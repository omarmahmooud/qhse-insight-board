import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getRiskDistribution } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";

const COLORS = {
  'High Risk': '#ef4444',
  'Medium Risk': '#f59e0b',
  'Low Risk': '#22c55e',
};

export function RiskPieChart() {
  const data = getRiskDistribution();

  return (
    <ChartCard 
      title="Risk Distribution" 
      subtitle="Findings by risk severity level"
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  stroke="transparent"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              itemStyle={{ color: 'hsl(210 40% 98%)' }}
              labelStyle={{ color: 'hsl(215 20% 55%)' }}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with values */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/30">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <p className="text-2xl font-bold text-foreground">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}
