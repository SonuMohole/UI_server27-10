import { Globe } from "lucide-react";

const countries = [
  { name: "United States", hosts: 4587, percentage: 42 },
  { name: "Singapore", hosts: 1893, percentage: 18 },
  { name: "Germany", hosts: 1234, percentage: 12 },
  { name: "China", hosts: 987, percentage: 9 },
  { name: "Canada", hosts: 756, percentage: 7 },
  { name: "Others", hosts: 1135, percentage: 12 },
];

const newTechnologies = [
  { name: "Elementor Page Builder", version: "3.19.2", tag: "wordpress_plugin" },
  { name: "React 18.2.0", version: "18.2.0", tag: "javascript_library" },
  { name: "Nginx 1.24.0", version: "1.24.0", tag: "web_server" },
];

export const GeographicMap = () => {
  return (
    <div className="glass-panel p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            Hosts by Country
          </h3>
          <div className="space-y-3">
            {countries.map((country, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{country.name}</span>
                  <span className="text-sm font-semibold">{country.hosts.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-primary"
                    style={{ width: `${country.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">New Technologies</h3>
          <div className="space-y-3">
            {newTechnologies.map((tech, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium">{tech.name}</div>
                  <code className="text-xs px-2 py-1 rounded bg-secondary/20 text-secondary">
                    {tech.tag}
                  </code>
                </div>
                <div className="text-xs text-muted-foreground">Version {tech.version}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
