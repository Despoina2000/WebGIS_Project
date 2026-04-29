import mapboxgl, { DataDrivenPropertyValueSpecification } from "mapbox-gl";
import { FeatureCollection, Point, Polygon } from "geojson";

/**
 * Add GeoJSON sources for points and polygons
 */
export const addGeoJsonSources = (
  map: mapboxgl.Map,
  points: FeatureCollection<Point>,
  polygons: FeatureCollection<Polygon>
): void => {
  // Add source for points with clustering enabled
  map.addSource("points-data", {
    type: "geojson",
    data: points,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  // Add source for polygons (no clustering needed)
  map.addSource("polygons-data", {
    type: "geojson",
    data: polygons,
  });
};

/**
 * Add polygon fill and outline layers
 */
export const addPolygonLayers = (map: mapboxgl.Map): void => {
  // Add polygon layer (fill)
  map.addLayer({
    id: "polygon-fill",
    type: "fill",
    source: "polygons-data",
    paint: {
      "fill-color": "#ff7b00",
      "fill-opacity": 0.4,
      "fill-outline-color": "#cc6000",
    },
  });

  // Add polygon outline
  map.addLayer({
    id: "polygon-outline",
    type: "line",
    source: "polygons-data",
    paint: {
      "line-color": "#cc6000",
      "line-width": 2,
    },
  });
};

/**
 * Calculate dynamic breakpoints based on point_count distribution
 * @param points - GeoJSON FeatureCollection of points
 * @param defaultRadius - Default radius for unclustered points
 * @param numBreakpoints - Number of breakpoints to generate
 * @returns Array formatted for Mapbox step expression
 */
const calculateDynamicBreakpoints = (
  points: FeatureCollection<Point>,
  defaultRadius: number = 20,
  numBreakpoints: number = 4
): DataDrivenPropertyValueSpecification<number> => {
  // Get all point_count values from the data
  const pointCounts = points.features
    .map(feature => feature.properties?.point_count || 0)
    .filter(count => count > 0)
    .sort((a, b) => a - b);

  if (pointCounts.length === 0) {
    return ["step", ["get", "point_count"], defaultRadius, 1, defaultRadius];
  }

  // Calculate percentiles for breakpoints
  const percentiles = Array.from({ length: numBreakpoints }, (_, i) =>
    Math.floor((i + 1) * (100 / (numBreakpoints + 1)))
  );

  const breakpoints: DataDrivenPropertyValueSpecification<number> = [
    "step",
    ["get", "point_count"],
    defaultRadius,
  ];

  percentiles.forEach((percentile, index) => {
    const position = Math.floor((percentile / 100) * (pointCounts.length - 1));
    const threshold = pointCounts[position];
    const radius = defaultRadius + (index + 1) * 5; // Increment radius by 5 for each breakpoint

    breakpoints.push(threshold, radius);
  });

  return breakpoints;
};

/**
 * Add cluster layer (for clustered points)
 */
export const addClusterLayer = (map: mapboxgl.Map, points: FeatureCollection<Point>): void => {
  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "points-data",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#51bbd6",
      "circle-radius": calculateDynamicBreakpoints(points, 20, 4),
      "circle-stroke-width": 2,
      "circle-stroke-color": "#fff",
    },
  });
};

/**
 * Add cluster count text layer
 */
export const addClusterCountLayer = (map: mapboxgl.Map): void => {
  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "points-data",
    filter: ["has", "point_count"],
    layout: {
      "text-field": ["get", "point_count"],
      "text-font": ["DIN Offc Pro Medium"],
      "text-size": 12,
    },
    paint: {
      "text-color": "#fff",
    },
  });
};

/**
 * Add individual point layer (unclustered points only)
 */
export const addPointLayer = (map: mapboxgl.Map): void => {
  map.addLayer({
    id: "points",
    type: "circle",
    source: "points-data",
    paint: {
      "circle-radius": 8,
      "circle-color": "#3b82f6",
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
    filter: ["!", ["has", "point_count"]],
  });
};