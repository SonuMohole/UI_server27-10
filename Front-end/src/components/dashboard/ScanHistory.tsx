import { Calendar } from "lucide-react";

const scanDays = [
  { date: "Oct 28", changes: 5, active: true },
  { date: "Oct 27", changes: 3, active: false },
  { date: "Oct 26", changes: 8, active: false },
  { date: "Oct 25", changes: 2, active: false },
  { date: "Oct 24", changes: 4, active: false },
];

const technologies = [
  { name: "Apache HTTP Server 2.4.48", type: "Web Server", risk: "high" },
  { name: "Ubuntu 20.04 LTS", type: "Operating System", risk: "medium" },
  { name: "OpenSSL 1.1.1k", type: "Security Library", risk: "critical" },
];

export const ScanHistory = () => {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-secondary" />
        Scan History
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          {scanDays.map((day, index) => (
            <div
              key={index}
              className={`flex-1 p-3 rounded-lg text-center cursor-pointer transition-all ${
                day.active 
                  ? "bg-primary/20 border-2 border-primary glow-pink" 
                  : "bg-white/5 border border-white/10 hover:border-white/20"
              }`}
            >
              <div className="text-xs text-muted-foreground mb-1">{day.date}</div>
              <div className="text-lg font-bold">{day.changes}</div>
              <div className="text-xs text-muted-foreground">changes</div>
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Technology Changes (Oct 28)</h4>
          <div className="space-y-2">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium">{tech.name}</div>
                    <div className="text-xs text-muted-foreground">{tech.type}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    tech.risk === "critical" ? "bg-severity-critical/20 text-severity-critical" :
                    tech.risk === "high" ? "bg-severity-high/20 text-severity-high" :
                    "bg-severity-medium/20 text-severity-medium"
                  }`}>
                    {tech.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
