"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"all" | "points" | "polygons">("all");

  // 🗺️ Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.7275, 37.9838],
      zoom: 11,
    });

    map.on("load", () => {
      // POINTS
      map.addSource("points-source", {
        type: "geojson",
        data: "/data/points.geojson",
      });

      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points-source",
        paint: {
          "circle-radius": 6,
          "circle-color": "#e63946",
        },
      });

      // POLYGONS
      map.addSource("polygons-source", {
        type: "geojson",
        data: "/data/polygons.geojson",
      });

      map.addLayer({
        id: "polygons-fill",
        type: "fill",
        source: "polygons-source",
        paint: {
          "fill-color": "#457b9d",
          "fill-opacity": 0.4,
        },
      });

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

  // 🎛️ Handle visibility changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setVisibility = (layer: string, visible: boolean) => {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(
          layer,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    };

    if (mode === "all") {
      setVisibility("points-layer", true);
      setVisibility("polygons-fill", true);
      setVisibility("polygons-outline", true);
    }

    if (mode === "points") {
      setVisibility("points-layer", true);
      setVisibility("polygons-fill", false);
      setVisibility("polygons-outline", false);
    }

    if (mode === "polygons") {
      setVisibility("points-layer", false);
      setVisibility("polygons-fill", true);
      setVisibility("polygons-outline", true);
    }
  }, [mode]);

  return (
    <div className={styles.wrapper}>
      {/* 🎛️ UI Controls */}
      <div className={styles.controls}>
        <button onClick={() => setMode("all")}>All</button>
        <button onClick={() => setMode("points")}>Points</button>
        <button onClick={() => setMode("polygons")}>Polygons</button>
      </div>

      <div ref={containerRef} className={styles.map} />
    </div>
  );
}