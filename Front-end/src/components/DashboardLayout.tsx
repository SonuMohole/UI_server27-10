import { cn } from "@/lib/utils";
import {
  Bot,
  Database,
  Download,
  FileText,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  ShieldAlert,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "Dashboard3" },
  { icon: Database, label: "Assets", path: "/assets" }, // 👈 Added Assets page here
  { icon: ShieldAlert, label: "Vulnerabilities", path: "/vulnerabilities" },
  { icon: Download, label: "Agent Center", path: "/agent-center" },
  { icon: ShieldAlert, label: "VM Intelligence", path: "/kev-intelligence" },
  { icon: Newspaper, label: "News & Recommendations", path: "/threat-news" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: Bot, label: "AI Assistant", path: "/ai-assistant" },
  { icon: Settings, label: "Account & Settings", path: "/account-settings" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-maroon-600/30 to-maroon-400/10 shadow-md ml-[-20px]">
                  <img
                    src="/QST logo.png"
                    alt="Qstellar Logo"
                    className="w-15 h-15 object-contain rounded-full shadow-lg"
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold text-sidebar-foreground tracking-wide">
                    Qstellar
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    QCTPL Platform
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground glow-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive && "animate-pulse"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed && (
            <div className="glass-panel p-3">
              <p className="text-xs text-muted-foreground mb-1">
                System Status
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium">
                  All Systems Operational
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
