"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./Map.module.css";
import { createMap } from "./mapSetup";

type Mode = "all" | "points" | "polygons";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("all");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = createMap(containerRef.current);
  }, []);

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
      <div className={styles.controls}>
        <button onClick={() => setMode("all")} className={mode === "all" ? styles.activeButton : ""}>All</button>
        <button onClick={() => setMode("points")} className={mode === "points" ? styles.activeButton : ""}>Points</button>
        <button onClick={() => setMode("polygons")} className={mode === "polygons" ? styles.activeButton : ""}>Polygons</button>
      </div>

      <div className={styles.legend}>
        <div><span className={styles.p1}></span> Points</div>
        <div><span className={styles.p2}></span> Clusters</div>
        <div><span className={styles.p3}></span> Polygons</div>
      </div>

      <div ref={containerRef} className={styles.map} />
    </div>
  );
}