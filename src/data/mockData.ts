import { Customer, Segment, SegmentKey, MetricsSummary } from "@/types/segmentation";

export const INITIAL_SEGMENTS: Segment[] = [
  {
    id: "champions",
    name: "High-Value Champions",
    persona: "Tech-Forward Power Shoppers",
    description: "Your best customers who buy frequently, spend the most, and actively advocate for the brand.",
    color: "#10b981", // emerald
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    badgeText: "text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    customerCount: 3840,
    customerPercentage: 26,
    avgCLV: 6840,
    avgRecency: 6.2,
    avgFrequency: 24.8,
    avgChurnRisk: 8.4,
    traits: {
      loyalty: 96,
      spend: 94,
      frequency: 91,
      channelEngagement: 88,
      brandAdvocacy: 95,
    },
    keyIndicators: [
      "Average Order Value > $280",
      "Repeat purchase interval < 14 days",
      "Early adopter of new product drops",
      "Zero discount dependency"
    ],
    recommendedStrategy: "Enroll in exclusive tier-1 VIP Concierge. Offer sneak previews of beta product lines via WhatsApp or direct executive outreach.",
    campaignChannels: ["WhatsApp VIP", "Private Portal", "Exclusive Early Access"],
    estimatedRevenueOpportunity: "+$142,000 / quarter",
  },
  {
    id: "loyalists",
    name: "Loyal Enthusiasts",
    persona: "Consistent Brand Believers",
    description: "Reliable, recurring buyers with solid average order values and strong mobile app engagement.",
    color: "#3b82f6", // blue
    badgeBg: "bg-blue-500/10 dark:bg-blue-500/20",
    badgeText: "text-blue-700 dark:text-blue-400 border-blue-500/30",
    customerCount: 4210,
    customerPercentage: 28,
    avgCLV: 4320,
    avgRecency: 14.5,
    avgFrequency: 16.2,
    avgChurnRisk: 14.2,
    traits: {
      loyalty: 82,
      spend: 78,
      frequency: 80,
      channelEngagement: 86,
      brandAdvocacy: 74,
    },
    keyIndicators: [
      "Primarily mobile app checkout (>78%)",
      "Subscribes to brand push notifications",
      "Responds strongly to gamified loyalty rewards",
      "Steady quarterly spend pattern"
    ],
    recommendedStrategy: "Deliver milestone anniversary rewards, personalized category bundles, and double-loyalty points on their favorite product lines.",
    campaignChannels: ["Push Notifications", "In-App Banners", "Targeted SMS"],
    estimatedRevenueOpportunity: "+$98,500 / quarter",
  },
  {
    id: "potential",
    name: "Emerging Potential",
    persona: "High-Intent Newcomers",
    description: "Recent buyers who made 1-2 substantial purchases and show high web browsing engagement.",
    color: "#8b5cf6", // violet
    badgeBg: "bg-purple-500/10 dark:bg-purple-500/20",
    badgeText: "text-purple-700 dark:text-purple-400 border-purple-500/30",
    customerCount: 2650,
    customerPercentage: 18,
    avgCLV: 2890,
    avgRecency: 9.8,
    avgFrequency: 5.4,
    avgChurnRisk: 28.5,
    traits: {
      loyalty: 55,
      spend: 64,
      frequency: 48,
      channelEngagement: 79,
      brandAdvocacy: 50,
    },
    keyIndicators: [
      "Joined within the last 45 days",
      "High multi-category browser exploration",
      "High cart-to-purchase conversion speed",
      "Engages with tutorial and onboarding content"
    ],
    recommendedStrategy: "Trigger smart cross-sell nurturing sequence within 72 hours of first delivery. Introduce community benefits and second-order bonus incentives.",
    campaignChannels: ["Automated Email Onboarding", "Personalized SMS", "Retargeting Ads"],
    estimatedRevenueOpportunity: "+$76,000 / quarter",
  },
  {
    id: "occasional",
    name: "Price-Sensitive Occasionals",
    persona: "Bargain Hunters & Deal Seekers",
    description: "High volume of site visits during holiday sales and flash promotions, but purchase cadence drops without discounts.",
    color: "#f59e0b", // amber
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/20",
    badgeText: "text-amber-700 dark:text-amber-400 border-amber-500/30",
    customerCount: 2480,
    customerPercentage: 17,
    avgCLV: 1540,
    avgRecency: 38.4,
    avgFrequency: 4.1,
    avgChurnRisk: 42.1,
    traits: {
      loyalty: 35,
      spend: 38,
      frequency: 32,
      channelEngagement: 62,
      brandAdvocacy: 30,
    },
    keyIndicators: [
      "92% orders placed with promo or clearance code",
      "High cart abandonment without coupon popups",
      "Price comparison behavior detected",
      "Peak activity during Black Friday & Cyber Week"
    ],
    recommendedStrategy: "Target with dynamic bundle promotions, clear-out clearance alerts, and minimum-spend tier discounts to uplift basket size.",
    campaignChannels: ["Promotional Email Blast", "Browser Push Deal Alerts", "Instagram Retargeting"],
    estimatedRevenueOpportunity: "+$44,200 / quarter",
  },
  {
    id: "atrisk",
    name: "At-Risk Loyalists",
    persona: "Slipping High-Spenders",
    description: "Past regular or high-value shoppers who have gone silent for >60 days with rising churn velocity.",
    color: "#ef4444", // rose/red
    badgeBg: "bg-red-500/10 dark:bg-red-500/20",
    badgeText: "text-red-700 dark:text-red-400 border-red-500/30",
    customerCount: 1640,
    customerPercentage: 11,
    avgCLV: 5120,
    avgRecency: 72.8,
    avgFrequency: 11.8,
    avgChurnRisk: 79.4,
    traits: {
      loyalty: 40,
      spend: 70,
      frequency: 50,
      channelEngagement: 22,
      brandAdvocacy: 35,
    },
    keyIndicators: [
      "No transaction in >65 days (historic average: 18 days)",
      "Decreased email open rate by 64%",
      "Logged unresolved support ticket or return in last order",
      "High lifetime spend historically"
    ],
    recommendedStrategy: "Deploy high-priority 'We Miss You' win-back campaign with a no-strings-attached $35 gift credit, personalized survey, and free returns.",
    campaignChannels: ["Executive Win-Back Email", "Dedicated Concierge SMS", "Direct Mailer"],
    estimatedRevenueOpportunity: "+$115,000 / quarter (recoverable)",
  },
];

