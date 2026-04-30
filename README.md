# 🌍 WebGIS Application (Next.js + Mapbox GL JS)

A WebGIS application built with **Next.js** and **Mapbox GL JS** that visualizes geospatial data (points and polygons), supports clustering, interactive layers, and rich map interactions.

---

## 🚀 Features

* Interactive Map using Mapbox GL JS
* GeoJSON data rendering (local files)
* Point clustering with dynamic counts
* Polygon visualization with outlines and hover effects
* Layer toggle system (All / Points / Polygons)
* Popups for both points and polygons
* Fly-to animation on point click
* Polygon popup positioned at top-center edge
* Hover highlight for polygons
* Cursor interaction feedback
* Responsive UI layout
* Map legend for better UX

---

## 🧰 Tech Stack

* Next.js (App Router)
* Mapbox GL JS
* TypeScript
* CSS Modules

---

## 📂 Project Structure

```
components/
└── Map/
    ├── Map.tsx
    ├── mapSetup.ts
    ├── mapLayers.ts
    ├── mapInteractions.ts
    └── Map.module.css

public/
└── data/
    ├── points.geojson
    └── polygons.geojson
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/theogera/webgis-app.git
cd webgis-app
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Add Mapbox token

Create a `.env.local` file:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

Get your token from:
[https://account.mapbox.com/](https://account.mapbox.com/)

---

### 4. Add GeoJSON data

Place your files here:

```
/public/data/points.geojson
/public/data/polygons.geojson
```

---

### 5. Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🧠 Architecture Overview

### 🔹 Modular Map Design

The map logic is split into 3 parts:

* `mapSetup.ts` → Initializes the map
* `mapLayers.ts` → Adds sources and layers
* `mapInteractions.ts` → Handles clicks, hover, popups

This improves:

* readability
* scalability
* maintainability

---

### 🔹 Why Mapbox GL JS

* Native support for GeoJSON
* Built-in clustering
* High-performance rendering
* Rich interaction system

---

### 🔹 Data Strategy

GeoJSON files are stored in `/public` to simulate a real GIS dataset without backend complexity.

---

### 🔹 UI Decisions

* Minimal UI focused on map interaction
* Floating controls for layer switching
* Legend for clarity
* Hover + click feedback for usability

---

## ✨ Key Features Explained

### 📍 Point Interaction

* Click zooms to feature
* Popup shows properties
* Clustering expands smoothly

### 🟦 Polygon Interaction

* Hover highlights polygon
* Click shows popup at top edge center
* Styled outlines for clarity

---

## 🔮 Future Improvements

* Sidebar instead of popups for details
* Search functionality (features / locations)
* Category filtering (points/polygons)
* Dark/light basemap switch
* Improved polygon centroid calculation (true geometric center)
* Unit testing for map logic
* Backend integration (PostGIS / GeoServer)

---

## 📌 Notes

* Built as a WebGIS learning project
* Focus on Mapbox GL JS capabilities and modular architecture
* Fully client-side rendering

---

## 👤 Author

Developed as a WebGIS exercise using **Next.js + Mapbox GL JS**