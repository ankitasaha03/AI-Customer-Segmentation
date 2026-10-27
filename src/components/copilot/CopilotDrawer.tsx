"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { Sheet, SheetHeader, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  MessageSquare,
  HelpCircle,
  Mail,
  Zap,
} from "lucide-react";

export function CopilotDrawer() {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    chatHistory,
    isChatStreaming,
    sendChatMessage,
    filters,
    selectedCustomer,
    segments,
  } = useSegmentation();

  const [inputMessage, setInputMessage] = useState("");
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultSuggestions = [
    "Which segment has the highest risk of churn?",
    "Draft a re-engagement email campaign for At-Risk Customers.",
    "Why were customers in Segment 3 placed together?",
    "Suggest cross-sell strategies for Budget Seekers.",
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isChatStreaming]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isChatStreaming) return;
    sendChatMessage(text);
    setInputMessage("");
  };

  const copyCampaignToClipboard = (campaign: any, msgId: string) => {
    const copyText = `Subject: ${campaign.subject}
Channel: ${campaign.channel}
Target: ${campaign.targetSegment}
Recommended Send Window: ${campaign.recommendedTime}

--- PREVIEW TEXT ---
${campaign.previewText}

--- MESSAGE BODY ---
${campaign.body}

--- CTA ---
${campaign.cta}`;

    navigator.clipboard.writeText(copyText);
    setCopiedDraftId(msgId);
    setTimeout(() => setCopiedDraftId(null), 3000);
  };

  return (
    <>
      {/* Floating Action Button (Always available in bottom-right) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-white shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-semibold tracking-wide">SegmentAI Copilot</span>
        </button>
      )}

      {/* Slide-over Drawer / Sheet */}
      <Sheet
        open={isCopilotOpen}
        onOpenChange={setIsCopilotOpen}
        width="max-w-md sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader onClose={() => setIsCopilotOpen(false)}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  SegmentAI Copilot
                </h3>
                <Badge variant="purple" className="text-[10px] px-1.5 py-0">
                  v2.4 Autonomous
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Context-aware campaign generator & behavioral strategist
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Body (Chat message log) */}
        <SheetBody className="space-y-4 py-4">
          {/* Active Context Banner */}
          <div className="rounded-lg bg-slate-100/70 dark:bg-slate-800/60 p-2 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="h-3 w-3 text-blue-500 shrink-0" />
              <span className="truncate">
                Active Scope:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {filters.selectedSegment === "all"
                    ? "Global Portfolio (5 Segments)"
                    : segments.find((s) => s.id === filters.selectedSegment)?.name}
                </strong>
                {selectedCustomer && ` • Customer: ${selectedCustomer.name}`}
              </span>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Suggested Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {defaultSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  disabled={isChatStreaming}
                  className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left cursor-pointer disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Message Stream */}
          <div className="space-y-4 pt-2">
            {chatHistory.map((msg) => {
              const isAssistant = msg.sender === "assistant";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isAssistant ? "items-start" : "items-end"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[92%] shadow-xs ${
                      isAssistant
                        ? "bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
                        : "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    }`}
                  >
                    {/* Text content with markdown formatting handling */}
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.text || (msg.isStreaming && "Thinking & querying behavioral tensors...")}
                    </div>

                    {/* Campaign Draft Card if attached */}
                    {msg.campaignDraft && (
                      <div className="mt-3 rounded-xl border border-blue-300 dark:border-blue-900 bg-white/90 dark:bg-slate-900/90 p-3.5 space-y-2 text-slate-900 dark:text-slate-100">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="font-bold text-xs">
                              {msg.campaignDraft.channel} Campaign Draft
                            </span>
                          </div>
                          <button
                            onClick={() => copyCampaignToClipboard(msg.campaignDraft, msg.id)}
                            className="flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedDraftId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy Campaign</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <p>
                            <span className="text-slate-400">Target:</span>{" "}
                            <strong>{msg.campaignDraft.targetSegment}</strong>
                          </p>
                          <p>
                            <span className="text-slate-400">Subject:</span>{" "}
                            <strong>{msg.campaignDraft.subject}</strong>
                          </p>
                          <p>
                            <span className="text-slate-400">Preview:</span>{" "}
                            <span className="italic">{msg.campaignDraft.previewText}</span>
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 text-[11px] font-sans text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-800 whitespace-pre-wrap">
                          {msg.campaignDraft.body}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>
                            CTA: <strong className="text-blue-600 dark:text-blue-400">{msg.campaignDraft.cta}</strong>
                          </span>
                          <span>{msg.campaignDraft.recommendedTime}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message timestamp */}
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </SheetBody>

        {/* Footer (Chat input box) */}
        <SheetFooter className="p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 w-full"
          >
            <Input
              type="text"
              placeholder="Ask Copilot about churn, cohorts, or generate ad copy..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isChatStreaming}
              className="text-xs h-10 flex-1"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputMessage.trim() || isChatStreaming}
              className="h-10 px-3.5 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </SheetFooter>
      </Sheet>
    </>
  );
}
