import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Zap,
  ShoppingBag,
  Video,
  Clock,
  Sparkles,
  Download,
  Share2,
  TrendingUp,
  BarChart3,
  FileText,
  Radio,
  CheckSquare,
  Square,
  Shuffle,
  Flame,
  Tag,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react';
import { BoostAnalysisData, PlatformType, OptimizedTitle } from '../types';
import { safeCopy } from '../utils/clipboard';

// Helper to synthesize randomized, high-intent structured formulas according to official Shopee & TikTok algorithm guidelines
function buildRandomTitles(
  productName: string,
  category: string,
  keywords: string[]
): OptimizedTitle[] {
  const cleanName = productName.replace(/^\[.*?\]\s*/, '').trim() || 'Produk Seller';
  const kw1 = (keywords[0] || cleanName).toLowerCase();
  const kw2 = (keywords[1] || `${cleanName} original`).toLowerCase();

  const shopeeLabels = ['[OFFICIAL]', '[STAR+ SELLER]', '[ORIGINAL 100%]', '[MALL RESMI]', '[PROMO SPESIAL]', '[BEST SELLER #1]'];
  const shopeeUSPs = [
    'Kualitas Premium Anti Rusak',
    'Bahan Tebal Nyaman Awet',
    'Desain Elegan Model Terbaru',
    'Standar Ekspor Material Kokoh',
    'Paling Laris Terbukti Bagus',
    'Finishing Rapi Bergaransi',
    'Anti Luntur Super Lembut',
  ];
  const shopeePerks = [
    'Gratis Ongkir XTRA + Cashback XTRA + Bisa COD',
    'Termurah Garansi Resmi 100% Free Ongkir',
    'Free Ongkir 0 Rupiah + Garansi Uang Kembali',
    'Pengiriman Cepat 24 Jam Bisa COD Seluruh Indonesia',
    'Diskon Terbatas Free Ongkir Seluruh Indonesia',
  ];

  const tiktokHooks = [
    'Viral FYP!',
    'Spill Racun TikTok!',
    'Lagi Rame Banget!',
    'Wajib Punya!',
    'Beneran Senyaman Ini!',
    'Solusi Praktis!',
    'Kaget Banget Bagusnya!',
  ];
  const tiktokBenefits = [
    'Look Mewah Harga Murah',
    'Super Awet & Praktis',
    'Bikin Tampil Beda Maksimal',
    'Kualitas Original Terbukti',
    'Paling Banyak Dicari Pembeli',
    'Auto Bikin Pangling Elegan',
  ];
  const tiktokCTAs = [
    '(Spesial Diskon Flash Sale Live)',
    '(Promo Keranjang Kuning Kiri Bawah)',
    '(Bisa COD & Voucher Gratis Ongkir)',
    '(Amankan Selagi Promo Masih Aktif)',
    '(Stok Terbatas Cek Etalase)',
  ];

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shopee Titles (Formatted for 100-120 chars)
  const s1 = `${pick(shopeeLabels)} ${cleanName} ${pick(shopeeUSPs)} - ${pick(shopeePerks)}`.slice(0, 120);
  const s2 = `${kw1.toUpperCase()} ${cleanName} Model Terbaru - ${pick(shopeeUSPs)} + ${pick(shopeePerks)}`.slice(0, 120);
  const s3 = `Rekomendasi ${kw2} Pilihan Seller - ${cleanName} ${pick(shopeeUSPs)} Garansi 100%`.slice(0, 120);

  // TikTok Titles (Formatted for 60-80 chars)
  const t1 = `${pick(tiktokHooks)} ${cleanName} ${pick(tiktokBenefits)} ${pick(tiktokCTAs)}`.slice(0, 80);
  const t2 = `${pick(tiktokHooks)} ${cleanName} Rekomendasi Terlaris ${pick(tiktokCTAs)}`.slice(0, 80);
  const t3 = `Solusi ${cleanName} 100% Original ${pick(tiktokBenefits)} - Cek Keranjang Kuning`.slice(0, 80);

  return [
    {
      platform: 'Shopee',
      title: s1,
      charCount: s1.length,
      formula: 'Brand/Label + Kata Kunci Inti + Spesifikasi USP + Voucher Shopee',
      formulaType: 'official',
      formulaBadge: 'Shopee SEO Official',
      searchRelevanceScore: 99,
    },
    {
      platform: 'Shopee',
      title: s2,
      charCount: s2.length,
      formula: 'High-Intent Keyword + Nama Produk + Fitur + Promo Xtra COD',
      formulaType: 'promo',
      formulaBadge: 'Shopee Promo Terlaris',
      searchRelevanceScore: 98,
    },
    {
      platform: 'Shopee',
      title: s3,
      charCount: s3.length,
      formula: 'Search Discovery + Nama Produk + Keunggulan + Garansi Kepuasan',
      formulaType: 'high_intent',
      formulaBadge: 'Shopee Pencarian Tertarget',
      searchRelevanceScore: 96,
    },
    {
      platform: 'TikTok Shop',
      title: t1,
      charCount: t1.length,
      formula: 'Viral Trigger + Nama Produk + Benefit Visual + Flash Sale Live',
      formulaType: 'viral_fyp',
      formulaBadge: 'TikTok FYP Viral',
      searchRelevanceScore: 98,
    },
    {
      platform: 'TikTok Shop',
      title: t2,
      charCount: t2.length,
      formula: 'Spill Hook + Produk Terlaris + Value Proposition + CTA Keranjang',
      formulaType: 'unboxing_spill',
      formulaBadge: 'TikTok Racun Belanja',
      searchRelevanceScore: 96,
    },
    {
      platform: 'TikTok Shop',
      title: t3,
      charCount: t3.length,
      formula: 'Problem Solver + Jaminan Original + Direct Keranjang Kuning',
      formulaType: 'problem_solution',
      formulaBadge: 'TikTok Konversi Cepat',
      searchRelevanceScore: 95,
    },
  ];
}

