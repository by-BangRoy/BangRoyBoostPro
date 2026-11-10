import React, { useState } from 'react';
import { ArrowRight, Sparkles, Link2, ShoppingBag, Video, CheckCircle2, Zap, Clock } from 'lucide-react';
import { PlatformType, BumpingIntervalMinutes } from '../types';

interface LinkInputHeroProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: (overrideUrl?: string, customCategory?: string, targetAudience?: string, overrideInterval?: BumpingIntervalMinutes) => Promise<void>;
  isLoading: boolean;
  detectedPlatform: PlatformType;
  bumpingInterval: BumpingIntervalMinutes;
  setBumpingInterval: (interval: BumpingIntervalMinutes) => void;
}

const SAMPLE_PRODUCTS = [
  {
    title: 'Shopee: Kemeja Linen Oversize Pria',
    platform: 'shopee' as const,
    url: 'https://shopee.co.id/Kemeja-Linen-Oversize-Pria-Casual-Premium-i.291038291.9201928310',
    category: 'Fashion Pria',
  },
  {
    title: 'Shopee: Serum Niacinamide Glowing Premium',
    platform: 'shopee' as const,
    url: 'https://shopee.co.id/Serum-Niacinamide-Glowing-Mencerahkan-Kulit-i.18291038.7182910283',
    category: 'Beauty & Skincare',
  },
  {
    title: 'Shopee: TWS Bluetooth 5.3 Bass Earphone',
    platform: 'shopee' as const,
    url: 'https://shopee.co.id/TWS-Bluetooth-Earphone-Wireless-Super-Bass-i.88129031.9921039481',
    category: 'Gadget & Aksesoris',
  },
  {
    title: 'Shopee: Mukena Silk Premium Cantik Mewah',
    platform: 'shopee' as const,
    url: 'https://shopee.co.id/Mukena-Silk-Premium-Mewah-Adem-i.39102819.8291029381',
    category: 'Fashion Muslimah',
  },
];

