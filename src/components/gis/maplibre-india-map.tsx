/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  MapPin,
  Crosshair,
  AlertCircle,
} from "lucide-react";
import {
  INDIA_STATES_DATA,
  getAshtaCadastralGeoJson,
} from "@/lib/gis/india-geo-data";
import { AdministrativeBoundaryProvider } from "@/lib/gis/boundary-provider";
import { CadastralFeature } from "./gis-workstation-view";

// Base map style types
export type BasemapStyle = "cadastral" | "satellite" | "topographic";

export interface MapLibreIndiaMapProps {
  currentTier: "country" | "state" | "district" | "tehsil";
  selectedState?: string;
  selectedDistrict?: string;
  selectedTehsil?: string;
  selectedYear?: number;
  selectedFeatureId?: string;
  activeLayers?: Record<string, boolean>;
  onSelectState: (stateName: string) => void;
  onSelectDistrict?: (districtName: string) => void;
  onSelectTehsil?: (tehsilName: string) => void;
  onSelectFeature?: (feature: CadastralFeature) => void;
  flyToLocation?: { center: [number, number]; zoom?: number } | null;
  className?: string;
}

// Initial center and zoom as requested (Longitude: 78.96, Latitude: 22.59, Zoom: ~4.5)
const INDIA_MAP_CENTER: [number, number] = [78.96, 22.59];
const INDIA_MAP_ZOOM = 4.5;

