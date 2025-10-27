import { 
  LayoutDashboard, 
  AlertTriangle, 
  Server, 
  Code, 
  Lightbulb, 
  FolderKanban, 
  Download, 
  Upload, 
  Activity, 
  FileText, 
  CreditCard,
  Bot,
  Settings,
  Database // 👈 Added for Assets (nice data-related icon)
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: LayoutDashboard, label: "Dashboard2" },
  { icon: LayoutDashboard, label: "Dashboard3" },
  { icon: Database, label: "Assets" }, // 👈 Newly added Assets page
  { icon: AlertTriangle, label: "Issues" },
  { icon: Server, label: "Entities" },
  { icon: Code, label: "Technologies" },
  { icon: Lightbulb, label: "Insights" },
  { icon: FolderKanban, label: "Collections" },
  { icon: Download, label: "Agent Download" },
  { icon: Upload, label: "Report Upload" },
  { icon: Activity, label: "Monitoring" },
  { icon: FileText, label: "Old Reports" },
  { icon: CreditCard, label: "Subscription" },
  { icon: Settings, label: "Account & Settings" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-20 glass-panel border-r border-white/10 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-8 text-2xl font-bold text-primary text-glow-pink">
        Q<span className="text-secondary">S</span>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className={cn(
                "group relative w-full h-12 flex items-center justify-center rounded-lg transition-all duration-300",
                item.active 
                  ? "bg-primary/20 text-primary glow-pink" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute left-full ml-4 px-3 py-1 bg-popover text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
      
      {/* AI Assistant Button */}
      <button className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary glow-pink flex items-center justify-center hover:scale-110 transition-transform">
        <Bot className="w-6 h-6 text-white" />
      </button>
    </aside>
  );
};
