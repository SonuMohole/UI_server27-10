// src/pages/SIMDashboard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Globe,
  Network,
  Cpu,
  RefreshCcw,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MOCK_SIM = {
  topCards: {
    totalAgents: 245,
    activeConnections: 220,
    averageLatency: "142 ms",
    uptimePercentage: 99.6,
  },
  networkHealth: [
    { region: "Asia", Uptime: 98.5, Downtime: 1.5 },
    { region: "Europe", Uptime: 99.2, Downtime: 0.8 },
    { region: "America", Uptime: 99.7, Downtime: 0.3 },
    { region: "Africa", Uptime: 97.8, Downtime: 2.2 },
  ],
  activeAgents: [
    { name: "Server A", status: "Healthy", cpu: 45 },
    { name: "Server B", status: "Moderate", cpu: 72 },
    { name: "Server C", status: "Overload", cpu: 95 },
    { name: "Server D", status: "Healthy", cpu: 55 },
  ],
};

const SIMDashboard = ({ theme }: { theme: "dark" | "light" }) => {
  const [data] = useState(MOCK_SIM);

  return (
    <div>
      {/* ✨ Top Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            icon: <Server className="w-5 h-5 text-blue-500" />,
            title: "Total Agents",
            value: data.topCards.totalAgents,
            sub: "Deployed across regions",
          },
          {
            icon: <Network className="w-5 h-5 text-emerald-400" />,
            title: "Active Connections",
            value: data.topCards.activeConnections,
            sub: "Live monitoring agents",
          },
          {
            icon: <Activity className="w-5 h-5 text-yellow-400" />,
            title: "Average Latency",
            value: data.topCards.averageLatency,
            sub: "Global response average",
          },
          {
            icon: <Globe className="w-5 h-5 text-rose-500" />,
            title: "Uptime",
            value: `${data.topCards.uptimePercentage}%`,
            sub: "System-wide uptime",
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
              <p className="text-3xl font-bold">{item.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* 🌍 Network Health Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 bg-white dark:bg-[#081319] dark:border-gray-800 h-[450px] flex flex-col">
          <CardHeader className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-lg font-semibold">
              Network Health by Region
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.networkHealth}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme === "dark" ? "#374151" : "#e5e7eb"}
                  opacity={0.3}
                />
                <XAxis dataKey="region" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#0f1720" : "#fff",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="Uptime" fill="#22c55e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Downtime" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* 🧠 Active Agents */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card className="p-4 bg-white dark:bg-[#0b1117] border dark:border-gray-800 shadow-sm">
          <CardHeader className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <CardTitle className="text-lg font-semibold">
              Active Agents Overview
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {data.activeAgents.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-[#131c27] border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {agent.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {agent.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          agent.cpu > 80
                            ? "bg-red-500"
                            : agent.cpu > 60
                            ? "bg-amber-400"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${agent.cpu}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        agent.cpu > 80
                          ? "text-red-500"
                          : agent.cpu > 60
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {agent.cpu}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SIMDashboard;
