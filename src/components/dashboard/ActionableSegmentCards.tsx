"use client";

import React from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Sparkles,
  Bot,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { Segment } from "@/types/segmentation";

export function ActionableSegmentCards() {
  const {
    segments,
    filters,
    setSelectedSegment,
    setActiveTab,
    openCopilotWithPrompt,
  } = useSegmentation();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Actionable Segment Profiles & Autonomous Strategies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time behavioral insights synthesized by the segmentation intelligence engine
          </p>
        </div>
        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
          5 Machine-Learned Cohorts
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {segments.map((segment) => {
          const isSelected = filters.selectedSegment === segment.id;
          const churnColor =
            segment.avgChurnRisk > 50
              ? "text-rose-600 bg-rose-500/10 border-rose-500/30"
              : segment.avgChurnRisk > 20
              ? "text-amber-600 bg-amber-500/10 border-amber-500/30"
              : "text-emerald-600 bg-emerald-500/10 border-emerald-500/30";

          return (
            <Card
              key={segment.id}
              className={`flex flex-col justify-between transition-all duration-200 border-t-4 ${
                isSelected
                  ? "ring-2 ring-blue-500/80 shadow-lg scale-101"
                  : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
              }`}
              style={{ borderTopColor: segment.color }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono px-2 py-0"
                    style={{ color: segment.color, borderColor: `${segment.color}40` }}
                  >
                    {segment.customerPercentage}% of Base
                  </Badge>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${churnColor}`}
                  >
                    {segment.avgChurnRisk}% Churn Risk
                  </span>
                </div>

                <div className="pt-1">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="truncate">{segment.name}</span>
                  </CardTitle>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Persona: <span className="text-slate-800 dark:text-slate-200">{segment.persona}</span>
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs pt-0">
                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2 text-slate-600 dark:text-slate-300 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg CLV</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(segment.avgCLV)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Recency</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {segment.avgRecency} days
                    </span>
                  </div>
                </div>

                {/* Key Behavioral Indicators */}
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Behavioral Indicators
                  </span>
                  <ul className="space-y-1">
                    {segment.keyIndicators.slice(0, 3).map((ind, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-snug"
                      >
                        <CheckCircle2
                          className="h-3 w-3 shrink-0 mt-0.5"
                          style={{ color: segment.color }}
                        />
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended AI Strategy Callout */}
                <div className="rounded-lg p-2.5 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span>AI Marketing Strategy</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {segment.recommendedStrategy}
                  </p>
                </div>

                {/* Revenue Opportunity */}
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Upside Opportunity:</span>
                  <span>{segment.estimatedRevenueOpportunity}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-3 flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800/80">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    openCopilotWithPrompt(
                      `Generate a high-converting campaign blueprint targeting ${segment.name} (${segment.persona}). What channels and incentives will maximize ROI?`,
                      segment.id
                    )
                  }
                  className="w-full h-8 text-xs font-semibold gap-1.5"
                >
                  <Bot className="h-3.5 w-3.5" />
                  Target with AI Copilot
                </Button>

                <div className="grid grid-cols-2 gap-1.5 w-full">
                  <button
                    onClick={() => setSelectedSegment(segment.id)}
                    className="py-1 px-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer text-center"
                  >
                    {isSelected ? "Clear Filter" : "Filter Cards"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSegment(segment.id);
                      setActiveTab("customers");
                    }}
                    className="py-1 px-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
