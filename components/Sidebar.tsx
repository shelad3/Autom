
import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Wallet, 
  Settings, 
  History, 
  Zap 
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
    { id: View.AUTOMATION, icon: Video, label: 'Automation' },
    { id: View.WALLETS, icon: Wallet, label: 'Wallet & Ads' },
    { id: View.HISTORY, icon: History, label: 'Post History' },
    { id: View.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 border-r border-gray-800 flex flex-col h-full bg-gray-950/50 backdrop-blur-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Zap className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight">VINCI <span className="text-indigo-500">AI</span></span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Bot Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
