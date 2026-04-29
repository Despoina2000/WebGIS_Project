import {
  addGeoJsonSources,
  addPolygonLayers,
  addClusterLayer,
  addClusterCountLayer,
  addPointLayer,
} from '../layerSetupUtils';
import { FeatureCollection, Point } from 'geojson';

// Mock mapbox-gl
jest.mock('mapbox-gl');

describe('layerSetupUtils', () => {
  let mockMap: any;

  beforeEach(() => {
    mockMap = {
      addSource: jest.fn(),
      addLayer: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addGeoJsonSources', () => {
    it('should add points and polygons sources with correct configuration', () => {
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [],
      };
      const polygons: FeatureCollection<any> = {
        type: 'FeatureCollection',
        features: [],
      };

      addGeoJsonSources(mockMap, points, polygons);

      expect(mockMap.addSource).toHaveBeenCalledTimes(2);

      // Check points source
      expect(mockMap.addSource).toHaveBeenNthCalledWith(
        1,
        'points-data',
        expect.objectContaining({
          type: 'geojson',
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        })
      );

      // Check polygons source
      expect(mockMap.addSource).toHaveBeenNthCalledWith(
        2,
        'polygons-data',
        expect.objectContaining({
          type: 'geojson',
        })
      );
    });

    it('should add sources with the provided GeoJSON data', () => {
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [23.73, 37.99] },
            properties: {},
          },
        ],
      };
      const polygons: FeatureCollection<any> = {
        type: 'FeatureCollection',
        features: [],
      };

      addGeoJsonSources(mockMap, points, polygons);

      const pointsCall = mockMap.addSource.mock.calls[0];
      expect(pointsCall[1].data).toEqual(points);
    });
  });

  describe('addPolygonLayers', () => {
    it('should add polygon fill and outline layers', () => {
      addPolygonLayers(mockMap);

      expect(mockMap.addLayer).toHaveBeenCalledTimes(2);

      // Check polygon fill layer
      expect(mockMap.addLayer).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          id: 'polygon-fill',
          type: 'fill',
          source: 'polygons-data',
        })
      );

      // Check polygon outline layer
      expect(mockMap.addLayer).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          id: 'polygon-outline',
          type: 'line',
          source: 'polygons-data',
        })
      );
    });

    it('should set correct paint properties for polygon layers', () => {
      addPolygonLayers(mockMap);

      const fillCall = mockMap.addLayer.mock.calls[0][0];
      expect(fillCall.paint).toEqual({
        'fill-color': '#ff7b00',
        'fill-opacity': 0.4,
        'fill-outline-color': '#cc6000',
      });

      const outlineCall = mockMap.addLayer.mock.calls[1][0];
      expect(outlineCall.paint).toEqual({
        'line-color': '#cc6000',
        'line-width': 2,
      });
    });
  });

  describe('addClusterLayer', () => {
    it('should add cluster layer with correct configuration', () => {
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { point_count: 5 },
          },
        ],
      };

      addClusterLayer(mockMap, points);

      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'clusters',
          type: 'circle',
          source: 'points-data',
          filter: ['has', 'point_count'],
        })
      );
    });

    it('should set cluster paint properties', () => {
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [],
      };

      addClusterLayer(mockMap, points);

      const call = mockMap.addLayer.mock.calls[0][0];
      expect(call.paint).toEqual(
        expect.objectContaining({
          'circle-color': '#51bbd6',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        })
      );
      expect(call.paint['circle-radius']).toBeDefined();
    });

    it('should calculate dynamic breakpoints for circle-radius', () => {
      const points: FeatureCollection<Point> = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { point_count: 5 },
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [1, 1] },
            properties: { point_count: 15 },
          },
        ],
      };

      addClusterLayer(mockMap, points);

      const call = mockMap.addLayer.mock.calls[0][0];
      const circleRadius = call.paint['circle-radius'];

      // Check that it's a step expression
      expect(Array.isArray(circleRadius)).toBe(true);
      expect(circleRadius[0]).toBe('step');
    });
  });

  describe('addClusterCountLayer', () => {
    it('should add cluster count text layer', () => {
      addClusterCountLayer(mockMap);

      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'cluster-count',
          type: 'symbol',
          source: 'points-data',
          filter: ['has', 'point_count'],
        })
      );
    });

    it('should set correct layout and paint properties', () => {
      addClusterCountLayer(mockMap);

      const call = mockMap.addLayer.mock.calls[0][0];

      expect(call.layout).toEqual(
        expect.objectContaining({
          'text-field': ['get', 'point_count'],
          'text-size': 12,
        })
      );

      expect(call.paint).toEqual({
        'text-color': '#fff',
      });
    });
  });

  describe('addPointLayer', () => {
    it('should add individual point layer', () => {
      addPointLayer(mockMap);

      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'points',
          type: 'circle',
          source: 'points-data',
          filter: ['!', ['has', 'point_count']],
        })
      );
    });

    it('should set correct paint properties for points', () => {
      addPointLayer(mockMap);

      const call = mockMap.addLayer.mock.calls[0][0];

      expect(call.paint).toEqual({
        'circle-radius': 8,
        'circle-color': '#3b82f6',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      });
    });

    it('should filter out clustered points', () => {
      addPointLayer(mockMap);

      const call = mockMap.addLayer.mock.calls[0][0];

      // Filter should exclude any features with point_count property
      expect(call.filter).toEqual(['!', ['has', 'point_count']]);
    });
  });
});