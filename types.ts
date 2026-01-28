
export enum View {
  DASHBOARD = 'DASHBOARD',
  AUTOMATION = 'AUTOMATION',
  WALLETS = 'WALLETS',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY'
}

export interface SocialAccount {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'x';
  username: string;
  connected: boolean;
  followers: number;
  autoScan: boolean;
}

export interface ShortClip {
  id: string;
  title: string;
  hook: string;
  start: string;
  end: string;
  views: number;
  likes: number;
  revenue: number;
  videoUrl?: string; // URL for the Veo generated video
}

export interface AutomationJob {
  id: string;
  sourceUrl: string;
  title: string;
  status: 'idle' | 'analyzing' | 'clipping' | 'generating_visuals' | 'exporting' | 'posting' | 'completed';
  progress: number;
  timestamp: number;
  clips: ShortClip[];
}

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  type: 'income' | 'expense';
  timestamp: number;
}

export interface WalletState {
  balance: number;
  totalSpent: number;
  totalRevenue: number;
  transactions: Transaction[];
}

export interface AppState {
  accounts: SocialAccount[];
  jobs: AutomationJob[];
  wallet: WalletState;
}
