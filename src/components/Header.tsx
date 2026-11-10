import React from 'react';
import { Zap, ShieldCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { ShopeeLiveServerConnection } from '../types';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  shopeeConnection?: ShopeeLiveServerConnection | null;
  onOpenServerModal?: () => void;
  onRotateProxy?: () => void;
  isRotatingProxy?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  shopeeConnection,
  onOpenServerModal,
  onRotateProxy,
  isRotatingProxy,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-4">
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

          {/* Direct Shopee.co.id Connection Badge */}
          {shopeeConnection && (
            <button
              onClick={onOpenServerModal}
              title="Klik untuk melihat detail koneksi server Shopee & pool proxy rotasi"
              className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-[11px] text-emerald-300 hover:border-emerald-400 transition"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white flex items-center gap-1">
                <ShoppingBag className="h-3 w-3 text-orange-400" />
                https://shopee.co.id
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-emerald-300">{shopeeConnection.latencyMs}ms</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300 font-mono">
                Proxy: {shopeeConnection.activeProxy?.provider.split(' ')[0]} ({shopeeConnection.activeProxy?.ip})
              </span>
            </button>
          )}
        </div>

        {/* Zone 2: Navigation links */}
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
            Auto-Bumping
          </button>
          <button
            onClick={() => onSelectTab('shopee-live')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'shopee-live' ? 'text-orange-400' : 'hover:text-white'
            }`}
          >
            Shopee Live & Formula
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

        {/* Zone 3: Actions & Proxy Quick Switch */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onRotateProxy && (
            <button
              onClick={onRotateProxy}
              disabled={isRotatingProxy}
              title="Putar IP Proxy Indonesia (Telkomsel / Biznet / Indosat) sekarang"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-200 hover:text-white hover:border-orange-500 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 text-cyan-400 ${isRotatingProxy ? 'animate-spin' : ''}`} />
              <span>{isRotatingProxy ? 'Memutar IP...' : 'Putar Proxy'}</span>
            </button>
          )}

          <button
            onClick={onOpenServerModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Server & Proxy</span>
          </button>

          <button
            onClick={() => {
              onSelectTab('booster');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-500 whitespace-nowrap shrink-0 shadow-md"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Mulai Boost</span>
          </button>
        </div>
      </div>
    </header>
  );
};

