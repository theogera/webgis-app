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

      // 🎨 Choose your basemap style
      style: "mapbox://styles/mapbox/light-v11",

      center: [23.7275, 37.9838], // Athens
      zoom: 11,
    });

    // 🧭 Fit map to bounds (better than fixed center)
    const bounds = new mapboxgl.LngLatBounds(
      [23.68, 37.95], // southwest
      [23.78, 38.02]  // northeast
    );

    map.fitBounds(bounds, {
      padding: 20,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className={styles.map} />;
}