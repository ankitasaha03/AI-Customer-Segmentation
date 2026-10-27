"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { useSegmentation } from "@/context/SegmentationContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function SegmentRadarChart() {
  const { segments, filters } = useSegmentation();

  const traitsKeys = [
    { key: "loyalty", label: "Brand Loyalty" },
    { key: "spend", label: "Average Basket / Spend" },
    { key: "frequency", label: "Purchase Frequency" },
    { key: "channelEngagement", label: "Digital Engagement" },
    { key: "brandAdvocacy", label: "Advocacy & Referrals" },
  ];

  const radarData = traitsKeys.map((trait) => {
    const row: any = { trait: trait.label };
    segments.forEach((seg) => {
      row[seg.id] = (seg.traits as any)[trait.key] || 50;
    });
    return row;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Behavioral Traits Radar</CardTitle>
            <CardDescription>Multi-dimensional metric alignment across cohorts</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center items-center pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#cbd5e1" strokeOpacity={0.4} />
              <PolarAngleAxis
                dataKey="trait"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
                        {payload.map((entry: any) => {
                          const seg = segments.find((s) => s.id === entry.dataKey);
                          return (
                            <div key={entry.dataKey} className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: seg?.color }}
                                />
                                {seg?.name}:
                              </span>
                              <span className="font-mono font-semibold text-slate-900 dark:text-slate-200">
                                {entry.value}/100
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {segments.map((seg) => {
                const isSelected =
                  filters.selectedSegment === "all" || filters.selectedSegment === seg.id;
                return (
                  <Radar
                    key={seg.id}
                    name={seg.name}
                    dataKey={seg.id}
                    stroke={seg.color}
                    fill={seg.color}
                    fillOpacity={isSelected ? 0.25 : 0.05}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                );
              })}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px]">
          {segments.map((seg) => (
            <div key={seg.id} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
              <span>{seg.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
