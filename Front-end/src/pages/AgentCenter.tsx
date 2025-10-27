"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Download, FileText, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// --- CONFIGURATION ---
const API_BASE_URL = "http://localhost:8000";
// ---------------------

const initialOsCards = [
  {
    name: "Windows",
    icon: "🪟",
    api_name: "windows",
    version: "v2.4.1",
    file: "QS-Setup.exe",
    date: "2025-09-28",
    checksum: "Fetching...",
  },
  {
    name: "Linux",
    icon: "🐧",
    api_name: "ubuntu",
    version: "v2.4.1",
    file: "qs-agent_1.0.0_all.deb",
    date: "2025-09-28",
    checksum: "Fetching...",
  },
  {
    name: "macOS",
    icon: "🍎",
    api_name: "mac",
    version: "v2.4.1",
    file: "mac_agent",
    date: "2025-09-28",
    checksum: "Fetching...",
  },
];

// --- Types ---
interface AgentLog {
  agent_uuid: string;
  hostname: string;
  ip_address: string;
  os_name: string;
  status: "Active" | "Inactive";
  last_heartbeat_str: string;
}

interface Asset {
  hostname: string;
  username: string;
  os: string;
  os_version: string;
  cpu: string;
  memory_gb: number;
  disk_gb: number;
  ip_addresses: string;
  collected_at: string;
}

