"use client";

import React, { useState } from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { formatNumber, formatCurrency } from "@/lib/utils";
import {
  Upload,
  Database,
  Cpu,
  Sparkles,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertCircle,
  Play,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ClusteringModelConfig } from "@/types/segmentation";

export function DataIngestionPanel() {
  const {
    customers,
    clusteringConfig,
    runClusteringEngine,
    synthesizeDataset,
    importCSVRecords,
    setActiveTab,
  } = useSegmentation();

  const [selectedAlgo, setSelectedAlgo] = useState<ClusteringModelConfig["algorithm"]>(
    clusteringConfig.algorithm
  );
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const success = importCSVRecords(text);
      if (success) {
        setCsvUploadSuccess(`Successfully ingested & processed ${file.name}`);
        setCsvError(null);
        setTimeout(() => setCsvUploadSuccess(null), 4000);
      } else {
        setCsvError("Invalid CSV format. Please ensure valid row structure.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            Data Ingestion & Behavioral Clustering Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ingest event logs, simulate synthetic transaction streams, and execute unsupervised clustering
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => synthesizeDataset(75)}
            className="text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Synthesize 75 Customer Records
          </Button>
          <Button
            variant="glow"
            size="sm"
            onClick={() => runClusteringEngine(selectedAlgo)}
            disabled={clusteringConfig.status === "running"}
            className="text-xs gap-1.5"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Run Clustering Pipeline</span>
          </Button>
        </div>
      </div>

      {/* Grid: Ingestion & Model Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Data Ingestion (Upload & Synthesis) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-500" />
                Raw Data Ingestion Portal
              </CardTitle>
              <CardDescription>
                Upload CSV transaction streams or trigger autonomous synthetic generator
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40"
                }`}
                onClick={() => {
                  const input = document.getElementById("csv-file-input") as HTMLInputElement;
                  input?.click();
                }}
              >
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Drop CSV customer transactional file here, or browse
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Accepts columns: customer_id, recency, order_count, monetary_val, channels, ticket_history
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] mt-1">
                    Supports up to 50MB CSV/JSON
                  </Badge>
                </div>
              </div>

              {/* Status alerts */}
              {csvUploadSuccess && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{csvUploadSuccess}</span>
                </div>
              )}
              {csvError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{csvError}</span>
                </div>
              )}

              {/* Data Synthesis Card */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Simulate Behavioral Clickstream & Support Logs
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Continuous Generator
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Synthesize realistic multi-touch journey vectors: checkout drop-offs, WhatsApp customer support escalations, and category browses.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => synthesizeDataset(50)}
                    className="flex-1 text-xs"
                  >
                    Generate 50 Profiles
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => synthesizeDataset(100)}
                    className="flex-1 text-xs"
                  >
                    Generate 100 Profiles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Clustering Pipeline & Engine Diagnostics */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-500" />
                    Unsupervised Clustering Pipeline
                  </CardTitle>
                  <CardDescription>
                    Configure mathematical partition hyper-parameters
                  </CardDescription>
                </div>
                <Badge
                  variant={clusteringConfig.status === "running" ? "purple" : "success"}
                  className="text-[10px]"
                >
                  {clusteringConfig.status === "running" ? "Converging..." : "Model Converged"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-1">
              {/* Algorithm Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Clustering Algorithm
                  </label>
                  <Select
                    value={selectedAlgo}
                    onChange={(e) => setSelectedAlgo(e.target.value as any)}
                    className="w-full text-xs"
                    options={[
                      { label: "K-Means++ (Optimal Centroids)", value: "K-Means++" },
                      { label: "DBSCAN (Density-Based)", value: "DBSCAN (Density-Based)" },
                      { label: "Hierarchical Ward", value: "Hierarchical Ward" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    Target Clusters (k)
                  </label>
                  <div className="h-9 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-semibold flex items-center justify-between text-slate-900 dark:text-slate-100">
                    <span>5 Cohorts</span>
                    <span className="text-[10px] text-slate-400">(Auto Silhouette Max)</span>
                  </div>
                </div>
              </div>

              {/* Progress & Live Pipeline Step */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-blue-500" />
                    Pipeline Status:
                  </span>
                  <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    {clusteringConfig.progress}%
                  </span>
                </div>

                <Progress
                  value={clusteringConfig.progress}
                  indicatorColor={
                    clusteringConfig.status === "running"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-emerald-500"
                  }
                />

                <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-black/5 dark:bg-black/30 p-2 rounded-md">
                  &gt; {clusteringConfig.currentStep || "Model idle. Ready to execute."}
                </p>
              </div>

              {/* Model Diagnostics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Silhouette Score</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {clusteringConfig.silhouetteScore}
                  </span>
                  <span className="text-[9px] text-slate-400 block">High separation</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Inertia Sum</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {clusteringConfig.inertiaScore}
                  </span>
                  <span className="text-[9px] text-slate-400 block">Sum of sq. dist</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Inference Time</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {clusteringConfig.executionTimeMs} ms
                  </span>
                  <span className="text-[9px] text-slate-400 block">Sub-second</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[10px] text-slate-400 block">Feature Tensors</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    5 Dimensions
                  </span>
                  <span className="text-[9px] text-slate-400 block">Normalized</span>
                </div>
              </div>

              {/* Run Button */}
              <Button
                variant="default"
                onClick={() => runClusteringEngine(selectedAlgo)}
                disabled={clusteringConfig.status === "running"}
                className="w-full h-9 text-xs font-semibold gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    clusteringConfig.status === "running" ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {clusteringConfig.status === "running"
                    ? "Running Mathematical Clustering..."
                    : `Execute ${selectedAlgo} on ${customers.length} Profiles`}
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Transaction & Behavioral Event Stream Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                Live Ingested Event & Behavioral Stream Sample
              </CardTitle>
              <CardDescription>
                Real-time records streaming into SegmentAI feature vectorizer
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("customers")}
              className="text-xs gap-1"
            >
              <span>View In Full Table</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Assigned Cohort</th>
                  <th className="p-3">Recency</th>
                  <th className="p-3">Monetary Value</th>
                  <th className="p-3">Return Rate</th>
                  <th className="p-3">Primary Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.slice(0, 8).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {c.name} ({c.id})
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 font-mono text-[10px]">
                        ORDER_FULFILLED
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {c.segmentName}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{c.recencyDays}d ago</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(c.monetaryValue)}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{c.returnRate}%</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{c.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
