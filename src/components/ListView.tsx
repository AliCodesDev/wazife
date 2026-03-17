import { useState, useMemo } from "react";
import type { Company, IndustryCategory } from "../types/company";
import { INDUSTRY_COLORS, INDUSTRY_LABELS } from "../data/industries";

type SortOption = "name" | "industry" | "city";

interface ListViewProps {
  companies: Company[];
  activeFilters: IndustryCategory[] | undefined;
  onCompanyClick: (company: Company) => void;
}

export default function ListView({ companies, activeFilters, onCompanyClick }: ListViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const filtered = useMemo(() => {
    if (!activeFilters) return [];
    return companies.filter((c) =>
      c.industries.some((ind) => activeFilters.includes(ind)),
    );
  }, [companies, activeFilters]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "industry":
        return list.sort((a, b) =>
          INDUSTRY_LABELS[a.industries[0]].localeCompare(INDUSTRY_LABELS[b.industries[0]]),
        );
      case "city":
        return list.sort((a, b) => a.city.localeCompare(b.city));
      default:
        return list;
    }
  }, [filtered, sortBy]);

  // Empty state — no filters active
  if (!activeFilters || activeFilters.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-lg dark:bg-gray-800">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500 dark:text-blue-400"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Select industries to get started
          </p>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Use the filters to explore companies
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {sorted.length} {sorted.length === 1 ? "company" : "companies"}
        </span>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm text-gray-500 dark:text-gray-400">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="name">Name (A-Z)</option>
            <option value="industry">Industry</option>
            <option value="city">City</option>
          </select>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden flex-1 overflow-y-auto md:block">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/90">
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Website</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {sorted.map((company) => (
              <tr
                key={company.id}
                tabIndex={0}
                role="button"
                onClick={() => onCompanyClick(company)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCompanyClick(company); } }}
                className="cursor-pointer transition-colors hover:bg-gray-50 focus:bg-blue-50 focus:outline-none dark:hover:bg-gray-800/50 dark:focus:bg-gray-800"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {company.name}
                  </div>
                  {company.name_ar && (
                    <div className="text-xs text-gray-400 dark:text-gray-500" dir="rtl">
                      {company.name_ar}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {company.industries.map((ind) => (
                      <span
                        key={ind}
                        className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: INDUSTRY_COLORS[ind] }}
                      >
                        {INDUSTRY_LABELS[ind].split(" / ")[0]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {company.city}
                </td>
                <td className="px-4 py-3">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Visit
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3 md:hidden">
        {sorted.map((company) => (
          <div
            key={company.id}
            tabIndex={0}
            role="button"
            onClick={() => onCompanyClick(company)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCompanyClick(company); } }}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 transition-colors active:bg-gray-50 focus:border-blue-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:active:bg-gray-700 dark:focus:border-blue-500"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {company.name}
                </div>
                <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {company.city}
                </div>
              </div>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 text-xs text-blue-600 hover:underline dark:text-blue-400"
                >
                  Visit
                </a>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {company.industries.map((ind) => (
                <span
                  key={ind}
                  className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: INDUSTRY_COLORS[ind] }}
                >
                  {INDUSTRY_LABELS[ind].split(" / ")[0]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
