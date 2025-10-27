import Chatbot from "@/components/dashboard/Chatbot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NotificationPanel from "@/components/ui/NotificationPanel";
import { useCallback, useEffect, useRef, useState } from "react"; // ✅ useRef added
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronRight,
  FileText,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const techData = [
  { name: "Endpoint", value: 450 },
  { name: "Network", value: 320 },
  { name: "Cloud", value: 210 },
  { name: "Identity", value: 150 },
];

type CVEData = { name: string; value: number; color: string };

const cveData: CVEData[] = [
  { name: "Critical", value: 252, color: "#f59e0b" }, // amber
  { name: "High", value: 1820, color: "#ef4444" }, // red
  { name: "Medium", value: 1422, color: "#6366f1" }, // indigo
  { name: "Low", value: 1498, color: "#22c55e" }, // green
];

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
      {/* === KPI Section (Refined Compact Professional Version) === */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {/* 🟥 Total Issues */}
        <Card className="p-4 h-[130px] flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-[#ffffff] to-[#f3f4f6] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div>
            <p className="text-xs md:text-sm text-[#454555] font-medium">
              Total Issues
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#d72638] mt-1 tracking-tight">
              6,592
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-[#d72638]" />
            <span className="text-xs md:text-sm font-semibold text-[#d72638]">
              -12.5%
            </span>
            <span className="text-[10px] text-[#aaaabc]">vs last scan</span>
          </div>
        </Card>

        {/* 🟦 Agents Online / Total */}
        <Card className="p-4 h-[130px] flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-[#ffffff] to-[#f5f6fa] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div>
            <p className="text-xs md:text-sm text-[#454555] font-medium">
              Agents Online / Total
            </p>
            <div className="flex items-center justify-between mt-1">
              <div className="text-3xl md:text-4xl font-bold text-[#0284c7]">
                256<span className="text-gray-400 text-xl"> / 300</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]"></div>
                <span className="mt-1 text-[9px] font-medium text-emerald-500">
                  Live
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#0284c7]" />
            <span className="text-xs md:text-sm font-semibold text-[#0284c7]">
              +3.7%
            </span>
            <span className="text-[10px] text-[#aaaabc]">uptime this week</span>
          </div>
        </Card>

        {/* 🟣 Total Assets */}
        <Link to="/assets" className="block">
          <Card className="p-4 h-[130px] flex flex-col justify-between cursor-pointer rounded-xl border border-gray-200 bg-gradient-to-br from-[#ffffff] to-[#f4f4fa] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div>
              <p className="text-xs md:text-sm text-[#454555] font-medium">
                Total Assets
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-[#7c3aed] mt-1 tracking-tight">
                1K+
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#7c3aed]" />
              <span className="text-xs md:text-sm font-semibold text-[#7c3aed]">
                +8.0%
              </span>
              <span className="text-[10px] text-[#aaaabc]">vs last scan</span>
            </div>
          </Card>
        </Link>

        {/* 🟢 Total Technologies */}
        <Card className="p-4 h-[130px] flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-[#ffffff] to-[#f1f9f4] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div>
            <p className="text-xs md:text-sm text-[#454555] font-medium">
              Total Technologies
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-[#10b981] mt-1 tracking-tight">
              3,824
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#10b981]" />
            <span className="text-xs md:text-sm font-semibold text-[#10b981]">
              +5.2%
            </span>
            <span className="text-[10px] text-[#aaaabc]">vs last scan</span>
          </div>
        </Card>

        {/* 🟡 QCT Score */}
        <Card className="p-4 h-[130px] flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-[#ffffff] to-[#fdfaf3] shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-[#454555] font-medium">
                QCT Score
              </p>
              <h3 className="text-3xl md:text-4xl font-bold text-[#fbbf24] mt-1 tracking-tight">
                72.3
              </h3>
            </div>
            <div className="relative h-10 w-10">
              <svg className="transform -rotate-90 h-10 w-10">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="url(#qctGradient)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.723)}`}
                />
                <defs>
                  <linearGradient id="qctGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#f59e0b]">
                  72%
                </span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#aaaabc] mt-1">
            Quality • Compliance • Threat Index
          </p>
        </Card>
      </div>

      {/* Main Analytics Section */}
      {/* === Main Analytics Section (Refined Compact Version) === */}
      {/* === Main Analytics Section (Balanced Layout) === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🧩 Issues by Severity */}
        <Card className="glass-card p-5 lg:col-span-2 h-[340px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Issues by Severity
                </h3>
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
              </div>

              <div className="flex gap-2">
                {(["week", "month", "quarter"] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="capitalize"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={severityData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="criticalGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="mediumGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                {/* Cleaner chart look — no grid lines */}
                <CartesianGrid vertical={false} horizontal={false} />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#criticalGradient)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#highGradient)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stroke="#facc15"
                  strokeWidth={2}
                  fill="url(#mediumGradient)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#lowGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Indicators */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { color: "#ef4444", val: "-40%" },
              { color: "#f97316", val: "-32%" },
              { color: "#facc15", val: "-16%" },
              { color: "#22c55e", val: "-28%" },
            ].map((bar, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${40 + i * 10}%`,
                      backgroundColor: bar.color,
                    }}
                  ></div>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: bar.color }}
                >
                  {bar.val}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* 🧭 Agent Uptime (7 days) */}
        <Card className="p-5 h-[340px] shadow-sm border border-gray-100 rounded-xl bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              Agent Uptime (7 days)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Monitored active agents across clusters
            </p>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { day: "D-6", uptime: 96 },
                    { day: "D-5", uptime: 95.5 },
                    { day: "D-4", uptime: 94 },
                    { day: "D-3", uptime: 96 },
                    { day: "D-2", uptime: 97 },
                    { day: "D-1", uptime: 98.5 },
                    { day: "Today", uptime: 99.2 },
                  ]}
                  margin={{ top: 5, right: 20, left: -5, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(0,0,0,0.08)"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    stroke="rgba(0,0,0,0.45)"
                    fontSize={11}
                  />
                  <YAxis
                    domain={[90, 100]}
                    axisLine={false}
                    tickLine={false}
                    stroke="rgba(0,0,0,0.45)"
                    fontSize={11}
                  />
                  <Tooltip
                    cursor={{ stroke: "rgba(59,130,246,0.3)", strokeWidth: 1 }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Last updated: Today 10:45 AM</span>
            <span className="text-blue-500 font-medium">↑ 0.5 improvement</span>
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

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        </div> */}

        {/* --- Aligned Risk Overview Cards (uniform height) --- */}
        {/* --- Compact Risk Overview Cards (Smaller + Balanced) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Critical Systems",
              subtitle: "High Risk",
              icon: <Shield className="h-6 w-6 text-destructive" />,
              value: "8",
              color: "text-destructive",
              bg: "bg-destructive/15",
            },
            {
              title: "Patched Devices",
              subtitle: "8,700",
              icon: <Shield className="h-6 w-6 text-success" />,
              value: "87%",
              color: "text-success",
              progress: true,
            },
            {
              title: "Pending Reports",
              subtitle: "Review",
              icon: <FileText className="h-6 w-6 text-warning" />,
              value: "43",
              color: "text-warning",
              bg: "bg-warning/15",
            },
            {
              title: "Active Alerts",
              subtitle: "Live",
              icon: <Bell className="h-6 w-6 text-destructive animate-pulse" />,
              value: "12",
              color: "text-destructive",
              bg: "bg-destructive/15",
              pulse: true,
            },
          ].map((item, i) => (
            <Card
              key={i}
              className="p-4 rounded-xl flex flex-col justify-between border border-gray-200/60 
                 bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md 
                 hover:scale-[1.02] transition-all duration-300 min-h-[140px]"
            >
              {/* Top Section */}
              <div className="flex items-center justify-between mb-2">
                {item.icon}
                {item.progress ? (
                  <div className="relative h-10 w-10">
                    <svg className="transform -rotate-90 h-10 w-10">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="hsl(var(--muted))"
                        strokeWidth="3"
                        fill="none"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        stroke="hsl(var(--success))"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - 0.87)}`}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-success">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${item.bg}`}
                  >
                    <span className={`text-lg font-bold ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div>
                <h4 className="text-[13px] text-muted-foreground mb-0.5">
                  {item.title}
                </h4>
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.subtitle}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {/* CVE Threats Row */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* ---------- CVEs Threats Card ---------- */}
        <Card
          className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/50
    bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#0f0f0f] dark:via-[#111111] dark:to-[#1a1a1a]
    shadow-sm hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🛡️ CVEs Threats
          </h2>

          {/* ---------------- CVEs Threats content (TSX - replace inside Card) ---------------- */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300/40 text-amber-700 text-sm font-semibold shadow-sm">
              Critical{" "}
              <span className="ml-1 text-amber-900 font-bold">252</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-50 border border-red-300/40 text-red-700 text-sm font-semibold shadow-sm">
              High <span className="ml-1 text-red-900 font-bold">1820</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-indigo-50 border border-indigo-300/40 text-indigo-700 text-sm font-semibold shadow-sm">
              Medium{" "}
              <span className="ml-1 text-indigo-900 font-bold">1422</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-50 border border-green-300/40 text-green-700 text-sm font-semibold shadow-sm">
              Low <span className="ml-1 text-green-900 font-bold">1498</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300/40 text-gray-600 text-sm font-semibold shadow-sm">
              N/A <span className="ml-1 text-gray-800 font-bold">0</span>
            </div>
          </div>

          {/* Distribution Pie Chart (TSX) */}
          {/* <div className="mt-6 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cveData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="50%"
                  outerRadius="80%"
                  paddingAngle={4}
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {cveData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  wrapperStyle={{
                    outline: "none",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                    borderRadius: 8,
                  }}
                  formatter={(value: number) =>
                    `${value.toLocaleString()} CVEs`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div> */}


            {/* --- Refined CVE Distribution Donut Chart --- */}
<div className="mt-8 flex flex-col items-center justify-center">
  <div className="relative w-full max-w-[420px] h-[260px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        {/* Soft radial glow for subtle depth */}
        <defs>
          <radialGradient id="donutGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Donut Chart */}
        <Pie
          data={cveData}
          dataKey="value"
          nameKey="name"
          innerRadius="65%"
          outerRadius="85%"
          paddingAngle={2}
          startAngle={90}
          endAngle={450}
          label={({ name, percent, cx, cy, midAngle, outerRadius }: any) => {
            const RADIAN = Math.PI / 180;
            const radius = outerRadius + 20; // 👈 extra gap between donut and label
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
              <text
                x={x}
                y={y}
                fill={
                  name === "Critical"
                    ? "#f59e0b"
                    : name === "High"
                    ? "#ef4444"
                    : name === "Medium"
                    ? "#6366f1"
                    : name === "Low"
                    ? "#22c55e"
                    : "#6b7280"
                }
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                fontSize={13}
                fontWeight={500}
              >
                {`${name} ${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          labelLine={false}
          isAnimationActive
          animationDuration={900}
        >
          {cveData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.color}
              stroke="url(#donutGlow)"
              strokeWidth={2}
            />
          ))}
        </Pie>

        {/* Tooltip (Dark Mode Friendly) */}
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(30, 30, 30, 0.9)",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: "12px",
          }}
          formatter={(value: number) => `${value.toLocaleString()} CVEs`}
        />
      </PieChart>
    </ResponsiveContainer>

    {/* --- Centered Text --- */}
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-xs text-muted-foreground mb-1">Total CVEs</p>
      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-rose-500 bg-clip-text text-transparent">
        4,992
      </p>
    </div>
  </div>
</div>


          {/* ---------------- end TSX block ---------------- */}

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Total CVEs recorded this cycle
            </p>
            <p className="text-lg font-bold text-primary">4,992</p>
          </div>
        </Card>

        {/* ---------- Technologies Distribution Chart Card ---------- */}
        <Card
          className="p-6 rounded-2xl border border-gray-200/60 dark:border-gray-800/50
    bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#0f0f0f] dark:via-[#111111] dark:to-[#1a1a1a]
    shadow-sm hover:shadow-md transition-all duration-300"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⚙️ Technologies Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={techData} barCategoryGap="25%">
              <defs>
                <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.4}
              />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                  fontWeight: 500,
                }}
              />
              <Bar
                dataKey="value"
                fill="url(#techGradient)"
                radius={[8, 8, 0, 0]}
                barSize={50}
                isAnimationActive
                animationDuration={1200}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* === Vulnerability Insights Section === */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🔴 Left: Most Frequent CVEs */}
        {/* 🔴 Most Frequent CVEs (Compact & Polished) */}
        <Card
          className="p-6 lg:col-span-2 bg-gradient-to-br from-white via-gray-50 to-gray-100 
  dark:from-[#0d0d0d] dark:via-[#141414] dark:to-[#1a1a1a] 
  border border-gray-200/40 dark:border-gray-800/40 rounded-2xl 
  shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-semibold text-foreground tracking-tight">
                Most Frequent CVEs
              </h3>
              <div className="h-0.5 w-20 bg-gradient-to-r from-rose-500 to-orange-400 rounded-full mt-1"></div>
            </div>

            <Badge
              className="text-[10px] font-semibold bg-rose-100 text-rose-700 border border-rose-200 
      px-2 py-0.5 shadow-sm uppercase tracking-wide"
            >
              Top 10
            </Badge>
          </div>

          {/* Table Container */}
          <div
            className="overflow-x-auto overflow-y-auto max-h-[350px] rounded-lg border border-gray-100/50 
    dark:border-gray-800/60 backdrop-blur-sm custom-scrollbar"
          >
            <table className="w-full border-collapse text-sm">
              {/* Table Head */}
              <thead
                className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 
        sticky top-0 z-10 border-b border-gray-200/40 dark:border-gray-800/40"
              >
                <tr className="text-[12px] uppercase text-muted-foreground font-semibold tracking-wide">
                  <th className="text-left py-3 px-4">CVE ID</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">CVSS</th>
                  <th className="text-left py-3 px-4">Severity</th>
                  <th className="text-left py-3 px-4">Published</th>
                  <th className="text-center py-3 px-4">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {recentIssues.map((issue, index) => (
                  <tr
                    key={issue.id}
                    className={cn(
                      "group transition-colors duration-150",
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50/60 dark:bg-gray-800/50",
                      "hover:bg-gray-100/70 dark:hover:bg-gray-800/60 border-b border-gray-100/50 dark:border-gray-800/40"
                    )}
                  >
                    {/* CVE ID */}
                    <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                      <span className="hover:text-primary transition-colors cursor-pointer">
                        {issue.id}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-muted-foreground text-[13px] max-w-[320px] truncate">
                      {issue.description}
                    </td>

                    {/* CVSS Score */}
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                        style={{
                          borderColor: getSeverityColor(issue.severity),
                          color: getSeverityColor(issue.severity),
                        }}
                      >
                        {issue.cvss}
                      </Badge>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4 text-[13px] font-medium capitalize">
                      <span style={{ color: getSeverityColor(issue.severity) }}>
                        {issue.severity}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-4 text-[12px] text-muted-foreground whitespace-nowrap">
                      {issue.time}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] text-primary opacity-0 group-hover:opacity-100 
                  hover:bg-primary/10 transition-all duration-200"
                      >
                        View
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          className="p-6 flex flex-col bg-gradient-to-br from-[#f9fafb] to-white 
  dark:from-[#111111] dark:to-[#1a1a1a] border border-gray-200/40 dark:border-gray-800/40 
  shadow-md hover:shadow-lg rounded-xl transition-all duration-300"
        >
          {/* Header */}
          <div className="w-full text-center mb-4">
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Open Security Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Current unresolved alerts detected across systems
            </p>
          </div>

          {/* Alerts List */}
          <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar px-1">
            {[
              {
                id: "AL-4012",
                title: "Unauthorized Access Attempt",
                desc: "Multiple failed login attempts detected on admin node.",
                icon: "🔒",
                severity: "High",
              },
              {
                id: "AL-3987",
                title: "Outdated SSL Certificate",
                desc: "SSL certificate for the internal API expires in 5 days.",
                icon: "📜",
                severity: "Medium",
              },
              {
                id: "AL-3823",
                title: "Unpatched Software",
                desc: "Detected unpatched Apache HTTPD server on Node 7.",
                icon: "⚙️",
                severity: "High",
              },
              {
                id: "AL-3741",
                title: "Suspicious File Activity",
                desc: "Unexpected file modifications observed on host QCT-14.",
                icon: "🧩",
                severity: "Low",
              },
              {
                id: "AL-3619",
                title: "Deprecated Protocol Use",
                desc: "Detected traffic using TLS 1.0 on internal network.",
                icon: "🌐",
                severity: "Medium",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className="group border border-gray-100 dark:border-gray-800/60 
          rounded-lg p-3 flex items-start gap-3 hover:bg-gray-50/70 
          dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                {/* Icon */}
                <div className="text-xl">{alert.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-semibold text-foreground leading-snug">
                      {alert.title}
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {alert.id}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mb-1">
                    {alert.desc}
                  </p>
                  <div className="text-[11px] text-muted-foreground">
                    Severity:{" "}
                    <span className="font-medium text-foreground">
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-4 text-xs text-muted-foreground text-center border-t border-gray-200 dark:border-gray-800 pt-3">
            <span className="font-medium text-foreground">
              Total Open Alerts: 5
            </span>
            <br />
            <span>Last updated: Today • 10:50 AM</span>
          </div>
        </Card>
      </div>

      {/* System Health vs Threat Density */}

      <Chatbot />
    </div>
  );
}
