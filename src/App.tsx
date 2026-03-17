import { useState, useCallback, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import Navbar from "./components/Navbar";
import type { ViewMode } from "./components/Navbar";
import Map from "./components/Map";
import ListView from "./components/ListView";
import CompanyCard from "./components/CompanyCard";
import FilterSidebar from "./components/FilterSidebar";
import FilterChips from "./components/FilterChips";
import OnboardingPrompt from "./components/OnboardingPrompt";
import { useTheme } from "./hooks/useTheme";
import { useFilters } from "./hooks/useFilters";
import companiesData from "./data/companies.json";
import type { Company } from "./types/company";

const companies = companiesData as Company[];
const companiesById = Object.fromEntries(companies.map((c) => [c.id, c]));

function App() {
  const { theme, toggle } = useTheme();
  const { activeIndustries, toggleIndustry, showAll, clearAll, addIndustry } = useFilters();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);

  const activeFiltersArray = useMemo(
    () => Array.from(activeIndustries),
    [activeIndustries],
  );

  const handleCompanyClick = useCallback((id: string) => {
    setSelectedCompany(companiesById[id] ?? null);
  }, []);

  const handleListCompanyClick = useCallback((company: Company) => {
    setSelectedCompany(company);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  const handleMapReady = useCallback((map: mapboxgl.Map) => {
    mapInstanceRef.current = map;
  }, []);

  const handleSearchSelect = useCallback(
    (company: Company) => {
      const primaryIndustry = company.industries[0];
      if (primaryIndustry) {
        addIndustry(primaryIndustry);
      }

      // Switch to map view and fly to company
      setViewMode("map");
      mapInstanceRef.current?.flyTo({
        center: [company.longitude, company.latitude],
        zoom: 14,
        duration: 1500,
      });

      setSelectedCompany(company);
    },
    [addIndustry],
  );

  const hasFilters = activeIndustries.size > 0;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-gray-900">
      <Navbar
        theme={theme}
        onToggleTheme={toggle}
        companies={companies}
        onSearchSelect={handleSearchSelect}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Mobile filter chips */}
      <div className="mt-14 md:hidden">
        <FilterChips activeIndustries={activeIndustries} onToggle={toggleIndustry} />
      </div>

      {/* Main content: sidebar + map/list */}
      <div className="flex flex-1 overflow-hidden md:mt-14">
        <FilterSidebar
          activeIndustries={activeIndustries}
          onToggle={toggleIndustry}
          onShowAll={showAll}
          onClearAll={clearAll}
        />

        <div className="relative flex flex-1 flex-col">
          {viewMode === "map" ? (
            <>
              <Map
                theme={theme}
                companies={companies}
                onCompanyClick={handleCompanyClick}
                activeFilters={hasFilters ? activeFiltersArray : undefined}
                onMapReady={handleMapReady}
              />
              {!hasFilters && <OnboardingPrompt />}
            </>
          ) : (
            <ListView
              companies={companies}
              activeFilters={hasFilters ? activeFiltersArray : undefined}
              onCompanyClick={handleListCompanyClick}
            />
          )}
        </div>
      </div>

      <CompanyCard company={selectedCompany} onClose={handleCloseCard} />
    </div>
  );
}

export default App;
