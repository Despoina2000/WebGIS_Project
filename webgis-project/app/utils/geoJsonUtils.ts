import { FeatureCollection, Point, Polygon, Feature } from "geojson";

export const separateGeoJsonByType = (
  data: FeatureCollection
): { points: FeatureCollection<Point>; polygons: FeatureCollection<Polygon> } => {
  return {
    points: {
      ...data,
      features: data.features.filter(
        (f): f is Feature<Point> => f.geometry.type === "Point"
      ),
    },
    polygons: {
      ...data,
      features: data.features.filter(
        (f): f is Feature<Polygon> => f.geometry.type === "Polygon"
      ),
    },
  };
};