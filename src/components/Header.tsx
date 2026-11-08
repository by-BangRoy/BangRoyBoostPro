import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('booster');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-cyan-400 bg-clip-text text-transparent">
            BangRoyBoost
          </span>
          <span className="text-xs font-mono font-medium text-slate-400 border border-slate-700/60 rounded px-1.5 py-0.5">
            PRO
          </span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('booster')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'booster' ? 'text-orange-400' : 'hover:text-white'
            }`}
          >
            Turbo Booster
          </button>
          <button
            onClick={() => onSelectTab('shopee4h')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'shopee4h' ? 'text-orange-400' : 'hover:text-white'
            }`}
          >
            Auto-Bumping 15M
          </button>
          <button
            onClick={() => onSelectTab('tiktok-hooks')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'tiktok-hooks' ? 'text-orange-400' : 'hover:text-white'
            }`}
          >
            TikTok Viral Hook
          </button>
          <button
            onClick={() => onSelectTab('history')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'history' ? 'text-orange-400' : 'hover:text-white'
            }`}
          >
            Riwayat Boost
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Clean action button without server status) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectTab('booster');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 whitespace-nowrap shrink-0 shadow-md"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Mulai Boost</span>
          </button>
        </div>
      </div>
    </header>
  );
};

