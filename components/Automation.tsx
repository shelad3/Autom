
import React, { useState } from 'react';
import { 
  Play, 
  Search, 
  Scissors, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  Video,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppState } from '../types';

interface AutomationProps {
  state: AppState;
  startJob: (url: string) => void;
}

const Automation: React.FC<AutomationProps> = ({ state, startJob }) => {
  const [url, setUrl] = useState('');
  const activeJob = state.jobs.find(j => j.status !== 'completed' && j.status !== 'idle');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Automation Engine</h1>
        <p className="text-gray-400">The Vinci Engine is currently monitoring {state.accounts.filter(a => a.autoScan).length} accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-2xl shadow-xl">
            <label className="block text-sm font-medium text-gray-400 mb-2">Target Source (Manual Trigger)</label>
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                onClick={() => { if(url) { startJob(url); setUrl(''); } }}
                disabled={!!activeJob}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                {activeJob ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
                Run
              </button>
            </div>

            {activeJob && (
              <div className="space-y-6 relative ml-2">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
                {[
                  { id: 'analyzing', label: 'Analysis', icon: Search },
                  { id: 'clipping', label: 'Smart Clipping', icon: Scissors },
                  { id: 'generating_visuals', label: 'AI Visual Generation (Veo)', icon: Sparkles },
                  { id: 'exporting', label: 'Rendering', icon: Upload },
                  { id: 'posting', label: 'Posting', icon: CheckCircle2 },
                ].map((s) => {
                  const statuses = ['analyzing', 'clipping', 'generating_visuals', 'exporting', 'posting'];
                  const isActive = activeJob.status === s.id;
                  const isDone = statuses.indexOf(activeJob.status) > statuses.indexOf(s.id as any);
                  
                  return (
                    <div key={s.id} className="flex items-center gap-4 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-gray-950 transition-all ${
                        isActive ? 'bg-indigo-600 animate-pulse scale-110' : isDone ? 'bg-green-600' : 'bg-gray-800 text-gray-500'
                      }`}>
                        <s.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{s.label}</h4>
                          {isActive && <span className="text-[10px] text-indigo-400 font-mono">{activeJob.progress}%</span>}
                        </div>
                        {isActive && (
                          <div className="mt-2 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${activeJob.progress}%` }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16}/> Engine History</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {state.jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-800 rounded-xl text-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-gray-300 font-medium truncate max-w-[150px]">{job.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(job.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              {state.jobs.length === 0 && <p className="text-gray-600 italic text-center text-sm py-4">No job history found.</p>}
            </div>
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Video className="text-indigo-400" /> Live Extraction</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {state.jobs.flatMap(j => j.clips).map(clip => (
              <div key={clip.id} className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-right-4 overflow-hidden">
                {clip.videoUrl && (
                  <div className="aspect-[9/16] bg-black mb-4 rounded-lg overflow-hidden border border-indigo-500/30">
                     <video src={clip.videoUrl} className="w-full h-full object-cover" autoPlay muted loop />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-indigo-400 text-sm truncate flex-1">{clip.title}</h4>
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded uppercase shrink-0">{clip.start}-{clip.end}</span>
                </div>
                <p className="text-xs text-indigo-300/70 italic mb-2 line-clamp-2">"{clip.hook}"</p>
                <div className="flex gap-4 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><Sparkles size={10}/> Veo Gen</span>
                  <span>9:16 Vertical</span>
                  <span>AI Subtitles</span>
                </div>
              </div>
            ))}
            {state.jobs.flatMap(j => j.clips).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <Video size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Processed clips will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;
