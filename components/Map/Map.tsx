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
      style: "mapbox://styles/mapbox/streets-v12",
      center: [23.7275, 37.9838], // Athens
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      // POINTS SOURCE
      map.addSource("points", {
        type: "geojson",
        data: "/data/points.geojson",
      });

      // POINTS LAYER
      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 6,
          "circle-color": "#e63946",
        },
      });

      // POLYGONS SOURCE
      map.addSource("polygons", {
        type: "geojson",
        data: "/data/polygons.geojson",
      });

      // POLYGONS LAYER
      map.addLayer({
        id: "polygons-layer",
        type: "fill",
        source: "polygons",
        paint: {
          "fill-color": "#457b9d",
          "fill-opacity": 0.4,
        },
      });

      // POPUP INTERACTION
      map.on("click", "points-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const coordinates = (feature.geometry as any).coordinates.slice();
        const name = feature.properties?.name;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<strong>${name}</strong>`)
          .addTo(map);
      });

      // CURSOR POINTER
      map.on("mouseenter", "points-layer", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "points-layer", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className={styles.map} />;
}