
import React from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Eye, 
  MousePointer2, 
  Target 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AppState } from '../types';

const COLORS = ['#ef4444', '#00f2ea', '#c084fc', '#ffffff'];

const WalletDashboard: React.FC<{ state: AppState; addFunds: () => void }> = ({ state, addFunds }) => {
  const chartData = [
    { platform: 'Spend', value: state.wallet.totalSpent },
    { platform: 'Revenue', value: state.wallet.totalRevenue }
  ];

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Wallet & Ad Manager</h1>
          <p className="text-gray-400">Total operational budget management.</p>
        </div>
        <button 
          onClick={addFunds}
          className="flex items-center gap-2 bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          <Plus size={18} /> Add Funds
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <CreditCard size={120} />
            </div>
            <div className="relative z-10">
              <p className="text-indigo-200 font-medium mb-1">Available Budget</p>
              <h2 className="text-4xl font-black mb-12">${state.wallet.balance.toLocaleString()}</h2>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-widest">Main Operating Wallet</p>
                  <p className="font-mono">**** **** **** 4821</p>
                </div>
                <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold uppercase">PRO</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold">Transaction History</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {state.wallet.transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center border-b border-gray-800 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'income' ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.label}</p>
                      <p className="text-[10px] text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-green-500' : 'text-gray-300'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Eye size={14} /> Spend Total</div>
              <div className="text-xl font-bold">${state.wallet.totalSpent.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><MousePointer2 size={14} /> Revenue</div>
              <div className="text-xl font-bold">${state.wallet.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Target size={14} /> ROI</div>
              <div className="text-xl font-bold text-green-500">{(state.wallet.totalRevenue / (state.wallet.totalSpent || 1)).toFixed(1)}x</div>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl">
            <h3 className="font-bold mb-6">Financial Balance Flow</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="platform" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    cursor={{ fill: '#1f2937' }}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;
