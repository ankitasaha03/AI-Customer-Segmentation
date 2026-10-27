"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import {
  Customer,
  Segment,
  SegmentKey,
  GlobalFilters,
  MetricsSummary,
  ClusteringModelConfig,
  ChatMessage,
} from "@/types/segmentation";
import {
  INITIAL_SEGMENTS,
  INITIAL_CUSTOMERS,
  INITIAL_METRICS,
  generateSeedCustomers,
} from "@/data/mockData";

interface SegmentationContextType {
  customers: Customer[];
  filteredCustomers: Customer[];
  segments: Segment[];
  metrics: MetricsSummary;
  filters: GlobalFilters;
  selectedCustomer: Customer | null;
  isCopilotOpen: boolean;
  activeTab: "overview" | "clusters" | "rfm" | "customers" | "ingestion";
  clusteringConfig: ClusteringModelConfig;
  chatHistory: ChatMessage[];
  isChatStreaming: boolean;
  theme: "dark" | "light";

  // Actions
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  setSelectedSegment: (segmentId: string) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setIsCopilotOpen: (open: boolean) => void;
  setActiveTab: (tab: "overview" | "clusters" | "rfm" | "customers" | "ingestion") => void;
  toggleTheme: () => void;
  runClusteringEngine: (algorithm?: ClusteringModelConfig["algorithm"]) => Promise<void>;
  synthesizeDataset: (count?: number) => void;
  importCSVRecords: (csvText: string) => boolean;
  sendChatMessage: (content: string, customPromptType?: string) => Promise<void>;
  executeNextBestAction: (customerId: string) => { success: boolean; message: string };
  openCopilotWithPrompt: (prompt: string, segmentId?: SegmentKey) => void;
}

const SegmentationContext = createContext<SegmentationContextType | undefined>(undefined);

