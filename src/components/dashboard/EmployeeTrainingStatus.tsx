import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertTriangle, User, Building2 } from 'lucide-react';
import { 
  isCloudEnergiEmployee, 
  detectRoleFromPosition, 
  getRequiredTrainings,
  EmployeeRole 
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
  // Filter only Cloud Energi employees
  const cegTrainings = trainings.filter(t => isCloudEnergiEmployee(t.company));
  
  // Group by employee name and calculate training status
  const employeeMap = new Map<string, EmployeeStats>();
  
  cegTrainings.forEach(training => {
    const key = training.trainee_name.toLowerCase().trim();
    
    if (!employeeMap.has(key)) {
      const role = detectRoleFromPosition(training.position);
      const required = role ? getRequiredTrainings(role).map(t => t.name.toLowerCase()) : [];
      
      employeeMap.set(key, {
        name: training.trainee_name,
        position: training.position,
        role,
        company: training.company,
        completedTrainings: [],
        requiredTrainings: required,
        missingTrainings: [],
        completionPercentage: 0,
      });
    }
    
    const emp = employeeMap.get(key)!;
    if (training.status === 'Completed') {
      // Use flexible matching for training names
      const trainingName = training.training_type.toLowerCase();
      if (!emp.completedTrainings.includes(trainingName)) {
        emp.completedTrainings.push(trainingName);
      }
    }
  });
  
  // Calculate missing trainings and completion percentage
  employeeMap.forEach((emp, key) => {
    if (emp.requiredTrainings.length > 0) {
      emp.missingTrainings = emp.requiredTrainings.filter(req => 
        !emp.completedTrainings.some(comp => 
          comp.includes(req.split(' ')[0]) || req.includes(comp.split(' ')[0])
        )
      );
      const completed = emp.requiredTrainings.length - emp.missingTrainings.length;
      emp.completionPercentage = Math.round((completed / emp.requiredTrainings.length) * 100);
    }
    employeeMap.set(key, emp);
  });
  
  const employees = Array.from(employeeMap.values()).sort((a, b) => 
    a.completionPercentage - b.completionPercentage
  );

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-destructive';
  };

  if (employees.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Cloud Energi Employee Training Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No Cloud Energi employees found. Import training records to see status.
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
          Cloud Energi Employee Training Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {employees.length} employees • Showing training completion status
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
                  <Progress 
                    value={emp.completionPercentage} 
                    className="h-2 mt-3" 
                  />
                  
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
