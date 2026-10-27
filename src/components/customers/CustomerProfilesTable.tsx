"use client";

import React, { useState } from "react";
import { useSegmentation } from "@/context/SegmentationContext";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  Search,
  Filter,
  Download,
  Eye,
  ArrowUpDown,
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function CustomerProfilesTable() {
  const {
    filteredCustomers,
    segments,
    filters,
    setFilters,
    setSelectedCustomer,
    setSelectedSegment,
    openCopilotWithPrompt,
  } = useSegmentation();

  const [sortField, setSortField] = useState<"clv" | "rfm" | "recency" | "churn">("clv");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: "clv" | "rfm" | "recency" | "churn") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let diff = 0;
    if (sortField === "clv") {
      diff = a.monetaryValue - b.monetaryValue;
    } else if (sortField === "rfm") {
      diff = a.rfmScore.composite - b.rfmScore.composite;
    } else if (sortField === "recency") {
      diff = a.recencyDays - b.recencyDays;
    } else if (sortField === "churn") {
      diff = a.churnScore - b.churnScore;
    }
    return sortOrder === "asc" ? diff : -diff;
  });

  const exportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Segment",
      "CLV ($)",
      "Recency (Days)",
      "Frequency",
      "RFM Score",
      "Churn Risk",
      "Channel",
      "Region",
    ];

    const rows = sortedCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      c.email,
      `"${c.segmentName}"`,
      c.monetaryValue,
      c.recencyDays,
      c.frequencyPurchases,
      c.rfmScore.composite,
      c.churnRisk,
      c.channel,
      c.region,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `segmentai-customer-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <CardTitle>Customer Profiles & Behavioral Intelligence</CardTitle>
            <CardDescription>
              Showing {sortedCustomers.length} active customer profiles analyzed by AI
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Filter customers..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-8 text-xs h-8 w-44"
              />
            </div>

            {/* Segment Selector */}
            <Select
              value={filters.selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="text-xs h-8"
              options={[
                { label: "All Segments", value: "all" },
                ...segments.map((s) => ({ label: s.name, value: s.id })),
              ]}
            />

            {/* Churn Filter */}
            <Select
              value={filters.churnFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, churnFilter: e.target.value as any }))}
              className="text-xs h-8"
              options={[
                { label: "All Churn Risks", value: "all" },
                { label: "Low Risk (<20%)", value: "Low" },
                { label: "Medium Risk (20-50%)", value: "Medium" },
                { label: "High Risk (>50%)", value: "High" },
              ]}
            />

            {/* Export CSV button */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="h-8 text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[240px]">Customer Profile</TableHead>
                <TableHead>Behavioral Segment</TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("clv")}
                >
                  <div className="flex items-center gap-1">
                    <span>Lifetime Value (CLV)</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("rfm")}
                >
                  <div className="flex items-center gap-1">
                    <span>RFM Composite</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("recency")}
                >
                  <div className="flex items-center gap-1">
                    <span>Recency</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort("churn")}
                >
                  <div className="flex items-center gap-1">
                    <span>Churn Risk</span>
                    <ArrowUpDown className="h-3 w-3 text-slate-400" />
                  </div>
                </TableHead>
                <TableHead>Channel & Region</TableHead>
                <TableHead className="w-[200px]">Next-Best Action</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                    No customer profiles found matching current filters.
                  </TableCell>
                </TableRow>
              ) : (
                sortedCustomers.map((cust) => {
                  const segment = segments.find((s) => s.id === cust.segmentId);
                  const churnBadge =
                    cust.churnRisk === "High"
                      ? "destructive"
                      : cust.churnRisk === "Medium"
                      ? "warning"
                      : "success";

                  return (
                    <TableRow
                      key={cust.id}
                      className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      {/* Customer info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={cust.avatar}
                            fallback={cust.name}
                            size="md"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                              {cust.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {cust.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Segment badge */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] whitespace-nowrap"
                          style={{
                            color: segment?.color,
                            borderColor: `${segment?.color}40`,
                            backgroundColor: `${segment?.color}10`,
                          }}
                        >
                          {cust.segmentName}
                        </Badge>
                      </TableCell>

                      {/* CLV */}
                      <TableCell>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {formatCurrency(cust.monetaryValue)}
                        </span>
                      </TableCell>

                      {/* RFM Score */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {cust.rfmScore.composite}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (R{cust.rfmScore.r} F{cust.rfmScore.f} M{cust.rfmScore.m})
                          </span>
                        </div>
                      </TableCell>

                      {/* Recency */}
                      <TableCell>
                        <span className="text-slate-700 dark:text-slate-300">
                          {cust.recencyDays} days ago
                        </span>
                      </TableCell>

                      {/* Churn Risk */}
                      <TableCell>
                        <Badge variant={churnBadge as any} className="text-[10px]">
                          {cust.churnRisk} ({cust.churnScore}%)
                        </Badge>
                      </TableCell>

                      {/* Channel & Region */}
                      <TableCell>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          <p>{cust.channel}</p>
                          <p className="text-[10px] text-slate-400">{cust.region}</p>
                        </div>
                      </TableCell>

                      {/* NBA */}
                      <TableCell>
                        <div className="text-[11px] line-clamp-2 text-slate-700 dark:text-slate-300">
                          <span className="font-medium text-blue-600 dark:text-blue-400 mr-1">
                            [{cust.nextBestAction.channel}]
                          </span>
                          {cust.nextBestAction.action}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(cust);
                          }}
                          className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Inspect
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
