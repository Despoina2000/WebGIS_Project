import { separateGeoJsonByType } from '../geoJsonUtils';
import { FeatureCollection } from 'geojson';

describe('geoJsonUtil', () => {
  describe('separateGeoJsonByType', () => {
    it('should separate points and polygons correctly', () => {
      const mockGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [23.73, 37.99] },
            properties: { name: 'Point 1' },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            },
            properties: { name: 'Polygon 1' },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [24.0, 38.0] },
            properties: { name: 'Point 2' },
          },
        ],
      };

      const { points, polygons } = separateGeoJsonByType(mockGeoJson);

      expect(points.features).toHaveLength(2);
      expect(polygons.features).toHaveLength(1);
      expect(points.features[0].geometry.type).toBe('Point');
      expect(polygons.features[0].geometry.type).toBe('Polygon');
    });

    it('should handle empty GeoJSON', () => {
      const emptyGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      const { points, polygons } = separateGeoJsonByType(emptyGeoJson);

      expect(points.features).toHaveLength(0);
      expect(polygons.features).toHaveLength(0);
    });

    it('should handle GeoJSON with only points', () => {
      const pointsOnlyGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [23.73, 37.99] },
            properties: { name: 'Point 1' },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [24.0, 38.0] },
            properties: { name: 'Point 2' },
          },
        ],
      };

      const { points, polygons } = separateGeoJsonByType(pointsOnlyGeoJson);

      expect(points.features).toHaveLength(2);
      expect(polygons.features).toHaveLength(0);
    });

    it('should handle GeoJSON with only polygons', () => {
      const polygonsOnlyGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]],
            },
            properties: { name: 'Polygon 1' },
          },
        ],
      };

      const { points, polygons } = separateGeoJsonByType(polygonsOnlyGeoJson);

      expect(points.features).toHaveLength(0);
      expect(polygons.features).toHaveLength(1);
    });

    it('should preserve properties in separated features', () => {
      const mockGeoJson: FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [23.73, 37.99] },
            properties: { name: 'Point 1', id: 123 },
          },
        ],
      };

      const { points } = separateGeoJsonByType(mockGeoJson);

      expect(points.features[0].properties?.name).toBe('Point 1');
      expect(points.features[0].properties?.id).toBe(123);
    });
  });
});