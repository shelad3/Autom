
import React, { useState, useEffect, useCallback } from 'react';
import { View, AppState, AutomationJob, Transaction, ShortClip, SocialAccount } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Automation from './components/Automation';
import WalletDashboard from './components/WalletDashboard';
import { analyzeVideoContent, generateVideoClip } from './services/geminiService';
import { 
  Bell, 
  Search, 
  Command, 
  CircleUser,
  Plus,
  X,
  Youtube,
  Instagram,
  Twitter,
  Music2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.DASHBOARD);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState<{ platform: SocialAccount['platform'], username: string }>({
    platform: 'youtube',
    username: ''
  });

  const [state, setState] = useState<AppState>({
    accounts: [
      { id: '1', platform: 'youtube', username: '@TechMaster', connected: true, followers: 45200, autoScan: true },
      { id: '2', platform: 'tiktok', username: 'tech.master', connected: true, followers: 122800, autoScan: true }
    ],
    jobs: [],
    wallet: {
      balance: 24580.42,
      totalSpent: 4200.00,
      totalRevenue: 12400.00,
      transactions: [
        { id: 't1', label: 'Initial Deposit', amount: 25000, type: 'income', timestamp: Date.now() - 86400000 }
      ]
    }
  });

  // Simulated Transaction Handler
  const addTransaction = (label: string, amount: number, type: 'income' | 'expense') => {
    setState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance + (type === 'income' ? amount : -amount),
        totalSpent: prev.wallet.totalSpent + (type === 'expense' ? amount : 0),
        totalRevenue: prev.wallet.totalRevenue + (type === 'income' ? amount : 0),
        transactions: [
          { id: Math.random().toString(36), label, amount, type, timestamp: Date.now() },
          ...prev.wallet.transactions
        ].slice(0, 20)
      }
    }));
  };

  // Account Handlers
  const openConnectModal = (platform: SocialAccount['platform']) => {
    setNewAccountForm(prev => ({ ...prev, platform, username: '' }));
    setIsAddAccountModalOpen(true);
  };

  const addAccount = () => {
    if (!newAccountForm.username) return;
    
    const newAcc: SocialAccount = {
      id: Math.random().toString(36).substr(2, 9),
      platform: newAccountForm.platform,
      username: newAccountForm.username.startsWith('@') ? newAccountForm.username : `@${newAccountForm.username}`,
      connected: true,
      followers: Math.floor(Math.random() * 10000),
      autoScan: false
    };

    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, newAcc]
    }));
    
    addTransaction(`Connected ${newAccountForm.platform} account`, 0, 'income');
    setIsAddAccountModalOpen(false);
    setNewAccountForm({ platform: 'youtube', username: '' });
  };

  const removeAccount = (id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(a => a.id !== id)
    }));
  };

  const checkAndOpenKeySelector = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setShowKeyPrompt(true);
      return false;
    }
    return true;
  };

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
    setShowKeyPrompt(false);
  };

  // Full Automation Pipeline Logic
  const processJob = async (jobId: string) => {
    const updateJobStatus = (id: string, updates: Partial<AutomationJob>) => {
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
      }));
    };

    try {
      updateJobStatus(jobId, { status: 'analyzing', progress: 10 });
      addTransaction('AI Analysis Fee', 15.00, 'expense');
      
      const suggestions = await analyzeVideoContent(`Processing new content for Vinci Engine Job ${jobId}`);
      
      updateJobStatus(jobId, { status: 'clipping', progress: 30 });
      await new Promise(r => setTimeout(r, 2000));

      updateJobStatus(jobId, { status: 'generating_visuals', progress: 50 });
      addTransaction('Veo Generation Fee', 85.00, 'expense');
      
      const clips: ShortClip[] = [];
      for (let i = 0; i < suggestions.length; i++) {
        const s = suggestions[i];
        let videoUrl: string | undefined = undefined;
        
        if (i === 0) {
          try {
             videoUrl = await generateVideoClip(s.hook);
          } catch (e: any) {
            console.error("Veo failed", e);
            if (e.message?.includes("Requested entity was not found")) {
              setShowKeyPrompt(true);
              throw new Error("Key reset required");
            }
          }
        }

        clips.push({
          id: Math.random().toString(36),
          title: s.title,
          hook: s.hook,
          start: s.start,
          end: s.end,
          views: Math.floor(Math.random() * 5000),
          likes: Math.floor(Math.random() * 500),
          revenue: Math.random() * 50,
          videoUrl: videoUrl
        });
      }

      updateJobStatus(jobId, { status: 'exporting', progress: 80 });
      addTransaction('Render Server Credits', 5.50, 'expense');
      await new Promise(r => setTimeout(r, 2000));

      updateJobStatus(jobId, { status: 'posting', progress: 95 });
      await new Promise(r => setTimeout(r, 1500));

      updateJobStatus(jobId, { status: 'completed', progress: 100, clips });
      
      setTimeout(() => {
        addTransaction(`Revenue from Job ${jobId.slice(0, 4)}`, Math.random() * 200, 'income');
      }, 5000);

    } catch (err: any) {
      console.error("Job Failed:", err);
      updateJobStatus(jobId, { status: 'idle', progress: 0 });
    }
  };

  const startManualJob = async (url: string) => {
    const hasKey = await checkAndOpenKeySelector();
    if (!hasKey) return;

    const newJob: AutomationJob = {
      id: Math.random().toString(36).substr(2, 9),
      sourceUrl: url,
      title: `Manual Job: ${url.split('v=')[1] || 'Import'}`,
      status: 'idle',
      progress: 0,
      timestamp: Date.now(),
      clips: []
    };
    setState(prev => ({ ...prev, jobs: [newJob, ...prev.jobs] }));
    processJob(newJob.id);
  };

  useEffect(() => {
    const scanner = setInterval(async () => {
      const activeScanners = state.accounts.filter(a => a.autoScan);
      if (activeScanners.length > 0 && Math.random() > 0.8) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) {
          const account = activeScanners[Math.floor(Math.random() * activeScanners.length)];
          startManualJob(`https://youtube.com/watch?v=auto_${Math.random().toString(36).substr(2, 5)}`);
        }
      }
    }, 20000);
    return () => clearInterval(scanner);
  }, [state.accounts]);

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard state={state} />;
      case View.AUTOMATION:
        return <Automation state={state} startJob={startManualJob} />;
      case View.WALLETS:
        return <WalletDashboard state={state} addFunds={() => addTransaction('Manual Top-up', 5000, 'income')} />;
      case View.HISTORY:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Post History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.jobs.flatMap(j => j.clips).map((clip) => (
                <div key={clip.id} className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500 transition-all overflow-hidden flex flex-col">
                  {clip.videoUrl && (
                    <div className="aspect-[9/16] bg-black mb-4 rounded-xl overflow-hidden border border-gray-800">
                      <video src={clip.videoUrl} className="w-full h-full object-cover" controls loop muted autoPlay />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg truncate flex-1 pr-2">{clip.title}</h3>
                    <span className="text-xs text-green-400 font-mono shrink-0">+${clip.revenue.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 italic line-clamp-2">"{clip.hook}"</p>
                  <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-800">
                    <span>👁️ {clip.views} views</span>
                    <span>❤️ {clip.likes} likes</span>
                  </div>
                </div>
              ))}
              {state.jobs.length === 0 && <p className="text-gray-500 italic">No posts yet. Start an automation to see history.</p>}
            </div>
          </div>
        );
      case View.SETTINGS:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-gray-400">Manage your connected social accounts and engine preferences.</p>
            </div>

            {/* Quick Connect Section */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle size={14} className="text-indigo-400" /> Quick Connect Platform
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { platform: 'youtube', icon: Youtube, color: 'hover:border-red-500 hover:bg-red-500/10 hover:text-red-500' },
                  { platform: 'tiktok', icon: Music2, color: 'hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-400' },
                  { platform: 'instagram', icon: Instagram, color: 'hover:border-pink-500 hover:bg-pink-500/10 hover:text-pink-500' },
                  { platform: 'x', icon: Twitter, color: 'hover:border-white hover:bg-white/10 hover:text-white' }
                ].map((item) => (
                  <button
                    key={item.platform}
                    onClick={() => openConnectModal(item.platform as any)}
                    className={`bg-gray-900/40 border border-gray-800 p-6 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 group ${item.color}`}
                  >
                    <item.icon size={32} className="transition-transform group-hover:scale-110" />
                    <span className="text-xs font-black uppercase tracking-widest">{item.platform}</span>
                  </button>
                ))}
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.accounts.map(acc => (
                  <div key={acc.id} className="flex items-center justify-between p-5 bg-gray-900/40 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                        {acc.platform === 'youtube' && <Youtube size={24} />}
                        {acc.platform === 'tiktok' && <Music2 size={24} />}
                        {acc.platform === 'instagram' && <Instagram size={24} />}
                        {acc.platform === 'x' && <Twitter size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-white">{acc.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{acc.platform} • {acc.followers.toLocaleString()} reach</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] text-gray-500 uppercase font-bold group-hover:text-indigo-400 transition-colors">Auto-Scan</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={acc.autoScan} 
                            onChange={() => {
                              setState(prev => ({
                                ...prev,
                                accounts: prev.accounts.map(a => a.id === acc.id ? { ...a, autoScan: !a.autoScan } : a)
                              }));
                            }}
                          />
                          <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                      <button 
                        onClick={() => removeAccount(acc.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {state.accounts.length === 0 && (
                  <div className="col-span-full border-2 border-dashed border-gray-800 p-12 rounded-2xl text-center text-gray-500">
                    No accounts connected. Use the quick connect grid above to start.
                  </div>
                )}
              </div>
            </section>

            <section className="pt-8 border-t border-gray-800">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Vinci Engine Settings</h2>
              <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="font-bold text-indigo-100">AI Video Generation (Veo)</p>
                  <p className="text-sm text-indigo-300/80">Generate high-fidelity AI B-Roll and visuals for your automated shorts.</p>
                </div>
                <button 
                  onClick={handleOpenKeySelector}
                  className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
                >
                  Configure Veo Access
                </button>
              </div>
            </section>
          </div>
        );
      default:
        return <Dashboard state={state} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-200 bg-gray-950">
      <Sidebar currentView={currentView} setView={setView} />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-950/50 backdrop-blur-md z-30">
          <div className="flex items-center gap-4 max-w-xl flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search engine history..."
                className="w-full bg-gray-900 border border-gray-800 rounded-full pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Vinci Engine Online
            </div>
            <div className="flex items-center gap-3 border-l border-gray-800 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold">Balance: ${state.wallet.balance.toLocaleString()}</p>
                <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase">Auto-Pilot Active</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center overflow-hidden border border-indigo-500/50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Key Prompt Modal */}
      {showKeyPrompt && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md"></div>
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Veo API Key Required</h3>
            <p className="text-gray-400 mb-8">
              To use AI Video Generation (Veo), you must select a paid API key from a project with billing enabled.
              Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">billing docs</a> for more info.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleOpenKeySelector}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20"
              >
                Select Paid API Key
              </button>
              <button 
                onClick={() => setShowKeyPrompt(false)}
                className="text-gray-500 hover:text-white text-sm py-2"
              >
                Continue without Veo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Modal */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={() => setIsAddAccountModalOpen(false)}></div>
          <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Connect {newAccountForm.platform.charAt(0).toUpperCase() + newAccountForm.platform.slice(1)}</h3>
                <button onClick={() => setIsAddAccountModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-center mb-2">
                   <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-indigo-400">
                    {newAccountForm.platform === 'youtube' && <Youtube size={40} />}
                    {newAccountForm.platform === 'tiktok' && <Music2 size={40} />}
                    {newAccountForm.platform === 'instagram' && <Instagram size={40} />}
                    {newAccountForm.platform === 'x' && <Twitter size={40} />}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Handle / Username</label>
                  <input 
                    type="text" 
                    value={newAccountForm.username}
                    onChange={(e) => setNewAccountForm(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="@username"
                    autoFocus
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-white font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && addAccount()}
                  />
                </div>

                <div className="bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-indigo-500 shrink-0" />
                  <p className="text-xs text-indigo-300">Vinci Studio will sync your content for automated clipping and performance tracking.</p>
                </div>

                <button 
                  onClick={addAccount}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Authorize & Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
