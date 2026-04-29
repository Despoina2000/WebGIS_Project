import {
  setPointLayersVisibility,
  setPolygonLayersVisibility,
  updateLayerVisibility,
  LAYER_IDS,
} from '../layerVisibilityUtils';
import { ViewMode } from '../../models/types';

describe('layerVisibilityUtils', () => {
  let mockMap: mapboxgl.Map;

  beforeEach(() => {
    mockMap = {
      setLayoutProperty: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setPointLayersVisibility', () => {
    it('should set point layers to visible', () => {
      setPointLayersVisibility(mockMap, true);

      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(3);
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POINT,
        'visibility',
        'visible'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.CLUSTER,
        'visibility',
        'visible'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.CLUSTER_COUNT,
        'visibility',
        'visible'
      );
    });

    it('should set point layers to hidden', () => {
      setPointLayersVisibility(mockMap, false);

      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(3);
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POINT,
        'visibility',
        'none'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.CLUSTER,
        'visibility',
        'none'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.CLUSTER_COUNT,
        'visibility',
        'none'
      );
    });
  });

  describe('setPolygonLayersVisibility', () => {
    it('should set polygon layers to visible', () => {
      setPolygonLayersVisibility(mockMap, true);

      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(2);
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_FILL,
        'visibility',
        'visible'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_OUTLINE,
        'visibility',
        'visible'
      );
    });

    it('should set polygon layers to hidden', () => {
      setPolygonLayersVisibility(mockMap, false);

      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(2);
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_FILL,
        'visibility',
        'none'
      );
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_OUTLINE,
        'visibility',
        'none'
      );
    });
  });

  describe('updateLayerVisibility', () => {
    it('should show only points when mode is "points"', () => {
      updateLayerVisibility(mockMap, 'points');

      // Points should be visible
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POINT,
        'visibility',
        'visible'
      );
      // Polygons should be hidden
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_FILL,
        'visibility',
        'none'
      );
    });

    it('should show only polygons when mode is "polygons"', () => {
      updateLayerVisibility(mockMap, 'polygons');

      // Points should be hidden
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POINT,
        'visibility',
        'none'
      );
      // Polygons should be visible
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_FILL,
        'visibility',
        'visible'
      );
    });

    it('should show both points and polygons when mode is "both"', () => {
      updateLayerVisibility(mockMap, 'both');

      // Points should be visible
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POINT,
        'visibility',
        'visible'
      );
      // Polygons should be visible
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith(
        LAYER_IDS.POLYGON_FILL,
        'visibility',
        'visible'
      );
    });

    it('should handle all view modes', () => {
      const modes: ViewMode[] = ['points', 'polygons', 'both'];

      modes.forEach((mode) => {
        jest.clearAllMocks();
        mockMap.setLayoutProperty.mockClear();

        updateLayerVisibility(mockMap, mode);

        expect(mockMap.setLayoutProperty).toHaveBeenCalled();
      });
    });
  });

  describe('LAYER_IDS constant', () => {
    it('should export correct layer IDs', () => {
      expect(LAYER_IDS.POINT).toBe('points');
      expect(LAYER_IDS.CLUSTER).toBe('clusters');
      expect(LAYER_IDS.CLUSTER_COUNT).toBe('cluster-count');
      expect(LAYER_IDS.POLYGON_FILL).toBe('polygon-fill');
      expect(LAYER_IDS.POLYGON_OUTLINE).toBe('polygon-outline');
    });
  });
});