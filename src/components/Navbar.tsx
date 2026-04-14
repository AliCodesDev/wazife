import type { Theme } from "../hooks/useTheme";
import type { Company } from "../types/company";
import SearchBar from "./SearchBar";
import { MapIcon, ListIcon, MoonIcon, SunIcon } from "./Icon";

export type ViewMode = "map" | "list";

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  companies: Company[];
  onSearchSelect: (company: Company) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function Navbar({
  theme,
  onToggleTheme,
  companies,
  onSearchSelect,
  viewMode,
  onViewModeChange,
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-2 border-b border-gray-200 bg-white px-3 dark:border-gray-700 dark:bg-gray-900 sm:gap-3 sm:px-4" role="navigation" aria-label="Main navigation">
      <span className="shrink-0 text-lg font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
        Wazafak
      </span>

      <SearchBar companies={companies} onSelect={onSearchSelect} />

      {/* Map / List toggle */}
      <div className="flex shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600">
        <button
          onClick={() => onViewModeChange("map")}
          aria-label="Map view"
          aria-pressed={viewMode === "map"}
          className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3 ${
            viewMode === "map"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <MapIcon />
          <span className="hidden sm:inline">Map</span>
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:px-3 ${
            viewMode === "list"
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <ListIcon />
          <span className="hidden sm:inline">List</span>
        </button>
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
    </nav>
  );
}
