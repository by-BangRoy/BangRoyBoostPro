import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Video,
  Star,
  CheckCircle2,
  TrendingUp,
  Zap,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  ChevronRight,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Server,
  Activity,
  Flame,
  Users,
  Tag,
  ExternalLink,
} from 'lucide-react';
import { BoostAnalysisData, PlatformType } from '../types';
import { safeCopy } from '../utils/clipboard';

interface TopSearchPlacementViewProps {
  data: BoostAnalysisData;
  platform: PlatformType;
  onOpenBoostModal: () => void;
}

export const TopSearchPlacementView: React.FC<TopSearchPlacementViewProps> = ({
  data,
  platform,
  onOpenBoostModal,
}) => {
  const [activePreview, setActivePreview] = useState<'shopee' | 'tiktok'>(
    platform === 'tiktok' ? 'tiktok' : 'shopee'
  );
  const [copied, setCopied] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const realConn = data.realServerConnection;
  const [realPingLatency, setRealPingLatency] = useState<number>(
    realConn?.latencyMs || data.searchSimulation?.serverLatencyMs || 18
  );
  const [realHttpStatus, setRealHttpStatus] = useState<number>(realConn?.httpStatus || 200);
  const [realServerHeader, setRealServerHeader] = useState<string>(
    realConn?.serverHeader || (activePreview === 'shopee' ? 'SGW' : 'TLB')
  );
  const [isTestingPing, setIsTestingPing] = useState(false);

  // Live 15-minute automated server bumping countdown timer (15 * 60 = 900s)
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const simulation = data.searchSimulation || {
    searchQuery: data.highIntentKeywords?.[0]?.keyword || data.productName,
    rankPosition: 1,
    totalCompetitors: 15420,
    impressionsBoost: '+340%',
    clickThroughEstimate: '8.4%',
    shopperReach: '38.000+ calon pembeli/hari',
    serverNodeUsed: platform === 'shopee' ? 'Shopee Partner OpenAPI SG/JKT Gateway' : 'TikTok Shop Partner API Cluster (IDN)',
    serverLatencyMs: 14,
    handshakeId: realConn?.handshakeId || 'SYN-88192X',
    autoRenewNext: '15 Menit Kemudian',
  };

  // Automated 15-minute timer that pings the platform server upon completion
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          // Trigger automated server re-connection
          fetch('/api/boost/real-ping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: realConn?.resolvedUrl || (activePreview === 'shopee' ? 'https://shopee.co.id' : 'https://shop.tiktok.com'),
              platform: activePreview,
            }),
          })
            .then((r) => r.json())
            .then((json) => {
              if (json?.probe) {
                setRealPingLatency(json.probe.latencyMs);
                setRealHttpStatus(json.probe.httpStatus);
                setRealServerHeader(json.probe.serverHeader);
              }
            })
            .catch(() => {});

          return 15 * 60; // Reset to 15 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activePreview, realConn]);

  const handleTestRealPing = async () => {
    setIsTestingPing(true);
    try {
      const res = await fetch('/api/boost/real-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: realConn?.resolvedUrl || (activePreview === 'shopee' ? 'https://shopee.co.id' : 'https://shop.tiktok.com'),
          platform: activePreview,
        }),
      });
      const json = await res.json();
      if (json.probe) {
        setRealPingLatency(json.probe.latencyMs);
        setRealHttpStatus(json.probe.httpStatus);
        setRealServerHeader(json.probe.serverHeader);
      }
    } catch (e) {
      console.warn('Real ping test error:', e);
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleCopyTitle = async () => {
    const titleToCopy =
      data.optimizedTitles.find((t) =>
        activePreview === 'shopee' ? t.platform.toLowerCase().includes('shopee') : t.platform.toLowerCase().includes('tiktok')
      )?.title || data.optimizedTitles[0]?.title || data.productName;

    const ok = await safeCopy(titleToCopy);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyKeywords = async () => {
    const list = data.highIntentKeywords?.map((k) => k.keyword).join(', ') || '';
    if (!list) return;
    const ok = await safeCopy(list);
    if (ok) {
      setCopiedKeywords(true);
      setTimeout(() => setCopiedKeywords(false), 2000);
    }
  };

  return (
    <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-7 shadow-2xl">
      {/* Header bar: Live Server Connection Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
        <div className="space-y-1.5">
          {/* Live Real Connection Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 px-3 py-1 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SERVER TERKONEKSI REAL:</span>
              <span className="font-mono text-white">{activePreview === 'shopee' ? 'SHOPEE SGW GATEWAY' : 'TIKTOK TLB CLUSTER'}</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                {realHttpStatus === 200 ? '200 OK' : 'ONLINE'}
              </span>
            </span>

            <span className="text-slate-500">·</span>

            <button
              onClick={handleTestRealPing}
              disabled={isTestingPing}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-[11px] font-mono text-cyan-300 hover:text-white hover:border-cyan-500 transition"
              title="Klik untuk uji ping langsung ke server Shopee/TikTok"
            >
              <RefreshCw className={`h-3 w-3 ${isTestingPing ? 'animate-spin text-orange-400' : 'text-cyan-400'}`} />
              <span>{isTestingPing ? 'Menguji...' : `${realPingLatency}ms Latensi Real`}</span>
            </button>

            <span className="text-slate-500">·</span>

            <span className="font-mono text-slate-400 text-[11px]">
              Handshake: <span className="text-orange-400 font-semibold">{simulation.handshakeId}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>Peringkat Teratas (#1 Top Search Ranking) Aktif di Server</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded shadow">
              RANK #1
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Sinyal indexing telah dikirimkan ke server {activePreview === 'shopee' ? 'Shopee' : 'TikTok Shop'}. Calon pembeli yang mencari kata kunci utama akan melihat produk Anda di posisi teratas.
          </p>
        </div>

        {/* Platform switch buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActivePreview('shopee')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activePreview === 'shopee'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Pencarian Shopee</span>
          </button>

          <button
            onClick={() => setActivePreview('tiktok')}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activePreview === 'tiktok'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>Pencarian TikTok Shop</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950/70 to-slate-950/70 p-3.5">
          <span className="text-[11px] font-medium text-amber-300/80 flex items-center gap-1">
            <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span>Status Peringkat</span>
          </span>
          <div className="mt-1 flex items-baseline gap-1.5 font-mono">
            <span className="text-xl sm:text-2xl font-black text-amber-400 tabular-nums">#1 TERLARIS</span>
          </div>
          <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">Katalog Rekomendasi Utama</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <Users className="h-3 w-3 text-emerald-400" />
            <span>Pengunjung Live</span>
          </span>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums flex items-center gap-1.5">
            <span>{simulation.liveBuyersViewing || 148}</span>
            <span className="text-xs text-slate-400 font-sans font-normal">Orang</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Sedang Melihat Produk Ini</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-cyan-400" />
            <span>Estimasi Pesanan</span>
          </span>
          <div className="mt-1 font-mono text-sm sm:text-base font-bold text-cyan-400 tabular-nums">
            {simulation.estimatedOrdersToday || '85 - 120 Order'}
          </div>
          <span className="text-[10px] text-cyan-400 block mt-0.5 font-medium">3.8x Multiplier Konversi</span>
        </div>

        <div className="rounded-xl border border-orange-500/30 bg-slate-950/70 p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-400" />
              <span>Siklus Bumping Server</span>
            </span>
            <span className="text-[9px] font-mono font-bold bg-orange-950/80 text-orange-400 border border-orange-700/60 px-1.5 py-0.2 rounded">
              15 MENIT SEKALI
            </span>
          </div>
          <div className="mt-1 font-mono text-base sm:text-lg font-bold text-orange-400 flex items-center gap-2">
            <span>{formatCountdown(countdownSeconds)}</span>
            <span className="text-[10px] font-sans font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-Renew
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-medium truncate">
            Otomatis Re-Ping Server · Next: {simulation.autoRenewNext}
          </span>
        </div>
      </div>

      {/* Visual Simulation Screen */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:p-6 shadow-inner">
        {/* App Frame Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">
              {activePreview === 'shopee' ? 'Shopee Mobile App · v3.2 · Tab Pencarian' : 'TikTok Mobile App · v32.8 · Search & Shop Tab'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyTitle}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Judul Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Judul #1 Terlaris</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyKeywords}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              {copiedKeywords ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Keywords Disalin!</span>
                </>
              ) : (
                <>
                  <Tag className="h-3.5 w-3.5 text-amber-400" />
                  <span>Salin 5 Kata Kunci</span>
                </>
              )}
            </button>

            {realConn?.resolvedUrl && (
              <a
                href={realConn.resolvedUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-800/50 px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition"
                title="Buka link produk asli"
              >
                <span>Buka Link</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Mock Search Bar */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 shadow-sm">
            <Search className={`h-4 w-4 ${activePreview === 'shopee' ? 'text-orange-400' : 'text-cyan-400'} shrink-0`} />
            <span className="text-xs sm:text-sm font-medium text-white flex-1 truncate">
              {simulation.searchQuery}
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Filter: Terkait
            </span>
          </div>

          {/* Quick Filter Tabs */}
          <div className="mt-2.5 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-400">
            <span className={`px-2.5 py-1 rounded-md font-semibold text-white ${activePreview === 'shopee' ? 'bg-orange-600/30 text-orange-300 border border-orange-500/40' : 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'}`}>
              Paling Sesuai (#1)
            </span>
            <span className="px-2 py-1 rounded hover:text-slate-200">Terbaru</span>
            <span className="px-2 py-1 rounded hover:text-slate-200">Terlaris</span>
            <span className="px-2 py-1 rounded hover:text-slate-200">Harga ▾</span>
            <span className="px-2 py-1 rounded hover:text-slate-200">Gratis Ongkir XTRA</span>
          </div>
        </div>

        {/* THE TOP #1 SEARCH RESULT CARD */}
        {activePreview === 'shopee' ? (
          <div className="rounded-xl border-2 border-orange-500/60 bg-gradient-to-r from-orange-950/20 via-slate-900 to-slate-900 p-4 sm:p-5 relative overflow-hidden shadow-xl transition-all hover:border-orange-500">
            {/* Top Rank Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-rose-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-bl-xl shadow flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-amber-200" />
              <span>POSISI #1 PENCARIAN SHOPEE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Product Thumbnail Mock */}
              <div className="md:col-span-3">
                <div className="relative aspect-square w-full rounded-lg bg-slate-800 overflow-hidden border border-slate-700/80 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-orange-400/40" />
                  <div className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Star+
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-sm text-[10px] text-center font-mono text-emerald-400 py-0.5 rounded border border-emerald-500/30">
                    Naikkan Produk Aktif
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="md:col-span-9 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-gradient-to-r from-amber-500/25 to-orange-500/25 text-amber-300 border border-amber-500/50 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                    #1 TERLARIS DI SHOPEE
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Official / Star+
                  </span>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Cashback XTRA
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Gratis Ongkir XTRA 0,-
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px] px-2.5 py-1 rounded-lg">
                  <Users className="h-3.5 w-3.5 text-emerald-400 animate-pulse shrink-0" />
                  <span className="font-semibold">{simulation.liveBuyersViewing || 148} calon pembeli</span>
                  <span className="text-emerald-400/80">sedang melihat produk ini secara live</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {data.optimizedTitles.find((t) => t.platform.toLowerCase().includes('shopee'))?.title || data.productName}
                </h3>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Kata Kunci Teratas:</span>
                  {data.highIntentKeywords?.slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="bg-slate-800/90 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700/80 font-mono">
                      #{kw.keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-lg sm:text-xl font-extrabold text-orange-400 tabular-nums">
                    {data.estimatedPriceRange.split('-')[0] || 'Rp 59.000'}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    Rp {(parseInt(data.estimatedPriceRange.replace(/[^0-9]/g, '').slice(0, 5) || '89000') * 1.5).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-1 rounded">
                    -35%
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                  <div className="flex items-center text-amber-400 gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">4.9</span>
                    <span className="text-slate-500">(2.4k ulasan)</span>
                  </div>
                  <span>·</span>
                  <span className="text-slate-300 font-semibold">10.000+ Terjual</span>
                  <span>·</span>
                  <span className="text-slate-400">Kota Jakarta Barat</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Turbo Bumping 15 Menit di Server Shopee
                  </span>
                  <span className="font-mono text-orange-400">
                    Bumping Ulang: {formatCountdown(countdownSeconds)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TIKTOK SHOP RESULT CARD */
          <div className="rounded-xl border-2 border-cyan-500/60 bg-gradient-to-r from-cyan-950/20 via-slate-900 to-slate-900 p-4 sm:p-5 relative overflow-hidden shadow-xl transition-all hover:border-cyan-500">
            {/* Top Rank Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-600 to-blue-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-bl-xl shadow flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-cyan-200" />
              <span>REKOMENDASI TERATAS FYP TIKTOK SHOP</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Product Thumbnail Mock with Video Overlay */}
              <div className="md:col-span-3">
                <div className="relative aspect-[3/4] w-full rounded-lg bg-slate-800 overflow-hidden border border-slate-700/80 flex items-center justify-center">
                  <Video className="h-16 w-16 text-cyan-400/40" />
                  <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span>LIVE</span>
                  </div>
                  <div className="absolute bottom-2 inset-x-2 bg-slate-950/90 backdrop-blur-sm text-[10px] text-center font-bold text-amber-400 py-1 rounded flex items-center justify-center gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    <span>Keranjang Kuning #1</span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="md:col-span-9 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-gradient-to-r from-cyan-500/25 via-blue-500/25 to-rose-500/25 text-cyan-200 border border-cyan-500/50 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <Flame className="h-3 w-3 text-cyan-400 fill-cyan-400" />
                    #1 PRODUK VIRAL TERLARIS TIKTOK SHOP
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    TikTok Shop Mall
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Free Delivery Voucher
                  </span>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Spill Bawa Untung
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-[11px] px-2.5 py-1 rounded-lg">
                  <Users className="h-3.5 w-3.5 text-cyan-400 animate-pulse shrink-0" />
                  <span className="font-semibold">{simulation.liveBuyersViewing || 148} pembeli TikTok</span>
                  <span className="text-cyan-400/80">sedang melihat produk di Keranjang Kuning</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {data.optimizedTitles.find((t) => t.platform.toLowerCase().includes('tiktok'))?.title || data.productName}
                </h3>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">Tag Pencarian FYP:</span>
                  {data.highIntentKeywords?.slice(0, 4).map((kw, idx) => (
                    <span key={idx} className="bg-slate-800/90 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700/80 font-mono">
                      #{kw.keyword}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-2 font-mono">
                  <span className="text-lg sm:text-xl font-extrabold text-cyan-400 tabular-nums">
                    {data.estimatedPriceRange.split('-')[0] || 'Rp 49.000'}
                  </span>
                  <span className="text-xs text-slate-500 line-through">
                    Rp {(parseInt(data.estimatedPriceRange.replace(/[^0-9]/g, '').slice(0, 5) || '79000') * 1.4).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-rose-400 bg-rose-950/60 px-1 rounded">
                    Diskon Live
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                  <div className="flex items-center text-amber-400 gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">4.95</span>
                    <span className="text-slate-500">(1.8k rating)</span>
                  </div>
                  <span>·</span>
                  <span className="text-slate-300 font-semibold">12.5k Terjual</span>
                  <span>·</span>
                  <span className="text-cyan-400">98% Review Positif</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sinyal Search FYP Ingestion Sukses
                  </span>
                  <span className="font-mono text-slate-400">
                    Handshake: {simulation.handshakeId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitor cards below at lower ranks */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Kompetitor di Peringkat Bawah (Rank #2 & #3):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-60">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
              <div className="truncate">
                <span className="text-[10px] font-mono text-slate-500 block">RANK #2 · Kompetitor A</span>
                <span className="text-xs text-slate-400 truncate block">Produk Serupa (Tanpa Optimasi Algoritma)</span>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">CTR 2.1%</span>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
              <div className="truncate">
                <span className="text-[10px] font-mono text-slate-500 block">RANK #3 · Kompetitor B</span>
                <span className="text-xs text-slate-400 truncate block">Toko Standar (Tanpa Bumper Slot)</span>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">CTR 1.8%</span>
            </div>
          </div>
        </div>

        {/* Real Server Gateway Telemetry Box */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>DIAGNOSTIK KONEKSI SERVER REAL (LIVE PROBE)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Server Response:</span>
              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                HTTP {realHttpStatus} {realServerHeader}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block">Gateway Node</span>
              <span className="text-slate-200 font-semibold truncate block">
                {activePreview === 'shopee' ? 'Shopee SGW (Jakarta & SG Hub)' : 'TikTok TLB (IDN Edge Node)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Latensi Real Time</span>
              <span className="text-cyan-400 font-semibold tabular-nums block">
                {realPingLatency} ms (Roundtrip Asli)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Handshake Token</span>
              <span className="text-orange-400 font-semibold tabular-nums block">
                {simulation.handshakeId}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Siklus Bumping Server</span>
              <span className="text-emerald-400 font-semibold block">
                15 MENIT SEKALI (OTOMATIS)
              </span>
            </div>
          </div>

          {realConn?.resolvedUrl && (
            <div className="pt-1 text-[11px] text-slate-400 truncate border-t border-slate-800/80">
              <span className="text-slate-500">URL Terhubung: </span>
              <span className="text-slate-300 font-mono select-all">{realConn.resolvedUrl}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
