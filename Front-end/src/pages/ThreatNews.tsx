import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const newsItems = [
  {
    headline: "Critical Zero-Day in Ivanti Connect Secure Actively Exploited",
    summary: "Threat actors are exploiting CVE-2024-21893 to deploy web shells and establish persistence on vulnerable systems.",
    source: "CISA",
    time: "2h ago",
    severity: "critical",
  },
  {
    headline: "LockBit 3.0 Targets Healthcare Sector with New Ransomware Variant",
    summary: "Security researchers identify updated LockBit variant with enhanced encryption and evasion capabilities.",
    source: "BleepingComputer",
    time: "5h ago",
    severity: "high",
  },
  {
    headline: "Microsoft Patches 78 Vulnerabilities in October Security Update",
    summary: "Monthly patch Tuesday addresses multiple critical vulnerabilities including remote code execution flaws.",
    source: "Threatpost",
    time: "1d ago",
    severity: "info",
  },
  {
    headline: "Cisco Warns of Active Exploitation in IOS XE Web UI",
    summary: "CVE-2024-20419 being exploited in the wild to gain initial access and deploy malicious implants.",
    source: "CISA",
    time: "1d ago",
    severity: "critical",
  },
  {
    headline: "BlackCat Ransomware Gang Claims Major Financial Institution Breach",
    summary: "ALPHV/BlackCat publishes data samples allegedly stolen from Fortune 500 financial services company.",
    source: "The Record",
    time: "2d ago",
    severity: "high",
  },
  {
    headline: "Google Patches Fifth Chrome Zero-Day of 2024",
    summary: "Critical use-after-free vulnerability in Chrome's V8 engine actively exploited by threat actors.",
    source: "Google Security Blog",
    time: "2d ago",
    severity: "critical",
  },
];

const campaigns = [
  { name: "LockBit 3.0", active: true, sector: "Healthcare" },
  { name: "BlackCat/ALPHV", active: true, sector: "Finance" },
  { name: "Clop", active: true, sector: "Government" },
  { name: "Royal", active: false, sector: "Manufacturing" },
];

const attackTrendData = [
  { day: "Mon", volume: 1200 },
  { day: "Tue", volume: 1800 },
  { day: "Wed", volume: 1500 },
  { day: "Thu", volume: 2200 },
  { day: "Fri", volume: 1900 },
  { day: "Sat", volume: 1400 },
  { day: "Sun", volume: 1100 },
];

const trendingTags = [
  { tag: "#ZeroDay", count: 12, hot: true },
  { tag: "#Ransomware", count: 28, hot: true },
  { tag: "#Phishing", count: 15, hot: false },
  { tag: "#Botnet", count: 8, hot: false },
  { tag: "#APT", count: 6, hot: false },
  { tag: "#SupplyChain", count: 4, hot: true },
];

export default function ThreatNews() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">News & Recommendations</h1>
        <p className="text-muted-foreground">Trending threat activity and security insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Latest Threat News</h3>
              <Badge variant="outline" className="ml-auto">Auto-refresh: 10min</Badge>
            </div>
            <div className="space-y-4">
              {newsItems.map((news, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-xl hover:glow-primary transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant={news.severity === "critical" ? "destructive" : news.severity === "high" ? "default" : "secondary"}
                      className={news.severity === "high" ? "bg-warning text-white" : ""}
                    >
                      {news.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{news.time}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{news.headline}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Source: {news.source}</span>
                    <Button size="sm" variant="outline">View Full Report</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Attack Trends */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Internet Threat Trends (7 Days)</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line type="monotone" dataKey="volume" stroke="hsl(var(--destructive))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {trendingTags.map((tag) => (
                <Badge 
                  key={tag.tag} 
                  variant="outline" 
                  className={tag.hot ? "border-destructive text-destructive animate-pulse" : ""}
                >
                  {tag.tag} ({tag.count})
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Ransomware */}
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-lg font-semibold">Active Ransomware</h3>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.name} className="glass-panel p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{campaign.name}</span>
                    <div className={`h-2 w-2 rounded-full ${campaign.active ? "bg-destructive animate-pulse" : "bg-muted"}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">Target: {campaign.sector}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <p className="text-xs font-medium text-center mb-1">Active Campaigns</p>
              <p className="text-3xl font-bold text-center text-destructive">{campaigns.filter(c => c.active).length}</p>
            </div>
          </Card>

          {/* AI Recommendations */}
          <Card className="glass-card p-6 bg-gradient-card border-primary/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Recommendations</h3>
                <p className="text-xs text-muted-foreground">Contextual threat mitigation</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="glass-panel p-3 rounded-lg">
                <p className="font-medium mb-1">🔴 Critical</p>
                <p className="text-xs text-muted-foreground">Patch CVE-2024-21887 immediately on all Exchange servers</p>
              </div>
              <div className="glass-panel p-3 rounded-lg">
                <p className="font-medium mb-1">🟡 Monitor</p>
                <p className="text-xs text-muted-foreground">Increase monitoring of SMB traffic for lateral movement patterns</p>
              </div>
              <div className="glass-panel p-3 rounded-lg">
                <p className="font-medium mb-1">🟢 Review</p>
                <p className="text-xs text-muted-foreground">Update endpoint detection rules for LockBit 3.0 indicators</p>
              </div>
            </div>
            <Button className="w-full mt-4 gradient-primary hover:glow-accent" size="sm">
              Generate New Insights
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