export const LinkInputHero: React.FC<LinkInputHeroProps> = ({
  url,
  setUrl,
  onAnalyze,
  isLoading,
  detectedPlatform,
  bumpingInterval,
  setBumpingInterval,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [autoBoostOnPaste, setAutoBoostOnPaste] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    // Automatically clean out surrounding share text (e.g. from Shopee mobile app or WhatsApp)
    const match = trimmed.match(/https?:\/\/[^\s"'<>)]+/i);
    const clean = match ? match[0].replace(/[.,;)]+$/, '') : trimmed;
    if (clean !== url) {
      setUrl(clean);
    }
    onAnalyze(clean, customCategory, targetAudience, bumpingInterval);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText) return;

    const match = pastedText.match(/https?:\/\/[^\s"'<>)]+/i);
    const clean = match ? match[0].replace(/[.,;)]+$/, '') : pastedText.trim();
    setUrl(clean);

    if (autoBoostOnPaste && clean) {
      setTimeout(() => {
        onAnalyze(clean, customCategory, targetAudience, bumpingInterval);
      }, 50);
    }
  };

  const handleQuickPasteAndBoost = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
        const text = await navigator.clipboard.readText();
        if (text) {
          const match = text.match(/https?:\/\/[^\s"'<>)]+/i);
          const clean = match ? match[0].replace(/[.,;!)]+$/, '') : text.trim();
          if (clean) {
            setUrl(clean);
            onAnalyze(clean, customCategory, targetAudience, bumpingInterval);
            return;
          }
        }
      }
    } catch {
      // Ignore clipboard permission issue in sandboxed iframe
    }

    if (url.trim()) {
      onAnalyze(url.trim(), customCategory, targetAudience, bumpingInterval);
      return;
    }

    // Fallback: If both clipboard and input are empty, focus input for user convenience
    const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PRODUCTS[0]) => {
    setUrl(sample.url);
    setCustomCategory(sample.category);
    onAnalyze(sample.url, sample.category, targetAudience, bumpingInterval);
  };

  return (
    <section id="link-input-section" className="relative overflow-hidden border-b border-slate-800 bg-slate-950/60 py-10 sm:py-14">
      {/* Subtle ambient gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[360px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="h-[280px] w-[420px] rounded-full bg-amber-600/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading and Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span className="text-orange-400">Shopee OpenAPI & SGW Gateway</span>
                <span aria-hidden="true">·</span>
                <span>Auto-Bumping {bumpingInterval}M Engine</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400">Sinkronisasi Realtime</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white" style={{ textWrap: 'balance' }}>
                Boost Produk Shopee Langsung ke Server Shopee SGW
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                Cukup masukkan link produk Shopee Anda. Sistem secara otomatis memetakan katalog, mengoptimasi formula kata kunci SEO Shopee, dan menjadwalkan auto-bumping ({bumpingInterval} menit sekali) ke server Shopee SGW agar selalu berada di peringkat #1 pencarian terlaris.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative rounded-2xl border border-slate-700/80 bg-slate-900/90 p-2 shadow-2xl transition-all focus-within:border-orange-500/80 focus-within:ring-2 focus-within:ring-orange-500/20">
                <div className="flex items-center gap-3 px-3 py-1.5">
                  <Link2 className="h-5 w-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="Masukkan tautan produk Shopee (shopee.co.id / shp.ee) di sini..."
                    className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                    disabled={isLoading}
                  />

                  {/* Clear button if URL has text */}
                  {url && !isLoading && (
                    <button
                      type="button"
                      onClick={() => setUrl('')}
                      className="text-slate-400 hover:text-slate-200 transition p-1"
                      title="Hapus input"
                    >
                      ✕
                    </button>
                  )}

                  {/* Platform Indicator */}
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md text-xs font-semibold">
                    <span className="flex items-center gap-1 text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Shopee SGW
                    </span>
                  </div>
                </div>

                {/* Pilihan Siklus Bumping Bar */}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 px-2 pt-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-orange-400" />
                    <span className="font-semibold text-white">Siklus Bumping:</span>
                    <span className="hidden sm:inline text-[11px] text-slate-400">Pilih interval server</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {([
                      { val: 1 as const, label: '1 Menit Sekali' },
                      { val: 5 as const, label: '5 Menit Sekali' },
                      { val: 10 as const, label: '10 Menit Sekali' },
                      { val: 15 as const, label: '15 Menit Sekali' },
                    ]).map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setBumpingInterval(opt.val)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                          bumpingInterval === opt.val
                            ? 'bg-orange-500/20 border-orange-500 text-orange-300 ring-1 ring-orange-500/40 shadow-sm shadow-orange-950'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                        }`}
                        title={`Koneksi otomatis dan auto-bumping ke server Shopee setiap ${opt.val} menit sekali`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${bumpingInterval === opt.val ? 'bg-orange-400 animate-pulse' : 'bg-transparent'}`} />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action Bar */}
                <div className="mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80 px-2 pt-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setAutoBoostOnPaste(!autoBoostOnPaste)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        autoBoostOnPaste
                          ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                      title="Ketika aktif, link yang dimasukkan langsung dikoneksikan ke server dan diposisikan ke peringkat #1"
                    >
                      <span className={`h-2 w-2 rounded-full ${autoBoostOnPaste ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span>Sinkronisasi Otomatis: {autoBoostOnPaste ? 'AKTIF' : 'NONAKTIF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowOptions(!showOptions)}
                      className="text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                    >
                      {showOptions ? '− Preferensi' : '+ Target Kategori'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleQuickPasteAndBoost}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition shrink-0"
                      title="Ambil link langsung dan jalankan koneksi server peringkat teratas secara instan"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-400" />
                      <span>Eksekusi Kilat</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading || !url.trim()}
                      className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-950/40 transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                    >
                      {isLoading ? (
                        <>
                          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Menghubungkan ke Server #1...</span>
                        </>
                      ) : (
                        <>
                          <span>Boost ke #1 Shopee</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Real Server Status Bar */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Shopee SGW Jakarta: Live</span>
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-1.5 text-orange-400">
                  <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                  <span>Shopee Partner OpenAPI: Live</span>
                </span>
                <span className="text-slate-700">|</span>
                <span className="text-amber-400 font-semibold">
                  Mode: Auto-Bumping {bumpingInterval} Menit Sekali ke #1 Terlaris
                </span>
              </div>

              {/* Optional Audience & Category Controls */}
              {showOptions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Kategori Produk (Opsional)
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Contoh: Skincare Pria / Sepatu Sneaker"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Target Audiens (Opsional)
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="Contoh: Mahasiswa / Ibu Muda / Pekerja Kantor"
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Quick Demo Link Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">
                Atau coba link contoh produk populer:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PRODUCTS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    <span className="text-orange-400 text-[11px] font-bold">Shopee</span>
                    <span className="text-slate-400">·</span>
                    <span className="truncate max-w-[170px]">{sample.title.split(': ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset with Fallback */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <img
                src="/src/assets/images/ecommerce_boost_banner_1793852644186.jpg"
                alt="BangRoyBoost E-Commerce Data Analytics Pipeline"
                referrerPolicy="no-referrer"
                className="w-full h-64 sm:h-72 object-cover transition duration-300 hover:scale-102"
                onError={(e) => {
                  // Fallback container if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Jalur Eksekusi Terverifikasi</span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  Shopee 15-Minute Turbo Bumping Queue + Realtime Search Index Ingestion siap diaktifkan otomatis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
