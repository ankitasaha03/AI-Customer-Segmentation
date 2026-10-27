export type SegmentKey =
  | "champions"
  | "loyalists"
  | "potential"
  | "occasional"
  | "atrisk";

export interface NextBestAction {
  action: string;
  expectedLift: string;
  channel: "WhatsApp" | "Email" | "Push Notification" | "SMS" | "In-App Banner";
  promoCode?: string;
  urgency: "Immediate" | "High" | "Medium" | "Low";
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "purchase" | "page_view" | "cart_abandon" | "support_ticket" | "email_click";
  title: string;
  detail: string;
  amount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  segmentId: SegmentKey;
  segmentName: string;
  recencyDays: number;
  frequencyPurchases: number;
  monetaryValue: number;
  rfmScore: {
    r: number;
    f: number;
    m: number;
    composite: number;
  };
  churnRisk: "Low" | "Medium" | "High";
  churnScore: number; // 0 - 100%
  channel: "Mobile App" | "Web Desktop" | "In-Store" | "Omni-channel";
  preferredCategory: string;
  returnRate: number; // %
  region: "North America" | "EMEA" | "APAC" | "LATAM";
  joinedDate: string;
  lastActive: string;
  behavioralTags: string[];
  aiSummary: string;
  nextBestAction: NextBestAction;
  timeline: TimelineEvent[];
}

export interface Segment {
  id: SegmentKey;
  name: string;
  persona: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  customerCount: number;
  customerPercentage: number;
  avgCLV: number;
  avgRecency: number;
  avgFrequency: number;
  avgChurnRisk: number;
  traits: {
    loyalty: number;
    spend: number;
    frequency: number;
    channelEngagement: number;
    brandAdvocacy: number;
  };
  keyIndicators: string[];
  recommendedStrategy: string;
  campaignChannels: string[];
  estimatedRevenueOpportunity: string;
}

export interface ClusteringModelConfig {
  algorithm: "K-Means++" | "DBSCAN (Density-Based)" | "Hierarchical Ward";
  nClusters: number;
  features: string[];
  status: "idle" | "running" | "completed";
  progress: number;
  currentStep?: string;
  executionTimeMs: number;
  silhouetteScore: number;
  inertiaScore: number;
}

export interface CampaignDraft {
  targetSegment: string;
  channel: "Email" | "WhatsApp" | "Push Notification" | "Instagram Ad";
  subject: string;
  previewText: string;
  body: string;
  cta: string;
  recommendedTime: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  suggestions?: string[];
  campaignDraft?: CampaignDraft;
  relatedSegmentId?: SegmentKey;
}

export interface GlobalFilters {
  search: string;
  selectedSegment: string; // 'all' | SegmentKey
  region: string;
  dateRange: string;
  churnFilter: "all" | "Low" | "Medium" | "High";
}

export interface MetricsSummary {
  totalCustomers: number;
  discoveredSegments: number;
  activeCampaigns: number;
  avgCLV: number;
  clvGrowthMoM: number;
  avgChurnProbability: number;
}
