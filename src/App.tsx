import { useState, useCallback, useMemo } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
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
  const { activeIndustries, toggleIndustry, showAll, clearAll } = useFilters();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const activeFiltersArray = useMemo(
    () => Array.from(activeIndustries),
    [activeIndustries],
  );

  const handleCompanyClick = useCallback((id: string) => {
    setSelectedCompany(companiesById[id] ?? null);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  const hasFilters = activeIndustries.size > 0;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-gray-900">
      <Navbar theme={theme} onToggleTheme={toggle} />

      {/* Mobile filter chips */}
      <div className="mt-14 md:hidden">
        <FilterChips activeIndustries={activeIndustries} onToggle={toggleIndustry} />
      </div>

      {/* Main content: sidebar + map */}
      <div className="flex flex-1 overflow-hidden md:mt-14">
        <FilterSidebar
          activeIndustries={activeIndustries}
          onToggle={toggleIndustry}
          onShowAll={showAll}
          onClearAll={clearAll}
        />

        <div className="relative flex-1">
          <Map
            theme={theme}
            companies={companies}
            onCompanyClick={handleCompanyClick}
            activeFilters={hasFilters ? activeFiltersArray : undefined}
          />
          {!hasFilters && <OnboardingPrompt />}
        </div>
      </div>

      <CompanyCard company={selectedCompany} onClose={handleCloseCard} />
    </div>
  );
}

export default App;
