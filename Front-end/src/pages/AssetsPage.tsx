import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Server,
  Cpu,
  AppWindow,
  Layers,
  RefreshCcw,
} from "lucide-react";

// -----------------------------
// 🔹 Interfaces
// -----------------------------
interface Asset {
  name: string;
  type: string;
  ip: string;
  risk: "High" | "Medium" | "Low";
  issues: number;
  lastSeen: string;
  status: string;
}

interface CategoryCardProps {
  title: string;
  count: number;
  gradient: string;
  icon: JSX.Element;
  onClick?: () => void;
}

// -----------------------------
// 🔹 Reusable Category Card
// -----------------------------
const CategoryCard = ({ title, count, gradient, icon, onClick }: CategoryCardProps) => (
  <Card
    onClick={onClick}
    className={`p-5 border-l-4 ${gradient} bg-gradient-to-br rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-300`}
  >
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {icon}
    </div>
    <p className="text-3xl font-bold mt-2">{count}</p>
    <p className="text-sm text-muted-foreground">View {title.toLowerCase()}</p>
  </Card>
);

// -----------------------------
// 🔹 Reusable Table Component
// -----------------------------
const AssetTable = ({ assets, onEdit }: { assets: Asset[]; onEdit: (asset: Asset) => void }) => (
  <div className="overflow-x-auto mt-8 border rounded-xl shadow bg-white/80 backdrop-blur-sm">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100/80 border-b">
        <tr>
          {[
            "Asset Name",
            "Type",
            "IP / Hostname",
            "Risk Level",
            "Issues",
            "Last Seen",
            "Status",
            "Actions",
          ].map((header) => (
            <th
              key={header}
              className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wide"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {assets.map((asset, idx) => (
          <tr
            key={idx}
            className="hover:bg-gray-50 transition-all border-b last:border-none"
          >
            <td className="px-4 py-2 font-medium text-foreground">
              <div className="flex items-center gap-2">
                {asset.status === "Active" && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                {asset.name}
              </div>
            </td>
            <td className="px-4 py-2">{asset.type}</td>
            <td className="px-4 py-2">{asset.ip}</td>
            <td className="px-4 py-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  asset.risk === "High"
                    ? "bg-red-100 text-red-700"
                    : asset.risk === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {asset.risk}
              </span>
            </td>
            <td className="px-4 py-2">{asset.issues}</td>
            <td className="px-4 py-2 text-muted-foreground">{asset.lastSeen}</td>
            <td className="px-4 py-2">
              <Badge
                className={`text-xs ${
                  asset.status === "At Risk"
                    ? "bg-red-100 text-red-700"
                    : asset.status === "Idle"
                    ? "bg-gray-100 text-gray-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {asset.status}
              </Badge>
            </td>
            <td className="px-4 py-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(asset)}
                className="flex items-center gap-1 text-xs"
              >
                <Edit3 className="w-4 h-4 text-gray-700" />
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {assets.length === 0 && (
      <div className="text-center text-muted-foreground py-10">
        No assets match your current filters.
      </div>
    )}
  </div>
);

// -----------------------------
// 🔹 Main Component
// -----------------------------
export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  // Demo Asset Data (extended)
  const assets: Asset[] = [
    { name: "Server-01", type: "Server", ip: "10.0.0.24", risk: "High", issues: 8, lastSeen: "2 hrs ago", status: "Active" },
    { name: "Server-02", type: "Server", ip: "10.0.0.35", risk: "Low", issues: 1, lastSeen: "3 hrs ago", status: "Active" },
    { name: "Workstation-24", type: "Endpoint", ip: "10.0.2.11", risk: "Medium", issues: 3, lastSeen: "5 hrs ago", status: "At Risk" },
    { name: "App-Backend", type: "Technology", ip: "172.16.5.22", risk: "High", issues: 6, lastSeen: "1 day ago", status: "Idle" },
    { name: "Laptop-18", type: "Endpoint", ip: "10.0.3.45", risk: "Low", issues: 0, lastSeen: "12 hrs ago", status: "Active" },
    { name: "API-Gateway", type: "Technology", ip: "192.168.1.10", risk: "Medium", issues: 2, lastSeen: "8 hrs ago", status: "Active" },
    { name: "Finance-Server", type: "Server", ip: "10.10.0.5", risk: "High", issues: 5, lastSeen: "3 hrs ago", status: "At Risk" },
    { name: "HR-Laptop", type: "Endpoint", ip: "10.0.5.33", risk: "Low", issues: 0, lastSeen: "6 hrs ago", status: "Active" },
    { name: "Dev-Workstation", type: "Endpoint", ip: "10.0.2.77", risk: "Medium", issues: 4, lastSeen: "1 hr ago", status: "Active" },
    { name: "Data-Processor", type: "Technology", ip: "172.16.3.19", risk: "High", issues: 7, lastSeen: "4 hrs ago", status: "Idle" },
    { name: "QA-Server", type: "Server", ip: "10.1.0.9", risk: "Medium", issues: 2, lastSeen: "30 mins ago", status: "Active" },
    { name: "Proxy-Node", type: "Technology", ip: "172.16.7.88", risk: "Low", issues: 0, lastSeen: "10 hrs ago", status: "Active" },
  ];

  // Filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.ip.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || asset.type === typeFilter;
      const matchesRisk = riskFilter === "All" || asset.risk === riskFilter;
      return matchesSearch && matchesType && matchesRisk;
    });
  }, [search, typeFilter, riskFilter]);

  // Edit Handler
  const handleEdit = (asset: Asset) => alert(`Edit record: ${asset.name}`);

  // Summary Categories (Total + Individual)
  const categories = [
    {
  name: "Total Assets",
  count: assets.length,
  gradient: "from-gray-800 to-gray-700 border-l-gray-800",
  icon: <Layers className="w-5 h-5 text-gray-200" />,
},

    {
      name: "Servers",
      count: assets.filter((a) => a.type === "Server").length,
      gradient: "from-indigo-500/10 to-indigo-500/5 border-l-indigo-500",
      icon: <Server className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: "Endpoints",
      count: assets.filter((a) => a.type === "Endpoint").length,
      gradient: "from-emerald-500/10 to-emerald-500/5 border-l-emerald-500",
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
    },
    {
      name: "Technologies",
      count: assets.filter((a) => a.type === "Technology").length,
      gradient: "from-pink-500/10 to-pink-500/5 border-l-pink-500",
      icon: <AppWindow className="w-5 h-5 text-pink-600" />,
    },
  ];

  return (
    <div className="p-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Asset Inventory</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of all discovered assets across your organization.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCcw className="h-4 w-4 animate-spin-slow" />
          <span>Auto-refresh every 5 mins</span>
        </div>
      </div>

      {/* Category Summary Cards */}
 {/* 🔹 Improved Compact, Balanced Summary Cards */}
{/* ⚡ Minimal & Sleek Summary Cards */}
{/* ⚫⚪ Black & White with Color Glow on Hover */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
  {categories.map((cat) => (
    <Card
      key={cat.name}
      onClick={() =>
        setTypeFilter(cat.name === "Total Assets" ? "All" : cat.name.slice(0, -1))
      }
      className={`
        relative group overflow-hidden p-4 rounded-xl border border-gray-200/70
        bg-gradient-to-br from-white via-gray-50 to-gray-100 
        dark:from-[#0c0c0c] dark:via-[#111111] dark:to-[#1a1a1a]
        hover:shadow-xl transition-all duration-500 cursor-pointer
        flex flex-col justify-between
      `}
    >
      {/* ✨ Color Glow Background (Appears on Hover) */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl rounded-xl`}
        style={{
          background:
            cat.name === "Servers"
              ? "radial-gradient(circle at center, rgba(99,102,241,0.25), transparent 70%)"
              : cat.name === "Endpoints"
              ? "radial-gradient(circle at center, rgba(16,185,129,0.25), transparent 70%)"
              : cat.name === "Technologies"
              ? "radial-gradient(circle at center, rgba(236,72,153,0.25), transparent 70%)"
              : "radial-gradient(circle at center, rgba(31,41,55,0.3), transparent 70%)",
        }}
      ></div>

      {/* Card Content */}
      <div className="relative z-10 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200 tracking-wide">
          {cat.name}
        </h2>
        <div
          className={`text-gray-400 transition-all duration-500 transform group-hover:scale-110 group-hover:text-black dark:group-hover:text-white`}
        >
          {cat.icon}
        </div>
      </div>

      <p className="relative z-10 text-2xl font-semibold mt-2 text-gray-900 dark:text-gray-100 tracking-tight">
        {cat.count}
      </p>

      {/* Underline Accent on Hover */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 rounded-full`}
        style={{
          background:
            cat.name === "Servers"
              ? "#6366f1"
              : cat.name === "Endpoints"
              ? "#10b981"
              : cat.name === "Technologies"
              ? "#ec4899"
              : "#111827",
        }}
      ></div>
    </Card>
  ))}
</div>




      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center justify-between mt-6">
        <input
          type="text"
          placeholder="Search assets by name or IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
        />

        {/* Type Filter */}
        <div className="flex gap-2">
          {["All", "Server", "Endpoint", "Technology"].map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              onClick={() => setTypeFilter(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Risk Filter */}
        <div className="flex gap-2">
          {["All", "High", "Medium", "Low"].map((risk) => (
            <Badge
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-all ${
                riskFilter === risk
                  ? risk === "High"
                    ? "bg-red-600 text-white shadow-sm"
                    : risk === "Medium"
                    ? "bg-yellow-500 text-white shadow-sm"
                    : risk === "Low"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {risk}
            </Badge>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <AssetTable assets={filteredAssets} onEdit={handleEdit} />
    </div>
  );
}
