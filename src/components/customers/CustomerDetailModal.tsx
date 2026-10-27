"use client";

import React, { useState } from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { Sheet, SheetHeader, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Sparkles,
  Bot,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Zap,
  ArrowRight,
  TrendingUp,
  Tag,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export function CustomerDetailModal() {
  const {
    selectedCustomer,
    setSelectedCustomer,
    segments,
    openCopilotWithPrompt,
    executeNextBestAction,
  } = useSegmentation();

  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  if (!selectedCustomer) return null;

  const segment = segments.find((s) => s.id === selectedCustomer.segmentId);

  const handleExecuteAction = () => {
    const result = executeNextBestAction(selectedCustomer.id);
    setActionSuccessNotice(result.message);
    setTimeout(() => {
      setActionSuccessNotice(null);
    }, 4000);
  };

  const churnColor =
    selectedCustomer.churnRisk === "High"
      ? "text-rose-600 bg-rose-500/10 border-rose-500/30"
      : selectedCustomer.churnRisk === "Medium"
      ? "text-amber-600 bg-amber-500/10 border-amber-500/30"
      : "text-emerald-600 bg-emerald-500/10 border-emerald-500/30";

  return (
    <Sheet
      open={Boolean(selectedCustomer)}
      onOpenChange={(open) => !open && setSelectedCustomer(null)}
      width="max-w-xl"
    >
      <SheetHeader onClose={() => setSelectedCustomer(null)}>
        <div className="flex items-center gap-3">
          <Avatar
            src={selectedCustomer.avatar}
            fallback={selectedCustomer.name}
            size="lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedCustomer.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[10px]"
                style={{
                  color: segment?.color,
                  borderColor: `${segment?.color}50`,
                  backgroundColor: `${segment?.color}15`,
                }}
              >
                {selectedCustomer.segmentName}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCustomer.id} • {selectedCustomer.email}
            </p>
          </div>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-5">
        {/* Success toast notification */}
        {actionSuccessNotice && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
            <span>{actionSuccessNotice}</span>
          </div>
        )}

        {/* Quick Attribute Tags Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300 text-[11px]">
            <MapPin className="h-3 w-3 text-slate-400" />
            {selectedCustomer.region}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300 text-[11px]">
            <ShoppingBag className="h-3 w-3 text-slate-400" />
            {selectedCustomer.channel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-600 dark:text-slate-300 text-[11px]">
            <Clock className="h-3 w-3 text-slate-400" />
            Active {selectedCustomer.lastActive}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium ${churnColor}`}>
            <AlertTriangle className="h-3 w-3" />
            {selectedCustomer.churnRisk} Churn ({selectedCustomer.churnScore}%)
          </span>
        </div>

        {/* RFM Score breakdown */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
              RFM Vector Score: {selectedCustomer.rfmScore.composite} / 5.0
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Composite Quintile
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Recency */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Recency Score</span>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedCustomer.rfmScore.r} <span className="text-xs font-normal text-slate-400">/ 5</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {selectedCustomer.recencyDays}d ago
              </span>
            </div>

            {/* Frequency */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Frequency Score</span>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedCustomer.rfmScore.f} <span className="text-xs font-normal text-slate-400">/ 5</span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                {selectedCustomer.frequencyPurchases} orders
              </span>
            </div>

            {/* Monetary */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] text-slate-400 block font-medium">Monetary Score</span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {selectedCustomer.rfmScore.m} <span className="text-xs font-normal text-slate-400">/ 5</span>
              </div>
              <span className="text-[10px] text-slate-500 block font-semibold">
                {formatCurrency(selectedCustomer.monetaryValue)}
              </span>
            </div>
          </div>
        </div>

        {/* AI Behavioral Profile Synthesis */}
        <div className="rounded-xl border border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI-Synthesized Behavioral Persona</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {selectedCustomer.aiSummary}
          </p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            {selectedCustomer.behavioralTags.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-[10px] font-medium">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommended Next-Best Action (NBA) */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-blue-500" />
              Prescriptive Next-Best Action (NBA)
            </span>
            <Badge variant="default" className="text-[10px]">
              {selectedCustomer.nextBestAction.urgency} Urgency
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {selectedCustomer.nextBestAction.action}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
              <span>Channel: <strong className="text-slate-800 dark:text-slate-200">{selectedCustomer.nextBestAction.channel}</strong></span>
              <span>•</span>
              <span>Expected Lift: <strong className="text-emerald-600 dark:text-emerald-400">{selectedCustomer.nextBestAction.expectedLift}</strong></span>
            </div>
            {selectedCustomer.nextBestAction.promoCode && (
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 mr-1.5">Attached Voucher:</span>
                <code className="rounded bg-slate-200/80 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                  {selectedCustomer.nextBestAction.promoCode}
                </code>
              </div>
            )}
          </div>

          <div className="pt-1 flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleExecuteAction}
              className="flex-1 h-8 text-xs font-medium gap-1.5"
            >
              <Zap className="h-3 w-3" />
              Trigger Action Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                openCopilotWithPrompt(
                  `Draft a tailored ${selectedCustomer.nextBestAction.channel} outreach message for ${selectedCustomer.name} (${selectedCustomer.segmentName}) regarding '${selectedCustomer.nextBestAction.action}'. Include promo code ${selectedCustomer.nextBestAction.promoCode || 'PERK-EXCLUSIVE'}.`
                )
              }
              className="h-8 text-xs font-medium gap-1 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60"
            >
              <Bot className="h-3 w-3" />
              Draft in Copilot
            </Button>
          </div>
        </div>

        {/* Historical Purchase Timeline & Event Stream */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            Behavioral Touchpoint Timeline
          </h4>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {selectedCustomer.timeline.map((evt) => (
              <div key={evt.id} className="relative group text-xs">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 group-hover:scale-110 transition-transform" />
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>{evt.date}</span>
                  <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0 font-mono">
                    {evt.type.replace("_", " ")}
                  </Badge>
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {evt.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {evt.detail}
                </p>
                {evt.amount && (
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                    Order Value: {formatCurrency(evt.amount)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetBody>

      <SheetFooter>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCustomer(null)}
          className="text-xs"
        >
          Close Inspector
        </Button>
      </SheetFooter>
    </Sheet>
  );
}