export const INITIAL_METRICS: MetricsSummary = {
  totalCustomers: 14820,
  discoveredSegments: 5,
  activeCampaigns: 18,
  avgCLV: 4290,
  clvGrowthMoM: 12.4,
  avgChurnProbability: 28.6,
};

const FIRST_NAMES = [
  "Elena", "Marcus", "Sophia", "Alexander", "Aaliyah", "Lucas", "Isabella", "Devon",
  "Chloe", "Mateo", "Priya", "Julian", "Fatima", "Ethan", "Zoe", "Kenji",
  "Camila", "Dante", "Nadia", "Liam", "Ava", "Noah", "Harper", "Rohan", "Maya"
];

const LAST_NAMES = [
  "Vance", "Sterling", "Chen", "Kowalski", "Patel", "Rodriguez", "Thorne", "Novak",
  "Abebe", "Sinclair", "Mercer", "Yamamoto", "Garrison", "Fontaine", "Dubois", "Al-Mansoor",
  "O'Connor", "Lindqvist", "Castillo", "Brennan", "Sato", "Moreau", "Kaufman", "Silva"
];

const CATEGORIES = [
  "Enterprise Electronics", "Sustainable Apparel", "Smart Home IoT", 
  "Luxury Timepieces", "Wellness & Ergonomics", "Gourmet Artisan"
];

