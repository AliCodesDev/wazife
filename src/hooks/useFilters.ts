import { useState, useCallback } from "react";
import type { IndustryCategory } from "../types/company";
import { INDUSTRY_CATEGORIES } from "../data/industries";

export function useFilters() {
  const [activeIndustries, setActiveIndustries] = useState<Set<IndustryCategory>>(
    new Set(),
  );

  const toggleIndustry = useCallback((industry: IndustryCategory) => {
    setActiveIndustries((prev) => {
      const next = new Set(prev);
      if (next.has(industry)) {
        next.delete(industry);
      } else {
        next.add(industry);
      }
      return next;
    });
  }, []);

  const showAll = useCallback(() => {
    setActiveIndustries(new Set(INDUSTRY_CATEGORIES));
  }, []);

  const clearAll = useCallback(() => {
    setActiveIndustries(new Set());
  }, []);

  const addIndustry = useCallback((industry: IndustryCategory) => {
    setActiveIndustries((prev) => {
      if (prev.has(industry)) return prev;
      const next = new Set(prev);
      next.add(industry);
      return next;
    });
  }, []);

  return { activeIndustries, toggleIndustry, showAll, clearAll, addIndustry } as const;
}
