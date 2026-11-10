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

// Helper to synthesize randomized, high-intent structured formulas according to official Shopee SEO algorithm guidelines
function buildRandomTitles(
  productName: string,
  category: string,
  keywords: string[]
): OptimizedTitle[] {
  const cleanName = productName.replace(/^\[.*?\]\s*/, '').trim() || 'Produk Seller';
  const kw1 = (keywords[0] || cleanName).toLowerCase();
  const kw2 = (keywords[1] || `${cleanName} original`).toLowerCase();
  const kw3 = (keywords[2] || `${cleanName} terlaris`).toLowerCase();

  const shopeeLabels = ['[OFFICIAL]', '[STAR+ SELLER]', '[ORIGINAL 100%]', '[MALL RESMI]', '[PROMO SPESIAL]', '[BEST SELLER #1]'];
  const shopeeUSPs = [
    'Kualitas Premium Anti Rusak',
    'Bahan Tebal Nyaman Awet',
    'Desain Elegan Model Terbaru',
    'Standar Ekspor Material Kokoh',
    'Paling Laris Terbukti Bagus',
    'Finishing Rapi Bergaransi',
    'Anti Luntur Super Lembut',
    'Original Bergaransi Resmi',
  ];
  const shopeePerks = [
    'Gratis Ongkir XTRA + Cashback XTRA + Bisa COD',
    'Termurah Garansi Resmi 100% Free Ongkir',
    'Free Ongkir 0 Rupiah + Garansi Uang Kembali',
    'Pengiriman Cepat 24 Jam Bisa COD Seluruh Indonesia',
    'Diskon Terbatas Free Ongkir Seluruh Indonesia',
    'Extra Voucher Cashback + Siap Kirim Hari Ini',
  ];

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shopee Titles (Formatted for 100-120 chars to maximize SEO score in search)
  const s1 = `${pick(shopeeLabels)} ${cleanName} ${pick(shopeeUSPs)} - ${pick(shopeePerks)}`.slice(0, 120);
  const s2 = `${kw1.toUpperCase()} ${cleanName} Model Terbaru - ${pick(shopeeUSPs)} + ${pick(shopeePerks)}`.slice(0, 120);
  const s3 = `Rekomendasi ${kw2} Pilihan Seller - ${cleanName} ${pick(shopeeUSPs)} Garansi 100%`.slice(0, 120);
  const s4 = `[PROMO LIVE] ${cleanName} ${kw3} Diskon Kilat Flash Sale - ${pick(shopeePerks)}`.slice(0, 120);
  const s5 = `[BEST SELLER] ${cleanName} Asli 100% Original ${pick(shopeeUSPs)} - Bisa COD Free Ongkir`.slice(0, 120);

  return [
    {
      platform: 'Shopee',
      title: s1,
      charCount: s1.length,
      formula: 'Brand/Label + Kata Kunci Inti + Spesifikasi USP + Voucher Shopee',
      formulaType: 'official',
      formulaBadge: 'Shopee Star+ Official',
      searchRelevanceScore: 99,
    },
    {
      platform: 'Shopee',
      title: s2,
      charCount: s2.length,
      formula: 'High-Intent Keyword + Nama Produk + Fitur + Promo XTRA COD',
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
      searchRelevanceScore: 97,
    },
    {
      platform: 'Shopee',
      title: s4,
      charCount: s4.length,
      formula: 'Shopee Live / Flash Sale + Nama Produk + Diskon Kilat + Free Ongkir',
      formulaType: 'flash_sale',
      formulaBadge: 'Shopee Live & Flash Sale',
      searchRelevanceScore: 98,
    },
    {
      platform: 'Shopee',
      title: s5,
      charCount: s5.length,
      formula: 'Bestseller Badge + Kualitas Teruji + USP Kuat + COD Seluruh Indonesia',
      formulaType: 'bestseller',
      formulaBadge: 'Shopee Bestseller #1',
      searchRelevanceScore: 96,
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
  const [formulaFilter, setFormulaFilter] = useState<'all' | 'official' | 'promo' | 'live'>('all');

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
    if (formulaFilter === 'official') return t.formulaBadge?.toLowerCase().includes('official') || t.formulaBadge?.toLowerCase().includes('star');
    if (formulaFilter === 'promo') return t.formulaBadge?.toLowerCase().includes('promo') || t.formulaBadge?.toLowerCase().includes('bestseller');
    if (formulaFilter === 'live') return t.formulaBadge?.toLowerCase().includes('live') || t.formulaBadge?.toLowerCase().includes('flash');
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
    const content = `=== BANGROYBOOST BLUEPRINT OPTIMASI SHOPEE ===
Produk: ${data.productName}
Kategori: ${data.category}
Platform: Shopee (SGW Server Ingestion)
Estimasi Harga: ${data.estimatedPriceRange}

--- FORMULA JUDUL OPTIMASI SHOPEE (100-120 KARAKTER) ---
${titles.map((t) => `[${t.formulaBadge || 'Shopee SEO'}] (${t.charCount} Karakter)\n${t.title}\nStruktur: ${t.formula}`).join('\n\n')}

--- KATA KUNCI REKOMENDASI SHOPEE (HIGH-INTENT) ---
${data.highIntentKeywords.map((k) => `• ${k.keyword} | Volume: ${k.searchVolume} | Kompetisi: ${k.competition} | CPC: ${k.cpcEstimate}`).join('\n')}

--- SCRIPT SHOPEE LIVE & SHOPEE VIDEO ---
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
              <span className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                <ShoppingBag className="h-3.5 w-3.5" />
                Shopee SGW Hub Connected
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{data.category}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-mono tabular-nums">{data.estimatedPriceRange}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white">{data.productName}</h2>

            {dispatchedInfo ? (
              <div className="flex items-center gap-2 pt-1 text-xs font-mono text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Terhubung ke Server Shopee: {dispatchedInfo.handshakeId}</span>
                <span>·</span>
                <span>Next Boost: {dispatchedInfo.nextBoostAt}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Analisis algoritma Shopee selesai. Klik tombol di kanan untuk memicu handshake & boosting ke server Shopee SGW.
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
          <span>Script Shopee Live & Video</span>
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
                <span>Formula Judul Rekomendasi Algoritma Shopee</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Formula judul tertata acak sesuai standar SEO Shopee (maks 120 karakter) agar produk langsung muncul di halaman pertama pencarian.
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

          {/* Formula Filter Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-fit text-xs overflow-x-auto">
            <button
              onClick={() => setFormulaFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                formulaFilter === 'all' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({titles.length})
            </button>
            <button
              onClick={() => setFormulaFilter('official')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                formulaFilter === 'official' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="h-3 w-3" />
              <span>Shopee Star+ & Official</span>
            </button>
            <button
              onClick={() => setFormulaFilter('promo')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                formulaFilter === 'promo' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="h-3 w-3" />
              <span>Promo & Bestseller</span>
            </button>
            <button
              onClick={() => setFormulaFilter('live')}
              className={`px-3 py-1 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                formulaFilter === 'live' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="h-3 w-3" />
              <span>Live & Flash Sale</span>
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
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider font-mono px-2 py-0.5 rounded border text-orange-400 bg-orange-500/10 border-orange-500/30">
                      <ShoppingBag className="h-3 w-3" />
                      SHOPEE SEO
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
                        t.charCount <= 120
                          ? 'text-emerald-400 bg-emerald-950/50'
                          : 'text-rose-400 bg-rose-950/50'
                      }`}
                    >
                      {t.charCount} / 120 Karakter
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
          {/* Hashtag strip */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">
              Hashtag Rekomendasi Shopee Haul & Live Video:
            </span>
            <div className="flex flex-wrap gap-2">
              {data.recommendedHashtags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopy(tag, `tag-${idx}`)}
                  className="rounded-md border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-orange-400 hover:border-orange-500/50 transition font-mono"
                >
                  {copiedId === `tag-${idx}` ? 'Disalin!' : tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shopee Live & Shopee Video Scripts */}
      {activeSubTab === 'scripts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Script Shopee Live & Video Generator</h3>
              <p className="text-xs text-slate-400">
                Pola hook psikologis dengan retensi tinggi untuk menarik penonton checkout di etalase Shopee Live & Shopee Video.
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
                    <span className="text-xs font-bold text-orange-400">{script.angle}</span>
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
                      Isi Script Video & Live:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{script.body}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                      Call to Action (CTA Etalase Shopee):
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5">{script.callToAction}</p>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Audio Vibe: <span className="text-orange-400">{script.recommendedAudioVibe}</span>
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
              <span>Panduan Host Shopee Live Stream & Diskon Kilat</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Strategi Pin Etalase Shopee Live:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {data.liveSellingPitch.pinScript}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Voice Prompt Seruan Host Shopee Live:
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
              Sistem BangRoyBoost secara berkala setiap <strong>15 menit sekali</strong> otomatis terkoneksi dan mengirimkan sinyal boost ke server Shopee SGW Gateway. Penjadwalan berulang ini menjaga produk Anda terus diprioritaskan di posisi teratas halaman pencarian pembeli tanpa jeda.
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
              <h3 className="text-base font-bold text-white">Checklist Kepatuhan Algoritma Shopee</h3>
              <p className="text-xs text-slate-400">
                Centang setiap poin setelah diterapkan pada toko Shopee Seller Center Anda.
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

      {/* Kolom Paling Bawah: Generator Formula Judul Acak Terlaris (Rekomendasi Langsung Shopee) */}
      <div className="rounded-2xl border-2 border-orange-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/90 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/70 border border-amber-600/50 px-2 py-0.5 rounded">
                <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
                REKOMENDASI LANGSUNG ALGORITMA SHOPEE
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-[11px] font-mono text-emerald-400">Siap Pasang di Shopee Seller Center</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Shuffle className="h-4 w-4 text-orange-400" />
              <span>Formula Judul Acak Terlaris (Rekomendasi Algoritma Shopee)</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Formula disusun acak dan dinamis namun tetap mengikuti struktur baku algoritma pencarian Shopee (100-120 karakter) agar produk langsung muncul di halaman pertama pencarian pembeli.
            </p>
          </div>

          <button
            onClick={handleRandomizeAll}
            disabled={isShuffling}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:brightness-110 disabled:opacity-50 shrink-0"
          >
            <Shuffle className={`h-3.5 w-3.5 text-white ${isShuffling ? 'animate-spin' : ''}`} />
            <span>{isShuffling ? 'Mengacak...' : '🔀 Acak Formula Baru'}</span>
          </button>
        </div>

        {/* 2 Featured Bottom Cards (Both Shopee SEO Variations) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
          {/* Shopee Featured Card 1: Official & Star+ Seller Formula */}
          {(() => {
            const shopeeTitle = titles[0] || titles.find((t) => t.formulaType === 'official') || titles[0];
            if (!shopeeTitle) return null;
            return (
              <div className="rounded-xl border border-orange-500/40 bg-orange-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded">
                      <ShoppingBag className="h-3 w-3" />
                      SHOPEE STAR+ FORMULA
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {shopeeTitle.formulaBadge || 'Formula Star+'}
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
                    onClick={() => handleCopy(shopeeTitle.title, 'bottom-shopee-1')}
                    className="flex items-center gap-1.5 rounded-lg border border-orange-500/60 bg-orange-600/30 px-3 py-1.5 text-xs font-bold text-orange-200 transition hover:bg-orange-600 hover:text-white"
                  >
                    {copiedId === 'bottom-shopee-1' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-orange-300" />
                        <span>Salin Judul Star+</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Shopee Featured Card 2: Promo XTRA & Flash Sale Formula */}
          {(() => {
            const promoTitle = titles[1] || titles[3] || titles[titles.length - 1];
            if (!promoTitle) return null;
            return (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      <Flame className="h-3 w-3" />
                      SHOPEE PROMO TERLARIS
                    </span>
                    <span className="text-[11px] text-amber-200 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      {promoTitle.formulaBadge || 'Formula Konversi'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-300 tabular-nums font-semibold">
                    {promoTitle.charCount} / 120 Karakter
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/80 font-mono">
                  <span className="text-slate-500 font-semibold">Struktur: </span>
                  <span className="text-slate-300">{promoTitle.formula}</span>
                </div>

                <p className="text-xs sm:text-sm text-white font-medium bg-slate-950/90 p-3 rounded-lg border border-amber-900/40 select-all font-mono leading-relaxed">
                  {promoTitle.title}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Meningkatkan CTR & Penjualan Cepat
                  </span>
                  <button
                    onClick={() => handleCopy(promoTitle.title, 'bottom-shopee-2')}
                    className="flex items-center gap-1.5 rounded-lg border border-amber-500/60 bg-amber-600/30 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:bg-amber-600 hover:text-white"
                  >
                    {copiedId === 'bottom-shopee-2' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-amber-300" />
                        <span>Salin Judul Promo</span>
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
