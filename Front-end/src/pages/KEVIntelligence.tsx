import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, TrendingUp, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const recentKEVs = [
  { cve: "CVE-2024-21887", severity: "critical", product: "Microsoft Exchange Server", dateAdded: "2025-10-03", vendor: "Microsoft" },
  { cve: "CVE-2024-38112", severity: "high", product: "Windows MSHTML Platform", dateAdded: "2025-10-02", vendor: "Microsoft" },
  { cve: "CVE-2024-43093", severity: "critical", product: "Android Framework", dateAdded: "2025-10-01", vendor: "Google" },
  { cve: "CVE-2024-20419", severity: "high", product: "Cisco IOS XE", dateAdded: "2025-09-30", vendor: "Cisco" },
  { cve: "CVE-2024-6387", severity: "critical", product: "OpenSSH", dateAdded: "2025-09-29", vendor: "OpenBSD" },
  { cve: "CVE-2024-4577", severity: "high", product: "PHP CGI", dateAdded: "2025-09-28", vendor: "PHP Group" },
  { cve: "CVE-2024-37085", severity: "critical", product: "VMware ESXi", dateAdded: "2025-09-27", vendor: "VMware" },
  { cve: "CVE-2024-38063", severity: "critical", product: "Windows TCP/IP", dateAdded: "2025-09-26", vendor: "Microsoft" },
  { cve: "CVE-2024-3400", severity: "critical", product: "Palo Alto PAN-OS", dateAdded: "2025-09-25", vendor: "Palo Alto" },
  { cve: "CVE-2024-21893", severity: "high", product: "Ivanti Connect Secure", dateAdded: "2025-09-24", vendor: "Ivanti" },
  { cve: "CVE-2024-27348", severity: "high", product: "Apache HugeGraph", dateAdded: "2025-09-23", vendor: "Apache" },
  { cve: "CVE-2024-26169", severity: "critical", product: "Windows Error Reporting", dateAdded: "2025-09-22", vendor: "Microsoft" },
  { cve: "CVE-2024-23897", severity: "high", product: "Jenkins CLI", dateAdded: "2025-09-21", vendor: "Jenkins" },
  { cve: "CVE-2024-1709", severity: "critical", product: "ConnectWise ScreenConnect", dateAdded: "2025-09-20", vendor: "ConnectWise" },
  { cve: "CVE-2024-0204", severity: "high", product: "Fortra GoAnywhere MFT", dateAdded: "2025-09-19", vendor: "Fortra" },
];

const weeklyKEVData = [
  { week: "Week 1", kevs: 12 },
  { week: "Week 2", kevs: 18 },
  { week: "Week 3", kevs: 15 },
  { week: "Week 4", kevs: 22 },
  { week: "Week 5", kevs: 19 },
  { week: "Week 6", kevs: 25 },
  { week: "Week 7", kevs: 21 },
  { week: "Week 8", kevs: 28 },
];

const severityData = [
  { name: "Critical", value: 45, color: "#ef4444" },
  { name: "High", value: 38, color: "#f59e0b" },
  { name: "Medium", value: 12, color: "#06b6d4" },
  { name: "Low", value: 5, color: "#10b981" },
];

const vendorData = [
  { vendor: "Microsoft", count: 32 },
  { vendor: "Google", count: 18 },
  { vendor: "Cisco", count: 15 },
  { vendor: "Adobe", count: 12 },
  { vendor: "Apache", count: 10 },
  { vendor: "VMware", count: 8 },
];

