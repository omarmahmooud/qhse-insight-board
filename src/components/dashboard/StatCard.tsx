import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'from-primary/20 to-transparent border-primary/30',
  success: 'from-success/20 to-transparent border-success/30',
  warning: 'from-warning/20 to-transparent border-warning/30',
  danger: 'from-destructive/20 to-transparent border-destructive/30',
};

const iconStyles = {
  default: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  danger: 'text-destructive bg-destructive/10',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div 
      className={cn(
        "stat-card group cursor-default",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 rounded-xl bg-gradient-to-br opacity-50 transition-opacity duration-300 group-hover:opacity-100",
        variantStyles[variant]
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
            iconStyles[variant]
          )}>
            <Icon className="w-6 h-6" />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "text-success bg-success/10" 
                : "text-destructive bg-destructive/10"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
            {value}
          </h3>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative corner accent */}
      <div className={cn(
        "absolute bottom-0 right-0 w-24 h-24 rounded-tl-full opacity-5 transition-opacity duration-300 group-hover:opacity-10",
        variant === 'default' && "bg-primary",
        variant === 'success' && "bg-success",
        variant === 'warning' && "bg-warning",
        variant === 'danger' && "bg-destructive",
      )} />
    </div>
  );
}
