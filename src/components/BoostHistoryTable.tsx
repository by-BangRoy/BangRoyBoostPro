import React from 'react';
import { ShoppingBag, Clock, Trash2, Zap, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { BoostHistoryItem } from '../types';

interface BoostHistoryTableProps {
  history: BoostHistoryItem[];
  onSelectProduct: (item: BoostHistoryItem) => void;
  onDeleteProduct: (id: string) => void;
  onReboost: (item: BoostHistoryItem) => void;
  onClearAll?: () => void;
}

export const BoostHistoryTable: React.FC<BoostHistoryTableProps> = ({
  history,
  onSelectProduct,
  onDeleteProduct,
  onReboost,
  onClearAll,
}) => {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center space-y-3">
        <Clock className="mx-auto h-8 w-8 text-slate-400" />
        <h3 className="text-sm font-semibold text-white">Belum Ada Riwayat Boost</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Masukkan link produk Shopee di form atas untuk memulai auto-boost langsung ke server Shopee SGW.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Riwayat Produk Yang Di-boost (Shopee Server)</h3>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              <ShieldCheck className="h-3 w-3" />
              SGW Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar produk Shopee dengan sinyal indexing aktif dan slot bumping 15 menit otomatis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            Total: {history.length} Produk Shopee
          </span>
          {onClearAll && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/50 hover:border-rose-700 transition"
              title="Bersihkan semua riwayat produk"
            >
              <Trash2 className="h-3 w-3" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400 uppercase">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk Shopee</th>
              <th className="px-4 py-3 font-semibold text-center">Handshake ID</th>
              <th className="px-4 py-3 font-semibold text-right">Waktu Boost</th>
              <th className="px-4 py-3 font-semibold text-center">Status Index</th>
              <th className="px-4 py-3 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {history.map((item) => (
              <tr key={item.id} className="transition hover:bg-slate-800/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-[11px] font-bold text-orange-400 border border-orange-500/20 shrink-0">
                      <ShoppingBag className="h-3 w-3" />
                      Shopee
                    </span>
                    <button
                      onClick={() => onSelectProduct(item)}
                      className="font-medium text-slate-200 hover:text-white transition truncate max-w-xs sm:max-w-md text-left"
                      title={item.productName}
                    >
                      {item.productName}
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3 text-center font-mono text-slate-300 tabular-nums">
                  {item.handshakeId}
                </td>

                <td className="px-4 py-3 text-right font-mono text-slate-400 tabular-nums">
                  {new Date(item.boostedAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} WIB
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-800/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Top Rank Aktif
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onReboost(item)}
                      className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white flex items-center gap-1"
                      title="Kirim ulang sinyal boost ke server Shopee"
                    >
                      <Zap className="h-3 w-3 text-orange-400" />
                      <span>Boost Ulang</span>
                    </button>

                    <button
                      onClick={() => onSelectProduct(item)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                      title="Lihat Blueprint Lengkap"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteProduct(item.id)}
                      className="rounded-lg border border-slate-700/80 bg-slate-800/60 p-1.5 text-slate-400 transition hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-800"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
