import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Database } from '@/integrations/supabase/types';

type TrainingInsert = Database['public']['Tables']['trainings']['Insert'];

interface TrainingExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (trainings: TrainingInsert[]) => Promise<boolean>;
}

// Helper to parse various date formats
function parseDate(value: any): string | null {
  if (!value) return null;
  
  // Excel serial date number
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  // String date
  if (typeof value === 'string') {
    const str = value.trim();
    
    // Try "2/Jan/25" or "02/Jan/2025" format
    const match = str.match(/^(\d{1,2})[\/\-]([A-Za-z]+)[\/\-](\d{2,4})$/);
    if (match) {
      const day = parseInt(match[1]);
      const monthStr = match[2].toLowerCase();
      let year = parseInt(match[3]);
      if (year < 100) year += 2000;
      
      const months: Record<string, number> = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11,
      };
      
      const month = months[monthStr];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
      }
    }
    
    // Try standard date formats
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0];
    }
  }
  
  return null;
}

// Normalize column names for flexible matching
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map Excel row to training record
function mapRowToTraining(row: Record<string, any>): TrainingInsert | null {
  // Create a normalized lookup
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeKey(key)] = value;
  }
  
  // Find trainee name - check multiple column variations
  const traineeColumns = ['inductee', 'traineename', 'trainee', 'name', 'employee', 'employeename', 'fullname'];
  let traineeName = '';
  for (const col of traineeColumns) {
    if (normalized[col]) {
      traineeName = String(normalized[col]).trim();
      break;
    }
  }
  
  // Find company
  const companyColumns = ['company', 'companyname', 'organization', 'employer'];
  let company = '';
  for (const col of companyColumns) {
    if (normalized[col]) {
      company = String(normalized[col]).trim();
      break;
    }
  }
  
  // Skip rows without required data
  if (!traineeName || !company) {
    return null;
  }
  
  // Find date
  const dateColumns = ['date', 'trainingdate', 'dateoftraining', 'conducteddate'];
  let trainingDate = new Date().toISOString().split('T')[0];
  for (const col of dateColumns) {
    if (normalized[col]) {
      const parsed = parseDate(normalized[col]);
      if (parsed) {
        trainingDate = parsed;
        break;
      }
    }
  }
  
  // Find position
  const positionColumns = ['position', 'jobtitle', 'title', 'role', 'designation'];
  let position = '';
  for (const col of positionColumns) {
    if (normalized[col]) {
      position = String(normalized[col]).trim();
      break;
    }
  }
  
  // Find instructor - check "Inducted by" column specifically
  const instructorColumns = ['inductedby', 'instructor', 'trainer', 'conductedby', 'facilitator'];
  let instructor = '';
  for (const col of instructorColumns) {
    if (normalized[col]) {
      instructor = String(normalized[col]).trim();
      break;
    }
  }
  
  // Find training type and map to enum
  const typeColumns = ['trainingtype', 'type', 'course', 'coursename', 'training'];
  let trainingTypeRaw = '';
  for (const col of typeColumns) {
    if (normalized[col]) {
      trainingTypeRaw = String(normalized[col]).trim().toLowerCase();
      break;
    }
  }
  
  // Map to valid enum value
  let trainingType: Database['public']['Enums']['training_type'] = 'HSE Induction';
  if (trainingTypeRaw.includes('fire')) {
    trainingType = 'Fire Safety';
  } else if (trainingTypeRaw.includes('first aid')) {
    trainingType = 'First Aid';
  } else if (trainingTypeRaw.includes('height')) {
    trainingType = 'Working at Height';
  } else if (trainingTypeRaw.includes('confined')) {
    trainingType = 'Confined Space';
  } else if (trainingTypeRaw.includes('manual') || trainingTypeRaw.includes('handling')) {
    trainingType = 'Manual Handling';
  } else if (trainingTypeRaw.includes('ppe')) {
    trainingType = 'PPE Training';
  } else if (trainingTypeRaw.includes('emergency')) {
    trainingType = 'Emergency Response';
  } else if (trainingTypeRaw.includes('environment')) {
    trainingType = 'Environmental Awareness';
  } else if (trainingTypeRaw.includes('induction') || trainingTypeRaw.includes('safety')) {
    trainingType = 'HSE Induction';
  } else if (trainingTypeRaw) {
    trainingType = 'Other';
  }
  
  // Find location
  const locationColumns = ['location', 'venue', 'place', 'site'];
  let location = '';
  for (const col of locationColumns) {
    if (normalized[col]) {
      location = String(normalized[col]).trim();
      break;
    }
  }
  
  // Find remarks/purpose
  const remarksColumns = ['remarks', 'notes', 'comment', 'purposeofvisit', 'purpose'];
  let remarks = '';
  for (const col of remarksColumns) {
    if (normalized[col]) {
      remarks = String(normalized[col]).trim();
      break;
    }
  }
  
  return {
    trainee_name: traineeName,
    company: company,
    position: position || null,
    training_type: trainingType,
    training_date: trainingDate,
    instructor: instructor || null,
    location: location || null,
    remarks: remarks || null,
    status: 'Completed',
    attendance_confirmed: true,
  };
}

export function TrainingExcelImportDialog({ open, onOpenChange, onImport }: TrainingExcelImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<TrainingInsert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);

        console.log('Parsed Excel data:', jsonData.slice(0, 3));
        
        if (jsonData.length > 0) {
          const columns = Object.keys(jsonData[0]);
          console.log('Detected columns:', columns);
          setDetectedColumns(columns);
        }

        const trainings: TrainingInsert[] = [];
        for (const row of jsonData) {
          const mapped = mapRowToTraining(row);
          if (mapped) {
            trainings.push(mapped);
          }
        }

        console.log('Mapped trainings:', trainings.slice(0, 3));

        if (trainings.length === 0) {
          setError('No valid training records found. Make sure your Excel has columns like "Inductee", "Company", "Date".');
        } else {
          setPreview(trainings);
        }
      } catch (err) {
        console.error('Error parsing Excel:', err);
        setError('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(selectedFile);
  }, []);

  const handleImport = async () => {
    if (preview.length === 0) return;

    setLoading(true);
    const success = await onImport(preview);
    setLoading(false);

    if (success) {
      onOpenChange(false);
      setFile(null);
      setPreview([]);
      setDetectedColumns([]);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setFile(null);
    setPreview([]);
    setError(null);
    setDetectedColumns([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Training Records from Excel
          </DialogTitle>
          <DialogDescription>
            Upload your QHSE training Excel file. The system will automatically detect columns.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File upload */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="excel-upload"
            />
            <label htmlFor="excel-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload Excel file (.xlsx, .xls)'}
              </p>
            </label>
          </div>

          {/* Detected columns */}
          {detectedColumns.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Detected columns:</p>
              <p className="text-xs text-muted-foreground">{detectedColumns.join(', ')}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{preview.length} training records ready to import</p>
              </div>
              
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Trainee</th>
                      <th className="p-2 text-left">Company</th>
                      <th className="p-2 text-left">Type</th>
                      <th className="p-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 10).map((t, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2">{t.trainee_name}</td>
                        <td className="p-2">{t.company}</td>
                        <td className="p-2">{t.training_type}</td>
                        <td className="p-2">{t.training_date}</td>
                      </tr>
                    ))}
                    {preview.length > 10 && (
                      <tr className="border-t">
                        <td colSpan={4} className="p-2 text-center text-muted-foreground">
                          ...and {preview.length - 10} more records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={loading || preview.length === 0}>
              {loading ? 'Importing...' : `Import ${preview.length} Records`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
