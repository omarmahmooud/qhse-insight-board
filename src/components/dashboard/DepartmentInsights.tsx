import { useMemo } from 'react';
import { ChartCard } from './ChartCard';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, CheckCircle2, Clock } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Inspection = Database['public']['Tables']['inspections']['Row'];

interface DepartmentInsightsProps {
  inspections: Inspection[];
}

export function DepartmentInsights({ inspections }: DepartmentInsightsProps) {
  const departmentData = useMemo(() => {
    const deptMap: Record<string, {
      total: number;
      open: number;
      closed: number;
      openHigh: number;
      openMedium: number;
      openLow: number;
    }> = {};

    inspections.forEach(inspection => {
      const dept = inspection.action_by || 'Unknown';
      if (!deptMap[dept]) {
        deptMap[dept] = {
          total: 0,
          open: 0,
          closed: 0,
          openHigh: 0,
          openMedium: 0,
          openLow: 0,
        };
      }

      deptMap[dept].total++;
      if (inspection.status === 'Open') {
        deptMap[dept].open++;
        if (inspection.risk_level === 'H') deptMap[dept].openHigh++;
        else if (inspection.risk_level === 'M') deptMap[dept].openMedium++;
        else if (inspection.risk_level === 'L') deptMap[dept].openLow++;
      } else {
        deptMap[dept].closed++;
      }
    });

    return Object.entries(deptMap)
      .map(([department, data]) => ({
        department,
        ...data,
        closureRate: data.total > 0 ? Math.round((data.closed / data.total) * 100) : 0,
        priority: data.openHigh * 3 + data.openMedium * 2 + data.openLow, // Priority score
      }))
      .filter(d => d.open > 0) // Only show departments with open items
      .sort((a, b) => b.priority - a.priority); // Sort by priority
  }, [inspections]);

  const totalOpen = useMemo(() => {
    return inspections.filter(i => i.status === 'Open').length;
  }, [inspections]);

  if (departmentData.length === 0) {
    return (
      <ChartCard 
        title="Department Action Required" 
        subtitle="No open items requiring action"
      >
        <div className="flex flex-col items-center justify-center py-8">
          <CheckCircle2 className="w-12 h-12 text-success mb-4" />
          <p className="text-muted-foreground text-center">
            All departments have closed their assigned inspection points!
          </p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard 
      title="Department Action Required" 
      subtitle={`${departmentData.length} departments with ${totalOpen} open points`}
    >
      <div className="space-y-4">
        {departmentData.map((dept) => (
          <div
            key={dept.department}
            className="p-4 rounded-lg border border-border/30 bg-card/50 hover:bg-card transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">{dept.department}</h3>
              </div>
              <Badge
                variant={dept.openHigh > 0 ? 'destructive' : dept.openMedium > 0 ? 'default' : 'secondary'}
                className="ml-2"
              >
                {dept.open} Open
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 rounded bg-destructive/10 border border-destructive/20">
                <p className="text-2xl font-bold text-destructive">{dept.openHigh}</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
              <div className="text-center p-2 rounded bg-warning/10 border border-warning/20">
                <p className="text-2xl font-bold text-warning">{dept.openMedium}</p>
                <p className="text-xs text-muted-foreground">Medium Risk</p>
              </div>
              <div className="text-center p-2 rounded bg-success/10 border border-success/20">
                <p className="text-2xl font-bold text-success">{dept.openLow}</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">
                  {dept.open} of {dept.total} points open
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">
                  {dept.closureRate}% closure rate
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${dept.closureRate}%` }}
              />
            </div>
          </div>
        ))}

        {departmentData.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning mb-1">Action Required</p>
                <p className="text-muted-foreground">
                  {departmentData.length} department{departmentData.length > 1 ? 's' : ''} need to close 
                  {totalOpen} open inspection point{totalOpen > 1 ? 's' : ''}. 
                  Priority departments are listed first based on risk level.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}


