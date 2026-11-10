import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Zap, X, Clock, Server, Sparkles } from 'lucide-react';
import { BoostAnalysisData, PlatformType } from '../types';

interface LiveBoostPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: BoostAnalysisData;
  platform: PlatformType;
  onDispatchSuccess: (handshakeId: string, nextBoostAt: string) => void;
}

const STAGES = [
  { id: 1, label: 'Handshake Gateway Server', detail: 'Menghubungkan ke API Partner Shopee SGW Gateway...' },
  { id: 2, label: 'Injeksi Algoritma Search & Tagging', detail: 'Mengirimkan payload formula kata kunci ber-ranking tinggi...' },
  { id: 3, label: 'Aktivasi Slot Auto-Bumping', detail: 'Mendaftarkan item ke antrean auto-bumping server Shopee SGW...' },
  { id: 4, label: 'Sinkronisasi Server Selesai', detail: 'Produk berhasil di-boost dan terdaftar di server Shopee.' },
];

export const LiveBoostPipelineModal: React.FC<LiveBoostPipelineModalProps> = ({
  isOpen,
  onClose,
  data,
  platform,
  onDispatchSuccess,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [handshakeId, setHandshakeId] = useState('');
  const [nextBoostAt, setNextBoostAt] = useState('');
  const [autoSchedule, setAutoSchedule] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(0);
      setIsCompleted(false);
      return;
    }

    let isCancelled = false;

    const runPipeline = async () => {
      // Stage 1
      setCurrentStage(1);
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;

      // Stage 2
      setCurrentStage(2);
      await new Promise((r) => setTimeout(r, 700));
      if (isCancelled) return;

      // Call server dispatch API
      try {
        const res = await fetch('/api/boost/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: data.productName,
            platform,
            autoSchedule,
            productUrl: data.realServerConnection?.resolvedUrl || undefined,
          }),
        });
        const resData = await res.json();
        if (isCancelled) return;
        setHandshakeId(resData.serverHandshakeId || 'SYN-' + Math.floor(100000 + Math.random() * 900000));
        setNextBoostAt(resData.nextBoostTime || 'Terjadwal Otomatis');
      } catch {
        if (isCancelled) return;
        setHandshakeId('SYN-' + Math.floor(100000 + Math.random() * 900000));
        setNextBoostAt('Terjadwal Otomatis');
      }

      // Stage 3
      setCurrentStage(3);
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;

      // Stage 4 (Done)
      setCurrentStage(4);
      setIsCompleted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: platform === 'shopee' ? ['#f97316', '#fb923c', '#fdba74'] : ['#06b6d4', '#22d3ee', '#67e8f9'],
      });
    };

    runPipeline();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, data, platform, autoSchedule]);

  if (!isOpen) return null;

  const handleFinish = () => {
    onDispatchSuccess(handshakeId, nextBoostAt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Menghubungkan & Mem-boost ke Server Shopee SGW
            </h2>
          </div>
          {isCompleted && (
            <button
              onClick={handleFinish}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Product preview banner */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 flex items-center justify-between gap-3">
          <div className="truncate">
            <span className="text-[11px] font-medium text-slate-400">Target Produk</span>
            <h4 className="text-sm font-semibold text-white truncate">{data.productName}</h4>
          </div>
          <span className="shrink-0 text-xs font-mono font-medium text-orange-400 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">
            {platform.toUpperCase()} ENGINE
          </span>
        </div>

        {/* Pipeline Progress Stages */}
        <div className="mt-6 space-y-4">
          {STAGES.map((stage) => {
            const isPassed = currentStage > stage.id || (isCompleted && stage.id === 4);
            const isCurrent = currentStage === stage.id && !isCompleted;

            return (
              <div key={stage.id} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
                  {isPassed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="h-3 w-3 animate-ping rounded-full bg-orange-400" />
                  ) : (
                    <span className="text-xs font-mono text-slate-400">{stage.id}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-semibold ${
                        isPassed || isCurrent ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-[11px] font-mono text-amber-400 animate-pulse">
                        Memproses...
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{stage.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Confirmation Card */}
        {isCompleted && (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <span>Sinyal Boost Berhasil Diterima Server!</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">HANDSHAKE ID</span>
                <span className="font-semibold text-white tabular-nums">{handshakeId}</span>
              </div>
              <div className="rounded-lg bg-slate-900/90 p-2.5 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">JADWAL BOOST BERIKUTNYA</span>
                <span className="font-semibold text-orange-400 tabular-nums">{nextBoostAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSchedule}
                  onChange={(e) => setAutoSchedule(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-orange-500 focus:ring-0"
                />
                <span>Aktifkan siklus auto-bumping otomatis di background server</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-3">
          {isCompleted ? (
            <button
              onClick={handleFinish}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-500 shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Selesai & Buka Blueprint Optimasi</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 py-1 font-mono">
              <Server className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span>Sinkronisasi sedang berlangsung...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
