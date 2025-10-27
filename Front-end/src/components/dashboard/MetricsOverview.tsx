import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  color: "pink" | "blue" | "purple";
}

const MetricCard = ({ title, value, trend, color }: MetricCardProps) => {
  const colorClasses = {
    pink: "from-primary/20 to-primary/5 border-primary/30",
    blue: "from-secondary/20 to-secondary/5 border-secondary/30",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  };
  
  const glowClasses = {
    pink: "glow-pink",
    blue: "glow-blue",
    purple: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  };

  return (
    <div className={`glass-panel p-6 bg-gradient-to-br ${colorClasses[color]} ${glowClasses[color]} hover:scale-105 transition-transform duration-300`}>
      <div className="text-sm text-muted-foreground mb-2">{title}</div>
      <div className="text-4xl font-bold mb-3">{value}</div>
      <div className="flex items-center gap-2 text-sm">
        {trend > 0 ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
        <span className={trend > 0 ? "text-green-400" : "text-red-400"}>
          {Math.abs(trend)}%
        </span>
        <span className="text-muted-foreground text-xs">vs last scan</span>
      </div>
    </div>
  );
};

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard title="Total Issues" value="6,592" trend={-12} color="pink" />
      <MetricCard title="Total Entities" value="10K+" trend={8} color="blue" />
      <MetricCard title="Total Technologies" value="3,824" trend={5} color="purple" />
    </div>
  );
};
