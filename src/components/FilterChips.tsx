import type { IndustryCategory } from "../types/company";
import { INDUSTRY_CATEGORIES, INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

interface FilterChipsProps {
  activeIndustries: Set<IndustryCategory>;
  onToggle: (industry: IndustryCategory) => void;
}

export default function FilterChips({ activeIndustries, onToggle }: FilterChipsProps) {
  return (
    <div
      className="md:hidden flex gap-2 overflow-x-auto px-3 py-2 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 scrollbar-none"
      role="group"
      aria-label="Industry filters"
    >
      {INDUSTRY_CATEGORIES.map((ind) => {
        const active = activeIndustries.has(ind);
        const color = INDUSTRY_COLORS[ind];
        const shortLabel = INDUSTRY_LABELS[ind].split(" / ")[0];
        return (
          <button
            key={ind}
            onClick={() => onToggle(ind)}
            aria-pressed={active}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-150 ${
              active
                ? "text-white border-transparent scale-105"
                : "bg-transparent dark:text-gray-300 border-current scale-100"
            }`}
            style={
              active
                ? { backgroundColor: color, borderColor: color }
                : { color }
            }
          >
            {shortLabel}
          </button>
        );
      })}
    </div>
  );
}
