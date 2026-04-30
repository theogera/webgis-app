"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Mode = "all" | "points" | "polygons";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<Mode>("all");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [23.7275, 37.9838],
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      // =========================
      // POINTS (CLUSTERED)
      // =========================
      map.addSource("points-source", {
        type: "geojson",
        data: "/data/points.geojson",
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "points-source",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": ["step", ["get", "point_count"], "#a8dadc", 10, "#457b9d", 30, "#1d3557"],
          "circle-radius": ["step", ["get", "point_count"], 15, 10, 22, 30, 30],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "points-source",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 13,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points-source",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#e63946",
          "circle-radius": 6,
        },
      });

      // =========================
      // POLYGONS
      // =========================
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

      // =========================
      // POPUPS - POINTS
      // =========================
      map.on("click", "unclustered-point", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties;

        new mapboxgl.Popup()
          .setLngLat((feature.geometry as any).coordinates)
          .setHTML(`
            <div style="font-size:14px;">
              <strong>${props?.name}</strong><br/>
              Category: ${props?.category}<br/>
              ${props?.description}
            </div>
          `)
          .addTo(map);
      });

      // =========================
      // POPUPS - POLYGONS
      // =========================
      map.on("click", "polygons-fill", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const props = feature.properties;

        const coordinates = (feature.geometry as any).coordinates[0][0];

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div style="font-size:14px;">
              <strong>${props?.name}</strong><br/>
              Type: ${props?.type}<br/>
              ${props?.info}
            </div>
          `)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  // =========================
  // VISIBILITY TOGGLE LOGIC
  // =========================
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const setVisibility = (id: string, visible: boolean) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", visible ? "visible" : "none");
      }
    };

    if (mode === "all") {
      setVisibility("clusters", true);
      setVisibility("cluster-count", true);
      setVisibility("unclustered-point", true);
      setVisibility("polygons-fill", true);
      setVisibility("polygons-outline", true);
    }

    if (mode === "points") {
      setVisibility("clusters", true);
      setVisibility("cluster-count", true);
      setVisibility("unclustered-point", true);
      setVisibility("polygons-fill", false);
      setVisibility("polygons-outline", false);
    }

    if (mode === "polygons") {
      setVisibility("clusters", false);
      setVisibility("cluster-count", false);
      setVisibility("unclustered-point", false);
      setVisibility("polygons-fill", true);
      setVisibility("polygons-outline", true);
    }
  }, [mode]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.controls}>
        <button onClick={() => setMode("all")}>All</button>
        <button onClick={() => setMode("points")}>Points</button>
        <button onClick={() => setMode("polygons")}>Polygons</button>
      </div>

      <div ref={containerRef} className={styles.map} />
    </div>
  );
}