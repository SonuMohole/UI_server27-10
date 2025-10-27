import SIMDashboard from "./SIMDashboard";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Shield,
  Cpu,
  Activity,
  RefreshCcw,
  Sun,
  Moon,
  BellRing,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/**
 * 
 * 2.tsx
 * - 3 Tabs: QCT | SIM | VM
 * - Integrated SIMDashboard
 * - QCT Dashboard includes: Issues Trend, Frequent Issues, Risk Overview, Remediation Chart
 */

// ---------- Mock Data ----------
const MOCK_QCT = {
  topCards: {
    totalIssues: 4992,
    totalAssets: 1234,
    totalTechnologies: 445,
    qctScore: 72.3,
  },
  trendBySeverity: [
    { week: "Week 1", Critical: 8, High: 12, Medium: 20, Low: 15 },
    { week: "Week 2", Critical: 10, High: 9, Medium: 18, Low: 13 },
    { week: "Week 3", Critical: 14, High: 15, Medium: 22, Low: 16 },
    { week: "Week 4", Critical: 9, High: 10, Medium: 19, Low: 14 },
    { week: "Week 5", Critical: 13, High: 17, Medium: 25, Low: 18 },
    { week: "Week 6", Critical: 11, High: 13, Medium: 23, Low: 17 },
  ],
  mostCommon: [
    {
      id: "CVE-2024-21887",
      title: "Input Validation Vulnerability",
      severity: "Critical",
      time: "2 hours ago",
      score: 9.8,
    },
    {
      id: "CVE-2024-38112",
      title: "Windows MSHTML Platform Bypass",
      severity: "High",
      time: "5 hours ago",
      score: 7.5,
    },
    {
      id: "CVE-2024-43093",
      title: "Windows Storage Elevation",
      severity: "Medium",
      time: "8 hours ago",
      score: 6.2,
    },
    {
      id: "CVE-2024-38189",
      title: "Remote Code Execution",
      severity: "Critical",
      time: "20 hours ago",
      score: 8.8,
    },
    {
      id: "CVE-2024-99999",
      title: "Example Low Risk",
      severity: "Low",
      time: "2 days ago",
      score: 3.1,
    },
  ],
  riskOverview: {
    critical: 252,
    high: 1820,
    medium: 1422,
    low: 1498,
    na: 0,
  },
};

const MOCK_REMEDIATION = {
  weekly: [
    { week: "Week 1", Fixed: 10, Pending: 22 },
    { week: "Week 2", Fixed: 14, Pending: 20 },
    { week: "Week 3", Fixed: 18, Pending: 16 },
    { week: "Week 4", Fixed: 22, Pending: 11 },
    { week: "Week 5", Fixed: 28, Pending: 7 },
  ],
  monthly: [
    { month: "Jan", Fixed: 120, Pending: 50 },
    { month: "Feb", Fixed: 150, Pending: 40 },
    { month: "Mar", Fixed: 170, Pending: 30 },
    { month: "Apr", Fixed: 210, Pending: 25 },
    { month: "May", Fixed: 230, Pending: 20 },
  ],
  yearly: [
    { year: "2020", Fixed: 400, Pending: 120 },
    { year: "2021", Fixed: 520, Pending: 100 },
    { year: "2022", Fixed: 640, Pending: 85 },
    { year: "2023", Fixed: 710, Pending: 60 },
    { year: "2024", Fixed: 790, Pending: 50 },
  ],
};

// ---------- Theme Hook ----------
const useLocalTheme = () => {
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("theme") as "dark" | "light") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
};

