import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { getTrainingByType } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";

export function TrainingTypeChart() {
  const data = getTrainingByType();

  return (
    <ChartCard 
      title="Training by Type" 
      subtitle="Distribution of training sessions"
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="trainingBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142 76% 50%)" />
                <stop offset="100%" stopColor="hsl(142 76% 35%)" />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 30% 18%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="name"
              stroke="hsl(215 20% 55%)"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(222 30% 18%)' }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(222 47% 10%)',
                border: '1px solid hsl(222 30% 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              itemStyle={{ color: 'hsl(210 40% 98%)' }}
              labelStyle={{ color: 'hsl(215 20% 55%)', fontWeight: 600 }}
              formatter={(value) => [`${value} sessions`, '']}
            />
            <Bar 
              dataKey="value" 
              fill="url(#trainingBarGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
