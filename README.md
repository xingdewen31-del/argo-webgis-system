Argo WebGIS System
Project Introduction

Argo WebGIS System is a Web-based geographic information system designed for the visualization and management of global Argo float data. The system integrates modern WebGIS technologies with a 3D Earth visualization engine to provide an interactive platform for exploring ocean observation data.

The platform enables users to visualize Argo float distribution, interact with observation data, and explore oceanographic information directly within a web browser.

This project demonstrates the integration of WebGIS technology, spatial databases, and 3D geospatial visualization, and was developed as part of a geospatial information system practice project.

System Architecture

The system follows a frontend-backend separation architecture, combining modern web technologies with geospatial data management.

Frontend (Vue + Cesium)
        │
        │ REST API
        ▼
Backend (FastAPI)
        │
        │ Spatial Query
        ▼
Database (PostgreSQL + PostGIS)
Architecture Description
Layer	Technology	Description
Frontend	Vue3 + Vite	User interface and interaction
3D Visualization	CesiumJS	3D globe and geospatial rendering
Backend	FastAPI	API services and data processing
Database	PostgreSQL + PostGIS	Spatial data storage and queries
Data Source	Argo Float Data	Ocean observation data
System Features
3D Global Visualization

Interactive 3D Earth visualization

Global ocean observation display

Smooth navigation and zoom

Argo Float Data Display

Global Argo float distribution

Interactive float selection

Float information visualization

WebGIS Interaction

Dynamic spatial layer loading

Geographic data interaction

Visualization of spatial information

User Interface

Login interface

Multi-page navigation

Data visualization panels

Project Structure
argo-webgis-system
│
├── public
│   └── assets
│       └── cesium
│           ├── Assets
│           ├── Widgets
│           ├── Workers
│           └── ThirdParty
│
├── src
│   ├── components
│   │   ├── CesiumViewer
│   │   ├── argo
│   │   ├── LoginCom
│   │   ├── ComOne
│   │   └── ComTwo
│   │
│   ├── views
│   │   ├── LoginView.vue
│   │   ├── mainview.vue
│   │   ├── ArgoInfo.vue
│   │   ├── VideoView.vue
│   │   └── SignIn.vue
│   │
│   ├── router
│   │   └── mainrouter.js
│   │
│   ├── stores
│   │   └── mainstore.js
│   │
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── package.json
├── vite.config.js
└── README.md
Installation
1 Clone the repository
git clone https://github.com/xingdewen31-del/argo-webgis-system.git
cd argo-webgis-system
2 Install dependencies
npm install
3 Run the project
npm run dev

Open the browser and visit

http://localhost:5173
Demo

The system provides the following functions:

3D Earth visualization

Argo float distribution display

Ocean observation information visualization

Interactive geospatial exploration

Technologies Used
Technology	Description
Vue 3	Frontend framework
Vite	Frontend build tool
CesiumJS	3D geospatial visualization
FastAPI	Backend API framework
PostgreSQL	Relational database
PostGIS	Spatial database extension
JavaScript	Application logic
Future Work

Future improvements may include:

Real-time ocean data integration

Advanced spatial analysis tools

Machine learning-based ocean prediction

Multi-user data management

Author

Donghao An

Geographic Information Science

Research Interests

WebGIS

Remote Sensing

Ocean Observation Data

Spatial Data Visualization
