"use client";

import React from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { Header } from "@/components/Header";
import { SegmentDonutChart } from "@/components/dashboard/SegmentDonutChart";
import { BehavioralClusteringScatter } from "@/components/dashboard/BehavioralClusteringScatter";
import { RFMHeatmapMatrix } from "@/components/dashboard/RFMHeatmapMatrix";
import { ActionableSegmentCards } from "@/components/dashboard/ActionableSegmentCards";
import { SegmentRadarChart } from "@/components/dashboard/SegmentRadarChart";
import { CustomerProfilesTable } from "@/components/customers/CustomerProfilesTable";
import { CustomerDetailModal } from "@/components/customers/CustomerDetailModal";
import { DataIngestionPanel } from "@/components/ingestion/DataIngestionPanel";
import { CopilotDrawer } from "@/components/copilot/CopilotDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, ShieldCheck, Layers, Bot } from "lucide-react";

export default function Home() {
  const { activeTab, setActiveTab, openCopilotWithPrompt, filters, setSelectedSegment } = useSegmentation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sticky Top Header & Metrics Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Segment Filter Banner (When a segment is isolated) */}
        {filters.selectedSegment !== "all" && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-900 dark:text-blue-200">
                Currently isolating behavioral cohort:{" "}
                <strong className="underline decoration-blue-500 underline-offset-2">
                  {filters.selectedSegment.toUpperCase()}
                </strong>
                . Visualizations and customer lists are filtered.
              </span>
            </div>
            <button
              onClick={() => setSelectedSegment("all")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Reset to All Segments
            </button>
          </div>
        )}

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Row: Donut breakdown + 2D Clustering Scatter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 xl:col-span-4">
                <SegmentDonutChart />
              </div>
              <div className="lg:col-span-7 xl:col-span-8">
                <BehavioralClusteringScatter />
              </div>
            </div>

            {/* Middle Row: RFM Matrix + Radar Traits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 xl:col-span-8">
                <RFMHeatmapMatrix />
              </div>
              <div className="lg:col-span-5 xl:col-span-4">
                <SegmentRadarChart />
              </div>
            </div>

            {/* Actionable Segment Cards */}
            <ActionableSegmentCards />

            {/* Customer Profiles Table */}
            <CustomerProfilesTable />
          </div>
        )}

        {/* TAB 2: BEHAVIORAL CLUSTERING 2D/3D */}
        {activeTab === "clusters" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Layers className="h-5 w-5 text-indigo-500" />
                    High-Dimensional Customer Feature Space
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Interact directly with clustered points to inspect individual customer centroid affinities and churn vectors
                  </p>
                </div>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() =>
                    openCopilotWithPrompt(
                      "Explain the mathematical separation and centroid coordinates of our 5 clusters. Which cluster has the highest variance?"
                    )
                  }
                  className="text-xs gap-1.5"
                >
                  <Bot className="h-3.5 w-3.5" />
                  Analyze Cluster Separation in Copilot
                </Button>
              </div>

              <div className="h-[440px]">
                <BehavioralClusteringScatter />
              </div>
            </div>

            <ActionableSegmentCards />
          </div>
        )}

        {/* TAB 3: RFM HEATMAP MATRIX */}
        {activeTab === "rfm" && (
          <div className="space-y-6">
            <RFMHeatmapMatrix />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SegmentRadarChart />
              <SegmentDonutChart />
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER PROFILES */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <CustomerProfilesTable />
          </div>
        )}

        {/* TAB 5: DATA INGESTION & SYNTHESIS SIMULATION */}
        {activeTab === "ingestion" && (
          <div className="space-y-6">
            <DataIngestionPanel />
          </div>
        )}
      </main>

      {/* Customer Detail Inspector Modal / Sheet */}
      <CustomerDetailModal />

      {/* Embedded AI Copilot Assistant Drawer */}
      <CopilotDrawer />

      {/* Enterprise Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">SegmentAI Suite</span>
            <span>•</span>
            <span>Unsupervised Clustering Engine v2.4</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Enterprise SOC2 Type II
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Real-time Telemetry & Dynamic Ingestion Active
          </div>
        </div>
      </footer>
    </div>
  );
}
