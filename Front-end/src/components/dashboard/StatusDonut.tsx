import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const statusData = [
  { name: 'Open', value: 2847, color: 'hsl(0, 84%, 60%)' },
  { name: 'In Progress', value: 1923, color: 'hsl(45, 100%, 55%)' },
  { name: 'Closed', value: 1822, color: 'hsl(195, 100%, 50%)' },
];

const riskData = [
  { level: 'High Risk', count: 523, color: 'severity-critical' },
  { level: 'Medium Risk', count: 892, color: 'severity-medium' },
  { level: 'Low Risk', count: 234, color: 'severity-low' },
];

export const StatusDonut = () => {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Issues by Status</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(220, 15%, 12%)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-2 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold mb-4 text-muted-foreground">Asset Risk Level</h4>
          <div className="space-y-3">
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm">{item.level}</span>
                <span className={`text-lg font-bold text-${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
