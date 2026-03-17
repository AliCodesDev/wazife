import { useEffect, useCallback, useRef } from "react";
import type { IndustryCategory } from "../types/company";
import { INDUSTRY_CATEGORIES } from "../data/industries";
import type { ViewMode } from "../components/Navbar";

/** Short slugs for URL readability */
const SLUG_TO_INDUSTRY: Record<string, IndustryCategory> = {
  tech: "technology",
  finance: "finance",
  health: "healthcare",
  law: "law",
  eng: "engineering",
  edu: "education",
  marketing: "marketing",
  hospitality: "hospitality",
  retail: "retail",
  ngo: "ngo",
  media: "media",
  other: "other",
};

const INDUSTRY_TO_SLUG: Record<IndustryCategory, string> = Object.fromEntries(
  Object.entries(SLUG_TO_INDUSTRY).map(([slug, ind]) => [ind, slug]),
) as Record<IndustryCategory, string>;

interface UrlState {
  industries: Set<IndustryCategory>;
  viewMode: ViewMode;
  companyId: string | null;
}

/** Read URL params once on load */
export function readUrlState(): UrlState {
  const params = new URLSearchParams(window.location.search);

  // Industries
  const industryParam = params.get("industry");
  const industries = new Set<IndustryCategory>();
  if (industryParam) {
    for (const slug of industryParam.split(",")) {
      const ind = SLUG_TO_INDUSTRY[slug.trim()];
      if (ind && INDUSTRY_CATEGORIES.includes(ind)) {
        industries.add(ind);
      }
    }
  }

  // View mode
  const viewParam = params.get("view");
  const viewMode: ViewMode = viewParam === "list" ? "list" : "map";

  // Company
  const companyId = params.get("company") || null;

  return { industries, viewMode, companyId };
}

/** Hook that syncs app state to URL query params via replaceState */
export function useUrlSync(
  activeIndustries: Set<IndustryCategory>,
  viewMode: ViewMode,
  selectedCompanyId: string | null,
) {
  const isFirstRender = useRef(true);

  const sync = useCallback(() => {
    const params = new URLSearchParams();

    // Industries
    if (activeIndustries.size > 0) {
      const slugs = Array.from(activeIndustries)
        .map((ind) => INDUSTRY_TO_SLUG[ind])
        .filter(Boolean);
      if (slugs.length > 0) {
        params.set("industry", slugs.join(","));
      }
    }

    // View mode — only include if not default
    if (viewMode === "list") {
      params.set("view", "list");
    }

    // Company
    if (selectedCompanyId) {
      params.set("company", selectedCompanyId);
    }

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [activeIndustries, viewMode, selectedCompanyId]);

  useEffect(() => {
    // Skip syncing on first render so URL-initialized state doesn't get wiped
    // before the deep-link company logic runs
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sync();
  }, [sync]);
}
