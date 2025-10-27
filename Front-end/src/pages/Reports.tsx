import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Share2, Trash2, Eye, Search } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { id: "RPT-001", title: "Q3 Vulnerability Assessment", type: "Vulnerability", agent: "AGT-001", date: "2025-09-30", size: "4.2 MB", severity: "high" },
  { id: "RPT-002", title: "Weekly Security Report", type: "Security", agent: "All", date: "2025-10-01", size: "2.8 MB", severity: "info" },
  { id: "RPT-003", title: "Compliance Audit Report", type: "Compliance", agent: "All", date: "2025-09-28", size: "6.5 MB", severity: "info" },
  { id: "RPT-004", title: "Threat Intelligence Summary", type: "Threat", agent: "AGT-002", date: "2025-09-27", size: "3.1 MB", severity: "medium" },
  { id: "RPT-005", title: "Incident Response Report", type: "Incident", agent: "AGT-003", date: "2025-09-25", size: "5.7 MB", severity: "critical" },
  { id: "RPT-006", title: "Agent Health Check", type: "System", agent: "All", date: "2025-09-24", size: "1.9 MB", severity: "info" },
  { id: "RPT-007", title: "Ransomware Defense Analysis", type: "Threat", agent: "All", date: "2025-09-22", size: "4.8 MB", severity: "high" },
  { id: "RPT-008", title: "Patch Management Report", type: "System", agent: "All", date: "2025-09-20", size: "3.3 MB", severity: "medium" },
];

export default function Reports() {
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = reports.filter((report) => {
    const matchesAgent = filterAgent === "all" || report.agent === filterAgent || report.agent === "All";
    const matchesType = filterType === "all" || report.type.toLowerCase() === filterType;
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || report.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAgent && matchesType && matchesSearch;
  });

  const handleAction = (action: string, reportTitle: string) => {
    toast.success(`${action} "${reportTitle}" successfully`);
  };

  const exportData = (format: string) => {
    toast.success(`Exporting reports as ${format.toUpperCase()}...`);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Historical Management</h1>
          <p className="text-muted-foreground">Access and manage all generated security reports</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => exportData("pdf")} variant="outline">
            Export PDF
          </Button>
          <Button onClick={() => exportData("csv")} variant="outline">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="AGT-001">AGT-001</SelectItem>
              <SelectItem value="AGT-002">AGT-002</SelectItem>
              <SelectItem value="AGT-003">AGT-003</SelectItem>
              <SelectItem value="All">System-wide</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vulnerability">Vulnerability</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="compliance">Compliance</SelectItem>
              <SelectItem value="threat">Threat</SelectItem>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => {
              setFilterAgent("all");
              setFilterType("all");
              setSearchQuery("");
              toast.info("Filters cleared");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-destructive/20">
              <FileText className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reports.filter(r => r.severity === "critical").length}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-warning/20">
              <FileText className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{reports.filter(r => r.severity === "high").length}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/20">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{(reports.reduce((sum, r) => sum + parseFloat(r.size), 0)).toFixed(1)} MB</p>
              <p className="text-sm text-muted-foreground">Total Size</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="glass-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Report ID</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Title</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Agent</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Created On</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Size</th>
                <th className="text-right py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                  <td className="py-4 font-mono text-sm">{report.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.title}</span>
                      {report.severity === "critical" && (
                        <Badge variant="destructive" className="text-xs">Critical</Badge>
                      )}
                      {report.severity === "high" && (
                        <Badge className="text-xs bg-warning text-white">High</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm">
                    <Badge variant="outline">{report.type}</Badge>
                  </td>
                  <td className="py-4 text-sm font-mono">{report.agent}</td>
                  <td className="py-4 text-sm text-muted-foreground">{report.date}</td>
                  <td className="py-4 text-sm">{report.size}</td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("Viewed", report.title)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("Downloaded", report.title)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("Shared", report.title)}
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction("Deleted", report.title)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No reports found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
}