// ---------- Main Component ----------
const Dashboard2: React.FC = () => {
  const { theme, toggle } = useLocalTheme();
  const [activeTab, setActiveTab] = useState<"qct" | "siem" | "vm">("qct");
  const [loading, setLoading] = useState(false);
  const [mostCommonFilter, setMostCommonFilter] = useState<
    "All" | "Critical" | "High" | "Medium" | "Low"
  >("All");
  const [data] = useState(MOCK_QCT);
  const [remediationView, setRemediationView] = useState<
    "weekly" | "monthly" | "yearly"
  >("weekly");

  const refreshTab = async () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  const filteredMostCommon = useMemo(() => {
    if (mostCommonFilter === "All") return data.mostCommon;
    return data.mostCommon.filter((m) => m.severity === mostCommonFilter);
  }, [data.mostCommon, mostCommonFilter]);

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#071018] dark:text-gray-100">
      {/* ---------------- Top Navbar ---------------- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Dashboards</h2>
<div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 rounded-lg p-1 shadow-sm">
  {(["qct", "siem", "vm"] as const).map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
        activeTab === tab
          ? "bg-[#6b2121] text-white shadow-md scale-[1.05]"
          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/40"
      }`}
    >
      {tab.toUpperCase()} Dashboard
    </button>
  ))}
</div>


          <button
            onClick={() => refreshTab()}
            disabled={loading}
            className="ml-4 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm hover:scale-[1.01]"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* Notifications & Theme */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/6">
            <BellRing className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
              3
            </span>
          </button>

          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-gray-100/60 dark:hover:bg-white/6"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* ---------------- Conditional Dashboards ---------------- */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* QCT Dashboard */}
        {activeTab === "qct" && (
          <>
            {/* 🔹 Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  icon: <Shield className="w-5 h-5 text-red-500" />,
                  title: "Total Issues",
                  value: data.topCards.totalIssues,
                  sub: "Issues detected",
                },
                {
                  icon: <Cpu className="w-5 h-5 text-emerald-400" />,
                  title: "Total Assets",
                  value: data.topCards.totalAssets,
                  sub: "Monitored devices",
                },
                {
                  icon: <BarChart3 className="w-5 h-5 text-pink-400" />,
                  title: "Total Technologies",
                  value: data.topCards.totalTechnologies,
                  sub: "Tech stacks discovered",
                },
                {
                  icon: <Activity className="w-5 h-5 text-rose-500" />,
                  title: "QCT Score",
                  value: data.topCards.qctScore.toFixed(1),
                  sub: "Higher means higher risk",
                  color: "text-rose-500",
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="p-4 bg-white dark:bg-[#0f1720] border dark:border-gray-800 shadow-sm"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-3xl font-bold ${
                        item.color ? item.color : ""
                      }`}
                    >
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.sub}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 🔹 Issues Trend by Severity + Most Frequent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Left: Trend */}
              <Card className="p-4 bg-white dark:bg-[#081319] dark:border-gray-800 h-[550px] flex flex-col lg:col-span-2">
                <CardHeader className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <CardTitle className="text-lg font-semibold">
                    Issues Trend by Severity
                  </CardTitle>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last 6 weeks
                  </span>
                </CardHeader>
                <CardContent className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.trendBySeverity}
                      margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                        opacity={0.3}
                      />
                      <XAxis dataKey="week" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend verticalAlign="top" />
                      <Line
                        type="monotone"
                        dataKey="Critical"
                        stroke="#ef4444"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="High"
                        stroke="#f472b6"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Medium"
                        stroke="#a78bfa"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Low"
                        stroke="#facc15"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Right: Most Frequent Issues */}
              <Card className="p-4 bg-white dark:bg-[#0b1117] border dark:border-gray-800 shadow-sm h-[550px] flex flex-col">
                <CardHeader className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <CardTitle className="text-lg font-semibold">
                    Most Frequent Issues
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={mostCommonFilter}
                      onChange={(e) =>
                        setMostCommonFilter(
                          e.target.value as
                            | "All"
                            | "Critical"
                            | "High"
                            | "Medium"
                            | "Low"
                        )
                      }
                      className="text-sm p-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101a23] text-gray-700 dark:text-gray-200"
                    >
                      <option value="All">All</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden">
                  <div className="space-y-3 h-full overflow-y-auto pr-2 scrollbar-thin">
                    {filteredMostCommon.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-[#131c27] border border-gray-200 dark:border-gray-700"
                      >
                        <div
                          className={`w-1.5 rounded-l-full ${
                            item.severity === "Critical"
                              ? "bg-red-400"
                              : item.severity === "High"
                              ? "bg-rose-400"
                              : item.severity === "Medium"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-sm truncate">
                              {item.id}
                            </div>
                            <div className="text-xs px-2 py-0.5 border rounded-full bg-gray-100 dark:bg-gray-900 text-gray-500">
                              {item.score.toFixed(1)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 🔹 Risk Overview + Remediation */}
            <Card className="p-4 bg-white dark:bg-[#071219] dark:border-gray-800">
              <CardHeader className="flex items-center justify-between mb-3">
                <CardTitle className="text-lg font-semibold">
                  Risk Overview
                </CardTitle>
                <div className="text-sm text-gray-500">
                  Total CVE Threats{" "}
                  <span className="ml-2 font-bold">
                    {Object.values(data.riskOverview).reduce((a, b) => a + b, 0)}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-3 mb-8">
                  {Object.entries(data.riskOverview).map(([key, value]) => (
                    <div key={key} className="flex-1 min-w-[160px]">
                      <div className="p-3 rounded-lg border bg-gray-50 dark:bg-[#0b1012] shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold capitalize">
                            {key}
                          </div>
                          <div className="text-lg font-bold">{value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Remediation Progress */}
                <div className="mt-10 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">
                      Remediation Progress Over Time
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        View:
                      </span>
                      <select
                        value={remediationView}
                        onChange={(e) =>
                          setRemediationView(
                            e.target.value as
                              | "weekly"
                              | "monthly"
                              | "yearly"
                          )
                        }
                        className="text-sm p-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#071016] text-gray-700 dark:text-gray-200"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#081319] border dark:border-gray-800 rounded-xl p-4 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={MOCK_REMEDIATION[remediationView]}
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            theme === "dark" ? "#374151" : "#e5e7eb"
                          }
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey={
                            remediationView === "yearly"
                              ? "year"
                              : remediationView === "monthly"
                              ? "month"
                              : "week"
                          }
                          stroke="#9ca3af"
                        />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip />
                        <Legend verticalAlign="top" />
                        <Line
                          type="monotone"
                          dataKey="Fixed"
                          stroke="#22c55e"
                          strokeWidth={2.5}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Pending"
                          stroke="#f97316"
                          strokeWidth={2.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* SIME Dashboard */}
        {activeTab === "siem" && <SIMDashboard theme={theme} />}

        {/* VM Placeholder */}
        {activeTab === "vm" && (
          <div className="text-center text-gray-400 mt-20">
            <p>🧠 VM Dashboard Coming Soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard2;
