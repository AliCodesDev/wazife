import Navbar from "./components/Navbar";
import Map from "./components/Map";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="h-screen w-screen overflow-hidden bg-white dark:bg-gray-900">
      <Navbar theme={theme} onToggleTheme={toggle} />
      <div className="pt-14 h-full">
        <Map theme={theme} />
      </div>
    </div>
  );
}

export default App;
