"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "../styles/module/MapQL.module.css";
import LayerControls from "./LayerControls";
import "mapbox-gl/dist/mapbox-gl.css";
import { ViewMode } from "../models/types";
import { updateLayerVisibility } from "../utils/layerVisibilityUtils";
import { loadGeoJsonData } from "../utils/dataLoadingUtils";
import {
  addClusterCountLayer,
  addClusterLayer,
  addGeoJsonSources,
  addPointLayer,
  addPolygonLayers,
} from "../utils/layerSetUpUtils";
import { separateGeoJsonByType } from "../utils/geoJsonUtils";
import {
  setupClickHandlers,
  setupLayersHoverCursor,
} from "../utils/mapInteractionUtils";

const URL_SOURCE = "/data/combined.json";

const MapQL = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // State to track current view mode and map load status
  const [viewMode, setViewMode] = useState<ViewMode>("both");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Update visibility when viewMode changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    updateLayerVisibility(map.current, viewMode);
  }, [viewMode, mapLoaded]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("Mapbox token is missing. Please add it to .env.local");
      return;
    }
    mapboxgl.accessToken = token;

    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12", // basemap style
        center: [23.73, 37.99], // Center on your data [lng, lat]
        zoom: 12,
      });

      // Wait for map to load before adding data
      map.current.on("load", async () => {
        if (!map.current) return;

        try {
          // Load and separate GeoJSON data
          const data = await loadGeoJsonData(URL_SOURCE);
          const { points, polygons } = separateGeoJsonByType(data);

          // Add sources
          addGeoJsonSources(map.current, points, polygons);

          // Add layers separately
          addPolygonLayers(map.current);
          addClusterLayer(map.current, points);
          addClusterCountLayer(map.current);
          addPointLayer(map.current);

          // Setup interactions
          setupLayersHoverCursor(map.current, [
            "clusters",
            "points",
            "polygon-fill",
          ]);
          setupClickHandlers(map.current);

          // Mark map as loaded
          setMapLoaded(true);
        } catch (error) {
          console.error("Error loading map data:", error);
        }
      });
    }
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainer} className={styles.mapContainer} />
      <LayerControls onViewModeChange={setViewMode} currentMode={viewMode} />
    </div>
  );
};

export default MapQL;