// --- Component ---
export default function AgentCenter() {
  const [filter, setFilter] = useState("all");
  const [osCards, setOsCards] = useState(initialOsCards);

  const [monitoringData, setMonitoringData] = useState<{ logs: AgentLog[]; total_pages: number }>({
    logs: [],
    total_pages: 1,
  });
  const [monitoringPage, setMonitoringPage] = useState(1);

  const [assetData, setAssetData] = useState<{ assets: Asset[]; total_pages: number }>({
    assets: [],
    total_pages: 1,
  });
  const [assetPage, setAssetPage] = useState(1);

  // --- Fetch Monitoring Data ---
  const fetchMonitoringData = (page: number) => {
    fetch(`${API_BASE_URL}/server_dashboard/data?page=${page}&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch monitoring data.");
        return res.json();
      })
      .then((data) => {
        setMonitoringData({
          logs: data.logs || [],
          total_pages: data.total_pages || 1,
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  // --- Fetch Asset Data ---
  const fetchAssetData = (page: number) => {
    fetch(`${API_BASE_URL}/api/assets?page=${page}&limit=50`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch asset data.");
        return res.json();
      })
      .then((data) => {
        setAssetData({
          assets: data.assets || [],
          total_pages: data.total_pages || 1,
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  // --- Fetch Checksums ---
  useEffect(() => {
    const fetchChecksums = async () => {
      const updatedCards = [...initialOsCards];
      for (let i = 0; i < updatedCards.length; i++) {
        try {
          const res = await fetch(`${API_BASE_URL}/get_link/${updatedCards[i].api_name}`);
          if (!res.ok) throw new Error("File not found or unauthorized");
          const data = await res.json();
          updatedCards[i].checksum = data.sha256.substring(0, 15) + "...";
        } catch (error) {
          console.error(`Failed to get checksum for ${updatedCards[i].name}:`, error);
          updatedCards[i].checksum = "Unavailable";
        }
      }
      setOsCards(updatedCards);
    };
    fetchChecksums();
  }, []);

  useEffect(() => {
    fetchMonitoringData(monitoringPage);
  }, [monitoringPage]);

  useEffect(() => {
    fetchAssetData(assetPage);
  }, [assetPage]);

  // --- Handle Downloads ---
  const handleDownload = async (os_api_name: string) => {
    const toastId = toast.loading(`Requesting ${os_api_name} agent...`);
    try {
      const res = await fetch(`${API_BASE_URL}/get_link/${os_api_name}`);
      if (res.status === 404) {
        const err = await res.json();
        throw new Error(err.detail || "File not found on server.");
      }
      if (!res.ok) throw new Error("Download request failed.");

      const data = await res.json();
      const downloadUrl = data.url; // ✅ Corrected
      window.location.href = downloadUrl;

      toast.success(`Downloading ${os_api_name} agent...`, { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleReportAction = (action: string, report: string) => {
    toast.success(`${action} "${report}" successfully (Demo)`);
  };

  const filteredAgents = monitoringData.logs.filter((agent) => {
    if (filter === "all") return true;
    if (filter === "active") return agent.status === "Active";
    if (filter === "offline") return agent.status === "Inactive";
    if (filter === "idle") return false;
    return true;
  });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Agent Center</h1>
        <p className="text-muted-foreground">Download, monitor, and manage security agents</p>
      </div>

      <Tabs defaultValue="download" className="space-y-6">
        <TabsList className="glass-panel p-1">
          <TabsTrigger value="download" className="gap-2">
            <Download className="h-4 w-4" />
            Download Center
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="gap-2">
            <Monitor className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileText className="h-4 w-4" />
            Asset Inventory
          </TabsTrigger>
        </TabsList>

        {/* --- DOWNLOAD CENTER --- */}
        <TabsContent value="download" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {osCards.map((os) => (
              <Card key={os.name} className="glass-card p-6 hover:glow-primary transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-2">{os.icon}</div>
                  <h3 className="text-xl font-bold">{os.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Version: <span className="text-foreground font-medium">{os.version}</span>
                    </p>
                    <p>Released: {os.date}</p>
                    <p className="text-xs">Checksum: {os.checksum}</p>
                  </div>
                  <Button
                    onClick={() => handleDownload(os.api_name)}
                    className="w-full gradient-primary hover:glow-accent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {os.file.split(".").pop()?.toUpperCase()}
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Installation Guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- MONITORING --- */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Overview */}
            <Card className="glass-card p-6 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-center">Agent Status</h3>
              <div className="relative flex items-center justify-center h-64">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{monitoringData.logs.length}</p>
                    <p className="text-sm text-muted-foreground">Total Agents (On this page)</p>
                  </div>
                </div>
                <svg className="w-full h-full animate-spin-slow" style={{ animationDuration: "20s" }}>
                  <circle cx="50%" cy="50%" r="45%" fill="none" stroke="hsl(var(--success))" strokeWidth="8" strokeDasharray="70 30" />
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="hsl(var(--warning))" strokeWidth="8" strokeDasharray="20 80" />
                  <circle cx="50%" cy="50%" r="25%" fill="none" stroke="hsl(var(--destructive))" strokeWidth="8" strokeDasharray="10 90" />
                </svg>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-sm">Active</span>
                  </div>
                  <span className="font-medium">{monitoringData.logs.filter((a) => a.status === "Active").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-sm">Idle</span>
                  </div>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive" />
                    <span className="text-sm">Offline</span>
                  </div>
                  <span className="font-medium">{monitoringData.logs.filter((a) => a.status === "Inactive").length}</span>
                </div>
              </div>
            </Card>

            {/* Agent Table */}
            <Card className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Connected Agents</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                    All
                  </Button>
                  <Button size="sm" variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
                    Active
                  </Button>
                  <Button size="sm" variant={filter === "offline" ? "default" : "outline"} onClick={() => setFilter("offline")}>
                    Offline
                  </Button>
                  <Button size="sm" variant={filter === "idle" ? "default" : "outline"} onClick={() => setFilter("idle")}>
                    Idle
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Hostname</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">IP Address</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">OS</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent) => (
                      <tr key={agent.agent_uuid} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="py-3 font-mono text-sm">{agent.hostname}</td>
                        <td className="py-3 text-sm">{agent.ip_address}</td>
                        <td className="py-3 text-sm">{agent.os_name}</td>
                        <td className="py-3">
                          <Badge variant={agent.status === "Active" ? "default" : "destructive"} className="capitalize">
                            {agent.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{agent.last_heartbeat_str}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-end items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMonitoringPage((p) => Math.max(1, p - 1))}
                  disabled={monitoringPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {monitoringPage} of {monitoringData.total_pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMonitoringPage((p) => Math.min(monitoringData.total_pages, p + 1))}
                  disabled={monitoringPage === monitoringData.total_pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* --- ASSET INVENTORY --- */}
        <TabsContent value="reports">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Asset Inventory</h3>
              <p className="text-sm text-muted-foreground">Live asset data collected from agents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(assetData.assets || []).map((asset, idx) => (
                <Card key={idx} className="glass-card p-6 hover:glow-primary transition-all">
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-3">
                        {asset.os}
                      </Badge>
                      <h4 className="font-semibold mb-2">{asset.hostname}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          User: <span className="text-foreground font-mono">{asset.username}</span>
                        </p>
                        <p>OS Version: {asset.os_version}</p>
                        <p>CPU: {asset.cpu}</p>
                        <p>RAM: {asset.memory_gb} GB / Disk: {asset.disk_gb} GB</p>
                        <p>IPs: {asset.ip_addresses}</p>
                        <p>Last Seen: {new Date(asset.collected_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleReportAction("Viewed Details for", asset.hostname)}
                      >
                        👁️ View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction("Triggered Scan on", asset.hostname)}
                      >
                        ⚡ Scan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssetPage((p) => Math.max(1, p - 1))}
                disabled={assetPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {assetPage} of {assetData.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAssetPage((p) => Math.min(assetData.total_pages, p + 1))}
                disabled={assetPage === assetData.total_pages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
