"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
} from "recharts";
import { useSegmentation } from "@/context/SegmentationContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Network, Sparkles, Filter, UserCheck, Eye } from "lucide-react";
import { Customer } from "@/types/segmentation";

export function BehavioralClusteringScatter() {
  const {
    customers,
    segments,
    filters,
    setSelectedSegment,
    setSelectedCustomer,
    clusteringConfig,
  } = useSegmentation();

  const [axisMode, setAxisMode] = useState<"recency-monetary" | "frequency-monetary" | "churn-clv">("recency-monetary");

  // Map customers into coordinate items
  const plotData = customers.map((c) => {
    let x = c.recencyDays;
    let y = c.monetaryValue;
    let z = c.frequencyPurchases;

    if (axisMode === "frequency-monetary") {
      x = c.frequencyPurchases;
      y = c.monetaryValue;
      z = c.recencyDays;
    } else if (axisMode === "churn-clv") {
      x = c.churnScore;
      y = c.monetaryValue;
      z = c.rfmScore.composite;
    }

    const seg = segments.find((s) => s.id === c.segmentId);
    return {
      x,
      y,
      z,
      customer: c,
      segmentId: c.segmentId,
      segmentName: c.segmentName,
      color: seg?.color || "#3b82f6",
    };
  });

  const getAxisLabels = () => {
    switch (axisMode) {
      case "frequency-monetary":
        return {
          xLabel: "Frequency (Total Lifetime Purchases)",
          yLabel: "Monetary Value (CLV $)",
          xDomain: [0, 50],
          yDomain: [500, 15000],
        };
      case "churn-clv":
        return {
          xLabel: "Predicted Churn Probability (%)",
          yLabel: "Monetary Value (CLV $)",
          xDomain: [0, 100],
          yDomain: [500, 15000],
        };
      case "recency-monetary":
      default:
        return {
          xLabel: "Recency (Days Since Last Order)",
          yLabel: "Monetary Value (CLV $)",
          xDomain: [0, 100],
          yDomain: [500, 15000],
        };
    }
  };

  const { xLabel, yLabel, xDomain, yDomain } = getAxisLabels();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>2D/3D Behavioral Clustering Graph</CardTitle>
                <Badge variant="purple" className="text-[10px] px-1.5 py-0">
                  {clusteringConfig.algorithm}
                </Badge>
              </div>
              <CardDescription>
                Dimensionality-reduced vector space mapping customer affinity
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={axisMode}
              onChange={(e) => setAxisMode(e.target.value as any)}
              className="text-xs h-8"
              options={[
                { label: "Recency vs. CLV ($)", value: "recency-monetary" },
                { label: "Frequency vs. CLV ($)", value: "frequency-monetary" },
                { label: "Churn Risk (%) vs. CLV ($)", value: "churn-clv" },
              ]}
            />
            {filters.selectedSegment !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSegment("all")}
                className="h-8 text-xs text-blue-600 dark:text-blue-400 gap-1"
              >
                <Filter className="h-3 w-3" />
                Show All Clusters
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-1">
        {/* Scatter Chart Area */}
        <div className="h-72 sm:h-80 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 25, left: 20 }}
            >
              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                domain={xDomain}
                unit={axisMode === "churn-clv" ? "%" : axisMode === "recency-monetary" ? "d" : "x"}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                label={{
                  value: xLabel,
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 11,
                  fill: "#64748b",
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name={yLabel}
                domain={yDomain}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                  fill: "#64748b",
                }}
              />
              <ZAxis type="number" dataKey="z" range={[70, 320]} />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const cust: Customer = data.customer;
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-[220px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {cust.name}
                          </span>
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {cust.id} • {cust.region}
                        </div>
                        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Cohort:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {cust.segmentName}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">CLV:</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(cust.monetaryValue)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Recency / Freq:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {cust.recencyDays}d / {cust.frequencyPurchases} orders
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Churn Risk:</span>
                            <span
                              className={`font-semibold ${
                                cust.churnRisk === "High"
                                  ? "text-rose-500"
                                  : cust.churnRisk === "Medium"
                                  ? "text-amber-500"
                                  : "text-emerald-500"
                              }`}
                            >
                              {cust.churnRisk} ({cust.churnScore}%)
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 flex gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="flex-1 py-1 px-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="h-3 w-3" />
                            Inspect Profile
                          </button>
                          <button
                            onClick={() => setSelectedSegment(cust.segmentId)}
                            className="py-1 px-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium cursor-pointer transition-colors"
                          >
                            Filter Cluster
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Customers"
                data={plotData}
                cursor="pointer"
                onClick={(entry: any) => {
                  if (entry && (entry.customer || entry.payload?.customer)) {
                    const cust = entry.customer || entry.payload?.customer;
                    setSelectedSegment(cust.segmentId);
                  }
                }}
              >
                {plotData.map((entry, index) => {
                  const isMatchingFilter =
                    filters.selectedSegment === "all" ||
                    filters.selectedSegment === entry.segmentId;

                  return (
                    <Cell
                      key={`scatter-node-${index}`}
                      fill={entry.color}
                      opacity={isMatchingFilter ? 0.85 : 0.15}
                      stroke={isMatchingFilter ? entry.color : "transparent"}
                      strokeWidth={1.5}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Cluster Filter Pill Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 mr-1">Clusters:</span>
            {segments.map((seg) => {
              const isActive = filters.selectedSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    isActive
                      ? "ring-2 ring-blue-500/50 shadow-xs text-slate-900 dark:text-slate-100"
                      : "opacity-75 hover:opacity-100 text-slate-600 dark:text-slate-400"
                  }`}
                  style={{
                    backgroundColor: isActive ? `${seg.color}25` : "transparent",
                    borderColor: `${seg.color}50`,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span>{seg.name}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 hidden lg:block">
            💡 Click any cluster node to filter or inspect persona traits
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
