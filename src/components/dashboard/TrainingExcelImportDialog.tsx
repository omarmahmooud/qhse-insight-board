import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TrainingExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (trainings: any[]) => Promise<boolean>;
}

// Helper to parse various date formats
function parseDate(value: any): string | null {
  if (!value) return null;
  
  if (typeof value === 'number') {
    const date = new Date((value - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0];
  }
  
  if (typeof value === 'string') {
    const str = value.trim();
    const match = str.match(/^(\d{1,2})[\/\-]([A-Za-z]+)[\/\-](\d{2,4})$/);
    if (match) {
      const day = parseInt(match[1]);
      const monthStr = match[2].toLowerCase();
      let year = parseInt(match[3]);
      if (year < 100) year += 2000;
      const months: Record<string, number> = {
        jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
        apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
        aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
        nov: 10, november: 10, dec: 11, december: 11,
      };
      const month = months[monthStr];
      if (month !== undefined) {
        const date = new Date(year, month, day);
        return date.toISOString().split('T')[0];
      }
    }
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  }
  return null;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mapRowToTraining(row: Record<string, any>): any | null {
  const normalized: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    normalized[normalizeKey(key)] = value;
  }

  // Find trainee name
  const traineeColumns = ['inductee', 'traineename', 'trainee', 'name', 'employee', 'employeename', 'fullname', 'participantname'];
  let traineeName = '';
  for (const col of traineeColumns) {
    if (normalized[col]) { traineeName = String(normalized[col]).trim(); break; }
  }

  // Find company
  const companyColumns = ['company', 'companyname', 'organization', 'employer', 'client'];
  let company = '';
  for (const col of companyColumns) {
    if (normalized[col]) { company = String(normalized[col]).trim(); break; }
  }

  if (!traineeName || !company) return null;

  // Find date
  const dateColumns = ['date', 'trainingdate', 'dateoftraining', 'conducteddate', 'inductiondate'];
  let trainingDate = new Date().toISOString().split('T')[0];
  for (const col of dateColumns) {
    if (normalized[col]) {
      const parsed = parseDate(normalized[col]);
      if (parsed) { trainingDate = parsed; break; }
    }
  }

  // Find position
  const positionColumns = ['position', 'jobtitle', 'title', 'role', 'designation'];
  let position = '';
  for (const col of positionColumns) {
    if (normalized[col]) { position = String(normalized[col]).trim(); break; }
  }

  // Find instructor
  const instructorColumns = ['inductedby', 'instructor', 'trainer', 'conductedby', 'facilitator'];
  let instructor = '';
  for (const col of instructorColumns) {
    if (normalized[col]) { instructor = String(normalized[col]).trim(); break; }
  }

  // Find training type - store raw value as text (no enum mapping)
  const typeColumns = ['trainingtype', 'type', 'course', 'coursename', 'training', 'trainingtopic'];
  let trainingType = 'QHSE Induction & General Disciplinary Actions';
  for (const col of typeColumns) {
    if (normalized[col]) { trainingType = String(normalized[col]).trim(); break; }
  }

  // Find purpose of visit
  const purposeColumns = ['purposeofvisit', 'purpose', 'reason', 'visitpurpose'];
  let purpose = '';
  for (const col of purposeColumns) {
    if (normalized[col]) { purpose = String(normalized[col]).trim(); break; }
  }

  // Find host name
  const hostColumns = ['hostname', 'host', 'hostperson', 'contactperson'];
  let hostName = '';
  for (const col of hostColumns) {
    if (normalized[col]) { hostName = String(normalized[col]).trim(); break; }
  }

  // Find location
  const locationColumns = ['location', 'venue', 'place', 'site'];
  let location = '';
  for (const col of locationColumns) {
    if (normalized[col]) { location = String(normalized[col]).trim(); break; }
  }

  // Build remarks
  let remarks = '';
  if (purpose && hostName) remarks = `${purpose} - Host: ${hostName}`;
  else if (purpose) remarks = purpose;
  else if (hostName) remarks = `Host: ${hostName}`;

  const remarksColumns = ['remarks', 'notes', 'comment', 'comments'];
  for (const col of remarksColumns) {
    if (normalized[col]) {
      const existing = String(normalized[col]).trim();
      if (existing) remarks = remarks ? `${remarks} | ${existing}` : existing;
      break;
    }
  }

  return {
    trainee_name: traineeName,
    company,
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
  const [preview, setPreview] = useState<any[]>([]);
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

        if (jsonData.length > 0) {
          setDetectedColumns(Object.keys(jsonData[0]));
        }

        const trainings: any[] = [];
        for (const row of jsonData) {
          const mapped = mapRowToTraining(row);
          if (mapped) trainings.push(mapped);
        }

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
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" id="excel-upload" />
            <label htmlFor="excel-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload Excel file (.xlsx, .xls)'}
              </p>
            </label>
          </div>

          {detectedColumns.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-1">Detected columns:</p>
              <p className="text-xs text-muted-foreground">{detectedColumns.join(', ')}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

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

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleImport} disabled={loading || preview.length === 0}>
              {loading ? 'Importing...' : `Import ${preview.length} Records`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
