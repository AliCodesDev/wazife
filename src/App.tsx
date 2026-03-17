import Navbar from "./components/Navbar";
import Map from "./components/Map";
import { useTheme } from "./hooks/useTheme";
import companiesData from "./data/companies.json";
import type { Company } from "./types/company";

const companies = companiesData as Company[];

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white dark:bg-gray-900">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <div className="mt-14 flex-1">
        <Map theme={theme} companies={companies} />
      </div>
    </div>
  );
}

export default App;
