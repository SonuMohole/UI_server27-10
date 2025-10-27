import { useState, useEffect, useRef, useCallback } from "react"; // ✅ useRef added
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Chatbot from "@/components/dashboard/Chatbot";
import ScoreMeterCard from "@/components/ui/ScoreMeterCard";
import { Link } from "react-router-dom";
import IdleOverlay from "@/components/IdleOverlay";
import NotificationPanel from "@/components/ui/NotificationPanel";

import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  FileText,
  Bell,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const severityData = [
  { month: "Jan", critical: 12, high: 28, medium: 45, low: 62 },
  { month: "Feb", critical: 15, high: 32, medium: 48, low: 58 },
  { month: "Mar", critical: 10, high: 25, medium: 52, low: 65 },
  { month: "Apr", critical: 8, high: 22, medium: 38, low: 70 },
  { month: "May", critical: 11, high: 27, medium: 42, low: 68 },
  { month: "Jun", critical: 8, high: 15, medium: 32, low: 45 },
];

const recentIssues = [
  {
    id: "CVE-2024-21887",
    description: "Input Validation Vulnerability",
    severity: "critical",
    cvss: 9.8,
    time: "2 hours ago",
  },
  {
    id: "CVE-2024-38112",
    description: "Windows MSHTML Platform Security Feature Bypass",
    severity: "high",
    cvss: 7.5,
    time: "5 hours ago",
  },
  {
    id: "CVE-2024-43093",
    description: "Windows Storage Elevation of Privilege",
    severity: "medium",
    cvss: 6.2,
    time: "8 hours ago",
  },
  {
    id: "CVE-2024-38189",
    description: "Microsoft Project Remote Code Execution",
    severity: "critical",
    cvss: 8.8,
    time: "12 hours ago",
  },
  {
    id: "CVE-2024-21302",
    description: "Windows Secure Kernel Mode Elevation",
    severity: "low",
    cvss: 4.4,
    time: "1 day ago",
  },
];

