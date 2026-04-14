import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { Company } from "../types/company";
import { SearchIcon } from "./Icon";
import IndustryBadge from "./IndustryBadge";

interface SearchBarProps {
  companies: Company[];
  onSelect: (company: Company) => void;
}

export default function SearchBar({ companies, onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter companies
  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return companies
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.name_ar && c.name_ar.includes(debouncedQuery.trim())),
      )
      .slice(0, 8);
  }, [debouncedQuery, companies]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  // Show dropdown when there are results
  useEffect(() => {
    setIsOpen(results.length > 0);
  }, [results]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (company: Company) => {
      onSelect(company);
      setQuery("");
      setDebouncedQuery("");
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            handleSelect(results[activeIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, activeIndex, handleSelect],
  );

  return (
    <div ref={containerRef} className="relative flex-1 md:flex-none">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-autocomplete="list"
          aria-label="Search companies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search companies..."
          className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-500 dark:focus:bg-gray-700 md:w-[300px]"
        />
      </div>

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <ul
          role="listbox"
          className="animate-dropdown-in absolute left-0 right-0 top-full z-50 mt-1 max-h-[360px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 md:w-[300px]"
        >
          {results.map((company, index) => {
            const primaryIndustry = company.industries[0];
            return (
              <li
                key={company.id}
                role="option"
                aria-selected={index === activeIndex}
                className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 ${
                  index === activeIndex
                    ? "bg-blue-50 dark:bg-gray-700"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur before click
                  handleSelect(company);
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {company.name}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {company.city}
                  </div>
                </div>
                <IndustryBadge industry={primaryIndustry} short />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
