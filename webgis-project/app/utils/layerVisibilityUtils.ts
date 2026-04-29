import { ViewMode } from "../models/types";

const LAYER_IDS = {
  POINT: "points",
  CLUSTER: "clusters",
  CLUSTER_COUNT: "cluster-count",
  POLYGON_FILL: "polygon-fill",
  POLYGON_OUTLINE: "polygon-outline",
} as const;

/**
 * Set visibility for point-related layers
 */
export const setPointLayersVisibility = (
  map: mapboxgl.Map,
  visible: boolean
): void => {
  const visibility = visible ? "visible" : "none";
  map.setLayoutProperty(LAYER_IDS.POINT, "visibility", visibility);
  map.setLayoutProperty(LAYER_IDS.CLUSTER, "visibility", visibility);
  map.setLayoutProperty(LAYER_IDS.CLUSTER_COUNT, "visibility", visibility);
};

/**
 * Set visibility for polygon-related layers
 */
export const setPolygonLayersVisibility = (
  map: mapboxgl.Map,
  visible: boolean
): void => {
  const visibility = visible ? "visible" : "none";
  map.setLayoutProperty(LAYER_IDS.POLYGON_FILL, "visibility", visibility);
  map.setLayoutProperty(LAYER_IDS.POLYGON_OUTLINE, "visibility", visibility);
};

/**
 * Update all layer visibility based on view mode
 */
export const updateLayerVisibility = (
  map: mapboxgl.Map,
  mode: ViewMode
): void => {
  switch (mode) {
    case "points":
      setPointLayersVisibility(map, true);
      setPolygonLayersVisibility(map, false);
      break;
    case "polygons":
      setPointLayersVisibility(map, false);
      setPolygonLayersVisibility(map, true);
      break;
    case "both":
      setPointLayersVisibility(map, true);
      setPolygonLayersVisibility(map, true);
      break;
  }
};

export { LAYER_IDS };