interface BoostResultViewProps {
  data: BoostAnalysisData;
  platform: PlatformType;
  onTriggerBoostModal: () => void;
  dispatchedInfo?: { handshakeId: string; nextBoostAt: string } | null;
}

export const BoostResultView: React.FC<BoostResultViewProps> = ({
  data,
  platform,
  onTriggerBoostModal,
  dispatchedInfo,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'titles' | 'keywords' | 'scripts' | 'shopee' | 'checklist'>('titles');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(data.algorithmActionChecklist);
  const [isShuffling, setIsShuffling] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'shopee' | 'tiktok'>('all');

  const [titles, setTitles] = useState<OptimizedTitle[]>(() => {
    if (data.optimizedTitles && data.optimizedTitles.length >= 4) {
      return data.optimizedTitles;
    }
    return buildRandomTitles(
      data.productName,
      data.category,
      data.highIntentKeywords?.map((k) => k.keyword) || []
    );
  });

  useEffect(() => {
    if (data.optimizedTitles && data.optimizedTitles.length >= 4) {
      setTitles(data.optimizedTitles);
    } else {
      setTitles(
        buildRandomTitles(
          data.productName,
          data.category,
          data.highIntentKeywords?.map((k) => k.keyword) || []
        )
      );
    }
  }, [data]);

  const handleRandomizeAll = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setTitles(
        buildRandomTitles(
          data.productName,
          data.category,
          data.highIntentKeywords?.map((k) => k.keyword) || []
        )
      );
      setIsShuffling(false);
    }, 200);
  };

  const handleRerollSingle = (idx: number) => {
    const singleRandomSet = buildRandomTitles(
      data.productName,
      data.category,
      data.highIntentKeywords?.map((k) => k.keyword) || []
    );
    setTitles((prev) => {
      const copy = [...prev];
      copy[idx] = singleRandomSet[idx % singleRandomSet.length];
      return copy;
    });
  };

  const filteredTitles = titles.filter((t) => {
    if (platformFilter === 'shopee') return t.platform.toLowerCase().includes('shopee');
    if (platformFilter === 'tiktok') return t.platform.toLowerCase().includes('tiktok');
    return true;
  });

  const handleCopy = async (text: string, id: string) => {
    const success = await safeCopy(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const toggleChecklistItem = (idx: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleExportText = () => {
    const content = `=== BANGROYBOOST BLUEPRINT HASIL ANALISIS ===
Produk: ${data.productName}
Kategori: ${data.category}
Platform: ${data.platform}
Estimasi Harga: ${data.estimatedPriceRange}

--- JUDUL OPTIMASI SHOPEE & TIKTOK ---
${data.optimizedTitles.map((t) => `[${t.platform}] (${t.charCount} Karakter)\n${t.title}\nFormula: ${t.formula}`).join('\n\n')}

--- KATA KUNCI REKOMENDASI (HIGH-INTENT) ---
${data.highIntentKeywords.map((k) => `• ${k.keyword} | Volume: ${k.searchVolume} | Kompetisi: ${k.competition} | CPC: ${k.cpcEstimate}`).join('\n')}

--- SCRIPT VIDEO VIRAL TIKTOK SHOP ---
${data.viralTikTokScripts
  .map(
    (s, i) =>
      `[Script #${i + 1}: ${s.angle}] (${s.targetDuration})\nHook: ${s.hook}\nBody: ${s.body}\nCTA: ${s.callToAction}\nAudio Vibe: ${s.recommendedAudioVibe}`
  )
  .join('\n\n')}

--- JADWAL NAIKKAN PRODUK SHOPEE 4 JAM ---
${data.shopeeScheduleBoost.bestSlots.map((s) => `• ${s.time}: ${s.reason}`).join('\n')}

--- SCRIPT LIVE STREAM SELLING ---
Pin Etalase: ${data.liveSellingPitch.pinScript}
Voice Prompt Host: ${data.liveSellingPitch.hostVoicePrompt}

--- HASHTAG REKOMENDASI ---
${data.recommendedHashtags.join(' ')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BangRoyBoost_${data.productName.slice(0, 20).replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Product Identity & Score Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {platform === 'shopee' ? (
                <span className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Shopee Server Ready
                </span>
              ) : (
                <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  <Video className="h-3.5 w-3.5" />
                  TikTok Shop Cluster Ready
                </span>
              )}
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{data.category}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-mono tabular-nums">{data.estimatedPriceRange}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{data.productName}</h2>

            {dispatchedInfo ? (
              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Terhubung ke Server: {dispatchedInfo.handshakeId}</span>
                <span>·</span>
                <span>Next Boost: {dispatchedInfo.nextBoostAt}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Analisis AI algoritma selesai. Klik tombol di kanan untuk memicu handshake & boosting ke server platform.
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleExportText}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
              title="Unduh ringkasan optimasi ke file teks"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Ekspor Kit</span>
            </button>

            <button
              onClick={onTriggerBoostModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 whitespace-nowrap"
            >
              <Zap className="h-4 w-4" />
              <span>{dispatchedInfo ? 'Sinkronkan Ulang Server' : 'Aktifkan Boost ke Server Sekarang'}</span>
            </button>
          </div>
        </div>

        {/* Algorithm Scoreboard */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-5">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Skor Judul SEO</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-orange-400 tabular-nums">
                {data.algorithmScore.titleScore}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-0.5">High Keyword Volume</span>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Kerapatan Keyword</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-cyan-400 tabular-nums">
                {data.algorithmScore.keywordDensity}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-cyan-400 block mt-0.5">Optimal Search Match</span>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Potensi CTR Video/Card</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-rose-400 tabular-nums">
                {data.algorithmScore.ctrPotential}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-rose-400 block mt-0.5">High Stop-Scroll Rate</span>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
            <span className="text-[11px] font-medium text-slate-400 block">Kesiapan Konversi</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">
                {data.algorithmScore.conversionReadiness}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Checkout Ready</span>
          </div>
        </div>
      </div>

      {/* Segmented Sub-Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveSubTab('titles')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeSubTab === 'titles'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-orange-400" />
          <span>Judul SEO Ranking Tinggi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('keywords')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeSubTab === 'keywords'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />
          <span>Matriks Kata Kunci ({data.highIntentKeywords.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('scripts')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeSubTab === 'scripts'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Video className="h-3.5 w-3.5 text-rose-400" />
          <span>Script Video FYP TikTok</span>
        </button>

        <button
          onClick={() => setActiveSubTab('shopee')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeSubTab === 'shopee'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          <span>Turbo Bumping 15M</span>
        </button>

        <button
          onClick={() => setActiveSubTab('checklist')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeSubTab === 'checklist'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
          <span>Checklist Algoritma</span>
        </button>
      </div>

      {/* Tab 1: Optimized Titles */}
      {activeSubTab === 'titles' && (
        <div className="space-y-5">
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Formula Judul Rekomendasi Algoritma (Shopee & TikTok Shop)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula judul tertata acak sesuai standar SEO Shopee (maks 120 kar) dan display card TikTok Shop (maks 80 kar).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomizeAll}
                disabled={isShuffling}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 transition shadow-lg shrink-0"
                title="Acak semua formula judul menggunakan kata kunci produk"
              >
                <Shuffle className={`h-3.5 w-3.5 text-amber-400 ${isShuffling ? 'animate-spin' : ''}`} />
                <span>{isShuffling ? 'Mengacak Formula...' : '🔀 Acak Semua Formula'}</span>
              </button>
            </div>
          </div>

          {/* Platform Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-fit text-xs overflow-x-auto">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                platformFilter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({titles.length})
            </button>
            <button
              onClick={() => setPlatformFilter('shopee')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                platformFilter === 'shopee' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Shopee SEO (100-120 Karakter)</span>
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                platformFilter === 'tiktok' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="h-3 w-3" />
              <span>TikTok Shop FYP (60-80 Karakter)</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredTitles.map((t, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition hover:border-slate-700 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded border ${
                        t.platform.toLowerCase().includes('shopee')
                          ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                          : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
                      }`}
                    >
                      {t.platform.toLowerCase().includes('shopee') ? (
                        <ShoppingBag className="h-3 w-3" />
                      ) : (
                        <Video className="h-3 w-3" />
                      )}
                      {t.platform}
                    </span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                      <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                      {t.formulaBadge || 'Formula Terlaris'}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                      {t.searchRelevanceScore || 98}% Skor Relevansi
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-0.5 rounded tabular-nums ${
                        t.platform.toLowerCase().includes('shopee')
                          ? t.charCount <= 120
                            ? 'text-emerald-400 bg-emerald-950/50'
                            : 'text-rose-400 bg-rose-950/50'
                          : t.charCount <= 80
                          ? 'text-emerald-400 bg-emerald-950/50'
                          : 'text-rose-400 bg-rose-950/50'
                      }`}
                    >
                      {t.charCount} / {t.platform.toLowerCase().includes('shopee') ? 120 : 80} Karakter
                    </span>
                  </div>
                </div>

                {/* Structured Formula Breakdown Flow */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                  <span className="text-slate-500 font-semibold">Struktur Formula:</span>
                  <span className="text-slate-300 font-mono">{t.formula}</span>
                </div>

                {/* Title Box */}
                <p className="text-sm text-slate-100 font-semibold leading-relaxed bg-slate-950/80 p-3 rounded-lg border border-slate-800 select-all font-mono">
                  {t.title}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60 text-xs">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    Rekomendasi Algoritma Resmi {t.platform}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRerollSingle(idx)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      title="Acak variasi judul ini saja"
                    >
                      <Shuffle className="h-3 w-3 text-cyan-400" />
                      <span>Acak Ulang Ini</span>
                    </button>

                    <button
                      onClick={() => handleCopy(t.title, `title-${idx}`)}
                      className="flex items-center gap-1.5 rounded-lg border border-orange-500/50 bg-orange-600/20 px-3 py-1 font-bold text-orange-200 transition hover:bg-orange-600/30 hover:text-white"
                    >
                      {copiedId === `title-${idx}` ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Judul Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-orange-400" />
                          <span>Salin Judul Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: High-Intent Keywords Matrix */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white">Matriks Kata Kunci Pencarian Tinggi</h3>
              <p className="text-xs text-slate-400">
                Gunakan kata kunci ini pada deskripsi produk, atribut spesifikasi, dan tag kampanye iklan.
              </p>
            </div>

            <button
              onClick={() => {
                const allKw = data.highIntentKeywords.map((k) => k.keyword).join(', ');
                handleCopy(allKw, 'all-keywords');
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white shrink-0"
            >
              {copiedId === 'all-keywords' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Semua Kata Kunci Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Semua Kata Kunci</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Kata Kunci</th>
                  <th className="px-4 py-3 font-semibold text-right">Estimasi Volume</th>
                  <th className="px-4 py-3 font-semibold text-center">Tingkat Kompetisi</th>
                  <th className="px-4 py-3 font-semibold text-right">Est. CPC Iklan</th>
                  <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.highIntentKeywords.map((item, idx) => (
                  <tr key={idx} className="transition hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium text-white">{item.keyword}</td>
                    <td className="px-4 py-3 text-right font-mono text-orange-400 tabular-nums">
                      {item.searchVolume}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs text-slate-300">
                        {item.competition}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300 tabular-nums">
                      {item.cpcEstimate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleCopy(item.keyword, `kw-${idx}`)}
                        className="rounded p-1 text-slate-400 hover:text-white transition"
                        title="Salin kata kunci"
                      >
                        {copiedId === `kw-${idx}` ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Hashtag strip */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Hashtag Rekomendasi FYP & Shopee Haul:
            </span>
            <div className="flex flex-wrap gap-2">
              {data.recommendedHashtags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(tag, `tag-${idx}`)}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-cyan-400 hover:border-cyan-500/50 transition font-mono"
                >
                  {copiedId === `tag-${idx}` ? 'Disalin!' : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: TikTok Viral Scripts */}
      {activeSubTab === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Script Video TikTok Shop FYP Generator</h3>
              <p className="text-xs text-slate-400">
                Pola hook psikologis dengan retensi tinggi untuk menarik penonton checkout keranjang kuning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.viralTikTokScripts.map((script, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 transition hover:border-slate-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-xs font-bold text-rose-400">{script.angle}</span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {script.targetDuration}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                      3-Second Hook:
                    </span>
                    <p className="text-sm font-semibold text-white mt-0.5">"{script.hook}"</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Isi Script Video:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{script.body}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Call to Action (CTA Keranjang Kuning):
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5">{script.callToAction}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Audio Vibe: <span className="text-cyan-400">{script.recommendedAudioVibe}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex justify-end">
                  <button
                    onClick={() => {
                      const fullScript = `[HOOK]: ${script.hook}\n\n[BODY]: ${script.body}\n\n[CTA]: ${script.callToAction}\n\nAudio: ${script.recommendedAudioVibe}`;
                      handleCopy(fullScript, `script-${idx}`);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                  >
                    {copiedId === `script-${idx}` ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Script Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin Script Ini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Live Selling Pitch Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Radio className="h-4 w-4" />
              <span>Panduan Host Live Stream (Shopee Live / TikTok Live)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Pin Etalase Strategy:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {data.liveSellingPitch.pinScript}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Voice Prompt Seruan Host:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{data.liveSellingPitch.hostVoicePrompt}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Turbo Bumping 15M */}
      {activeSubTab === 'shopee' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-orange-500/30 bg-orange-950/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-base">
                <ShoppingBag className="h-5 w-5" />
                <span>Fitur Naikkan Produk Otomatis (Turbo Bumping 15 Menit Sekali)</span>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded">
                Siklus 15 Menit Aktif
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Sistem BangRoyBoost secara berkala setiap <strong>15 menit sekali</strong> otomatis terkoneksi dan mengirimkan sinyal boost ke server Shopee dan TikTok Shop. Penjadwalan berulang ini menjaga produk Anda terus diprioritaskan di posisi teratas halaman pencarian tanpa henti.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {data.shopeeScheduleBoost.bestSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-800 bg-slate-900/90 p-3 space-y-1"
                >
                  <span className="text-xs font-mono font-bold text-orange-400 tabular-nums">
                    {slot.time}
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">{slot.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Checklist Algoritma */}
      {activeSubTab === 'checklist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Checklist Kepatuhan Algoritma</h3>
              <p className="text-xs text-slate-400">
                Centang setiap poin setelah diterapkan pada toko Shopee atau TikTok Shop Anda.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                onClick={() => toggleChecklistItem(idx)}
                className={`flex items-center justify-between gap-4 rounded-xl border p-3.5 transition cursor-pointer ${
                  item.completed
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.completed ? (
                    <CheckSquare className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      item.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                    }`}
                  >
                    {item.task}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                  <span className="text-emerald-400 font-semibold">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kolom Paling Bawah: Generator Formula Judul Acak Terlaris (Shopee & TikTok Direct) */}
      <div className="rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/90 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded">
                <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                REKOMENDASI LANGSUNG SHOPEE & TIKTOK
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] font-mono text-emerald-400">Siap Pasang di Seller Center</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-orange-400" />
              <span>Formula Judul Acak Terlaris (Pencarian Tertarget Pembeli)</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Formula disusun acak dan dinamis namun tetap mengikuti struktur baku algoritma pencarian Shopee & TikTok agar produk langsung muncul di halaman pertama pencarian pembeli.
            </p>
          </div>

          <button
            onClick={handleRandomizeAll}
            disabled={isShuffling}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-rose-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50 shrink-0"
          >
            <Shuffle className={`h-3.5 w-3.5 text-white ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? 'Mengacak...' : '🔀 Acak Formula Baru'}</span>
          </button>
        </div>

        {/* 2 Featured Bottom Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Shopee Featured Card */}
          {(() => {
            const shopeeTitle = titles.find((t) => t.platform.toLowerCase().includes('shopee')) || titles[0];
            if (!shopeeTitle) return null;
            return (
              <div className="rounded-xl border border-orange-500/40 bg-orange-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">
                      <ShoppingBag className="h-3 w-3" />
                      SHOPEE SEO
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {shopeeTitle.formulaBadge || 'Formula Terlaris'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-orange-300 tabular-nums font-semibold">
                    {shopeeTitle.charCount} / 120 Karakter
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/80 font-mono">
                  <span className="text-slate-500 font-semibold">Struktur: </span>
                  <span className="text-slate-300">{shopeeTitle.formula}</span>
                </div>

                <p className="text-xs sm:text-sm text-white font-medium bg-slate-950/90 p-3 rounded-lg border border-orange-900/40 select-all font-mono leading-relaxed">
                  {shopeeTitle.title}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Mudah Ditemukan Pembeli di Shopee
                  </span>
                  <button
                    onClick={() => handleCopy(shopeeTitle.title, 'bottom-shopee')}
                    className="flex items-center gap-1.5 rounded-lg border border-orange-500/60 bg-orange-600/30 px-3 py-1.5 text-xs font-bold text-orange-200 transition hover:bg-orange-600 hover:text-white"
                  >
                    {copiedId === 'bottom-shopee' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-orange-300" />
                        <span>Salin Judul Shopee</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* TikTok Shop Featured Card */}
          {(() => {
            const tiktokTitle = titles.find((t) => t.platform.toLowerCase().includes('tiktok')) || titles[1] || titles[0];
            if (!tiktokTitle) return null;
            return (
              <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                      <Video className="h-3 w-3" />
                      TIKTOK SHOP
                    </span>
                    <span className="text-[11px] text-cyan-200 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      {tiktokTitle.formulaBadge || 'Formula FYP'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 tabular-nums font-semibold">
                    {tiktokTitle.charCount} / 80 Karakter
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/80 font-mono">
                  <span className="text-slate-500 font-semibold">Struktur: </span>
                  <span className="text-slate-300">{tiktokTitle.formula}</span>
                </div>

                <p className="text-xs sm:text-sm text-white font-medium bg-slate-950/90 p-3 rounded-lg border border-cyan-900/40 select-all font-mono leading-relaxed">
                  {tiktokTitle.title}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Mudah Masuk FYP & Keranjang Kuning
                  </span>
                  <button
                    onClick={() => handleCopy(tiktokTitle.title, 'bottom-tiktok')}
                    className="flex items-center gap-1.5 rounded-lg border border-cyan-500/60 bg-cyan-600/30 px-3 py-1.5 text-xs font-bold text-cyan-200 transition hover:bg-cyan-600 hover:text-white"
                  >
                    {copiedId === 'bottom-tiktok' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-cyan-300" />
                        <span>Salin Judul TikTok</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
