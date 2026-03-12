import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Calendar } from 'lucide-react';
import { isEmployee } from '@/data/trainingRequirements';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type Training = Database['public']['Tables']['trainings']['Row'];

interface VisitorTrainingSummaryProps {
  trainings: Training[];
}

interface VisitorStats {
  name: string;
  company: string;
  position: string | null;
  purpose: string | null;
  trainingsCompleted: number;
  lastTrainingDate: string;
  trainingTypes: string[];
}

export function VisitorTrainingSummary({ trainings }: VisitorTrainingSummaryProps) {
  // Group trainings by person
  const personTrainings = new Map<string, Training[]>();
  trainings.forEach(t => {
    const key = t.trainee_name.toLowerCase().trim();
    if (!personTrainings.has(key)) personTrainings.set(key, []);
    personTrainings.get(key)!.push(t);
  });

  // Find outsiders: people who only have outsider-level trainings
  const visitorMap = new Map<string, VisitorStats>();

  personTrainings.forEach((pts, key) => {
    const types = pts.map(t => t.training_type);
    if (isEmployee(types)) return; // skip employees

    const first = pts[0];
    let purpose: string | null = null;
    if (first.remarks) {
      const purposeMatch = first.remarks.match(/^([^|-]+)/);
      purpose = purposeMatch ? purposeMatch[1].trim() : first.remarks;
    }

    const trainingTypes: string[] = [];
    let trainingsCompleted = 0;
    let lastDate = first.training_date;

    pts.forEach(t => {
      if (t.status === 'Completed') {
        trainingsCompleted++;
        if (!trainingTypes.includes(t.training_type)) trainingTypes.push(t.training_type);
      }
      if (new Date(t.training_date) > new Date(lastDate)) lastDate = t.training_date;
    });

    visitorMap.set(key, {
      name: first.trainee_name,
      company: first.company,
      position: first.position,
      purpose,
      trainingsCompleted,
      lastTrainingDate: lastDate,
      trainingTypes,
    });
  });

  const visitors = Array.from(visitorMap.values()).sort((a, b) =>
    new Date(b.lastTrainingDate).getTime() - new Date(a.lastTrainingDate).getTime()
  );

  if (visitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Outsider Training Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No outsider records found. Import training records to see visitor data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Outsider Training Records
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {visitors.length} outsiders (Contractors, Suppliers, Visitors, VIP)
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Trainings</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.slice(0, 15).map((visitor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {visitor.purpose || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {visitor.trainingTypes.slice(0, 2).map((type, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {type.length > 20 ? type.slice(0, 20) + '...' : type}
                        </Badge>
                      ))}
                      {visitor.trainingTypes.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{visitor.trainingTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(visitor.lastTrainingDate), 'dd MMM yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {visitors.length > 15 && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Showing 15 of {visitors.length} outsiders
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
