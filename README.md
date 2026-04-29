# WebGIS Project

A modern geospatial web application built with Next.js, React, TypeScript, and Mapbox GL. This application visualizes geospatial data (points and polygons) on an interactive map with clustering, filtering, and detailed interaction features.

## Features

- **Interactive Map** - Powered by Mapbox GL with smooth interactions
- **Point Clustering** - Dynamic clustering with zoom-dependent visibility
- **Layer Control** - Toggle between points, polygons, or both views
- **Data Filtering** - View modes for different geographic data types
- **Click Interactions** - Popups showing detailed information about features
- **Hover Effects** - Visual feedback when hovering over interactive elements
- **Type-Safe** - Full TypeScript implementation for reliable code

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Mapbox GL access token (get one from [Mapbox](https://www.mapbox.com))

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd webgis-project
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

4. **Run the development server:**

```bash
npm run dev
```
pen [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
webgis-app/
├── app/
│   ├── components/          # React components
│   │   ├── LayerControls.tsx
│   │   └── MapQL.tsx
│   ├── models/              # TypeScript types
│   │   └── types.ts
│   ├── utils/               # Utility functions
│   │   ├── dataLoadingUtils.ts
│   │   ├── geoJsonUtil.ts
│   │   ├── layerSetupUtils.ts
│   │   ├── layerVisibilityUtils.ts
│   │   ├── mapInteractionUtils.ts
│   │   └── __tests__/       # Unit tests
│   ├── styles/              # CSS modules
│   └── layout.tsx
├── public/
│   └── data/                # GeoJSON data files
│       └── combined.json
├── jest.config.ts           # Jest configuration
└── package.json
```

## Architecture & Design Decisions

### 1. **Utility-First Architecture**
- **Decision**: Separated concerns into focused utility modules (`dataLoadingUtils`, `layerSetupUtils`, etc.)
- **Benefit**: Improves testability, reusability, and maintainability. Each utility is independently testable.
- **Trade-off**: More files, but easier to understand and modify individual features.

### 2. **Mapbox GL Integration**
- **Decision**: Used Mapbox GL directly via React hooks instead of a wrapper library
- **Benefit**: Full control over map behavior, better performance, direct access to Mapbox features
- **Trade-off**: More manual event handling and state management

### 3. **Dynamic Cluster Breakpoints**
- **Decision**: Calculate cluster radius breakpoints dynamically from data distribution
- **Benefit**: Clusters scale appropriately regardless of data density
- **Implementation**: `calculateDynamicBreakpoints()` analyzes point_count distribution and generates Mapbox step expressions

### 4. **TypeScript Strict Mode**
- **Decision**: Full TypeScript typing for all functions and components
- **Benefit**: Catches errors at compile time, improves IDE autocomplete, self-documenting code
- **Trade-off**: Slightly more verbose, requires type discipline

### 5. **Jest Testing Framework**
- **Decision**: Jest + Testing Library for unit tests with jsdom environment
- **Benefit**: Jest is industry standard, jsdom allows testing without a real browser
- **Trade-off**: Mapbox GL requires mocking since it relies on canvas/WebGL

## Testing Coverage

**46 test cases** covering:
- **geoJsonUtil** (5 tests) - GeoJSON separation logic
- **layerSetupUtils** (13 tests) - Mapbox layer creation and configuration
- **layerVisibilityUtils** (8 tests) - Layer visibility management

## Future Improvements

### Short Term (High Priority)
1. **E2E Testing** 
   - Add Playwright tests for full user workflows
   - Test map loading, layer interaction, filter switching, popup display
   - Currently only unit tests exist; integration testing would catch component-level issues

2. **Performance Optimization**
   - Add performance metrics monitoring
   - Optimize GeoJSON rendering for large datasets (1000+ features)



### Medium Term (Enhancement)
3. **Advanced Filtering**
   - Add property-based filters (date range, category, area)
   - Support complex filter expressions
   - Real-time search and filtering UI


4. **Support New features**
   - User being able to add there own points and polygons by interacting with map

### Long Term (Architecture)
5. **Map Feature Store**
   - Implement a feature selection/management system
   - Multiple selection support
   - Feature history/undo-redo
   - Export selected features

6. **Real-Time Data Updates**
   - WebSocket support for live data updates
   - Delta updates instead of full reloads
   - Conflict resolution for concurrent updates

7. **Advanced Geospatial Operations**
   - Distance calculations, area measurements
   - Polygon intersection/union operations
   - Heatmap visualization

8. **Mobile Responsiveness**
    - Touch gesture support (pinch zoom, rotation)
    - Mobile-optimized controls and UI
    - Offline-first architecture for mobile users

## Known Issues & Limitations

- **Mobile Support**: Currently desktop-optimized; mobile responsive design needed
- **Mapbox Token**: Required in environment; no fallback visualization
- **GeoJSON Format**: Assumes standard GeoJSON format; custom formats need preprocessing

## Dependencies

- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Mapbox GL 3** - Map rendering
- **Tailwind CSS 4** - Styling
- **Jest** - Testing framework
- **Testing Library** - Component testing utilities

## Contributing

1. Ensure all tests pass: `npm test`
2. Run linter: `npm run lint`
3. Maintain TypeScript strict mode
4. Add tests for new utilities
5. Update documentation for API changes

## Tutorials
In order to support this project I did some research:

- [Udemy Tutorial: Interactive maps with Mapbox!](https://www.udemy.com/course/interactive-maps-with-mapbox)
- [Mapbox Documentation Guide] (https://docs.mapbox.com/mapbox-gl-js/guides/)


## Team Members
- [Despoina Papadopoulou](https://github.com/Despoina2000)
