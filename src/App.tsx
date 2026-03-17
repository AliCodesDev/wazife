import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import CompanyCard from "./components/CompanyCard";
import { useTheme } from "./hooks/useTheme";
import companiesData from "./data/companies.json";
import type { Company } from "./types/company";

const companies = companiesData as Company[];
const companiesById = Object.fromEntries(companies.map((c) => [c.id, c]));

function App() {
  const { theme, toggle } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleCompanyClick = useCallback((id: string) => {
    setSelectedCompany(companiesById[id] ?? null);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedCompany(null);
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-gray-900">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <div className="mt-14 flex-1">
        <Map
          theme={theme}
          companies={companies}
          onCompanyClick={handleCompanyClick}
        />
      </div>
      <CompanyCard company={selectedCompany} onClose={handleCloseCard} />
    </div>
  );
}

export default App;
