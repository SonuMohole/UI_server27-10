import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";
import Chatbot from "@/components/dashboard/Chatbot";


const vulnerabilities = [
  { id: "VULN-2024-001", name: "SQL Injection in Authentication", severity: "critical", product: "Windows Server 2022", type: "SQL Injection", lastDetected: "2025-10-05" },
  { id: "VULN-2024-002", name: "Remote Code Execution via Buffer Overflow", severity: "critical", product: "Cisco Router IOS", type: "RCE", lastDetected: "2025-10-04" },
  { id: "VULN-2024-003", name: "Cross-Site Scripting in Admin Panel", severity: "high", product: "Microsoft Exchange", type: "XSS", lastDetected: "2025-10-03" },
  { id: "VULN-2024-004", name: "Privilege Escalation via SUID Binary", severity: "high", product: "Ubuntu 22.04", type: "Privilege Escalation", lastDetected: "2025-10-02" },
  { id: "VULN-2024-005", name: "Information Disclosure in API Endpoint", severity: "medium", product: "Dell PowerEdge Server", type: "Info Disclosure", lastDetected: "2025-10-01" },
  { id: "VULN-2024-006", name: "CSRF Token Validation Bypass", severity: "medium", product: "HP Switch", type: "CSRF", lastDetected: "2025-09-30" },
  { id: "VULN-2024-007", name: "Weak SSL/TLS Configuration", severity: "low", product: "Workstation Endpoints", type: "Crypto", lastDetected: "2025-09-28" },
  { id: "VULN-2024-008", name: "Directory Traversal in File Upload", severity: "high", product: "Juniper Router", type: "Path Traversal", lastDetected: "2025-09-27" },
  { id: "VULN-2024-009", name: "Authentication Bypass via Race Condition", severity: "critical", product: "Windows 10 Endpoints", type: "Auth Bypass", lastDetected: "2025-09-26" },
  { id: "VULN-2024-010", name: "Denial of Service via Malformed Packet", severity: "medium", product: "Cisco Switch", type: "DoS", lastDetected: "2025-09-25" },
];

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("severity");

  const filteredVulns = vulnerabilities
    .filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedFilter === "all" || 
                           v.product.toLowerCase().includes(selectedFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "severity") {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return order[a.severity as keyof typeof order] - order[b.severity as keyof typeof order];
      }
      if (sortBy === "date") {
        return new Date(b.lastDetected).getTime() - new Date(a.lastDetected).getTime();
      }
      return 0;
    });

  const handleExport = () => {
    toast.success("Report exported successfully");
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vulnerabilities</h1>
        <p className="text-muted-foreground">Comprehensive vulnerability tracking and management</p>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vulnerabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={selectedFilter === "microsoft" ? "default" : "outline"}
                onClick={() => setSelectedFilter("microsoft")}
              >
                Microsoft
              </Button>
              <Button
                size="sm"
                variant={selectedFilter === "router" ? "default" : "outline"}
                onClick={() => setSelectedFilter("router")}
              >
                Routers
              </Button>
              <Button
                size="sm"
                variant={selectedFilter === "switch" ? "default" : "outline"}
                onClick={() => setSelectedFilter("switch")}
              >
                Switches
              </Button>
              <Button
                size="sm"
                variant={selectedFilter === "endpoint" ? "default" : "outline"}
                onClick={() => setSelectedFilter("endpoint")}
              >
                Endpoints
              </Button>
              <Button
                size="sm"
                variant={selectedFilter === "server" ? "default" : "outline"}
                onClick={() => setSelectedFilter("server")}
              >
                Servers
              </Button>
            </div>

            <div className="flex gap-2 ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm"
              >
                <option value="severity">Sort by Severity</option>
                <option value="date">Sort by Date</option>
                <option value="type">Sort by Type</option>
              </select>
              <Button onClick={handleExport} className="gradient-primary hover:glow-accent">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Vulnerabilities Table */}
      <Card className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Vulnerability ID</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Severity</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Affected Product</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Last Detected</th>
              </tr>
            </thead>
            <tbody>
              {filteredVulns.map((vuln) => (
                <tr key={vuln.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                  <td className="py-3 font-mono text-sm">{vuln.id}</td>
                  <td className="py-3 font-medium">{vuln.name}</td>
                  <td className="py-3">
                    <Badge
                      variant={vuln.severity === "critical" ? "destructive" : vuln.severity === "high" ? "default" : "secondary"}
                      className={vuln.severity === "high" ? "bg-warning text-white" : vuln.severity === "medium" ? "bg-primary" : ""}
                    >
                      {vuln.severity.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-sm">{vuln.product}</td>
                  <td className="py-3 text-sm">{vuln.type}</td>
                  <td className="py-3 text-sm text-muted-foreground">{vuln.lastDetected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {filteredVulns.length} of {vulnerabilities.length} vulnerabilities
        </div>
      </Card>
      <Chatbot />

    </div>
  );
}
