import { useState } from "react";
import {
  User,
  Lock,
  Users,
  CreditCard,
  Settings,
  Calendar,
  Shield,
  Bell,
  Cpu,
  LogOut,
} from "lucide-react";

// ---------------------------
// Subcomponents
// ---------------------------

// 🧍 My Details
const MyDetails = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
    <div className="glass-panel p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Basic Details</h2>

      <form className="space-y-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Full Name
          </label>
          <input
            type="text"
            defaultValue="Jayesh Gavit"
            className="w-full border border-border rounded-md p-2 bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="jayesh@example.com"
            className="w-full border border-border rounded-md p-2 bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Organization
          </label>
          <input
            type="text"
            placeholder="QCTPL Cyber Labs"
            className="w-full border border-border rounded-md p-2 bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Industry Category
          </label>
          <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
            <option>Cybersecurity</option>
            <option>Finance</option>
            <option>Healthcare</option>
            <option>Software</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition-all"
        >
          Save Changes
        </button>
      </form>
    </div>

    <div className="glass-panel p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Security</h2>
      <form className="space-y-3">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-border rounded-md p-2 bg-background text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-border rounded-md p-2 bg-background text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-3 bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-md text-sm transition-all"
        >
          Update Password
        </button>
      </form>
    </div>
  </div>
);

// ⚙️ Platform Settings
const PlatformSettings = () => (
  <div className="glass-panel p-6 rounded-lg shadow-sm max-w-4xl">
    <h2 className="text-lg font-semibold mb-4">Platform & CVE Mapping Settings</h2>
    <p className="text-sm text-muted-foreground mb-4">
      Configure how your organization maps CVEs, vulnerabilities, and patch data.
    </p>

    <form className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Data Sources
        </label>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked /> NVD (National Vulnerability Database)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked /> CISA KEV (Known Exploited Vulnerabilities)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> ExploitDB
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Mapping Frequency
        </label>
        <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
          <option>Hourly</option>
          <option>Daily</option>
          <option>Weekly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Risk Scoring Model
        </label>
        <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
          <option>CVSS v3.1</option>
          <option>EPSS (Exploit Prediction Scoring System)</option>
          <option>Custom Weighted Model</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Auto-Prioritization Rule
        </label>
        <input
          type="text"
          placeholder="Example: CVSS > 8.0 → Critical"
          className="w-full border border-border rounded-md p-2 bg-background text-sm"
        />
      </div>

      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm">
        Save Settings
      </button>
    </form>
  </div>
);

// 🧠 Integrations
const Integrations = () => (
  <div className="glass-panel p-6 rounded-lg shadow-sm max-w-4xl">
    <h2 className="text-lg font-semibold mb-4">Agent & Integration Settings</h2>
    <p className="text-sm text-muted-foreground mb-4">
      Manage data collection agents and third-party threat intelligence integrations.
    </p>

    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium">Qstellar Agent (v2.3)</span>
        <span className="text-xs text-green-500">Active</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium">CISA API Integration</span>
        <span className="text-xs text-yellow-500">Pending Auth</span>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <span className="font-medium">Shodan Connector</span>
        <span className="text-xs text-gray-400">Disabled</span>
      </div>

      <button className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm">
        Add Integration
      </button>
    </div>
  </div>
);

// 🚨 Notifications
const Notifications = () => (
  <div className="glass-panel p-6 rounded-lg shadow-sm max-w-3xl">
    <h2 className="text-lg font-semibold mb-4">Alert & Notification Settings</h2>
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Delivery Channels
        </label>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked /> Email Alerts
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Slack Notifications
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" /> Webhook Triggers
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Alert Filters
        </label>
        <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
          <option>Critical CVEs Only</option>
          <option>High and Critical</option>
          <option>All New CVEs</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-muted-foreground mb-1">
          Frequency
        </label>
        <select className="w-full border border-border rounded-md p-2 bg-background text-sm">
          <option>Real-Time</option>
          <option>Hourly</option>
          <option>Daily Digest</option>
        </select>
      </div>

      <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm">
        Save Preferences
      </button>
    </form>
  </div>
);

// ---------------------------
// Main Component
// ---------------------------

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("platform");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const tabs = [
    { id: "platform", label: "Platform Settings", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Cpu },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "team", label: "Teams", icon: Users },
    { id: "plan", label: "Plan", icon: CreditCard },
    { id: "billing", label: "Billing", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "details":
        return <MyDetails />;
      case "platform":
        return <PlatformSettings />;
      case "integrations":
        return <Integrations />;
      case "notifications":
        return <Notifications />;
      default:
        return <PlatformSettings />;
    }
  };

  return (
    <div className="p-6 sm:p-10 w-full h-full bg-background text-foreground relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div>
          <h1 className="text-2xl font-bold">Account & Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your organization’s profile, CVE mapping logic, and security controls.
          </p>
        </div>

        {/* Top Right */}
        <div className="flex items-center gap-4 relative">
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • {new Date().toLocaleDateString()}
          </p>

          {/* Profile Icon */}
          <div
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-primary/30"
          >
            JG
          </div>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-border p-2 z-50">
              <button
                onClick={() => {
                  setActiveTab("details");
                  setIsProfileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="w-4 h-4" /> Account Settings
              </button>
              <button
                onClick={() => alert('Logout confirmed')}
                className="flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-border mb-8 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">{renderContent()}</div>
    </div>
  );
}
