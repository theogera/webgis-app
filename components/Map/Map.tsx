"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.7275, 37.9838],
      zoom: 11,
    });

    map.on("load", () => {
      // =========================
      // 📍 POINTS SOURCE
      // =========================
      map.addSource("points-source", {
        type: "geojson",
        data: "/data/points.geojson", // ✅ local file
      });

      // =========================
      // 🔵 POINTS LAYER
      // =========================
      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points-source",
        paint: {
          "circle-radius": 6,
          "circle-color": "#e63946",
        },
      });

      // =========================
      // 🟩 POLYGONS SOURCE
      // =========================
      map.addSource("polygons-source", {
        type: "geojson",
        data: "/data/polygons.geojson", // ✅ local file
      });

      // =========================
      // 🟦 POLYGONS LAYER (fill)
      // =========================
      map.addLayer({
        id: "polygons-fill",
        type: "fill",
        source: "polygons-source",
        paint: {
          "fill-color": "#457b9d",
          "fill-opacity": 0.4,
        },
      });

      // OPTIONAL (but recommended): polygon borders
      map.addLayer({
        id: "polygons-outline",
        type: "line",
        source: "polygons-source",
        paint: {
          "line-color": "#1d3557",
          "line-width": 2,
        },
      });
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className={styles.map} />;
}