export function MapLibreIndiaMap({
  currentTier,
  selectedState = "India",
  selectedDistrict = "Sehore",
  selectedTehsil = "Ashta",
  selectedFeatureId,
  onSelectState,
  onSelectDistrict,
  onSelectTehsil,
  onSelectFeature,
  flyToLocation,
  className = "",
}: MapLibreIndiaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(INDIA_MAP_ZOOM);
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(INDIA_MAP_CENTER);
  const [activeStyle, setActiveStyle] = useState<BasemapStyle>("cadastral");
  const [satelliteNotice, setSatelliteNotice] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [basemapError, setBasemapError] = useState(false);

  // Read MapTiler API Key securely from Next.js public environment variable
  const mapTilerKey = (process.env.NEXT_PUBLIC_MAPTILER_KEY || "").trim();
  const hasMapTiler = Boolean(mapTilerKey && mapTilerKey !== "YOUR_MAPTILER_KEY_HERE");

  // Basemap style definition using MapTiler Cloud with graceful OSM fallback
  const getStyleSpec = useCallback(
    (style: BasemapStyle) => {
      let tileUrls: string[];
      let attribution: string;
      let rasterOpacity = 0.88;
      let rasterSaturation = -0.22;
      let rasterContrast = 0.04;

      if (hasMapTiler) {
        if (style === "satellite") {
          tileUrls = [
            `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
          ];
          attribution =
            '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
          rasterOpacity = 1.0;
          rasterSaturation = 0.05;
          rasterContrast = 0.08;
        } else if (style === "topographic") {
          tileUrls = [
            `https://api.maptiler.com/maps/topo-v2/256/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
          ];
          attribution =
            '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
          rasterOpacity = 0.92;
          rasterSaturation = 0.0;
          rasterContrast = 0.05;
        } else {
          // Cadastral / Analytical Basemap via MapTiler Dataviz Light
          tileUrls = [
            `https://api.maptiler.com/maps/dataviz-light/256/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
          ];
          attribution =
            '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
          rasterOpacity = 0.94;
          rasterSaturation = -0.15;
          rasterContrast = 0.05;
        }
      } else {
        // Fallback without API key
        if (style === "topographic") {
          tileUrls = [
            "https://tile.opentopomap.org/{z}/{x}/{y}.png",
            "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
            "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
            "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
          ];
          attribution =
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org" target="_blank" rel="noopener">OpenTopoMap</a> (CC-BY-SA)';
        } else {
          tileUrls = [
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          ];
          attribution =
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';
        }
      }

      return {
        version: 8,
        sources: {
          "basemap-tiles": {
            type: "raster",
            tiles: tileUrls,
            tileSize: 256,
            minzoom: 0,
            maxzoom: 19,
            attribution,
          },
        },
        layers: [
          {
            id: "basemap-tiles-layer",
            type: "raster",
            source: "basemap-tiles",
            minzoom: 0,
            maxzoom: 19,
            paint: {
              "raster-opacity": rasterOpacity,
              "raster-saturation": rasterSaturation,
              "raster-contrast": rasterContrast,
            },
          },
        ],
      };
    },
    [hasMapTiler]
  );

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let map: any = null;

    async function initMap() {
      try {
        const maplibreglModule = (await import("maplibre-gl")) as any;
        const maplibregl = maplibreglModule.default || maplibreglModule;

        map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: getStyleSpec("cadastral") as any,
          center: INDIA_MAP_CENTER,
          zoom: INDIA_MAP_ZOOM,
          minZoom: 3.5,
          maxZoom: 18,
          attributionControl: false,
        });

        // Add standard attribution with MapTiler / OpenStreetMap metadata
        const customAttribution = hasMapTiler
          ? "Basemap: MapTiler Real India • © MapTiler • © OpenStreetMap contributors"
          : "Administrative boundary data: Demonstration dataset • © OpenStreetMap contributors";

        map.addControl(
          new maplibregl.AttributionControl({
            compact: true,
            customAttribution,
          }),
          "bottom-right"
        );

        map.on("error", (e: any) => {
          if (
            e?.sourceId === "basemap-tiles" ||
            e?.sourceId === "osm-tiles" ||
            e?.error?.message?.includes("tile")
          ) {
            setBasemapError(true);
          }
        });

        map.on("load", () => {
          mapInstanceRef.current = map;
          setMapLoaded(true);
          setBasemapError(false);

          // 1. Add Indian States GeoJSON Source
          map.addSource("india-states", {
            type: "geojson",
            data: AdministrativeBoundaryProvider.getStates(),
          });

          // State Polygons Fill Layer (Subtle boundary highlights)
          map.addLayer({
            id: "states-fill",
            type: "fill",
            source: "india-states",
            paint: {
              "fill-color": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                "#3b82f6",
                "#173860",
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.22,
                0.08,
              ],
            },
          });

          // State Boundaries Outline Layer
          map.addLayer({
            id: "states-outline",
            type: "line",
            source: "india-states",
            paint: {
              "line-color": "#1e3a8a",
              "line-width": 1.5,
              "line-opacity": 0.8,
            },
          });

          // State Labels (Zoom < 8.5)
          map.addLayer({
            id: "states-labels",
            type: "symbol",
            source: "india-states",
            maxzoom: 8.5,
            layout: {
              "text-field": ["get", "name"],
              "text-size": 11,
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Regular"],
              "text-anchor": "center",
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": "#0f172a",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1.5,
            },
          });

          // 2. Add District Boundaries Source
          map.addSource("india-districts", {
            type: "geojson",
            data: AdministrativeBoundaryProvider.getDistricts(selectedState),
          });

          map.addLayer({
            id: "districts-fill",
            type: "fill",
            source: "india-districts",
            minzoom: 6.0,
            paint: {
              "fill-color": "#0284c7",
              "fill-opacity": [
                "case",
                ["boolean", ["feature-state", "hover"], false],
                0.24,
                0.06,
              ],
            },
          });

          map.addLayer({
            id: "districts-outline",
            type: "line",
            source: "india-districts",
            minzoom: 6.0,
            paint: {
              "line-color": "#0369a1",
              "line-width": 1.4,
              "line-dasharray": [3, 2],
            },
          });

          map.addLayer({
            id: "districts-labels",
            type: "symbol",
            source: "india-districts",
            minzoom: 7.0,
            maxzoom: 11.0,
            layout: {
              "text-field": ["get", "name"],
              "text-size": 10.5,
              "text-anchor": "center",
              "text-allow-overlap": false,
            },
            paint: {
              "text-color": "#0c4a6e",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1.2,
            },
          });

          // 3. Add Tehsil Boundaries Source
          map.addSource("india-tehsils", {
            type: "geojson",
            data: AdministrativeBoundaryProvider.getTehsils(selectedDistrict),
          });

          map.addLayer({
            id: "tehsils-fill",
            type: "fill",
            source: "india-tehsils",
            minzoom: 8.5,
            paint: {
              "fill-color": "#d97706",
              "fill-opacity": 0.08,
            },
          });

          map.addLayer({
            id: "tehsils-outline",
            type: "line",
            source: "india-tehsils",
            minzoom: 8.5,
            paint: {
              "line-color": "#b45309",
              "line-width": 1.3,
            },
          });

          map.addLayer({
            id: "tehsils-labels",
            type: "symbol",
            source: "india-tehsils",
            minzoom: 9.0,
            layout: {
              "text-field": ["get", "name"],
              "text-size": 10,
              "text-anchor": "center",
            },
            paint: {
              "text-color": "#78350f",
              "text-halo-color": "#ffffff",
              "text-halo-width": 1.2,
            },
          });

          // 4. Add Ashta Cadastral Parcels Source (for local zoom >= 11)
          map.addSource("ashta-cadastre", {
            type: "geojson",
            data: getAshtaCadastralGeoJson(),
          });

          map.addLayer({
            id: "cadastral-fill",
            type: "fill",
            source: "ashta-cadastre",
            minzoom: 11,
            paint: {
              "fill-color": [
                "match",
                ["get", "disputeStatus"],
                "Under Conciliation",
                "#ef4444",
                "Gram Sabha Review",
                "#f59e0b",
                /* default / clear */ "#10b981",
              ],
              "fill-opacity": 0.35,
            },
          });

          map.addLayer({
            id: "cadastral-outline",
            type: "line",
            source: "ashta-cadastre",
            minzoom: 11,
            paint: {
              "line-color": "#064e3b",
              "line-width": 1.8,
            },
          });

          // State Clicks & Hover Interaction
          let hoveredStateId: string | null = null;
          map.on("mousemove", "states-fill", (e: any) => {
            if (e.features.length > 0) {
              map.getCanvas().style.cursor = "pointer";
              const feat = e.features[0];
              setHoveredRegion(feat.properties.name);

              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: "india-states", id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = feat.id;
              map.setFeatureState(
                { source: "india-states", id: hoveredStateId },
                { hover: true }
              );
            }
          });

          map.on("mouseleave", "states-fill", () => {
            map.getCanvas().style.cursor = "";
            setHoveredRegion(null);
            if (hoveredStateId !== null) {
              map.setFeatureState(
                { source: "india-states", id: hoveredStateId },
                { hover: false }
              );
              hoveredStateId = null;
            }
          });

          map.on("click", "states-fill", (e: any) => {
            if (e.features.length > 0) {
              const stateName = e.features[0].properties.name;
              onSelectState(stateName);
            }
          });

          // District Clicks
          map.on("click", "districts-fill", (e: any) => {
            if (e.features.length > 0 && onSelectDistrict) {
              const distName = e.features[0].properties.name;
              onSelectDistrict(distName);
            }
          });

          // Tehsil Clicks
          map.on("click", "tehsils-fill", (e: any) => {
            if (e.features.length > 0 && onSelectTehsil) {
              const tehsilName = e.features[0].properties.name;
              onSelectTehsil(tehsilName);
            }
          });

          // Cadastral Parcel Clicks
          map.on("click", "cadastral-fill", (e: any) => {
            if (e.features.length > 0 && onSelectFeature) {
              const p = e.features[0].properties;
              onSelectFeature({
                id: p.id,
                khasraNo: p.khasraNo,
                ownerName: p.ownerName,
                areaHa: parseFloat(p.areaHa),
                areaBigha: parseFloat(p.areaBigha),
                tenureType: p.tenureType,
                landClassification: p.landClassification,
                disputeStatus: p.disputeStatus,
                points: "",
                centroid: { x: 400, y: 250 },
              });
            }
          });

          map.on("zoom", () => {
            setCurrentZoom(Math.round(map.getZoom() * 10) / 10);
          });

          map.on("move", () => {
            const center = map.getCenter();
            setCurrentCenter([
              Math.round(center.lng * 100) / 100,
              Math.round(center.lat * 100) / 100,
            ]);
          });
        });
      } catch (err) {
        console.error("Failed to initialize MapLibre GL map:", err);
      }
    }

    initMap();

    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [getStyleSpec, onSelectDistrict, onSelectFeature, onSelectState, onSelectTehsil, selectedDistrict, selectedState]);

  // Update dynamic district and tehsil GeoJSON when selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    const distSource = map.getSource("india-districts");
    if (distSource) {
      distSource.setData(AdministrativeBoundaryProvider.getDistricts(selectedState));
    }

    const tehsilSource = map.getSource("india-tehsils");
    if (tehsilSource) {
      tehsilSource.setData(AdministrativeBoundaryProvider.getTehsils(selectedDistrict));
    }
  }, [selectedState, selectedDistrict, mapLoaded]);

  // Handle Basemap Switcher with smooth raster layer swap
  const handleStyleChange = (style: BasemapStyle) => {
    setActiveStyle(style);
    if (style === "satellite" && !hasMapTiler) {
      setSatelliteNotice(true);
      setTimeout(() => setSatelliteNotice(false), 5000);
      return;
    }
    setSatelliteNotice(false);

    const map = mapInstanceRef.current;
    if (!map) return;

    try {
      const spec = getStyleSpec(style);
      const newSource = spec.sources["basemap-tiles"];
      const newLayer = spec.layers[0];

      if (map.getLayer("basemap-tiles-layer")) {
        map.removeLayer("basemap-tiles-layer");
      }
      if (map.getSource("basemap-tiles")) {
        map.removeSource("basemap-tiles");
      }
      map.addSource("basemap-tiles", newSource);
      if (map.getLayer("states-fill")) {
        map.addLayer(newLayer, "states-fill");
      } else {
        map.addLayer(newLayer);
      }
    } catch (err) {
      console.warn("Could not hot-swap basemap layer, falling back to setStyle:", err);
      map.setStyle(getStyleSpec(style));
    }
  };

  // Fly to custom searched coordinates when geocoded via MapTiler
  useEffect(() => {
    if (!flyToLocation || !mapInstanceRef.current || !mapLoaded) return;
    mapInstanceRef.current.flyTo({
      center: flyToLocation.center,
      zoom: flyToLocation.zoom || 11,
      essential: true,
      duration: 1400,
    });
  }, [flyToLocation, mapLoaded]);

  // Highlight currently selected administrative feature or cadastral parcel
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    try {
      if (map.getLayer("states-outline")) {
        map.setPaintProperty("states-outline", "line-color", [
          "case",
          ["==", ["get", "name"], selectedState || ""],
          "#D35E0E",
          "#1e3a8a",
        ]);
        map.setPaintProperty("states-outline", "line-width", [
          "case",
          ["==", ["get", "name"], selectedState || ""],
          2.6,
          1.5,
        ]);
      }
      if (map.getLayer("districts-outline")) {
        map.setPaintProperty("districts-outline", "line-color", [
          "case",
          ["==", ["get", "name"], selectedDistrict || ""],
          "#D35E0E",
          "#0369a1",
        ]);
        map.setPaintProperty("districts-outline", "line-width", [
          "case",
          ["==", ["get", "name"], selectedDistrict || ""],
          2.6,
          1.4,
        ]);
      }
      if (map.getLayer("tehsils-outline")) {
        map.setPaintProperty("tehsils-outline", "line-color", [
          "case",
          ["==", ["get", "name"], selectedTehsil || ""],
          "#D35E0E",
          "#b45309",
        ]);
        map.setPaintProperty("tehsils-outline", "line-width", [
          "case",
          ["==", ["get", "name"], selectedTehsil || ""],
          2.6,
          1.3,
        ]);
      }
      if (map.getLayer("cadastral-outline")) {
        map.setPaintProperty("cadastral-outline", "line-color", [
          "case",
          ["==", ["get", "khasraNo"], selectedFeatureId || ""],
          "#D35E0E",
          ["==", ["get", "id"], selectedFeatureId || ""],
          "#D35E0E",
          "#064e3b",
        ]);
        map.setPaintProperty("cadastral-outline", "line-width", [
          "case",
          ["==", ["get", "khasraNo"], selectedFeatureId || ""],
          3.2,
          ["==", ["get", "id"], selectedFeatureId || ""],
          3.2,
          1.8,
        ]);
      }
    } catch {
      // Ignore if layers are not yet ready
    }
  }, [selectedState, selectedDistrict, selectedTehsil, selectedFeatureId, mapLoaded]);

  // Fly to selected geography
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;

    if (currentTier === "country" || selectedState === "India") {
      map.flyTo({
        center: INDIA_MAP_CENTER,
        zoom: INDIA_MAP_ZOOM,
        essential: true,
        duration: 1200,
      });
    } else if (currentTier === "state") {
      const stateObj = INDIA_STATES_DATA.find(
        (s) => s.name.toLowerCase() === selectedState.toLowerCase()
      );
      if (stateObj) {
        map.flyTo({
          center: stateObj.coordinates,
          zoom: 6.8,
          essential: true,
          duration: 1200,
        });
      }
    } else if (currentTier === "district") {
      if (selectedDistrict.toLowerCase() === "sehore") {
        map.flyTo({
          center: [77.0841, 23.2048],
          zoom: 9.8,
          essential: true,
          duration: 1200,
        });
      } else if (selectedDistrict.toLowerCase() === "pune") {
        map.flyTo({
          center: [73.8567, 18.5204],
          zoom: 9.8,
          essential: true,
          duration: 1200,
        });
      }
    } else if (currentTier === "tehsil") {
      if (selectedTehsil.toLowerCase() === "ashta") {
        map.flyTo({
          center: [76.7214, 23.0232],
          zoom: 13.5,
          essential: true,
          duration: 1200,
        });
      }
    }
  }, [currentTier, selectedState, selectedDistrict, selectedTehsil, mapLoaded]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleResetIndia = () => {
    onSelectState("India");
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: INDIA_MAP_CENTER,
        zoom: INDIA_MAP_ZOOM,
        essential: true,
        duration: 1200,
      });
    }
  };

  const handleLocateCurrent = () => {
    if (!mapInstanceRef.current) return;
    if (currentTier === "tehsil") {
      mapInstanceRef.current.flyTo({ center: [76.7214, 23.0232], zoom: 13.5, essential: true });
    } else if (currentTier === "district") {
      mapInstanceRef.current.flyTo({ center: [77.0841, 23.2048], zoom: 9.8, essential: true });
    } else if (currentTier === "state") {
      mapInstanceRef.current.flyTo({ center: [77.4126, 23.2599], zoom: 6.8, essential: true });
    } else {
      mapInstanceRef.current.flyTo({ center: INDIA_MAP_CENTER, zoom: INDIA_MAP_ZOOM, essential: true });
    }
  };

  const handleToggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full h-[580px] bg-slate-900 rounded-sm border border-slate-300 overflow-hidden shadow-xs flex select-none ${className}`}
    >
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Top Header: Live Coordinates & Current Geographic Context */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded shadow-xs border border-slate-200/80 text-[11px] font-mono flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#D35E0E]" />
          <span className="font-bold text-slate-800">
            {currentTier === "country"
              ? "India (National)"
              : `${selectedTehsil || ""}, ${selectedDistrict || ""}, ${selectedState || ""}`}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">
            Z: {currentZoom} ({currentCenter[1].toFixed(2)}°N, {currentCenter[0].toFixed(2)}°E)
          </span>
        </div>

        {hoveredRegion && (
          <div className="bg-[#0A1C30]/90 text-white px-2.5 py-1 rounded text-xs font-semibold shadow-xs animate-in fade-in">
            {hoveredRegion}
          </div>
        )}
      </div>

      {/* Floating Basemap Style Switcher (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded shadow-xs border border-slate-200/80 pointer-events-auto">
        <button
          type="button"
          onClick={() => handleStyleChange("cadastral")}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
            activeStyle === "cadastral"
              ? "bg-[#0A1C30] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Cadastral & Analytical View"
        >
          Cadastral
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("topographic")}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
            activeStyle === "topographic"
              ? "bg-[#0A1C30] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Topographic Relief View"
        >
          Topographic
        </button>
        <button
          type="button"
          onClick={() => handleStyleChange("satellite")}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
            activeStyle === "satellite"
              ? "bg-[#0A1C30] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="Satellite Imagery"
        >
          Satellite
        </button>
      </div>

      {/* Satellite Imagery Notice (Only shown when key is absent and user attempts satellite) */}
      {satelliteNotice && !hasMapTiler && (
        <div className="absolute top-14 right-3 z-30 max-w-sm bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded shadow-lg text-xs animate-in fade-in slide-in-from-top-2 pointer-events-auto">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Satellite Basemap Notice</strong>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                Configure NEXT_PUBLIC_MAPTILER_KEY in .env.local to activate high-resolution satellite raster imagery.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clean Basemap Error Handling */}
      {basemapError && (
        <div className="absolute top-14 left-3 z-30 bg-amber-50 border border-amber-300 rounded px-3 py-1.5 text-xs text-amber-900 shadow-md flex items-center gap-2 pointer-events-auto">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Basemap unavailable</span>
          <button
            type="button"
            onClick={() => {
              setBasemapError(false);
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setStyle(getStyleSpec(activeStyle));
              }
            }}
            className="underline font-bold text-amber-900 hover:text-amber-950 ml-1"
          >
            Retry
          </button>
        </div>
      )}

      {/* Floating Vertical Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xs rounded shadow-xs border border-slate-200/80 flex flex-col divide-y divide-slate-100 overflow-hidden">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetIndia}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Reset View to India"
            aria-label="Reset to India"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleLocateCurrent}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Locate Selected Geography"
            aria-label="Locate Geography"
          >
            <Crosshair className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Zoom-Tier Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700 flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${hasMapTiler ? "bg-emerald-400" : "bg-sky-400"} animate-pulse`} />
          <span>Tier: {currentTier.toUpperCase()}</span>
          <span className="text-slate-400">•</span>
          <span>
            {currentZoom < 6
              ? "National State Boundaries"
              : currentZoom < 9
              ? "District Boundaries"
              : currentZoom < 11
              ? "Tehsil Boundaries"
              : "Cadastral Demonstration Mesh"}
          </span>
          {hasMapTiler && (
            <>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-300 font-semibold">MapTiler Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
