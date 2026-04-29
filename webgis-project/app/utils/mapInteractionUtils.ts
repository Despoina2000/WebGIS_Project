import mapboxgl from "mapbox-gl";

/**
 * Create and display a popup at the specified location
 */
export const showPopup = (
  map: mapboxgl.Map,
  lngLat: mapboxgl.LngLat,
  htmlContent: string,
): void => {
  new mapboxgl.Popup({
    className: "custom-popup",
    closeButton: true,
    closeOnClick: true,
  })
    .setLngLat(lngLat)
    .setHTML(htmlContent)
    .addTo(map);
};

/**
 * Setup cursor pointer on hover for a layer
 */
export const setupLayerHoverCursor = (
  map: mapboxgl.Map,
  layerId: string,
): void => {
  map.on("mouseenter", layerId, () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", layerId, () => {
    map.getCanvas().style.cursor = "";
  });
};

/**
 * Setup cursor pointer on hover for multiple layers
 */
export const setupLayersHoverCursor = (
  map: mapboxgl.Map,
  layerIds: string[],
): void => {
  layerIds.forEach((layerId) => {
    setupLayerHoverCursor(map, layerId);
  });
};

/**
 * Handle cluster click - zoom in to cluster
 */
export const handleClusterClick = (
  map: mapboxgl.Map,
  e: mapboxgl.MapMouseEvent,
): void => {
  if (!e.features || e.features.length === 0) return;

  const clusterId = e.features[0].id;
  const features = map.querySourceFeatures("points-data", {
    filter: ["has", "point_count"],
  });
  const feature = features.find((f) => f.id === clusterId);

  if (feature?.properties) {
    map.flyTo({
      center: e.lngLat,
      zoom: map.getZoom() + 2,
      duration: 300,
    });
  }
};

/**
 * Handle point click - show popup with point info
 */
export const handlePointClick = (
  map: mapboxgl.Map,
  e: mapboxgl.MapMouseEvent,
): void => {
  if (!e.features || e.features.length === 0) return;

  const props = e.features[0].properties;
  showPopup(
    map,
    e.lngLat,
    `<strong>${props?.name || "Point"}</strong><br/>${props?.category || ""}<br/>${props?.description || ""}`,
  );
};

/**
 * Handle polygon click - show popup with polygon info
 * Only shows popup if no points/clusters were clicked at the same location
 */
export const handlePolygonClick = (
  map: mapboxgl.Map,
  e: mapboxgl.MapMouseEvent,
): void => {
  if (!e.features || e.features.length === 0) return;

  // Check if a point or cluster was actually clicked at this exact location
  const renderedFeatures = map.queryRenderedFeatures(e.point, {
    layers: ["points", "clusters"],
  });

  // Only show polygon popup if no points or clusters were clicked
  if (renderedFeatures.length > 0) return;

  const props = e.features[0].properties;
  showPopup(
    map,
    e.lngLat,
    `<strong>${props?.name || "Polygon"}</strong><br/>${props?.info || ""}`,
  );
};

/**
 * Setup all click handlers for the map
 */
export const setupClickHandlers = (map: mapboxgl.Map): void => {
  map.on("click", "clusters", (e) => handleClusterClick(map, e));
  map.on("click", "points", (e) => handlePointClick(map, e));
  map.on("click", "polygon-fill", (e) => handlePolygonClick(map, e));
};