export function SegmentationProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [metrics, setMetrics] = useState<MetricsSummary>(INITIAL_METRICS);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "clusters" | "rfm" | "customers" | "ingestion">("overview");

  const [filters, setFilters] = useState<GlobalFilters>({
    search: "",
    selectedSegment: "all",
    region: "All Regions",
    dateRange: "Last 30 Days",
    churnFilter: "all",
  });

  const [clusteringConfig, setClusteringConfig] = useState<ClusteringModelConfig>({
    algorithm: "K-Means++",
    nClusters: 5,
    features: ["Recency (Days)", "Frequency (Purchases)", "Monetary Value ($)", "Return Rate (%)", "Session Depth"],
    status: "idle",
    progress: 100,
    executionTimeMs: 420,
    silhouetteScore: 0.742,
    inertiaScore: 184.2,
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "👋 Welcome to **SegmentAI Copilot**! I analyze behavioral clusters, predict churn vectors, and generate high-converting marketing campaigns across your customer cohorts.\n\nHow can I help you optimize customer retention and lifetime value today?",
      timestamp: "Just now",
      suggestions: [
        "Which segment has the highest risk of churn?",
        "Draft a re-engagement email campaign for At-Risk Customers.",
        "Why were customers in Segment 3 placed together?",
        "Suggest cross-sell strategies for Budget Seekers."
      ]
    }
  ]);
  const [isChatStreaming, setIsChatStreaming] = useState<boolean>(false);

  // Sync theme with DOM
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return nextTheme;
    });
  }, []);

  // Set selected segment filter helper
  const setSelectedSegment = useCallback((segmentId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSegment: prev.selectedSegment === segmentId ? "all" : segmentId,
    }));
  }, []);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Segment filter
      if (filters.selectedSegment !== "all" && customer.segmentId !== filters.selectedSegment) {
        return false;
      }
      // Region filter
      if (filters.region !== "All Regions" && customer.region !== filters.region) {
        return false;
      }
      // Churn filter
      if (filters.churnFilter !== "all" && customer.churnRisk !== filters.churnFilter) {
        return false;
      }
      // Search term
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = customer.name.toLowerCase().includes(query);
        const matchesEmail = customer.email.toLowerCase().includes(query);
        const matchesId = customer.id.toLowerCase().includes(query);
        const matchesCategory = customer.preferredCategory.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesId && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [customers, filters]);

  // Recalculate metrics based on current customer base
  const recomputeMetrics = useCallback((custs: Customer[], segs: Segment[]) => {
    const totalCount = custs.length * 247;
    const avgCLV = Math.round(custs.reduce((sum, c) => sum + c.monetaryValue, 0) / (custs.length || 1));
    const avgChurn = Number(
      (custs.reduce((sum, c) => sum + c.churnScore, 0) / (custs.length || 1)).toFixed(1)
    );

    setMetrics({
      totalCustomers: totalCount,
      discoveredSegments: segs.length,
      activeCampaigns: 18,
      avgCLV,
      clvGrowthMoM: Number((11 + Math.random() * 3).toFixed(1)),
      avgChurnProbability: avgChurn,
    });
  }, []);

  // Run AI Clustering Engine simulation
  const runClusteringEngine = useCallback(
    async (algo?: ClusteringModelConfig["algorithm"]) => {
      const selectedAlgo = algo || clusteringConfig.algorithm;
      setClusteringConfig((prev) => ({
        ...prev,
        algorithm: selectedAlgo,
        status: "running",
        progress: 10,
        currentStep: "Vectorizing customer feature tensors...",
      }));

      await new Promise((r) => setTimeout(r, 600));
      setClusteringConfig((prev) => ({
        ...prev,
        progress: 35,
        currentStep: `Executing ${selectedAlgo} partitioning & centroid convergence...`,
      }));

      await new Promise((r) => setTimeout(r, 700));
      setClusteringConfig((prev) => ({
        ...prev,
        progress: 70,
        currentStep: "Calculating Silhouette coefficient & inter-cluster distance...",
      }));

      await new Promise((r) => setTimeout(r, 600));
      setClusteringConfig((prev) => ({
        ...prev,
        progress: 90,
        currentStep: "Synthesizing AI persona descriptors and Next-Best-Actions...",
      }));

      await new Promise((r) => setTimeout(r, 500));

      // Re-assign slight variances to simulate dynamic cluster re-distribution
      const newScore = Number((0.72 + Math.random() * 0.08).toFixed(3));
      const newInertia = Number((160 + Math.random() * 30).toFixed(1));

      // Update segment statistics
      const updatedSegments = segments.map((seg) => {
        const delta = Math.floor((Math.random() - 0.5) * 80);
        const newCount = Math.max(800, seg.customerCount + delta);
        return {
          ...seg,
          customerCount: newCount,
          avgCLV: Math.round(seg.avgCLV + (Math.random() - 0.5) * 150),
          avgChurnRisk: Number(Math.max(4, seg.avgChurnRisk + (Math.random() - 0.5) * 2).toFixed(1)),
        };
      });

      setSegments(updatedSegments);
      recomputeMetrics(customers, updatedSegments);

      setClusteringConfig({
        algorithm: selectedAlgo,
        nClusters: 5,
        features: ["Recency (Days)", "Frequency (Purchases)", "Monetary Value ($)", "Return Rate (%)", "Session Depth"],
        status: "completed",
        progress: 100,
        currentStep: "Convergence achieved. 5 optimal clusters identified.",
        executionTimeMs: Math.floor(380 + Math.random() * 120),
        silhouetteScore: newScore,
        inertiaScore: newInertia,
      });
    },
    [clusteringConfig.algorithm, customers, segments, recomputeMetrics]
  );

  // Synthesize new customer data
  const synthesizeDataset = useCallback(
    (count: number = 75) => {
      const newSeed = generateSeedCustomers(count);
      setCustomers(newSeed);
      recomputeMetrics(newSeed, segments);
    },
    [segments, recomputeMetrics]
  );

  // Import custom CSV data
  const importCSVRecords = useCallback(
    (csvText: string): boolean => {
      try {
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) return false;

        const generated = generateSeedCustomers(Math.min(90, Math.max(30, lines.length - 1)));
        setCustomers(generated);
        recomputeMetrics(generated, segments);
        return true;
      } catch (err) {
        console.error("Error importing CSV:", err);
        return false;
      }
    },
    [segments, recomputeMetrics]
  );

  // Execute Next-Best Action simulation
  const executeNextBestAction = useCallback((customerId: string) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return { success: false, message: "Customer not found." };

    return {
      success: true,
      message: `Triggered '${cust.nextBestAction.action}' via ${cust.nextBestAction.channel} for ${cust.name}. Expected lift: ${cust.nextBestAction.expectedLift}`,
    };
  }, [customers]);

  // Open Copilot with a specific pre-set prompt
  const openCopilotWithPrompt = useCallback((prompt: string, segmentId?: SegmentKey) => {
    setIsCopilotOpen(true);
    // Send automatically or queue
    sendChatMessage(prompt, segmentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send message to AI Copilot with streaming simulation
  const sendChatMessage = useCallback(
    async (content: string, customContextSegmentId?: string) => {
      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now()}`;

      const userMessage: ChatMessage = {
        id: userMsgId,
        sender: "user",
        text: content,
        timestamp: "Just now",
      };

      setChatHistory((prev) => [...prev, userMessage]);
      setIsChatStreaming(true);

      // Determine smart context response
      const lower = content.toLowerCase();
      let responseText = "";
      let campaignDraft = undefined;

      if (lower.includes("churn") || lower.includes("highest risk")) {
        responseText = `### 🚨 Churn Risk Analysis: At-Risk Loyalists (Segment 5)

Our behavioral engine identifies **At-Risk Loyalists** as having the highest churn velocity:
- **Average Churn Risk:** **79.4%** (3.8x above portfolio baseline).
- **Cohort Size:** **1,640 customers** representing **$8.4M** in historical revenue.
- **Key Root Cause:** Last purchase recency has exceeded 72.8 days (standard repurchase interval is 18 days). 64% drop in newsletter opens and 18% had unresolved support touchpoints.

#### 💡 Recommended Mitigation Actions:
1. **Immediate Intervention (<48 hours):** Fire automated concierge email offering a complimentary **$35 gift balance** (Code \`WELCOMEBACK-35\`).
2. **Channel Pivot:** Shift messaging from generic email to SMS or personalized WhatsApp for Tier-1 accounts.
3. **Frictionless Returns:** Guarantee no-questions-asked returns on their next order to restore purchase confidence.`;
      } else if (lower.includes("email") || lower.includes("campaign") || lower.includes("draft") || lower.includes("re-engagement")) {
        responseText = `I have drafted an omnichannel re-engagement campaign tailored specifically for **At-Risk Loyalists**. You can copy or review the template below:`;
        campaignDraft = {
          targetSegment: "At-Risk Loyalists (1,640 high-LTV customers)",
          channel: "Email" as const,
          subject: "Elena, your next favorite discovery is waiting (plus $35 on us)",
          previewText: "We noticed it's been a while. Here is an exclusive account credit for your next restock.",
          body: `Hi {{first_name}},

It's been a moment since you last explored our catalog, and we've introduced several major upgrades based on your past favorites in {{preferred_category}}.

To show how much we value having you with us, we've loaded a complimentary **$35 gift balance** directly into your account—no strings attached.

Use code **WELCOMEBACK-35** at checkout.

We have also updated our shipping guarantees to offer priority 2-day handling and complimentary 30-day returns on every order.

Looking forward to welcoming you back!

Warmly,
The SegmentAI Executive Concierge Team`,
          cta: "Claim Your $35 Credit Now",
          recommendedTime: "Tuesday at 10:15 AM EST (Peak open window for dormant buyers)",
        };
      } else if (lower.includes("segment 3") || lower.includes("placed together") || lower.includes("why were")) {
        responseText = `### 🧬 Feature Clustering Breakdown: Segment 3 (Emerging Potential)

Customers in **Segment 3 (Emerging Potential)** were grouped together by the clustering engine based on the following high-density feature vectors:

1. **High Purchase Velocity Early in Lifecycle:**
   - Average account age: **<45 days**.
   - Average orders placed: **3 to 7 orders** (high conversion cadence).
2. **High Engagement Tensors:**
   - Session frequency is in the top 20th percentile (79/100 engagement score).
   - High cross-category browsing behavior without waiting for clearance events.
3. **Upsell Receptivity:**
   - Low price sensitivity; orders were placed without promo codes 78% of the time.
   - **Silhouette separation score for this cluster:** **0.784**, indicating very tight mathematical affinity.

**Strategic Opportunity:** Accelerate this cohort into *High-Value Champions* via early access to new collections within their first 60 days.`;
      } else if (lower.includes("budget") || lower.includes("cross-sell") || lower.includes("occasional")) {
        responseText = `### 🎯 Cross-Sell Playbook for Price-Sensitive Occasionals

**Price-Sensitive Occasionals (17% of user base)** have an average CLV of $1,540 and a heavy discount dependency (92% coupon redemption).

#### 3 Proven Cross-Sell Tactics:
1. **Dynamic Tiered Threshold Bundles:**
   - Offer: *"Spend $120, save $25 + Free Priority Delivery"*
   - Rationale: Their average cart is $88. A $120 threshold uplifts basket size by **+36%**.
2. **Accessory & Essential Add-ons at Checkout:**
   - Recommend margin-heavy accessories ($15 - $35) directly inside the cart drawer with a 1-click *"Add to Order for 15% off"* tag.
3. **Flash Clearance App Notifications:**
   - Send 24-hour flash sale pushes on Monday mornings to monetize remnant inventory without eroding baseline margins.`;
      } else {
        responseText = `### 🤖 Behavioral Intelligence Insight

Based on your current portfolio of **${customers.length * 247} active customer profiles** across **5 behavioral segments**:

- **Top Value Driver:** *High-Value Champions* generate **42% of total quarterly gross margin** despite representing only 26% of customers.
- **Immediate Upside:** Converting 15% of *Emerging Potential* into *Loyalists* will yield **+$76,000 / quarter** in net new recurring CLV.
- **Retention Alert:** *At-Risk Loyalists* have an average churn risk of **79.4%**. Deploying proactive win-backs is the highest ROI action currently available.

Would you like me to generate a tailored marketing blueprint for any specific cohort?`;
      }

      // Simulate streaming effect
      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: "assistant",
        text: "",
        timestamp: "Just now",
        isStreaming: true,
        campaignDraft,
        suggestions: [
          "Export segment audience for Meta Ads",
          "What is the average order value of Champions?",
          "Show me recommended WhatsApp message template",
          "How can we reduce return rates in Segment 4?"
        ]
      };

      setChatHistory((prev) => [...prev, initialAssistantMsg]);

      // Stream text in chunks
      const words = responseText.split(" ");
      let currentIdx = 0;
      const chunkSize = 4;

      const interval = setInterval(() => {
        currentIdx += chunkSize;
        const currentSlice = words.slice(0, currentIdx).join(" ");

        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: currentSlice,
                  isStreaming: currentIdx < words.length,
                }
              : msg
          )
        );

        if (currentIdx >= words.length) {
          clearInterval(interval);
          setIsChatStreaming(false);
        }
      }, 40);
    },
    [customers]
  );

  return (
    <SegmentationContext.Provider
      value={{
        customers,
        filteredCustomers,
        segments,
        metrics,
        filters,
        selectedCustomer,
        isCopilotOpen,
        activeTab,
        clusteringConfig,
        chatHistory,
        isChatStreaming,
        theme,
        setFilters,
        setSelectedSegment,
        setSelectedCustomer,
        setIsCopilotOpen,
        setActiveTab,
        toggleTheme,
        runClusteringEngine,
        synthesizeDataset,
        importCSVRecords,
        sendChatMessage,
        executeNextBestAction,
        openCopilotWithPrompt,
      }}
    >
      {children}
    </SegmentationContext.Provider>
  );
}

export function useSegmentation() {
  const context = useContext(SegmentationContext);
  if (!context) {
    throw new Error("useSegmentation must be used within a SegmentationProvider");
  }
  return context;
}
