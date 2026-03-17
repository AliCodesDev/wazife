import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Theme } from "../hooks/useTheme";
import { MAPBOX_STYLES } from "../hooks/useTheme";
import { useMapMarkers } from "../hooks/useMapMarkers";
import type { Company, IndustryCategory } from "../types/company";

interface MapProps {
  theme: Theme;
  companies: Company[];
  onCompanyClick?: (companyId: string) => void;
  activeFilters?: IndustryCategory[];
}

const LEBANON_CENTER: [number, number] = [35.85, 33.85];
const LEBANON_ZOOM = 8;

export default function Map({ theme, companies, onCompanyClick, activeFilters }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const prevThemeRef = useRef<Theme>(theme);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLES[theme],
      center: LEBANON_CENTER,
      zoom: LEBANON_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style only when theme actually changes (not on initial mount)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      map.setStyle(MAPBOX_STYLES[theme]);
    }
  }, [theme]);

  // Markers + clustering
  useMapMarkers(mapRef, companies, onCompanyClick, activeFilters);

  return <div ref={containerRef} className="h-full w-full" />;
}
