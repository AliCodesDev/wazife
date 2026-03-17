import { useEffect, useRef, useCallback } from "react";
import type { Map as MapboxMap, MapMouseEvent, GeoJSONSource } from "mapbox-gl";
import type { Company, IndustryCategory } from "../types/company";
import { INDUSTRY_COLORS } from "../data/industries";

const SOURCE_ID = "companies";
const CLUSTER_LAYER = "clusters";
const CLUSTER_COUNT_LAYER = "cluster-count";
const UNCLUSTERED_LAYER = "unclustered-point";

const CLUSTER_COLOR = "#64748b"; // slate-500

function companiesToGeoJSON(
  companies: Company[],
  activeFilters?: IndustryCategory[],
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  const filtered =
    activeFilters === undefined
      ? companies
      : companies.filter((c) =>
          c.industries.some((ind) => activeFilters.includes(ind)),
        );

  return {
    type: "FeatureCollection",
    features: filtered.map((company) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [company.longitude, company.latitude],
      },
      properties: {
        id: company.id,
        name: company.name,
        name_ar: company.name_ar ?? "",
        industries: JSON.stringify(company.industries),
        description: company.description,
        city: company.city,
        website: company.website ?? "",
        email: company.email ?? "",
        careers_url: company.careers_url ?? "",
        phone: company.phone ?? "",
        color: INDUSTRY_COLORS[company.industries[0]],
      },
    })),
  };
}

function addMarkerLayers(map: MapboxMap, geojson: GeoJSON.FeatureCollection<GeoJSON.Point>) {
  if (map.getSource(SOURCE_ID)) return;

  map.addSource(SOURCE_ID, {
    type: "geojson",
    data: geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // Cluster circles
  map.addLayer({
    id: CLUSTER_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": CLUSTER_COLOR,
      "circle-radius": ["step", ["get", "point_count"], 18, 10, 24, 50, 32],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-opacity": 0.85,
    },
  });

  // Cluster count labels
  map.addLayer({
    id: CLUSTER_COUNT_LAYER,
    type: "symbol",
    source: SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count_abbreviated"],
      "text-size": 13,
      "text-font": ["DIN Pro Medium", "Arial Unicode MS Bold"],
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  // Unclustered individual markers
  map.addLayer({
    id: UNCLUSTERED_LAYER,
    type: "circle",
    source: SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": ["get", "color"],
      "circle-radius": 8,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}

export function useMapMarkers(
  mapRef: React.RefObject<MapboxMap | null>,
  companies: Company[],
  activeFilters?: IndustryCategory[],
) {
  const geojsonRef = useRef<GeoJSON.FeatureCollection<GeoJSON.Point>>(
    companiesToGeoJSON(companies, activeFilters),
  );

  // Keep geojson in sync with companies/filters
  useEffect(() => {
    geojsonRef.current = companiesToGeoJSON(companies, activeFilters);

    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (source) {
      source.setData(geojsonRef.current);
    }
  }, [companies, activeFilters, mapRef]);

  // Re-add layers after every style.load (initial + theme switch)
  const handleStyleLoad = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    addMarkerLayers(map, geojsonRef.current);
  }, [mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // "load" fires on initial map load; "style.load" fires on setStyle() calls
    map.on("load", handleStyleLoad);
    map.on("style.load", handleStyleLoad);

    // If the map already loaded before this effect ran, add layers now
    if (map.loaded()) {
      handleStyleLoad();
    }

    return () => {
      map.off("load", handleStyleLoad);
      map.off("style.load", handleStyleLoad);
    };
  }, [mapRef, handleStyleLoad]);

  // Click handlers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onClusterClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_LAYER] });
      if (!features.length) return;

      const clusterId = features[0].properties!.cluster_id as number;
      const source = map.getSource(SOURCE_ID) as GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        const geometry = features[0].geometry as GeoJSON.Point;
        map.easeTo({
          center: geometry.coordinates as [number, number],
          zoom: zoom!,
        });
      });
    };

    const onMarkerClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [UNCLUSTERED_LAYER] });
      if (!features.length) return;

      const props = features[0].properties!;
      const geometry = features[0].geometry as GeoJSON.Point;

      map.easeTo({
        center: geometry.coordinates as [number, number],
        zoom: Math.max(map.getZoom(), 12),
      });

      console.log("Company clicked:", {
        id: props.id,
        name: props.name,
        industries: JSON.parse(props.industries as string),
        city: props.city,
        description: props.description,
        website: props.website,
        email: props.email,
        careers_url: props.careers_url,
        phone: props.phone,
      });
    };

    // Pointer cursors
    const onClusterEnter = () => { map.getCanvas().style.cursor = "pointer"; };
    const onMarkerEnter = () => { map.getCanvas().style.cursor = "pointer"; };
    const onClusterLeave = () => { map.getCanvas().style.cursor = ""; };
    const onMarkerLeave = () => { map.getCanvas().style.cursor = ""; };

    map.on("click", CLUSTER_LAYER, onClusterClick);
    map.on("click", UNCLUSTERED_LAYER, onMarkerClick);
    map.on("mouseenter", CLUSTER_LAYER, onClusterEnter);
    map.on("mouseenter", UNCLUSTERED_LAYER, onMarkerEnter);
    map.on("mouseleave", CLUSTER_LAYER, onClusterLeave);
    map.on("mouseleave", UNCLUSTERED_LAYER, onMarkerLeave);

    return () => {
      map.off("click", CLUSTER_LAYER, onClusterClick);
      map.off("click", UNCLUSTERED_LAYER, onMarkerClick);
      map.off("mouseenter", CLUSTER_LAYER, onClusterEnter);
      map.off("mouseenter", UNCLUSTERED_LAYER, onMarkerEnter);
      map.off("mouseleave", CLUSTER_LAYER, onClusterLeave);
      map.off("mouseleave", UNCLUSTERED_LAYER, onMarkerLeave);
    };
  }, [mapRef]);
}
