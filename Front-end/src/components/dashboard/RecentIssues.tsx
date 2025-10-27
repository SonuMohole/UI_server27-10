import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const issues = [
  { 
    cve: "CVE-2024-21887", 
    title: "Input Validation Vulnerability", 
    severity: "critical",
    date: "2 hours ago" 
  },
  { 
    cve: "CVE-2024-3400", 
    title: "Cross-Site Scripting", 
    severity: "high",
    date: "5 hours ago" 
  },
  { 
    cve: "CVE-2019-11358", 
    title: "jQuery Vulnerability", 
    severity: "medium",
    date: "1 day ago" 
  },
  { 
    cve: "CVE-2022-22720", 
    title: "Apache HTTP Server SSRF", 
    severity: "high",
    date: "1 day ago" 
  },
  { 
    cve: "CVE-2021-44228", 
    title: "Log4j Remote Code Execution", 
    severity: "critical",
    date: "2 days ago" 
  },
  { 
    cve: "CVE-2023-12345", 
    title: "SQL Injection Vulnerability", 
    severity: "low",
    date: "3 days ago" 
  },
];

const severityColors = {
  critical: "bg-severity-critical/20 text-severity-critical border-severity-critical/30",
  high: "bg-severity-high/20 text-severity-high border-severity-high/30",
  medium: "bg-severity-medium/20 text-severity-medium border-severity-medium/30",
  low: "bg-severity-low/20 text-severity-low border-severity-low/30",
};

export const RecentIssues = () => {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Most Recent Issues</h3>
      <ScrollArea className="h-[320px]">
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono text-primary">{issue.cve}</code>
                    <Badge className={severityColors[issue.severity as keyof typeof severityColors]}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{issue.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{issue.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