const REGIONS: ("North America" | "EMEA" | "APAC" | "LATAM")[] = [
  "North America", "EMEA", "APAC", "LATAM"
];

const CHANNELS: ("Mobile App" | "Web Desktop" | "In-Store" | "Omni-channel")[] = [
  "Mobile App", "Web Desktop", "In-Store", "Omni-channel"
];

export function generateSeedCustomers(count: number = 60): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const fName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lName = LAST_NAMES[(i * 3 + 2) % LAST_NAMES.length];
    const idNum = 1000 + i * 17;
    const customerId = `CUST-${idNum}`;
    const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${idNum % 99}@example.com`;

    // Distribute across 5 segments
    let segmentId: SegmentKey;
    if (i % 5 === 0) segmentId = "champions";
    else if (i % 5 === 1) segmentId = "loyalists";
    else if (i % 5 === 2) segmentId = "potential";
    else if (i % 5 === 3) segmentId = "occasional";
    else segmentId = "atrisk";

    const segMeta = INITIAL_SEGMENTS.find(s => s.id === segmentId)!;
    const region = REGIONS[(i + 1) % REGIONS.length];
    const channel = CHANNELS[(i + 2) % CHANNELS.length];
    const category = CATEGORIES[i % CATEGORIES.length];

    let recencyDays = 5;
    let frequency = 20;
    let monetary = 5000;
    let churnScore = 10;
    let churnRisk: "Low" | "Medium" | "High" = "Low";
    let returnRate = 4.2;

    if (segmentId === "champions") {
      recencyDays = Math.floor(2 + (i % 8));
      frequency = Math.floor(18 + (i % 22));
      monetary = Math.floor(5200 + (i * 240));
      churnScore = Math.floor(4 + (i % 8));
      churnRisk = "Low";
      returnRate = Number((2.1 + (i % 4) * 0.5).toFixed(1));
    } else if (segmentId === "loyalists") {
      recencyDays = Math.floor(8 + (i % 14));
      frequency = Math.floor(12 + (i % 10));
      monetary = Math.floor(3400 + (i * 120));
      churnScore = Math.floor(10 + (i % 12));
      churnRisk = "Low";
      returnRate = Number((4.0 + (i % 5) * 0.4).toFixed(1));
    } else if (segmentId === "potential") {
      recencyDays = Math.floor(4 + (i % 12));
      frequency = Math.floor(3 + (i % 5));
      monetary = Math.floor(2100 + (i * 90));
      churnScore = Math.floor(22 + (i % 16));
      churnRisk = "Medium";
      returnRate = Number((5.5 + (i % 4) * 0.6).toFixed(1));
    } else if (segmentId === "occasional") {
      recencyDays = Math.floor(28 + (i % 30));
      frequency = Math.floor(2 + (i % 4));
      monetary = Math.floor(950 + (i * 45));
      churnScore = Math.floor(35 + (i % 25));
      churnRisk = "Medium";
      returnRate = Number((8.2 + (i % 6) * 0.8).toFixed(1));
    } else {
      // atrisk
      recencyDays = Math.floor(62 + (i % 35));
      frequency = Math.floor(8 + (i % 8));
      monetary = Math.floor(4200 + (i * 110));
      churnScore = Math.floor(70 + (i % 26));
      churnRisk = "High";
      returnRate = Number((12.4 + (i % 5) * 0.9).toFixed(1));
    }

    const rScore = Math.min(5, Math.max(1, Math.round(5 - (recencyDays / 20))));
    const fScore = Math.min(5, Math.max(1, Math.round(frequency / 5)));
    const mScore = Math.min(5, Math.max(1, Math.round(monetary / 1800)));
    const compositeRfm = Number(((rScore * 0.35) + (fScore * 0.35) + (mScore * 0.3)).toFixed(1));

    // Behavioral tags
    const behavioralTags = [
      channel,
      category,
      segmentId === "champions" ? "VIP Ambassador" :
      segmentId === "loyalists" ? "Weekly App Active" :
      segmentId === "potential" ? "Fast Converter" :
      segmentId === "occasional" ? "Flash Deal Sensitive" : "Dormant Spender",
      returnRate > 8 ? "Moderate Returns" : "Low Friction Returns"
    ];

    // AI generated summary
    let aiSummary = "";
    if (segmentId === "champions") {
      aiSummary = `${fName} is an elite Tier-1 brand champion with a lifetime spend of $${monetary.toLocaleString()}. Demonstrates exceptional affinity for ${category} with purchases typically occurring within 48 hours of product drops. Almost zero discount reliance.`;
    } else if (segmentId === "loyalists") {
      aiSummary = `${fName} is a stable repeat purchaser relying predominantly on ${channel}. Maintains consistent 18-day re-order cadences. Highly receptive to gamified tier progression and new feature announcements.`;
    } else if (segmentId === "potential") {
      aiSummary = `${fName} shows strong breakout indicators. Joined recently, made ${frequency} high-basket purchases, and frequently inspects high-margin add-ons in ${category}. Ready for personalized cross-sell acceleration.`;
    } else if (segmentId === "occasional") {
      aiSummary = `${fName} exhibits price-sensitive transactional behavior. Activity clusters heavily around holiday flash sales with 92% of orders tied to voucher codes. Average cart value surges by 40% when threshold free shipping is offered.`;
    } else {
      aiSummary = `${fName} is a former high-spender who has drifted into high churn danger (>60 days inactivity). Previously placed ${frequency} orders totaling $${monetary.toLocaleString()}. Urgent win-back sequence required before terminal churn.`;
    }

    // Next Best Action
    const nextBestAction = {
      action:
        segmentId === "champions" ? "Invite to Private Executive Advisory Board & Beta Hardware Drop" :
        segmentId === "loyalists" ? "Trigger 2x Reward Points Boost on Preferred Category" :
        segmentId === "potential" ? "Send Curated Bundle Recommendation with 10% First-Month Upgrade" :
        segmentId === "occasional" ? "Dispatch Limited-Time 48h Flash Code via SMS" :
        "Deploy Automated Win-Back Concierge Call + $35 Account Credit",
      expectedLift:
        segmentId === "champions" ? "+18.4% CLV Upside" :
        segmentId === "loyalists" ? "+14.2% Re-order Acceleration" :
        segmentId === "potential" ? "+26.8% LTV Conversion" :
        segmentId === "occasional" ? "+12.1% Basket Uplift" :
        "+41.5% Churn Mitigation Rate",
      channel:
        segmentId === "champions" ? "WhatsApp" as const :
        segmentId === "loyalists" ? "Push Notification" as const :
        segmentId === "potential" ? "Email" as const :
        segmentId === "occasional" ? "SMS" as const :
        "Email" as const,
      promoCode:
        segmentId === "occasional" ? "FLASH-TIER-20" :
        segmentId === "atrisk" ? "WELCOMEBACK-35" : undefined,
      urgency:
        segmentId === "atrisk" ? "Immediate" as const :
        segmentId === "potential" ? "High" as const :
        segmentId === "champions" ? "Medium" as const :
        "Low" as const
    };

    // Timeline events
    const timeline = [
      {
        id: `evt-${i}-1`,
        date: "2 days ago",
        type: segmentId === "atrisk" ? "page_view" as const : "purchase" as const,
        title: segmentId === "atrisk" ? "Viewed Cancellation & Return Policy" : `Completed Order #${8200 + i}`,
        detail: segmentId === "atrisk" ? "Browsed account settings and return FAQ for 4m 12s" : `Purchased 3 items in ${category}`,
        amount: segmentId === "atrisk" ? undefined : Math.round(monetary / frequency),
      },
      {
        id: `evt-${i}-2`,
        date: "8 days ago",
        type: "email_click" as const,
        title: "Engaged with 'Spring Innovations Preview'",
        detail: "Clicked through primary CTA link from newsletter (desktop client)",
      },
      {
        id: `evt-${i}-3`,
        date: "22 days ago",
        type: segmentId === "occasional" ? "cart_abandon" as const : "purchase" as const,
        title: segmentId === "occasional" ? "Abandoned Cart (Item Value: $240)" : "Restocked Seasonal Favorites",
        detail: segmentId === "occasional" ? "Exit triggered at checkout coupon verification step" : "Standard 2-day priority delivery",
        amount: segmentId === "occasional" ? undefined : 210,
      },
      {
        id: `evt-${i}-4`,
        date: "45 days ago",
        type: segmentId === "atrisk" ? "support_ticket" as const : "page_view" as const,
        title: segmentId === "atrisk" ? "Support Ticket #4910: Delayed Shipping" : "Product Category Deep Dive",
        detail: segmentId === "atrisk" ? "Customer reported 4-day carrier delay; resolved with $15 voucher" : "Inspected 8 product spec sheets",
      }
    ];

    customers.push({
      id: customerId,
      name: `${fName} ${lName}`,
      email,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 987654) % 100000000}?auto=format&fit=crop&w=150&q=80`,
      segmentId,
      segmentName: segMeta.name,
      recencyDays,
      frequencyPurchases: frequency,
      monetaryValue: monetary,
      rfmScore: {
        r: rScore,
        f: fScore,
        m: mScore,
        composite: compositeRfm,
      },
      churnRisk,
      churnScore,
      channel,
      preferredCategory: category,
      returnRate,
      region,
      joinedDate: `2024-0${1 + (i % 9)}-${10 + (i % 18)}`,
      lastActive: `${recencyDays} days ago`,
      behavioralTags,
      aiSummary,
      nextBestAction,
      timeline,
    });
  }

  return customers;
}

export const INITIAL_CUSTOMERS = generateSeedCustomers(65);

// RFM Matrix 5x5 data builder for Heatmap
export interface RFMCell {
  recency: number; // 1 to 5
  monetaryFreq: number; // 1 to 5
  customerCount: number;
  dominantSegment: SegmentKey;
  label: string;
  avgCLV: number;
}

export function computeRFMMatrix(customers: Customer[]): RFMCell[] {
  const matrix: RFMCell[] = [];

  for (let r = 1; r <= 5; r++) {
    for (let mf = 1; mf <= 5; mf++) {
      // Find matching customers where r matches and average of f and m matches mf
      const matching = customers.filter(c => {
        const avgMf = Math.round((c.rfmScore.f + c.rfmScore.m) / 2);
        return c.rfmScore.r === r && avgMf === mf;
      });

      let dominantSegment: SegmentKey = "occasional";
      if (r >= 4 && mf >= 4) dominantSegment = "champions";
      else if (r >= 3 && mf >= 3) dominantSegment = "loyalists";
      else if (r >= 3 && mf <= 2) dominantSegment = "potential";
      else if (r <= 2 && mf >= 3) dominantSegment = "atrisk";
      else dominantSegment = "occasional";

      let label = "Dormant / Low Value";
      if (r >= 4 && mf >= 4) label = "Champions";
      else if (r >= 3 && mf >= 4) label = "Loyal High Spenders";
      else if (r >= 4 && mf <= 2) label = "New Promising Leads";
      else if (r <= 2 && mf >= 4) label = "Can't Lose Them (At Risk)";
      else if (r <= 2 && mf <= 2) label = "Hibernating Bargain Seekers";
      else label = "Developing Potential";

      const totalCLV = matching.reduce((sum, c) => sum + c.monetaryValue, 0);
      const avgCLV = matching.length > 0 ? Math.round(totalCLV / matching.length) : (r * mf * 280);

      matrix.push({
        recency: r,
        monetaryFreq: mf,
        customerCount: matching.length > 0 ? matching.length * 52 : Math.floor(18 + (r * mf * 9)),
        dominantSegment,
        label,
        avgCLV,
      });
    }
  }

  return matrix;
}
