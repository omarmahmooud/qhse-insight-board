import { statusSummary as staticSummary } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Clock } from "lucide-react";

interface RiskBreakdownCardProps {
  summary?: {
    total: number;
    closed: number;
    open: number;
    closedRiskBreakdown: {
      high: number;
      medium: number;
      low: number;
    };
    openRiskBreakdown: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

export function RiskBreakdownCard({ summary }: RiskBreakdownCardProps) {
  const statusSummary = summary || staticSummary;
  const { closedRiskBreakdown, openRiskBreakdown, total, closed, open } = statusSummary;
  
  const closedData = [
    { 
      label: 'High Risk', 
      value: closedRiskBreakdown.high, 
      percentage: Math.round((closedRiskBreakdown.high / closed) * 100),
      icon: AlertTriangle,
      textColor: 'text-destructive',
      barColor: 'bg-destructive'
    },
    { 
      label: 'Medium Risk', 
      value: closedRiskBreakdown.medium, 
      percentage: Math.round((closedRiskBreakdown.medium / closed) * 100),
      icon: AlertCircle,
      textColor: 'text-warning',
      barColor: 'bg-warning'
    },
    { 
      label: 'Low Risk', 
      value: closedRiskBreakdown.low, 
      percentage: Math.round((closedRiskBreakdown.low / closed) * 100),
      icon: Info,
      textColor: 'text-success',
      barColor: 'bg-success'
    },
  ];

  const openData = [
    { 
      label: 'High Risk', 
      value: openRiskBreakdown.high, 
      percentage: open > 0 ? Math.round((openRiskBreakdown.high / open) * 100) : 0,
      icon: AlertTriangle,
      textColor: 'text-destructive',
      barColor: 'bg-destructive'
    },
    { 
      label: 'Medium Risk', 
      value: openRiskBreakdown.medium, 
      percentage: open > 0 ? Math.round((openRiskBreakdown.medium / open) * 100) : 0,
      icon: AlertCircle,
      textColor: 'text-warning',
      barColor: 'bg-warning'
    },
    { 
      label: 'Low Risk', 
      value: openRiskBreakdown.low, 
      percentage: open > 0 ? Math.round((openRiskBreakdown.low / open) * 100) : 0,
      icon: Info,
      textColor: 'text-success',
      barColor: 'bg-success'
    },
  ];

  return (
    <ChartCard 
      title="Risk Level Breakdown" 
      subtitle="Closed vs Open findings by severity"
    >
      <div className="space-y-6">
        {/* Closed Section */}
        <div className="p-4 rounded-lg bg-success/5 border border-success/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="font-semibold text-success">Closed Points ({closed})</span>
          </div>
          <div className="space-y-2">
            {closedData.map((risk) => {
              const Icon = risk.icon;
              return (
                <div key={`closed-${risk.label}`} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${risk.textColor}`} />
                  <span className="text-sm text-muted-foreground w-24">{risk.label}</span>
                  <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${risk.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${risk.textColor} w-12 text-right`}>{risk.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open Section */}
        <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-warning" />
            <span className="font-semibold text-warning">Open Points ({open})</span>
          </div>
          <div className="space-y-2">
            {openData.map((risk) => {
              const Icon = risk.icon;
              return (
                <div key={`open-${risk.label}`} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${risk.textColor}`} />
                  <span className="text-sm text-muted-foreground w-24">{risk.label}</span>
                  <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${risk.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${risk.textColor} w-12 text-right`}>{risk.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}