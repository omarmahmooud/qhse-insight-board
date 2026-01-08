import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { getLocationData } from "@/data/qhseData";
import { ChartCard } from "./ChartCard";

export function LocationBarChart() {
  const data = getLocationData();

  return (
    <ChartCard 
      title="Findings by Location" 
      subtitle="Top 10 locations with most observations"
    >
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(174 72% 35%)" />
                <stop offset="100%" stopColor="hsl(174 72% 50%)" />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(222 30% 18%)" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              type="number"
              stroke="hsl(215 20% 55%)"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(222 30% 18%)' }}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(215 20% 55%)"
              tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={110}
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
              formatter={(value) => [`${value} findings`, '']}
            />
            <Bar 
              dataKey="count" 
              fill="url(#barGradient)"
              radius={[0, 4, 4, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
