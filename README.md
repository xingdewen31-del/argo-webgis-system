# argo-webgis-system
A WebGIS-based 3D visualization and query system for Argo buoy data using Vue, Cesium, FastAPI and PostGIS.
# Argo WebGIS Visualization System

## Project Introduction
This project is a WebGIS-based Argo buoy data visualization and query system.  
It integrates PostgreSQL/PostGIS, FastAPI, Vue, and Cesium to achieve spatial data storage, API services, 3D globe visualization, and interactive query of ocean buoy data.

## Tech Stack
- Frontend: Vue, PrimeVue, Cesium
- Backend: FastAPI, Python
- Database: PostgreSQL, PostGIS
- GIS: WebGIS, 3D visualization, spatial query

## Main Features
- User login and registration
- Argo buoy metadata query
- Argo observation data query
- 3D globe visualization of buoy locations
- Basemap switching
- Buoy popup information display
- Temperature and salinity profile display
- Multi-condition filtering by country and status

## Project Structure
```text
frontend/   Frontend code
backend/    Backend API services
database/   SQL scripts
docs/       Project documents and screenshots
## Highlights
- Frontend-backend separated architecture
- 3D WebGIS visualization with Cesium
- Spatial database design based on PostGIS
- Interactive buoy query and profile display
- ## Future Work
- Add real-time dynamic buoy query
- Add buoy positioning and tracking
- Support real-time data streaming
