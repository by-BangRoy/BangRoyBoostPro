export type PlatformType = 'shopee' | 'unknown';
export type BumpingIntervalMinutes = 1 | 5 | 10 | 15;

export interface OptimizedTitle {
  platform: string;
  title: string;
  charCount: number;
  formula: string;
  formulaType?: 'official' | 'promo' | 'high_intent' | 'flash_sale' | 'bestseller' | 'viral_fyp' | 'unboxing_spill' | 'problem_solution';
  formulaBadge?: string;
  searchRelevanceScore?: number;
}

export interface KeywordItem {
  keyword: string;
  searchVolume: string;
  competition: string;
  cpcEstimate: string;
}

export interface TikTokScript {
  angle: string;
  hook: string;
  body: string;
  callToAction: string;
  targetDuration: string;
  recommendedAudioVibe: string;
}

export interface ShopeeSlot {
  time: string;
  reason: string;
}

export interface ShopeeScheduleBoost {
  feature: string;
  bestSlots: ShopeeSlot[];
  autoRenewActive: boolean;
}

export interface LiveSellingPitch {
  pinScript: string;
  hostVoicePrompt: string;
}

export interface AlgorithmChecklistItem {
  task: string;
  impact: string;
  status: 'recommended' | 'critical' | 'priority';
  completed?: boolean;
}

export interface AlgorithmScore {
  overall: number;
  titleScore: number;
  keywordDensity: number;
  ctrPotential: number;
  conversionReadiness: number;
}

export interface SearchSimulation {
  searchQuery: string;
  rankPosition: number;
  totalCompetitors: number;
  impressionsBoost: string;
  clickThroughEstimate: string;
  shopperReach: string;
  serverNodeUsed: string;
  serverLatencyMs: number;
  handshakeId: string;
  autoRenewNext: string;
  bumpingIntervalMinutes?: BumpingIntervalMinutes;
  liveBuyersViewing?: number;
  salesRankBadge?: string;
  conversionBoostMultiplier?: string;
  estimatedOrdersToday?: string;
  searchDominancePct?: number;
}

export interface RealServerConnection {
  connected: boolean;
  httpStatus: number;
  serverNode: string;
  serverHeader: string;
  latencyMs: number;
  resolvedUrl: string;
  handshakeId: string;
  indexingSignalSent: boolean;
  timestamp: string;
  rateLimitRemaining?: string;
  htmlTitle?: string;
  verifiedLive: boolean;
}

export interface BoostAnalysisData {
  productName: string;
  category: string;
  platform: PlatformType;
  estimatedPriceRange: string;
  algorithmScore: AlgorithmScore;
  optimizedTitles: OptimizedTitle[];
  highIntentKeywords: KeywordItem[];
  viralTikTokScripts: TikTokScript[];
  shopeeScheduleBoost: ShopeeScheduleBoost;
  liveSellingPitch: LiveSellingPitch;
  recommendedHashtags: string[];
  algorithmActionChecklist: AlgorithmChecklistItem[];
  searchSimulation?: SearchSimulation;
  realServerConnection?: RealServerConnection;
}

export interface ServerNode {
  id: string;
  name: string;
  region: string;
  endpoint: string;
  status: 'online' | 'active' | 'fallback-active' | 'degraded';
  latencyMs: number;
  protocol: string;
  quotaRemaining: string;
}

export interface RotatingProxyNode {
  id: string;
  ip: string;
  port: number;
  location: string;
  provider: string;
  protocol: string;
  latencyMs: number;
  status: 'active' | 'standby' | 'rotating';
  requestsRouted: number;
  successRate: string;
  lastRotatedAt: string;
}

export interface ShopeeLiveServerConnection {
  target: string;
  connected: boolean;
  httpStatus: number;
  serverNode: string;
  serverHeader: string;
  latencyMs: number;
  handshakeId: string;
  timestamp: string;
  activeProxy: RotatingProxyNode;
  proxyPool: RotatingProxyNode[];
  rotationIntervalSeconds: number;
  totalRotations: number;
  wafBypassActive: boolean;
  rateLimitRemaining: string;
}

export interface BoostHistoryItem {
  id: string;
  productName: string;
  originalUrl: string;
  platform: PlatformType;
  boostedAt: string;
  nextBoostAt: string;
  handshakeId: string;
  status: 'active' | 'queued' | 'completed';
  autoSchedule: boolean;
  bumpingIntervalMinutes?: BumpingIntervalMinutes;
  data: BoostAnalysisData;
}
