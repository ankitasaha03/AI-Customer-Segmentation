"use client";

import React from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import {
  Sparkles,
  Sun,
  Moon,
  Search,
  Users,
  Layers,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Bot,
  Database,
  Filter,
  BarChart3,
  Network,
  Grid3X3,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function Header() {
  const {
    metrics,
    filters,
    setFilters,
    theme,
    toggleTheme,
    isCopilotOpen,
    setIsCopilotOpen,
    activeTab,
    setActiveTab,
    runClusteringEngine,
    clusteringConfig,
  } = useSegmentation();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
      {/* Top Bar: Brand, Search, Global Filters, Actions */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 shadow-md shadow-blue-500/25">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 dark:from-white dark:via-blue-200 dark:to-slate-300 bg-clip-text text-transparent">
                  SegmentAI
                </span>
                <Badge variant="default" className="text-[10px] px-2 py-0 border-blue-400/30">
                  Suite v2.4
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Autonomous Customer Segmentation & Intelligence Platform
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search customers, categories, IDs..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-9 pr-14 text-xs h-9 bg-slate-100/70 dark:bg-slate-900/70 border-slate-200/80 dark:border-slate-800"
            />
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              ⌘K
            </kbd>
          </div>

          {/* Global Filter Selectors & Controls */}
          <div className="flex items-center gap-2">
            <Select
              className="hidden lg:inline-flex h-8 text-[11px]"
              value={filters.region}
              onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
              options={[
                { label: "🌐 All Regions", value: "All Regions" },
                { label: "🇺🇸 North America", value: "North America" },
                { label: "🇪🇺 EMEA", value: "EMEA" },
                { label: "🇯🇵 APAC", value: "APAC" },
                { label: "🇧🇷 LATAM", value: "LATAM" },
              ]}
            />

            <Select
              className="hidden sm:inline-flex h-8 text-[11px]"
              value={filters.dateRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
              options={[
                { label: "Last 30 Days", value: "Last 30 Days" },
                { label: "Last 90 Days", value: "Last 90 Days" },
                { label: "Current Fiscal Year", value: "Current Fiscal Year" },
                { label: "All Time", value: "All Time" },
              ]}
            />

            {/* AI Clustering simulation button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => runClusteringEngine()}
              disabled={clusteringConfig.status === "running"}
              className="h-8 gap-1.5 text-xs text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <RefreshCw
                className={`h-3 w-3 ${
                  clusteringConfig.status === "running" ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {clusteringConfig.status === "running" ? "Clustering..." : "Run AI Engine"}
              </span>
            </Button>

            {/* AI Copilot Drawer Trigger */}
            <Button
              variant={isCopilotOpen ? "glow" : "default"}
              size="sm"
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className="h-8 gap-1.5 text-xs font-semibold relative overflow-hidden"
            >
              <Bot className="h-3.5 w-3.5" />
              <span>Copilot</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </Button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Quick Metrics Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 py-3 border-t border-slate-100 dark:border-slate-900/80 text-xs">
          {/* Total Customers */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Customers</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {formatNumber(metrics.totalCustomers)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+6.8%</span>
              </div>
            </div>
          </div>

          {/* Discovered Segments */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Discovered Segments</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {metrics.discoveredSegments} Clusters
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Optimal K</span>
              </div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Active Campaigns</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {metrics.activeCampaigns} Live
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">94.2% delivery</span>
              </div>
            </div>
          </div>

          {/* Average CLV */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Customer LTV</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {formatCurrency(metrics.avgCLV)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  +{metrics.clvGrowthMoM}% MoM
                </span>
              </div>
            </div>
          </div>

          {/* Portfolio Churn Probability */}
          <div className="hidden lg:flex items-center gap-3 px-2 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg Churn Index</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {metrics.avgChurnProbability}%
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">-1.4% pts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto border-t border-slate-100 dark:border-slate-800/80 -mb-[1px] no-scrollbar">
          <nav className="flex space-x-1 sm:space-x-2 py-2">
            {[
              { id: "overview", label: "Executive Overview", icon: BarChart3 },
              { id: "clusters", label: "2D/3D Behavioral Clustering", icon: Network },
              { id: "rfm", label: "RFM Heatmap Matrix", icon: Grid3X3 },
              { id: "customers", label: "Customer Profiles", icon: Users },
              { id: "ingestion", label: "Data Ingestion & Simulation", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
