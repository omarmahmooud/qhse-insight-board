import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { statusSummary as staticSummary } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";
import { CheckCircle2, Clock } from "lucide-react";

interface StatusChartProps {
  summary?: {
    total: number;
    closed: number;
    open: number;
    closureRate: number;
  };
}

export function StatusChart({ summary }: StatusChartProps) {
  const statusSummary = summary || staticSummary;
  const data = [
    { name: 'Closed', value: statusSummary.closed, color: '#22c55e' },
    { name: 'Open', value: statusSummary.open, color: '#f59e0b' },
  ];

  // Filter out zero values for the pie chart
  const chartData = data.filter(d => d.value > 0);

  return (
    <ChartCard 
      title="Open vs Closed Points" 
      subtitle="Current status of all inspection findings"
    >
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
              }}
              itemStyle={{ color: 'hsl(210 40% 98%)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{statusSummary.closureRate}%</p>
            <p className="text-xs text-muted-foreground">Closed</p>
          </div>
        </div>
      </div>
      
      {/* Status cards */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/30">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
          <CheckCircle2 className="w-8 h-8 text-success" />
          <div>
            <p className="text-2xl font-bold text-success">{statusSummary.closed}</p>
            <p className="text-xs text-muted-foreground">Closed Points</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30">
          <Clock className="w-8 h-8 text-warning" />
          <div>
            <p className="text-2xl font-bold text-warning">{statusSummary.open}</p>
            <p className="text-xs text-muted-foreground">Open Points</p>
          </div>
        </div>
      </div>

      {/* Summary message */}
      {statusSummary.open === 0 ? (
        <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20">
          <p className="text-sm text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Excellent! All {statusSummary.total} inspection points have been closed.</span>
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <p className="text-sm text-warning flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{statusSummary.open} inspection point{statusSummary.open > 1 ? 's' : ''} still require action.</span>
          </p>
        </div>
      )}
    </ChartCard>
  );
}
