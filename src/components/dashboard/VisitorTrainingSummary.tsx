import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Briefcase, Calendar } from 'lucide-react';
import { isCloudEnergiEmployee } from '@/data/trainingRequirements';
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
  // Filter non-Cloud Energi visitors (outsiders)
  const visitorTrainings = trainings.filter(t => !isCloudEnergiEmployee(t.company));
  
  // Group by visitor name
  const visitorMap = new Map<string, VisitorStats>();
  
  visitorTrainings.forEach(training => {
    const key = `${training.trainee_name.toLowerCase().trim()}-${training.company.toLowerCase().trim()}`;
    
    if (!visitorMap.has(key)) {
      // Extract purpose from remarks if available
      let purpose = null;
      if (training.remarks) {
        const purposeMatch = training.remarks.match(/purpose[:\s]+([^,]+)/i) || 
                            training.remarks.match(/visit[:\s]+([^,]+)/i);
        if (purposeMatch) purpose = purposeMatch[1].trim();
        else purpose = training.remarks;
      }
      
      visitorMap.set(key, {
        name: training.trainee_name,
        company: training.company,
        position: training.position,
        purpose,
        trainingsCompleted: 0,
        lastTrainingDate: training.training_date,
        trainingTypes: [],
      });
    }
    
    const visitor = visitorMap.get(key)!;
    if (training.status === 'Completed') {
      visitor.trainingsCompleted++;
      if (!visitor.trainingTypes.includes(training.training_type)) {
        visitor.trainingTypes.push(training.training_type);
      }
    }
    if (new Date(training.training_date) > new Date(visitor.lastTrainingDate)) {
      visitor.lastTrainingDate = training.training_date;
    }
    visitorMap.set(key, visitor);
  });
  
  const visitors = Array.from(visitorMap.values()).sort((a, b) => 
    new Date(b.lastTrainingDate).getTime() - new Date(a.lastTrainingDate).getTime()
  );

  // Separate work visitors from others
  const workVisitors = visitors.filter(v => 
    v.purpose?.toLowerCase().includes('work') || 
    v.position?.toLowerCase().includes('contractor') ||
    v.position?.toLowerCase().includes('worker')
  );
  const otherVisitors = visitors.filter(v => !workVisitors.includes(v));

  if (visitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Visitor Training Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No visitor records found. Import training records to see visitor data.
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
          Visitor Training Records
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {visitors.length} visitors • {workVisitors.length} for work purposes
        </p>
      </CardHeader>
      <CardContent>
        {/* Work Visitors Section */}
        {workVisitors.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">Work Visitors / Contractors</h3>
              <Badge variant="default" className="ml-auto">{workVisitors.length}</Badge>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Trainings</TableHead>
                    <TableHead>Last Training</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workVisitors.slice(0, 10).map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.company}</TableCell>
                      <TableCell>{visitor.position || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {visitor.trainingTypes.slice(0, 2).map((type, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {type}
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
              {workVisitors.length > 10 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Showing 10 of {workVisitors.length} work visitors
                </p>
              )}
            </div>
          </div>
        )}

        {/* Other Visitors Section */}
        {otherVisitors.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Other Visitors</h3>
              <Badge variant="secondary" className="ml-auto">{otherVisitors.length}</Badge>
            </div>
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
                  {otherVisitors.slice(0, 10).map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.company}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {visitor.purpose || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{visitor.trainingsCompleted}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(visitor.lastTrainingDate), 'dd MMM yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {otherVisitors.length > 10 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Showing 10 of {otherVisitors.length} other visitors
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
