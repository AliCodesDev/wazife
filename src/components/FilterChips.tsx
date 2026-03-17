import type { IndustryCategory } from "../types/company";
import { INDUSTRY_CATEGORIES, INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

interface FilterChipsProps {
  activeIndustries: Set<IndustryCategory>;
  onToggle: (industry: IndustryCategory) => void;
}

export default function FilterChips({ activeIndustries, onToggle }: FilterChipsProps) {
  return (
    <div className="md:hidden flex gap-2 overflow-x-auto px-3 py-2 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 scrollbar-none">
      {INDUSTRY_CATEGORIES.map((ind) => {
        const active = activeIndustries.has(ind);
        const color = INDUSTRY_COLORS[ind];
        return (
          <button
            key={ind}
            onClick={() => onToggle(ind)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              active
                ? "text-white border-transparent"
                : "bg-transparent dark:text-gray-300 border-current"
            }`}
            style={
              active
                ? { backgroundColor: color, borderColor: color }
                : { color }
            }
          >
            {INDUSTRY_LABELS[ind]}
          </button>
        );
      })}
    </div>
  );
}
