"use client";

import React, { useMemo, useState } from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import { computeRFMMatrix, RFMCell } from "@/data/mockData";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Grid3X3, ArrowUpRight, Sparkles, Filter, Info } from "lucide-react";

export function RFMHeatmapMatrix() {
  const { customers, segments, filters, setSelectedSegment } = useSegmentation();
  const [selectedCell, setSelectedCell] = useState<RFMCell | null>(null);

  const matrix = useMemo(() => computeRFMMatrix(customers), [customers]);

  // Max count for heat scaling
  const maxCount = useMemo(() => {
    return Math.max(...matrix.map((c) => c.customerCount), 1);
  }, [matrix]);

  // Color generator based on dominant segment and density
  const getCellBg = (cell: RFMCell) => {
    const seg = segments.find((s) => s.id === cell.dominantSegment);
    const color = seg?.color || "#3b82f6";
    const intensity = Math.min(0.9, Math.max(0.18, cell.customerCount / maxCount));

    return {
      backgroundColor: `${color}${Math.round(intensity * 255).toString(16).padStart(2, "0")}`,
      borderColor: `${color}60`,
    };
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Grid3X3 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>RFM Behavioral Heatmap Matrix</CardTitle>
              <CardDescription>
                5×5 segmentation tensor: Recency (X) vs. Monetary & Frequency Density (Y)
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400">Heat Intensity:</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">Low</span>
              <div className="h-2 w-16 rounded bg-gradient-to-r from-blue-500/20 via-emerald-500/60 to-emerald-500" />
              <span className="text-[10px] text-slate-400">High</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Heatmap Grid (5x5) */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-8">
              <span>Recency: R-1 (Dormant &gt;60d)</span>
              <span>R-3 (30d)</span>
              <span>R-5 (Very Recent &lt;7d) →</span>
            </div>

            <div className="flex items-start gap-2">
              {/* Y-Axis Label */}
              <div className="flex flex-col justify-between h-64 py-2 text-[10px] text-slate-400 font-medium text-right w-16 shrink-0">
                <span>MF-5 (Top)</span>
                <span>MF-4</span>
                <span>MF-3</span>
                <span>MF-2</span>
                <span>MF-1 (Low)</span>
              </div>

              {/* Grid 5x5 */}
              <div className="flex-1 grid grid-cols-5 gap-1.5 h-64">
                {[5, 4, 3, 2, 1].map((mf) =>
                  [1, 2, 3, 4, 5].map((r) => {
                    const cell = matrix.find((c) => c.recency === r && c.monetaryFreq === mf);
                    if (!cell) return null;

                    const isCurrentCellSelected =
                      selectedCell?.recency === r && selectedCell?.monetaryFreq === mf;
                    const isDominantMatch =
                      filters.selectedSegment === "all" ||
                      filters.selectedSegment === cell.dominantSegment;

                    const style = getCellBg(cell);

                    return (
                      <button
                        key={`cell-${r}-${mf}`}
                        onClick={() => {
                          setSelectedCell(cell);
                          setSelectedSegment(cell.dominantSegment);
                        }}
                        style={style}
                        className={`group relative rounded-lg border p-1 flex flex-col justify-between transition-all duration-150 cursor-pointer text-left ${
                          isCurrentCellSelected
                            ? "ring-2 ring-white shadow-lg scale-102 z-10"
                            : "hover:scale-102 hover:shadow-md"
                        } ${!isDominantMatch ? "opacity-30" : "opacity-100"}`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-900 dark:text-slate-100">
                          <span>
                            R{r}:M{mf}
                          </span>
                          <span className="font-semibold">{cell.customerCount}</span>
                        </div>
                        <div className="truncate text-[10px] font-medium text-slate-950 dark:text-slate-50 leading-tight">
                          {cell.label}
                        </div>
                        <div className="text-[9px] text-slate-700 dark:text-slate-300 font-mono">
                          {formatCurrency(cell.avgCLV)}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400">
              Horizontal: Recency Score (1-5) • Vertical: Combined Frequency & Monetary Score (1-5)
            </div>
          </div>

          {/* Right Column: Selected Cell Deep Dive & Strategic Action */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cohort Cell Inspector
              </span>
              {selectedCell ? (
                <Badge variant="purple" className="text-[10px]">
                  R{selectedCell.recency} : MF{selectedCell.monetaryFreq}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Hover or Click a Cell
                </Badge>
              )}
            </div>

            {selectedCell ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {selectedCell.label}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dominant Segment:{" "}
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {segments.find((s) => s.id === selectedCell.dominantSegment)?.name}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Est. Cohort Volume</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatNumber(selectedCell.customerCount)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Average CLV</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(selectedCell.avgCLV)}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <span className="font-semibold flex items-center gap-1 text-[11px]">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    AI Retention Strategy:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {selectedCell.recency >= 4 && selectedCell.monetaryFreq >= 4
                      ? "High-value VIPs: Trigger personalized concierge perks and VIP sneak peeks."
                      : selectedCell.recency <= 2 && selectedCell.monetaryFreq >= 3
                      ? "High-value slipping: Urgent win-back campaign with $35 voucher before terminal churn."
                      : selectedCell.recency >= 4 && selectedCell.monetaryFreq <= 2
                      ? "Promising fresh leads: Deploy second-purchase nurture sequence within 72h."
                      : "Dormant / Low margin: Automated reactivation newsletter with threshold free shipping."}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSegment(selectedCell.dominantSegment)}
                  className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter Dashboard to this Cohort
                </button>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                <Info className="h-6 w-6 mx-auto opacity-50" />
                <p>Click any matrix box to inspect customer density, average revenue, and AI recommendation.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