export default function KEVIntelligence() {
  const [showAll, setShowAll] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        toast.success("File parsed successfully. 8 CVEs matched against CISA KEV feed.");
      }, 2000);
    }
  };

  const handleUpgrade = () => {
    toast.info("Upgrade to Pro Plan to unlock full KEV archive");
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">VM Intelligence</h1>
        <p className="text-muted-foreground">Known Exploited Vulnerabilities tracking and analysis</p>
      </div>

      {/* Upload Section */}
      <Card className="glass-card p-6">
        <div className="flex items-start gap-4">
          <Upload className="h-8 w-8 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Upload & Analyze CVE Data</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload CSV, PDF, or XLSX files containing CVE IDs to match against the live CISA VM feed
            </p>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                accept=".csv,.pdf,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground">Supports CSV, PDF, XLSX (Max 50MB)</p>
              </label>
            </div>
            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-primary animate-pulse" style={{ width: "67%" }} />
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">Parsing file...</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Recent KEVs with Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Recent VMs (Past 2 Months)</h3>
              <p className="text-sm text-muted-foreground">Latest exploited vulnerabilities from CISA</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {recentKEVs.length} Total
            </Badge>
          </div>
          <div className="space-y-3">
            {recentKEVs.slice(0, 10).map((kev) => (
              <div key={kev.cve} className="glass-panel p-4 rounded-xl hover:glow-primary transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-mono font-semibold">{kev.cve}</h4>
                      <Badge 
                        variant={kev.severity === "critical" ? "destructive" : "default"}
                        className={kev.severity === "high" ? "bg-warning text-white" : ""}
                      >
                        {kev.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{kev.product}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Vendor: {kev.vendor}</span>
                      <span>Added: {kev.dateAdded}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Advisory
                  </Button>
                </div>
              </div>
            ))}
            {recentKEVs.slice(10).map((kev, idx) => (
              <div key={kev.cve} className="glass-panel p-4 rounded-xl opacity-30 blur-sm relative">
                {idx === 0 && (
                  <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                    Pro Required
                  </Badge>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-mono font-semibold">{kev.cve}</h4>
                      <Badge variant="secondary">
                        {kev.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{kev.product}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="relative mt-6">
              <Button 
                onClick={handleUpgrade}
                className="w-full gradient-primary hover:glow-accent"
              >
                🔒 Extend Your Plan to View All {recentKEVs.length} VMs
              </Button>
            </div>
          </div>
        </Card>

        {/* AI Security Recommendations */}
        <Card className="glass-card p-6 bg-gradient-card border-primary/30">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Security Recommendations</h3>
              <p className="text-xs text-muted-foreground mt-1">Based on uploaded data and VM analysis</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-medium text-destructive mb-1">🔴 Critical Priority</p>
              <p className="text-xs text-muted-foreground">6 new exploited CVEs detected this week - immediate patching required</p>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-medium text-warning mb-1">🟡 High Exposure</p>
              <p className="text-xs text-muted-foreground">Windows Server products show highest vulnerability concentration</p>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-medium text-primary mb-1">🔵 Action Required</p>
              <p className="text-xs text-muted-foreground">Prioritize patching CVE-2024-21887 on all Microsoft Exchange servers</p>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <p className="font-medium text-success mb-1">🟢 Recommendation</p>
              <p className="text-xs text-muted-foreground">Review and update firewall rules for affected network segments</p>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <Button className="w-full gradient-primary hover:glow-accent" size="sm">
              Generate Summary
            </Button>
            <Button className="w-full" variant="outline" size="sm">
              View Full Report
            </Button>
          </div>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly KEVs */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">VMs Published Weekly</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyKEVData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Line type="monotone" dataKey="kevs" stroke="hsl(var(--primary))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Severity Distribution */}
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">VMs by Severity</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Vendors */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Top Vendors Affected</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vendorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="vendor" type="category" stroke="hsl(var(--muted-foreground))" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card p-6 bg-gradient-card border-primary/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">AI Security Insights</h3>
            <div className="space-y-2 text-sm">
              <p>• <span className="text-primary font-medium">6 new exploited CVEs</span> added this week</p>
              <p>• Highest exposure: <span className="text-warning font-medium">Windows Server products</span></p>
              <p>• <span className="text-destructive font-medium">Critical attention</span> required for CVE-2024-21887</p>
              <p>• Recommendation: Prioritize patching Microsoft Exchange vulnerabilities</p>
            </div>
            <Button className="mt-4 gradient-primary hover:glow-accent">
              Generate Full Report (PDF)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
