import { Card } from "@/components/ui/card";
import React from "react";

interface ScoreMeterCardProps {
  title?: string;
  score?: number; // between 0–100
}

const ScoreMeterCard: React.FC<ScoreMeterCardProps> = ({
  title = "Risk Score",
  score = 72,
}) => {
  const arcLength = 220;
  const offset = arcLength - (arcLength * (score / 100));

  return (
    <Card className="glass-card flex flex-col items-center justify-center p-6 hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-destructive rounded-2xl">
      {/* Title */}
      <p className="text-sm text-muted-foreground font-medium mb-4">{title}</p>

      {/* Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
          {/* Background Arc */}
          <path
            d="M20 80 A40 40 0 1 1 80 80"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />

          {/* Foreground Arc */}
          <path
            d="M20 80 A40 40 0 1 1 80 80"
            stroke="url(#riskGradient)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="riskGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fecaca" /> {/* Light red */}
              <stop offset="50%" stopColor="#f87171" /> {/* Medium red */}
              <stop offset="100%" stopColor="#b91c1c" /> {/* Dark red */}
            </linearGradient>
          </defs>
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center translate-y-4">
          <span className="text-xs text-muted-foreground mb-1">Score</span>
          <span className="text-4xl font-extrabold text-foreground leading-none">
            {score}%
          </span>
        </div>
      </div>

      {/* Min / Max Labels */}
      <div className="flex justify-between w-full text-xs text-muted-foreground mt-2">
        <span>0</span>
        <span>100%</span>
      </div>
    </Card>
  );
};

export default ScoreMeterCard;
