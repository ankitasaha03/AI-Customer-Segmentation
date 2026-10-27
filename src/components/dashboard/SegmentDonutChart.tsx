"use client";

import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSegmentation } from "@/context/SegmentationContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Filter, PieChart as PieIcon, Info } from "lucide-react";

export function SegmentDonutChart() {
  const { segments, filters, setSelectedSegment } = useSegmentation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = segments.map((seg) => ({
    id: seg.id,
    name: seg.name,
    value: seg.customerCount,
    percentage: seg.customerPercentage,
    avgCLV: seg.avgCLV,
    color: seg.color,
  }));

  const activeSegmentData = activeIndex !== null ? data[activeIndex] : null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <PieIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Segment Distribution</CardTitle>
              <CardDescription>Customer breakdown by algorithmic clustering</CardDescription>
            </div>
          </div>
          {filters.selectedSegment !== "all" && (
            <button
              onClick={() => setSelectedSegment("all")}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Filter className="h-3 w-3" />
              Reset filter
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        {/* Donut Chart with Centered Insight */}
        <div className="relative h-56 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full inline-block"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          Customers: <span className="font-medium text-slate-900 dark:text-slate-200">{formatNumber(item.value)} ({item.percentage}%)</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                          Avg CLV: <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(item.avgCLV)}</span>
                        </p>
                        <p className="text-[10px] text-blue-500 font-medium pt-1">
                          Click slice to isolate cohort
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={92}
                paddingAngle={4}
                dataKey="value"
                cursor="pointer"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(entry: any) => {
                  const targetId = entry?.id || entry?.payload?.id;
                  if (targetId) setSelectedSegment(targetId);
                }}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.color}
                    opacity={
                      filters.selectedSegment === "all" || filters.selectedSegment === entry.id
                        ? 1
                        : 0.25
                    }
                    strokeWidth={filters.selectedSegment === entry.id ? 3 : 1}
                    stroke={filters.selectedSegment === entry.id ? "#ffffff" : "transparent"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Dynamic Summary */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            {activeSegmentData ? (
              <div className="animate-in fade-in zoom-in-95 duration-150">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                  {activeSegmentData.percentage}%
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 max-w-[120px] truncate block">
                  {formatNumber(activeSegmentData.value)}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {formatCurrency(activeSegmentData.avgCLV)}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Total Base
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block">
                  {formatNumber(data.reduce((acc, curr) => acc + curr.value, 0))}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  5 Clusters
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {data.map((item) => {
            const isSelected = filters.selectedSegment === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSegment(item.id)}
                className={`w-full flex items-center justify-between text-xs px-2 py-1 rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 font-semibold shadow-xs"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-900 dark:text-slate-200 font-medium">
                    {item.percentage}%
                  </span>
                  <span className="text-[11px] text-slate-400">({formatNumber(item.value)})</span>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
