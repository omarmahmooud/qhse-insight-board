import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, User, Building2 } from 'lucide-react';
import { 
  detectRoleFromPosition, 
  getRequiredTrainings,
  isEmployee,
  type EmployeeRole,
} from '@/data/trainingRequirements';
import type { Database } from '@/integrations/supabase/types';

type Training = Database['public']['Tables']['trainings']['Row'];

interface EmployeeTrainingStatusProps {
  trainings: Training[];
}

interface EmployeeStats {
  name: string;
  position: string | null;
  role: EmployeeRole | null;
  company: string;
  completedTrainings: string[];
  requiredTrainings: string[];
  missingTrainings: string[];
  completionPercentage: number;
}

export function EmployeeTrainingStatus({ trainings }: EmployeeTrainingStatusProps) {
  // Group trainings by person to determine employee vs outsider
  const personTrainings = new Map<string, Training[]>();
  trainings.forEach(t => {
    const key = t.trainee_name.toLowerCase().trim();
    if (!personTrainings.has(key)) personTrainings.set(key, []);
    personTrainings.get(key)!.push(t);
  });

  // Filter employees: people who have internal training types
  const employeeKeys = new Set<string>();
  personTrainings.forEach((pts, key) => {
    const types = pts.map(t => t.training_type);
    if (isEmployee(types)) {
      employeeKeys.add(key);
    }
  });

  // Build employee stats
  const employeeMap = new Map<string, EmployeeStats>();

  employeeKeys.forEach(key => {
    const pts = personTrainings.get(key)!;
    const first = pts[0];
    const role = detectRoleFromPosition(first.position);
    const required = role ? getRequiredTrainings(role) : [];

    const completedTrainings: string[] = [];
    pts.forEach(t => {
      if (t.status === 'Completed' && !completedTrainings.includes(t.training_type)) {
        completedTrainings.push(t.training_type);
      }
    });

    const missingTrainings = required.filter(req => 
      !completedTrainings.some(comp => {
        const compLower = comp.toLowerCase();
        const reqLower = req.toLowerCase();
        return compLower.includes(reqLower.substring(0, 15)) || reqLower.includes(compLower.substring(0, 15));
      })
    );

    const completionPercentage = required.length > 0
      ? Math.round(((required.length - missingTrainings.length) / required.length) * 100)
      : 0;

    employeeMap.set(key, {
      name: first.trainee_name,
      position: first.position,
      role,
      company: first.company,
      completedTrainings,
      requiredTrainings: required,
      missingTrainings,
      completionPercentage,
    });
  });

  const employees = Array.from(employeeMap.values()).sort((a, b) => 
    a.completionPercentage - b.completionPercentage
  );

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  if (employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Employee Training Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No employees found. Import training records to see status.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Employee Training Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {employees.length} employees • Based on training type classification
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {employees.map((emp, index) => (
            <div key={index} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{emp.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {emp.role && (
                        <Badge variant="outline" className="text-xs">
                          {emp.role}
                        </Badge>
                      )}
                      {emp.position && !emp.role && (
                        <span className="text-xs text-muted-foreground">{emp.position}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getStatusColor(emp.completionPercentage)}`}>
                    {emp.completionPercentage}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {emp.requiredTrainings.length - emp.missingTrainings.length}/{emp.requiredTrainings.length} completed
                  </p>
                </div>
              </div>
              
              {emp.requiredTrainings.length > 0 && (
                <>
                  <Progress value={emp.completionPercentage} className="h-2 mt-3" />
                  
                  {emp.missingTrainings.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-destructive flex items-center gap-1 mb-2">
                        <AlertTriangle className="w-3 h-3" />
                        Missing Trainings ({emp.missingTrainings.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {emp.missingTrainings.slice(0, 5).map((training, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-destructive/5 text-destructive border-destructive/30"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            {training.length > 25 ? training.slice(0, 25) + '...' : training}
                          </Badge>
                        ))}
                        {emp.missingTrainings.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{emp.missingTrainings.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {emp.completionPercentage === 100 && (
                <div className="mt-3 flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">All trainings completed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
