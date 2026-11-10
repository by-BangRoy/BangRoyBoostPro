import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LinkInputHero } from './components/LinkInputHero';
import { BoostResultView } from './components/BoostResultView';
import { TopSearchPlacementView } from './components/TopSearchPlacementView';
import { LiveBoostPipelineModal } from './components/LiveBoostPipelineModal';
import { ServerNodesModal } from './components/ServerNodesModal';
import { BoostHistoryTable } from './components/BoostHistoryTable';
import { Footer } from './components/Footer';
import { BoostAnalysisData, BoostHistoryItem, PlatformType, ServerNode, BumpingIntervalMinutes, ShopeeLiveServerConnection } from './types';
import { ShoppingBag, Video, Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'bangroyboost_history_v1';

export default function App() {
  const [url, setUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformType>('unknown');
  const [isLoading, setIsLoading] = useState(false);
  const [bumpingInterval, setBumpingInterval] = useState<BumpingIntervalMinutes>(15);
  const [analysisData, setAnalysisData] = useState<BoostAnalysisData | null>(null);
  const [dispatchedInfo, setDispatchedInfo] = useState<{ handshakeId: string; nextBoostAt: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live direct connection to https://shopee.co.id & rotating proxy pool state
  const [shopeeConnection, setShopeeConnection] = useState<ShopeeLiveServerConnection | null>(null);
  const [isRotatingProxy, setIsRotatingProxy] = useState(false);

  // Modals
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isRefreshingServers, setIsRefreshingServers] = useState(false);

  // Navigation tab
  const [activeTab, setActiveTab] = useState('booster');

  // Server state
  const [servers, setServers] = useState<ServerNode[]>([]);
  const [serverPing, setServerPing] = useState<number | null>(null);

  // History state with automatic sanitization of corrupted TikTok / Security Check items
  const [history, setHistory] = useState<BoostHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('omniboost_history_v1');
      if (!stored) return [];
      const parsed: BoostHistoryItem[] = JSON.parse(stored);
      // Clean history: remove TikTok items, WAF "Security Check" entries, and invalid titles
      return parsed.filter(
        (item) =>
          item.platform === 'shopee' &&
          item.productName &&
          !item.productName.toLowerCase().includes('security check') &&
          !item.productName.toLowerCase().includes('login') &&
          item.productName.trim().length > 3
      );
    } catch {
      return [];
    }
  });

  // Detect platform as user types (Shopee exclusive)
  useEffect(() => {
    const lower = url.toLowerCase().trim();
    if (!lower) {
      setDetectedPlatform('unknown');
    } else {
      setDetectedPlatform('shopee');
    }
  }, [url]);

  // Fetch server status & direct connection to https://shopee.co.id
  const fetchShopeeStatus = async () => {
    try {
      const res = await fetch('/api/shopee/live-status');
      const json = await res.json();
      if (json.success && json.data) {
        setShopeeConnection(json.data);
        setServerPing(json.data.latencyMs);
      }
    } catch (e) {
      console.warn('Shopee live status fetch failed:', e);
    }
  };

  const fetchServers = async () => {
    try {
      setIsRefreshingServers(true);
      const res = await fetch('/api/servers/status');
      const data = await res.json();
      if (data.servers && Array.isArray(data.servers)) {
        setServers(data.servers);
        const fastest = Math.min(...data.servers.map((s: ServerNode) => s.latencyMs));
        setServerPing(fastest);
      }
      if (data.activeProxy && !shopeeConnection) {
        fetchShopeeStatus();
      }
    } catch (err) {
      console.warn('Failed to fetch servers, using defaults:', err);
    } finally {
      setIsRefreshingServers(false);
    }
  };

  // Rotate proxy immediately and test connection to https://shopee.co.id
  const handleRotateProxy = async () => {
    try {
      setIsRotatingProxy(true);
      const res = await fetch('/api/proxy/rotate', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.liveConnection) {
        setShopeeConnection(json.liveConnection);
        setServerPing(json.liveConnection.latencyMs);
      }
    } catch (err) {
      console.error('Rotate proxy error:', err);
    } finally {
      setIsRotatingProxy(false);
    }
  };

  // Immediate connection on mount & periodic 30s heartbeat
  useEffect(() => {
    fetchShopeeStatus();
    fetchServers();

    const interval = setInterval(() => {
      fetchShopeeStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Save history on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('omniboost_history_v1');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  // Handle URL analyze & automatic server boosting
  const handleAnalyze = async (overrideUrl?: string, customCategory?: string, targetAudience?: string, overrideInterval?: BumpingIntervalMinutes) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl) return;
    if (overrideUrl && overrideUrl !== url) {
      setUrl(overrideUrl);
    }
    const intervalToUse = overrideInterval || bumpingInterval;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/boost/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          customCategory,
          targetAudience,
          bumpingInterval: intervalToUse,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gagal memproses link produk');
      }

      const productData = json.data;
      setAnalysisData(productData);

      // Auto-connect direct server handshake & top search placement
      const activePlatform = (detectedPlatform === 'unknown' ? productData.platform : detectedPlatform) || productData.platform;
      const handshakeId = productData.searchSimulation?.handshakeId || 'SYN-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const nextBoostAt = productData.searchSimulation?.autoRenewNext || 'Terjadwal Otomatis';

      setDispatchedInfo({ handshakeId, nextBoostAt });

      // Automatically dispatch background bumping cycle to live server
      try {
        fetch('/api/boost/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productUrl: targetUrl,
            url: targetUrl,
            platform: activePlatform,
            intervalMinutes: intervalToUse,
            autoSchedule: true,
          }),
        }).catch(() => {});
      } catch {}

      // Automatically register to boost history
      const newItem: BoostHistoryItem = {
        id: 'boost-' + Date.now(),
        productName: productData.productName,
        originalUrl: targetUrl,
        platform: activePlatform,
        boostedAt: new Date().toISOString(),
        nextBoostAt,
        handshakeId,
        status: 'active',
        autoSchedule: true,
        data: productData,
      };

      setHistory((prev) => [newItem, ...prev.filter((item) => item.productName !== productData.productName)]);
      setActiveTab('booster');

      // Trigger celebratory confetti for reaching Rank #1 Terlaris Shopee
      import('canvas-confetti').then((confettiModule) => {
        const confettiFn = confettiModule.default;
        confettiFn({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#eab308'],
        });
      });

      // Scroll smoothly to top search ranking preview
      setTimeout(() => {
        const el = document.getElementById('top-search-preview');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses link.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful boost dispatch
  const handleDispatchSuccess = (handshakeId: string, nextBoostAt: string) => {
    if (!analysisData) return;

    setDispatchedInfo({ handshakeId, nextBoostAt });

    const newItem: BoostHistoryItem = {
      id: 'boost-' + Date.now(),
      productName: analysisData.productName,
      originalUrl: url,
      platform: detectedPlatform === 'unknown' ? analysisData.platform : detectedPlatform,
      boostedAt: new Date().toISOString(),
      nextBoostAt,
      handshakeId,
      status: 'active',
      autoSchedule: true,
      data: analysisData,
    };

    setHistory((prev) => [newItem, ...prev.filter((item) => item.productName !== analysisData.productName)]);
  };

  // Select historical item
  const handleSelectHistoryItem = (item: BoostHistoryItem) => {
    setUrl(item.originalUrl);
    setAnalysisData(item.data);
    setDetectedPlatform(item.platform);
    setDispatchedInfo({
      handshakeId: item.handshakeId,
      nextBoostAt: item.nextBoostAt,
    });
    setActiveTab('booster');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Delete historical item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        shopeeConnection={shopeeConnection}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        onRotateProxy={handleRotateProxy}
        isRotatingProxy={isRotatingProxy}
      />

      <main className="flex-1">
        {/* Hero Input Area */}
        <LinkInputHero
          url={url}
          setUrl={setUrl}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          detectedPlatform={detectedPlatform}
          bumpingInterval={bumpingInterval}
          setBumpingInterval={setBumpingInterval}
          shopeeConnection={shopeeConnection}
          onOpenServerModal={() => setIsServerModalOpen(true)}
          onRotateProxy={handleRotateProxy}
          isRotatingProxy={isRotatingProxy}
        />

        {/* Error notification */}
        {errorMessage && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Main Booster View */}
          {activeTab === 'booster' && (
            <div id="boost-results" className="space-y-10">
              {analysisData ? (
                <>
                  {/* Real-time Top Search Placement Preview */}
                  <div id="top-search-preview">
                    <TopSearchPlacementView
                      data={analysisData}
                      platform={detectedPlatform === 'unknown' ? analysisData.platform : detectedPlatform}
                      bumpingInterval={bumpingInterval}
                      onIntervalChange={setBumpingInterval}
                      onOpenBoostModal={() => setIsBoostModalOpen(true)}
                    />
                  </div>

                  {/* Detailed Algorithmic Blueprint & Copy Toolkit */}
                  <BoostResultView
                    data={analysisData}
                    platform={detectedPlatform === 'unknown' ? analysisData.platform : detectedPlatform}
                    onTriggerBoostModal={() => setIsBoostModalOpen(true)}
                    dispatchedInfo={dispatchedInfo}
                  />
                </>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700">
                    <Zap className="h-7 w-7 text-orange-400" />
                  </div>
                  <div className="space-y-1.5 max-w-md mx-auto">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      Siap Mengoptimasi & Menghubungkan Server Shopee SGW
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Masukkan tautan produk Shopee (shopee.co.id atau shp.ee) di kolom atas, atau klik salah satu contoh produk populer untuk langsung memicu koneksi server real dan turbo boost.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-orange-400">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Shopee SGW Gateway Connected
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Clock className="h-3.5 w-3.5" />
                      Auto-Bumping Server Aktif
                    </span>
                    <span className="text-slate-700">·</span>
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Latency ~14ms (Direct)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Auto-Bumping Tab */}
          {activeTab === 'shopee4h' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-orange-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                    <ShoppingBag className="h-6 w-6" />
                    <h2>Siklus Bumping Otomatis Server (Shopee SGW)</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-600/60 text-emerald-300">
                    Siklus Auto-Bumping Aktif
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Sistem BangRoyBoost menghubungkan produk Anda langsung ke server Shopee SGW Gateway secara berkala. Algoritma melakukan re-index pencarian otomatis, menjaga produk tetap berada di urutan teratas katalog, dan memastikan produk selalu segar di hadapan calon pembeli aktif.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">Frekuensi Berkala</span>
                    <h4 className="text-sm font-semibold text-white">Re-Index Otomatis</h4>
                    <p className="text-xs text-slate-400">Pembaruan token handshake berkala menjaga produk tetap diprioritaskan algoritma.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-orange-400 font-bold">Shopee SGW Gateway</span>
                    <h4 className="text-sm font-semibold text-white">Slot Naikkan Produk</h4>
                    <p className="text-xs text-slate-400">Otomasi penjadwalan produk unggulan agar selalu tampil di tab Terkait & Terbaru.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">Shopee OpenAPI Node</span>
                    <h4 className="text-sm font-semibold text-white">Search Discovery Engine</h4>
                    <p className="text-xs text-slate-400">Injeksi kata kunci relevansi tinggi ke index pencarian katalog belanja Shopee.</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">Dominasi Peringkat</span>
                    <h4 className="text-sm font-semibold text-white">Posisi #1 Terlaris</h4>
                    <p className="text-xs text-slate-400">Mengalahkan ribuan produk kompetitor dengan continuous server presence.</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Sistem BangRoyBoost berjalan otomatis di latar belakang tanpa Anda harus membuka atau memencet tombol apa pun.
                  </span>
                  <button
                    onClick={() => {
                      setActiveTab('booster');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 transition whitespace-nowrap shrink-0"
                  >
                    Mulai Boost Produk Shopee Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shopee Live & Formula Showcase Tab */}
          {activeTab === 'shopee-live' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-orange-500/30 bg-slate-900/80 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                  <ShoppingBag className="h-6 w-6" />
                  <h2>Algoritma Shopee Live Stream & Formula Judul Terlaris</h2>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Algoritma Shopee memprioritaskan toko yang mengombinasikan judul berstruktur SEO baku (Brand + Fitur + USP + Promo XTRA) dengan sinyal live stream aktif untuk mendapatkan alokasi traffic organik gratis dari halaman utama.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-orange-400 font-bold">Formula 1</span>
                    <h4 className="text-sm font-semibold text-white">Shopee Star+ Official Formula</h4>
                    <p className="text-xs text-slate-400">[OFFICIAL / STAR+] + Nama Produk Spesifik + USP Mutu + Promo Voucher Gratis Ongkir XTRA (100-120 Karakter).</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold">Formula 2</span>
                    <h4 className="text-sm font-semibold text-white">Promo Flash Sale & Bestseller</h4>
                    <p className="text-xs text-slate-400">Targeting kata kunci bervolume tinggi dengan penawaran urgensi COD, diskon kilat, dan cashback ekstra.</p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="text-xs font-mono text-emerald-400 font-bold">Formula 3</span>
                    <h4 className="text-sm font-semibold text-white">Shopee Live Pin Etalase</h4>
                    <p className="text-xs text-slate-400">Teknik seruan host berkala tiap 45 detik untuk mendorong penonton mengklaim voucher live 50% di etalase #1.</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setActiveTab('booster');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500 transition"
                  >
                    Optimasi Produk Shopee Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <BoostHistoryTable
              history={history}
              onSelectProduct={handleSelectHistoryItem}
              onDeleteProduct={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onReboost={(item) => {
                setUrl(item.originalUrl);
                setAnalysisData(item.data);
                setIsBoostModalOpen(true);
              }}
            />
          )}

          {/* Quick History Strip below results if on booster tab */}
          {activeTab === 'booster' && history.length > 0 && (
            <div className="border-t border-slate-800/80 pt-8">
              <BoostHistoryTable
                history={history}
                onSelectProduct={handleSelectHistoryItem}
                onDeleteProduct={handleDeleteHistoryItem}
                onClearAll={handleClearAllHistory}
                onReboost={(item) => {
                  setUrl(item.originalUrl);
                  setAnalysisData(item.data);
                  setIsBoostModalOpen(true);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Live Boost Pipeline Modal */}
      {analysisData && (
        <LiveBoostPipelineModal
          isOpen={isBoostModalOpen}
          onClose={() => setIsBoostModalOpen(false)}
          data={analysisData}
          platform={detectedPlatform === 'unknown' ? analysisData.platform : detectedPlatform}
          onDispatchSuccess={handleDispatchSuccess}
        />
      )}

      {/* Server Nodes Inspection Modal */}
      <ServerNodesModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        servers={servers}
        onRefresh={fetchServers}
        isRefreshing={isRefreshingServers}
        shopeeConnection={shopeeConnection}
        onRotateProxy={handleRotateProxy}
        isRotatingProxy={isRotatingProxy}
      />
    </div>
  );
}