const healthDensityData = [
  { month: "Jan", health: 95, threats: 180 },
  { month: "Feb", health: 93, threats: 220 },
  { month: "Mar", health: 96, threats: 195 },
  { month: "Apr", health: 97, threats: 165 },
  { month: "May", health: 98, threats: 140 },
  { month: "Jun", health: 98.7, threats: 120 },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "hsl(348 89% 60%)";
    case "high":
      return "hsl(24 100% 55%)";
    case "medium":
      return "hsl(48 96% 53%)";
    case "low":
      return "hsl(142 71% 45%)";
    default:
      return "hsl(220 9% 46%)";
  }
};

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">(
    "month"
  );
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // 🔔 Notification logic (fixed)
  const [showOverlay, setShowOverlay] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(true);
  const [autoOpened, setAutoOpened] = useState(false);
  const idleTimerRef = useRef<number | null>(null);
  const showOverlayRef = useRef(showOverlay);

  useEffect(() => {
    showOverlayRef.current = showOverlay;
  }, [showOverlay]);

  // Reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      if (!showOverlayRef.current) {
        setShowOverlay(true);
        setAutoOpened(true);
        // 🔴 Do NOT clear unread alerts automatically
      }
    }, 4000);
  }, []);

  // Attach listeners for idle detection
  useEffect(() => {
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((e) => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetIdleTimer));
    };
  }, [resetIdleTimer]);

  // Manual notification open/close
  const handleNotificationClick = () => {
    setShowOverlay((prev) => !prev);
    setUnreadAlerts(false);
    setAutoOpened(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    resetIdleTimer();
  };

  const handlePanelClose = () => {
    setShowOverlay(false);
    setAutoOpened(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    resetIdleTimer();
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="p-8 space-y-8 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-black">
              Qstellar Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Attack Surface Management & Security Intelligence
            </p>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-4 relative">
            <span className="text-sm text-muted-foreground">
              Last updated 2 min ago
            </span>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <RefreshCw
                className={cn("h-4 w-4", refreshing && "animate-spin")}
              />
              Refresh
            </Button>

            {/* Notification Button */}
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
              aria-label="Security Alerts"
            >
              <img
                src="/icons/alert.png"
                alt="Security Alerts"
                className={cn(
                  "w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity",
                  autoOpened &&
                    "drop-shadow-[0_0_8px_rgba(255,0,0,0.7)] animate-pulse"
                )}
              />
              {unreadAlerts && (
                <span
                  className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-md animate-[pulse_1.6s_ease-in-out_infinite]"
                  style={{ boxShadow: "0 0 10px rgba(255,0,0,0.6)" }}
                ></span>
              )}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Security Alerts
              </span>
            </button>

            {/* Slide-in Notification Drawer */}
            {showOverlay && (
              <NotificationPanel
                onClose={handlePanelClose}
                autoOpened={autoOpened}
              />
            )}
          </div>
        </div>

        <Chatbot />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 gradient-violet border-l-4 border-l-primary">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">
              Total Issues
            </p>
            <h3 className="text-5xl font-bold bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
              6,592
            </h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive">
                -12.5%
              </span>
              <span className="text-xs text-muted-foreground">
                vs last scan
              </span>
            </div>
          </div>
        </Card>

        <Link to="/assets" className="block">
          <Card className="glass-card p-6 hover:scale-[1.02] cursor-pointer transition-all duration-300 gradient-blur border-l-4 border-l-secondary">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">
                Total Assets
              </p>
              <h3 className="text-5xl font-bold bg-gradient-to-br from-foreground to-secondary bg-clip-text text-transparent">
                1K+
              </h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-secondary">
                  +8.0%
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last scan
                </span>
              </div>
            </div>
          </Card>
        </Link>
        <Card className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 gradient-green border-l-4 border-l-success">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">
              Total Technologies
            </p>
            <h3 className="text-5xl font-bold bg-gradient-to-br from-foreground to-success bg-clip-text text-transparent">
              3,824
            </h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold text-success">+5.2%</span>
              <span className="text-xs text-muted-foreground">
                vs last scan
              </span>
            </div>
          </div>
        </Card>

        {/* <ScoreMeterCard score={62} /> */}
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues by Severity - Enhanced */}
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Issues by Severity</h3>
              <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={timeRange === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("week")}
              >
                Week
              </Button>
              <Button
                variant={timeRange === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("month")}
              >
                Month
              </Button>
              <Button
                variant={timeRange === "quarter" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange("quarter")}
              >
                Quarter
              </Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={severityData}>
              <defs>
                <linearGradient
                  id="criticalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FACC15" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FACC15" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(264 92% 61% / 0.3)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              />
              <Area
                type="monotone"
                dataKey="critical"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#criticalGradient)"
                dot={{ fill: "#EF4444", r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="high"
                stroke="#F97316"
                strokeWidth={2}
                fill="url(#highGradient)"
                dot={{ fill: "#F97316", r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="medium"
                stroke="#FACC15"
                strokeWidth={2}
                fill="url(#mediumGradient)"
                dot={{ fill: "#FACC15", r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="#22C55E"
                strokeWidth={2}
                fill="url(#lowGradient)"
                dot={{ fill: "#22C55E", r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Trend Indicators */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-destructive/20 rounded-full overflow-hidden">
                <div className="h-full bg-destructive w-[60%] rounded-full"></div>
              </div>
              <span className="text-xs text-destructive font-medium">-40%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-high/20 rounded-full overflow-hidden">
                <div className="h-full bg-high w-[45%] rounded-full"></div>
              </div>
              <span className="text-xs text-high font-medium">-32%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-warning/20 rounded-full overflow-hidden">
                <div className="h-full bg-warning w-[28%] rounded-full"></div>
              </div>
              <span className="text-xs text-warning font-medium">-16%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-success/20 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[35%] rounded-full"></div>
              </div>
              <span className="text-xs text-success font-medium">-28%</span>
            </div>
          </div>
        </Card>

        {/* Most Recent Issues */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Most Frequent Issues
              </h3>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "p-4 rounded-lg bg-card-secondary/50 border-l-4 hover:bg-card-secondary transition-all cursor-pointer group"
                )}
                style={{ borderLeftColor: getSeverityColor(issue.severity) }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{issue.id}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {issue.description}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 font-bold"
                    style={{
                      borderColor: getSeverityColor(issue.severity),
                      color: getSeverityColor(issue.severity),
                    }}
                  >
                    {issue.cvss}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {issue.time}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-secondary"
                  >
                    View Details
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk Overview Summary */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Risk Overview Summary</h2>
          <p className="text-sm text-muted-foreground">
            Aggregated threat and vulnerability health indicators
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary rounded-full mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-3">
              <Shield className="h-8 w-8 text-destructive" />
              <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-xl font-bold text-destructive">8</span>
              </div>
            </div>
            <h4 className="text-sm text-muted-foreground mb-1">
              Critical Systems
            </h4>
            <p className="text-2xl font-bold text-destructive">High Risk</p>
          </Card>

          <Card className="glass-card p-6 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-3">
              <Shield className="h-8 w-8 text-success" />
              <div className="relative h-12 w-12">
                <svg className="transform -rotate-90 h-12 w-12">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="hsl(var(--muted))"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="hsl(var(--success))"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - 0.87)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-success">87%</span>
                </div>
              </div>
            </div>
            <h4 className="text-sm text-muted-foreground mb-1">
              Patched Devices
            </h4>
            <p className="text-2xl font-bold text-success">8,700</p>
          </Card>

          <Card className="glass-card p-6 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-3">
              <FileText className="h-8 w-8 text-warning" />
              <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                <span className="text-xl font-bold text-warning">43</span>
              </div>
            </div>
            <h4 className="text-sm text-muted-foreground mb-1">
              Pending Reports
            </h4>
            <p className="text-2xl font-bold text-warning">Review</p>
          </Card>

          <Card className="glass-card p-6 hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-3">
              <Bell className="h-8 w-8 text-destructive animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive animate-pulse"></div>
                <span className="text-xl font-bold text-destructive">12</span>
              </div>
            </div>
            <h4 className="text-sm text-muted-foreground mb-1">
              Active Alerts
            </h4>
            <p className="text-2xl font-bold text-destructive">Live</p>
          </Card>
        </div>
      </div>

      {/* System Health vs Threat Density */}
      <Card className="glass-card p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-1">
            Remediation Trend (Last 6 Months)
          </h3>
          <div className="h-1 w-16 bg-gradient-to-r from-[hsl(260,70%,60%)] to-[hsl(330,70%,65%)] rounded-full"></div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={[
              { month: "Jan", fixed: 420, pending: 310 },
              { month: "Feb", fixed: 510, pending: 295 },
              { month: "Mar", fixed: 610, pending: 270 },
              { month: "Apr", fixed: 730, pending: 245 },
              { month: "May", fixed: 820, pending: 210 },
              { month: "Jun", fixed: 940, pending: 180 },
            ]}
          >
            <defs>
              {/* Fixed Issues Gradient */}
              <linearGradient id="fixedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
              </linearGradient>

              {/* Pending Issues Gradient */}
              <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />

            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(280 80% 70% / 0.3)",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />

            <Legend />

            {/* Fixed Vulnerabilities */}
            <Area
              type="monotone"
              dataKey="fixed"
              stroke="#8B5CF6"
              strokeWidth={3}
              fill="url(#fixedGradient)"
              dot={{ fill: "#8B5CF6", r: 5 }}
              name="Fixed Vulnerabilities"
            />

            {/* Pending Vulnerabilities */}
            <Area
              type="monotone"
              dataKey="pending"
              stroke="#F43F5E"
              strokeWidth={3}
              fill="url(#pendingGradient)"
              dot={{ fill: "#F43F5E", r: 5 }}
              name="Pending Vulnerabilities"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Footer Insight Section */}
        <div className="flex items-center justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-[#8B5CF6]">
              Fixed vulnerabilities up by 8.5%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-[#F43F5E]" />
            <span className="text-sm font-medium text-[#F43F5E]">
              Pending backlog reduced by 12%
            </span>
          </div>
        </div>
      </Card>

      <Chatbot />
    </div>
  );
}
