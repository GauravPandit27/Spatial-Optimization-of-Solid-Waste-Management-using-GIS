# Spatial Optimization of Solid Waste Management using GIS
**A Case Study of the Maha Kumbh Mela at Sangam, Prayagraj**

## Overview
This repository contains the source code and spatial analysis scripts for a Final Year Civil Engineering project focused on optimizing Municipal Solid Waste (MSW) logistics for extreme high-density floating populations. 

Using the 2019 Kumbh Mela (which saw 240+ million visitors and generated over 18,000 tonnes of waste) as a historical baseline, this project proposes a dynamic, IoT-integrated GIS model to achieve 100% geographic coverage and minimize logistical costs.

## Live Deployment
🌍 **[View the Live GIS Dashboard](https://spatial-optimization-of-solid-waste.vercel.app/)**

## Key Features
* **Spatial Buffer AI:** Computes 250m service catchment areas around Primary Collection Hubs to identify unserved critical gaps in real-time.
* **Population Density Heatmaps:** Visualizes waste generation intensity around major Ghats and sector camps using `leaflet.heat`.
* **River Protection Zones:** Enforces strict 150m exclusionary buffer polygons along the riverbank to ensure environmental compliance and prevent water contamination.
* **Dynamic Logistics Routing:** Simulates optimized collection paths (Route Alpha and Route Beta) linking over 12 primary hubs and 450+ mini-bins to a central Transfer Station.
* **IoT Sensor Simulation:** Simulates live smart-bin fill levels (Green → Yellow → Red) to trigger dynamic routing, preventing bin overflow.
* **BoQ & Financial Analytics:** Integrated `Chart.js` dashboard for real-time visualization of estimated daily waste and Bill of Quantities (BoQ) budgeting.

## Technology Stack
* **Web Mapping:** Leaflet.js, ESRI World Imagery
* **Data Visualization:** Chart.js, HTML5 Canvas
* **UI/UX:** Vanilla CSS3 (Glassmorphism, Cyberpunk aesthetics)
* **Data Processing:** Python, GeoPandas, Shapely (Located in `/python_scripts`)

## Local Installation
To run this project locally, no build tools are required.
1. Clone the repository:
   ```bash
   git clone https://github.com/GauravPandit27/Spatial-Optimization-of-Solid-Waste-Management-using-GIS.git
   ```
2. Open `index.html` in any modern web browser.

## Project Flowchart
1. **Data Aggregation:** Analyzed floating population using CPHEEO norms. Satellite mapping of Ghats, Camps, and Bins.
2. **Spatial Computations:** Executed 250m Service Area Buffers and River Protection Exclusion Zones to protect water bodies.
3. **Optimization Protocol:** Identified critical gaps requiring 1100L bins. Generated dynamic logistical pathways.

---
*Developed as a Final Year Civil Engineering Project.*
