import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit3,
  HardDrive,
  Loader2,
  RefreshCcw,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// -----------------------------
// 🔹 Configuration
// -----------------------------
const API_BASE_URL = "http://localhost:8000";
const ASSET_API_ENDPOINT = `${API_BASE_URL}/api/assets`;

// -----------------------------
// 🔹 Interfaces
// -----------------------------
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

// -----------------------------
// 🔹 Tabs Component
// -----------------------------
const Tabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    
    { id: "inventory", name: "Asset Inventory", icon: <HardDrive className="w-4 h-4" /> },
    { id: "useclient", name: "Priority", icon: <Users className="w-4 h-4" /> }, // ✅ New tab
  ];

  return (
    <div className="flex gap-3 border-b pb-3">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          className="flex items-center gap-2 text-sm"
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon}
          {tab.name}
        </Button>
      ))}
    </div>
  );
};

// -----------------------------
// 🔹 Asset Table Component
// -----------------------------
const AssetTable = ({
  assets,
  isLoading,
  onEdit,
}: {
  assets: Asset[];
  isLoading: boolean;
  onEdit: (asset: Asset) => void;
}) => (
  <div className="overflow-x-auto mt-8 border rounded-xl shadow bg-white/80 backdrop-blur-sm">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100/80 border-b">
        <tr>
          {[
            "Asset Name",
            "OS",
            "IP Address",
            "CPU",
            "RAM / Disk",
            "Last Seen",
            "User",
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
        {isLoading ? (
          <tr>
            <td colSpan={8}>
              <div className="flex justify-center items-center gap-2 py-10">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading assets...</span>
              </div>
            </td>
          </tr>
        ) : assets.length === 0 ? (
          <tr>
            <td colSpan={8}>
              <div className="text-center text-muted-foreground py-10">
                No assets found. (Ensure backend has data.)
              </div>
            </td>
          </tr>
        ) : (
          assets.map((asset, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 transition-all border-b last:border-none"
            >
              <td className="px-4 py-2 font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {asset.hostname}
                </div>
              </td>
              <td className="px-4 py-2">{asset.os}</td>
              <td className="px-4 py-2">{asset.ip_addresses}</td>
              <td className="px-4 py-2 truncate max-w-[150px]">{asset.cpu}</td>
              <td className="px-4 py-2">
                {asset.memory_gb} GB / {asset.disk_gb} GB
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(asset.collected_at).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                <Badge className="text-xs bg-blue-100 text-blue-700">
                  {asset.username}
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
          ))
        )}
      </tbody>
    </table>
  </div>
);

// -----------------------------
// 🔹 Main Component
// -----------------------------
export default function AgentCenterPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleEdit = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // ✅ Fetch assets
  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ASSET_API_ENDPOINT);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAssets(Array.isArray(data) ? data : data.assets || []);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      toast.error("Failed to fetch assets.", {
        description: "Please check the API connection and try again.",
      });
      setAssets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => assets, [assets]);

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Agent Center</h1>
        <p className="text-muted-foreground">
          Download, monitor, and manage security agents.
        </p>
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "download" && (
          <div>
            <h2 className="text-xl font-semibold">Download Center</h2>
            <p className="text-muted-foreground mt-2">
              Download the latest security agents for your OS.
            </p>
            <Button className="mt-4">Download Agent</Button>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div>
            <h2 className="text-xl font-semibold">Monitoring</h2>
            <p className="text-muted-foreground mt-2">
              Real-time agent status and heartbeat tracking will appear here.
            </p>
          </div>
        )}

        {activeTab === "inventory" && (
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Asset Inventory</h2>
                <p className="text-muted-foreground">
                  Comprehensive overview of all discovered assets.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchAssets} disabled={isLoading}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            <AssetTable assets={filteredAssets} isLoading={isLoading} onEdit={handleEdit} />
          </div>
        )}

      {activeTab === "useclient" && (
  <div className="p-8 space-y-8 animate-fadeIn">
    {/* Header */}
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Asset Priority Classification</h2>
      <p className="text-muted-foreground mt-2">
        Review and prioritize assets based on CIA (Confidentiality, Integrity, Availability) impact levels.
      </p>
    </div>

    {/* Dummy Data */}
    {(() => {
      const dummyAssets = [
        {
          id: 1,
          hostname: "db-prod-01.finance.core",
          ip: "10.1.1.5",
          type: "Server",
          confidentiality: "High",
          integrity: "High",
          availability: "High",
          process: "Payment Processing",
          compliance: "PCI-DSS",
          internetFacing: "No",
        },
        {
          id: 2,
          hostname: "web-portal-01.ecom.public",
          ip: "172.217.14.228",
          type: "Cloud",
          confidentiality: "Medium",
          integrity: "Medium",
          availability: "High",
          process: "Customer Portal",
          compliance: "GDPR",
          internetFacing: "Yes",
        },
        {
          id: 3,
          hostname: "dev-laptop-jdoe",
          ip: "192.168.1.102",
          type: "Endpoint",
          confidentiality: "Medium",
          integrity: "Low",
          availability: "Low",
          process: "Software Development",
          compliance: "None",
          internetFacing: "No",
        },
        {
          id: 4,
          hostname: "core-router-01.datacenter",
          ip: "10.0.0.1",
          type: "Network Device",
          confidentiality: "Low",
          integrity: "High",
          availability: "High",
          process: "Network Routing",
          compliance: "None",
          internetFacing: "No",
        },
        {
          id: 5,
          hostname: "hr-fileshare-01",
          ip: "10.1.10.50",
          type: "Server",
          confidentiality: "High",
          integrity: "Medium",
          availability: "Medium",
          process: "HR Files",
          compliance: "HIPAA, GDPR",
          internetFacing: "No",
        },
      ];

      const ImpactBadge = ({ level }: { level: string }) => {
        const colorMap: Record<string, string> = {
          High: "bg-red-100 text-red-700",
          Medium: "bg-yellow-100 text-yellow-700",
          Low: "bg-green-100 text-green-700",
        };
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              colorMap[level] || "bg-gray-100 text-gray-700"
            }`}
          >
            {level}
          </span>
        );
      };

      return (
        <div className="overflow-x-auto border rounded-xl shadow bg-white/90 backdrop-blur-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100/80 border-b">
              <tr>
                {[
                  "Hostname",
                  "IP Address",
                  "Asset Type",
                  "Business Process",
                  "Confidentiality",
                  "Integrity",
                  "Availability",
                  "Compliance",
                  "Internet Facing",
                  "Priority Level",
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
            <tbody className="divide-y divide-gray-200">
              {dummyAssets.map((asset) => {
                // Calculate simple priority score
                const scoreMap = { High: 3, Medium: 2, Low: 1 };
                const score =
                  scoreMap[asset.confidentiality] +
                  scoreMap[asset.integrity] +
                  scoreMap[asset.availability];
                let priorityLabel = "Low";
                let priorityColor = "bg-green-100 text-green-700";
                if (score >= 8) {
                  priorityLabel = "Critical";
                  priorityColor = "bg-red-100 text-red-700";
                } else if (score >= 6) {
                  priorityLabel = "High";
                  priorityColor = "bg-orange-100 text-orange-700";
                } else if (score >= 4) {
                  priorityLabel = "Medium";
                  priorityColor = "bg-yellow-100 text-yellow-700";
                }

                return (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-all">
                    <td className="px-4 py-2 font-medium text-gray-900">{asset.hostname}</td>
                    <td className="px-4 py-2">{asset.ip}</td>
                    <td className="px-4 py-2">{asset.type}</td>
                    <td className="px-4 py-2">{asset.process}</td>
                    <td className="px-4 py-2"><ImpactBadge level={asset.confidentiality} /></td>
                    <td className="px-4 py-2"><ImpactBadge level={asset.integrity} /></td>
                    <td className="px-4 py-2"><ImpactBadge level={asset.availability} /></td>
                    <td className="px-4 py-2 text-gray-700">{asset.compliance}</td>
                    <td className="px-4 py-2 text-gray-700">{asset.internetFacing}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityColor}`}>
                        {priorityLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    })()}
  </div>
)}

      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>Information for selected asset</DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-2 mt-2">
              <p><strong>Hostname:</strong> {selectedAsset.hostname}</p>
              <p><strong>OS:</strong> {selectedAsset.os}</p>
              <p><strong>CPU:</strong> {selectedAsset.cpu}</p>
              <p><strong>RAM / Disk:</strong> {selectedAsset.memory_gb}GB / {selectedAsset.disk_gb}GB</p>
              <p><strong>IP:</strong> {selectedAsset.ip_addresses}</p>
              <p><strong>User:</strong> {selectedAsset.username}</p>
              <p><strong>Last Seen:</strong> {new Date(selectedAsset.collected_at).toLocaleString()}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    
  );
}
