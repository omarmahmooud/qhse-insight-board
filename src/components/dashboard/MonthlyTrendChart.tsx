import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { getMonthlyTrend } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";

export function MonthlyTrendChart() {
  const data = getMonthlyTrend();

  return (
    <ChartCard 
      title="Monthly Activity Trend" 
      subtitle="Inspections and trainings over time"
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInspections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174 72% 45%)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(174 72% 45%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTrainings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 45%)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(142 76% 45%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 30% 18%)" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215 20% 55%)"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(222 30% 18%)' }}
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
            />
            <Legend 
              verticalAlign="top"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground capitalize">{value}</span>
              )}
            />
            <Area 
              type="monotone" 
              dataKey="inspections" 
              stroke="hsl(174 72% 45%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorInspections)" 
            />
            <Area 
              type="monotone" 
              dataKey="trainings" 
              stroke="hsl(142 76% 45%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTrainings)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
