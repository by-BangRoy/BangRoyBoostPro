import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ServerNode } from '../types';

interface ServerNodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: ServerNode[];
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const ServerNodesModal: React.FC<ServerNodesModalProps> = ({
  isOpen,
  onClose,
  servers,
  onRefresh,
  isRefreshing,
}) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-bold text-white">Status Server Gateway E-Commerce</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Koneksi langsung ke API Partner Shopee Open Platform & TikTok Shop Global Edge Network.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server List */}
        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {servers.map((server) => {
            const isFast = server.latencyMs < 35;
            const isMedium = server.latencyMs >= 35 && server.latencyMs < 80;

            return (
              <div
                key={server.id}
                className="rounded-xl border border-slate-800/90 bg-slate-950/60 p-4 transition hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700">
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{server.name}</h4>
                        <span className="text-[11px] text-slate-400">· {server.region}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => handleCopy(server.endpoint)}
                          className="font-mono text-xs text-slate-400 hover:text-slate-200 transition underline underline-offset-2 decoration-slate-700"
                          title="Klik untuk salin endpoint"
                        >
                          {copiedEndpoint === server.endpoint ? 'Disalin!' : server.endpoint}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-sm font-semibold tabular-nums">
                      <span
                        className={
                          isFast
                            ? 'text-emerald-400'
                            : isMedium
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {server.latencyMs} ms
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-400 font-mono">
                      <span>{server.protocol}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-medium">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & re-ping button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Semua gateway siap menerima payload boost & sinkronisasi indexing.</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Memverifikasi...' : 'Uji Ulang Latensi'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
