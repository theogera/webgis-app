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
          "circle-color": ["step", ["get", "point_count"], "#bde0fe", 10, "#4ea8de", 30, "#1d4e89"],
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
          "text-color": "#fff",
        },
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "points-source",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#e63946",
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      // =========================
      // POLYGONS
      // =========================
      map.addSource("polygons-source", {
        type: "geojson",
        data: "/data/polygons.geojson",
        generateId: true,
      });

      map.addLayer({
        id: "polygons-fill",
        type: "fill",
        source: "polygons-source",
        paint: {
          "fill-color": "#2a6f97",
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.7,
            0.35,
          ],
        },
      });

      map.addLayer({
        id: "polygons-outline",
        type: "line",
        source: "polygons-source",
        paint: {
          "line-color": "#184e77",
          "line-width": 2,
        },
      });

      // =========================
      // POPUPS - POINTS
      // =========================
      map.on("click", "unclustered-point", (e) => {
        const f = e.features?.[0];
        if (!f) return;

        const props = f.properties;

        map.flyTo({
          center: (f.geometry as any).coordinates,
          zoom: 14,
          speed: 1.2,
        });

        new mapboxgl.Popup()
          .setLngLat((f.geometry as any).coordinates)
          .setHTML(`
            <div style="font-size:13px;">
              <strong>${props?.name}</strong><br/>
              ${props?.category}<br/>
              ${props?.description}
            </div>
          `)
          .addTo(map);
      });

      // =========================
      // POPUPS - POLYGONS
      // =========================
      map.on("click", "polygons-fill", (e) => {
        const f = e.features?.[0];
        if (!f) return;

        const props = f.properties;
        const coords = (f.geometry as any).coordinates[0][0];

        new mapboxgl.Popup()
          .setLngLat(coords)
          .setHTML(`
            <div style="font-size:13px;">
              <strong>${props?.name}</strong><br/>
              ${props?.type}<br/>
              ${props?.info}
            </div>
          `)
          .addTo(map);
      });

      // =========================
      // HOVER HIGHLIGHT (POLYGONS)
      // =========================
      let hoveredId: any = null;

      map.on("mousemove", "polygons-fill", (e) => {
        if (!e.features?.length) return;

        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "polygons-source", id: hoveredId },
            { hover: false }
          );
        }

        hoveredId = e.features[0].id;

        map.setFeatureState(
          { source: "polygons-source", id: hoveredId },
          { hover: true }
        );
      });

      map.on("mouseleave", "polygons-fill", () => {
        if (hoveredId !== null) {
          map.setFeatureState(
            { source: "polygons-source", id: hoveredId },
            { hover: false }
          );
        }
        hoveredId = null;
      });
    });

    return () => map.remove();
  }, []);

  // =========================
  // TOGGLE LOGIC
  // =========================
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const set = (id: string, v: boolean) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", v ? "visible" : "none");
      }
    };

    if (mode === "all") {
      set("clusters", true);
      set("cluster-count", true);
      set("unclustered-point", true);
      set("polygons-fill", true);
      set("polygons-outline", true);
    }

    if (mode === "points") {
      set("clusters", true);
      set("cluster-count", true);
      set("unclustered-point", true);
      set("polygons-fill", false);
      set("polygons-outline", false);
    }

    if (mode === "polygons") {
      set("clusters", false);
      set("cluster-count", false);
      set("unclustered-point", false);
      set("polygons-fill", true);
      set("polygons-outline", true);
    }
  }, [mode]);

  return (
    <div className={styles.wrapper}>
      {/* CONTROLS */}
      <div className={styles.controls}>
        <button onClick={() => setMode("all")}>All</button>
        <button onClick={() => setMode("points")}>Points</button>
        <button onClick={() => setMode("polygons")}>Polygons</button>
      </div>

      {/* LEGEND */}
      <div className={styles.legend}>
        <div><span className={styles.p1}></span> Points</div>
        <div><span className={styles.p2}></span> Clusters</div>
        <div><span className={styles.p3}></span> Polygons</div>
      </div>

      <div ref={containerRef} className={styles.map} />
    </div>
  );
}