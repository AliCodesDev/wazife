import { useState, useCallback, useMemo, useRef, useEffect, lazy, Suspense } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import Navbar from "./components/Navbar";
import type { ViewMode } from "./components/Navbar";
import ListView from "./components/ListView";
import MapSkeleton from "./components/MapSkeleton";

const Map = lazy(() => import("./components/Map"));
import CompanyCard from "./components/CompanyCard";
import FilterSidebar from "./components/FilterSidebar";
import FilterChips from "./components/FilterChips";
import OnboardingPrompt from "./components/OnboardingPrompt";
import Footer from "./components/Footer";
import { SubmitBannerInline, SubmitBannerFloating } from "./components/SubmitBanner";
import { useTheme } from "./hooks/useTheme";
import { useFilters } from "./hooks/useFilters";
import { useOnboardingFadeOut } from "./hooks/useOnboardingFadeOut";
import { readUrlState, useUrlSync } from "./hooks/useUrlState";
import companiesData from "./data/companies.json";
import type { Company } from "./types/company";

const companies = companiesData as Company[];
const companiesById = Object.fromEntries(companies.map((c) => [c.id, c]));

// Read URL state once before any renders
const initialUrlState = readUrlState();

function App() {
  const { theme, toggle } = useTheme();
  const { activeIndustries, toggleIndustry, showAll, clearAll, addIndustry } =
    useFilters(initialUrlState.industries.size > 0 ? initialUrlState.industries : undefined);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialUrlState.viewMode);
  const mapInstanceRef = useRef<MapboxMap | null>(null);
  const deepLinkCompanyId = useRef(initialUrlState.companyId);

  const hasFilters = activeIndustries.size > 0;
  const onboardingFadingOut = useOnboardingFadeOut(hasFilters);

  // Sync state to URL
  useUrlSync(activeIndustries, viewMode, selectedCompany?.id ?? null);

  // Handle deep-link company on map ready
  const handleMapReady = useCallback((map: MapboxMap) => {
    mapInstanceRef.current = map;

    const companyId = deepLinkCompanyId.current;
    if (!companyId) return;
    deepLinkCompanyId.current = null;

    const company = companiesById[companyId];
    if (!company) return;

    // Ensure industry is active
    const primaryIndustry = company.industries[0];
    if (primaryIndustry) {
      addIndustry(primaryIndustry);
    }

    // Fly to and select
    map.once("load", () => {
      map.flyTo({
        center: [company.longitude, company.latitude],
        zoom: 14,
        duration: 1500,
      });
    });
    setSelectedCompany(company);
  }, [addIndustry]);

  // Handle deep-link company in list mode (map won't mount)
  useEffect(() => {
    if (viewMode !== "list") return;
    const companyId = deepLinkCompanyId.current;
    if (!companyId) return;
    deepLinkCompanyId.current = null;

    const company = companiesById[companyId];
    if (!company) return;

    const primaryIndustry = company.industries[0];
    if (primaryIndustry) {
      addIndustry(primaryIndustry);
    }
    setSelectedCompany(company);
  }, [viewMode, addIndustry]);

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

  const handleSearchSelect = useCallback(
    (company: Company) => {
      const primaryIndustry = company.industries[0];
      if (primaryIndustry) {
        addIndustry(primaryIndustry);
      }

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
              <Suspense fallback={<MapSkeleton />}>
                <Map
                  theme={theme}
                  companies={companies}
                  onCompanyClick={handleCompanyClick}
                  activeFilters={hasFilters ? activeFiltersArray : undefined}
                  onMapReady={handleMapReady}
                />
              </Suspense>
              {!hasFilters && !onboardingFadingOut && <OnboardingPrompt />}
              {onboardingFadingOut && <OnboardingPrompt fadingOut />}
              {hasFilters && <SubmitBannerFloating />}
            </>
          ) : (
            <ListView
              companies={companies}
              activeFilters={hasFilters ? activeFiltersArray : undefined}
              onCompanyClick={handleListCompanyClick}
            />
          )}

          {/* Submit banner + Footer */}
          {viewMode === "list" && hasFilters && <SubmitBannerInline />}
          {viewMode === "list" && <Footer />}
        </div>
      </div>

      {/* Map view footer - thin bar at bottom */}
      {viewMode === "map" && <Footer className="shrink-0" />}

      <CompanyCard company={selectedCompany} onClose={handleCloseCard} />
    </div>
  );
}

export default App;
