
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, TrendingUp, DollarSign, Share2 } from 'lucide-react';
import { AppState } from '../types';

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className="text-green-400 text-xs font-bold">+{trend}%</span>
      <span className="text-gray-600 text-xs italic">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC<{ state: AppState }> = ({ state }) => {
  const totalViews = state.jobs.reduce((acc, job) => acc + job.clips.reduce((sum, c) => sum + c.views, 0), 0);
  const totalShorts = state.jobs.reduce((acc, job) => acc + job.clips.length, 0);

  // Simulated chart data
  const data = [
    { name: 'Mon', views: 4000 },
    { name: 'Tue', views: 3000 },
    { name: 'Wed', views: 2000 },
    { name: 'Thu', views: 2780 },
    { name: 'Fri', views: 1890 },
    { name: 'Sat', views: 2390 },
    { name: 'Sun', views: 3490 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vinci Studio Overview</h1>
          <p className="text-gray-400">Total automated reach across all platforms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Impressions" value={(totalViews + 245000).toLocaleString()} icon={TrendingUp} color="bg-blue-600" trend="12.5" />
        <StatCard title="Follower Growth" value={(1290).toLocaleString()} icon={Users} color="bg-indigo-600" trend="8.2" />
        <StatCard title="Ad Revenue" value={`$${state.wallet.totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-600" trend="24.1" />
        <StatCard title="Shorts Created" value={totalShorts + 142} icon={Share2} color="bg-purple-600" trend="15.8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-6">Traffic & Reach</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-6">Active Channels</h3>
          <div className="space-y-4">
            {state.accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30 border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-xl capitalize">{acc.platform[0]}</span>
                  <div>
                    <p className="font-medium text-sm">{acc.username}</p>
                    <p className="text-xs text-gray-500">{(acc.followers / 1000).toFixed(1)}K Reach</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${acc.autoScan ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{acc.autoScan ? 'Scanning' : 'Standby'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
