import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  icon?: React.ReactNode;
}

export function Select({ options, icon, className, value, onChange, ...props }: SelectProps) {
  return (
    <div className="relative inline-flex items-center">
      {icon && (
        <div className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "h-9 appearance-none rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 py-1.5 pl-3 pr-8 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          icon ? "pl-8" : "pl-3",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
    </div>
  );
}
