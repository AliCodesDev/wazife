import { useState } from "react";
import type { IndustryCategory } from "../types/company";
import { INDUSTRY_CATEGORIES, INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";
import { ChevronRightIcon } from "./Icon";

interface FilterSidebarProps {
  activeIndustries: Set<IndustryCategory>;
  onToggle: (industry: IndustryCategory) => void;
  onShowAll: () => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  activeIndustries,
  onToggle,
  onShowAll,
  onClearAll,
}: FilterSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="hidden md:flex h-full shrink-0">
      {/* Sidebar panel */}
      <div
        className={`h-full overflow-y-auto border-r border-gray-200 bg-white transition-[width] duration-200 ease-out dark:border-gray-700 dark:bg-gray-900 ${
          collapsed ? "w-0 overflow-hidden" : "w-[260px]"
        }`}
      >
        <div className="w-[260px] p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Industries
            </h2>
            <div className="flex gap-1">
              <button
                onClick={onShowAll}
                className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                Show All
              </button>
              <button
                onClick={onClearAll}
                className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Industry list */}
          <div className="flex flex-col gap-0.5" role="group" aria-label="Industry filters">
            {INDUSTRY_CATEGORIES.map((ind) => {
              const active = activeIndustries.has(ind);
              return (
                <button
                  key={ind}
                  onClick={() => onToggle(ind)}
                  aria-pressed={active}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                    active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {/* Colored dot / checkbox indicator */}
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border-2"
                    style={{
                      borderColor: INDUSTRY_COLORS[ind],
                      backgroundColor: active ? INDUSTRY_COLORS[ind] : "transparent",
                    }}
                  />
                  <span className="truncate">{INDUSTRY_LABELS[ind]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toggle button (always visible at left edge) */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label={collapsed ? "Open filters" : "Collapse filters"}
        className="relative flex h-10 w-7 items-center justify-center self-center -ml-px rounded-r-lg border border-l-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <ChevronRightIcon className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
