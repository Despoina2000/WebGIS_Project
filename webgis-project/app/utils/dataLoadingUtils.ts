import { FeatureCollection } from "geojson";

/**
 * Load GeoJSON data from a URL
 */
export const loadGeoJsonData = async (
  url: string
): Promise<FeatureCollection> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error loading GeoJSON:", error);
    throw error;
  }
};