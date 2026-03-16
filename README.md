# Argo WebGIS System

**Author:** xingdewen  

**Demo Video:**  
https://www.instagram.com/reel/DV42lq7Eb-q/?igsh=MWlhd2NpdHUzZ25zeg==

---

## Project Introduction

**Argo WebGIS System** is a web-based geographic information system designed for the visualization and management of global Argo float data. The system integrates modern WebGIS technologies with a 3D Earth visualization engine to provide an interactive platform for exploring ocean observation data.

The platform enables users to visualize Argo float distribution, interact with observation data, and explore oceanographic information directly within a web browser.

This project demonstrates the integration of **WebGIS technology**, **spatial databases**, and **3D geospatial visualization**, and was developed as part of a geospatial information system practice project.

---

## System Architecture

The system follows a **frontend-backend separation architecture**, combining modern web technologies with geospatial data management.

```text
Frontend (Vue + Cesium)
        │
        │ REST API
        ▼
Backend (FastAPI)
        │
        │ Spatial Query
        ▼
Database (PostgreSQL + PostGIS)
