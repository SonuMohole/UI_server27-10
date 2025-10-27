import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { date: 'Jan', critical: 4000, high: 2400, medium: 2400, low: 1200 },
  { date: 'Feb', critical: 3000, high: 1398, medium: 2210, low: 1100 },
  { date: 'Mar', critical: 2000, high: 9800, medium: 2290, low: 1400 },
  { date: 'Apr', critical: 2780, high: 3908, medium: 2000, low: 1600 },
  { date: 'May', critical: 1890, high: 4800, medium: 2181, low: 1300 },
  { date: 'Jun', critical: 2390, high: 3800, medium: 2500, low: 1500 },
  { date: 'Jul', critical: 3490, high: 4300, medium: 2100, low: 1200 },
];

export const SeverityChart = () => {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Issues by Severity</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(15, 100%, 55%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(15, 100%, 55%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(45, 100%, 55%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(45, 100%, 55%)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
          <YAxis stroke="rgba(255,255,255,0.5)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(220, 15%, 12%)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Area type="monotone" dataKey="critical" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#colorCritical)" />
          <Area type="monotone" dataKey="high" stroke="hsl(15, 100%, 55%)" fillOpacity={1} fill="url(#colorHigh)" />
          <Area type="monotone" dataKey="medium" stroke="hsl(45, 100%, 55%)" fillOpacity={1} fill="url(#colorMedium)" />
          <Area type="monotone" dataKey="low" stroke="hsl(195, 100%, 50%)" fillOpacity={1} fill="url(#colorLow)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
