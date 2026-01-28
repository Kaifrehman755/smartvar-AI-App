import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { formatIndianRupee } from '@/lib/valuation';

interface PriceTrendChartProps {
  data: { year: number; price: number }[];
}

export function PriceTrendChart({ data }: PriceTrendChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl shadow-xl p-4 border border-border/50">
          <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
          <p className="text-lg font-display font-bold text-success">
            {formatIndianRupee(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="hsl(160 84% 39%)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(160 84% 39%)" />
              <stop offset="100%" stopColor="hsl(170 80% 42%)" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="hsl(225 20% 90%)"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(225 12% 50%)', fontWeight: 500 }}
            dy={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(225 12% 50%)', fontWeight: 500 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="url(#priceGradient)"
            dot={{
              fill: 'hsl(160 84% 39%)',
              stroke: 'white',
              strokeWidth: 3,
              r: 5,
            }}
            activeDot={{
              fill: 'hsl(160 84% 39%)',
              stroke: 'white',
              strokeWidth: 4,
              r: 8,
              className: 'drop-shadow-lg',
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
