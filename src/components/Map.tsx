import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Theme } from "../hooks/useTheme";
import { MAPBOX_STYLES } from "../hooks/useTheme";

interface MapProps {
  theme: Theme;
}

const LEBANON_CENTER: [number, number] = [35.85, 33.85];
const LEBANON_ZOOM = 8;

export default function Map({ theme }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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

  // Update style when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(MAPBOX_STYLES[theme]);
  }, [theme]);

  return <div ref={containerRef} className="h-full w-full" />;
}
