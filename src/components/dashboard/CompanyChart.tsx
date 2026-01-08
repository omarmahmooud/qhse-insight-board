import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getCompanyData } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";

const COLORS = [
  '#14b8a6', // teal
  '#22c55e', // green
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f43f5e', // rose
  '#06b6d4', // cyan
];

export function CompanyChart() {
  const data = getCompanyData();

  return (
    <ChartCard 
      title="Trainings by Company" 
      subtitle="Distribution across organizations"
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => 
                percent > 0.08 ? `${(percent * 100).toFixed(0)}%` : ''
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
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
              formatter={(value, name) => [`${value} trainings`, name]}
            />
            <Legend 
              verticalAlign="bottom"
              height={50}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
