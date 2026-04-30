import mapboxgl from "mapbox-gl";
import { addMapLayers } from "./mapLayers";
import { addMapInteractions } from "./mapInteractions";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export function createMap(container: HTMLDivElement) {
  const map = new mapboxgl.Map({
    container,
    style: "mapbox://styles/mapbox/dark-v11",
    center: [23.7275, 37.9838],
    zoom: 11,
  });

  map.on("load", () => {
    addMapLayers(map);
    addMapInteractions(map);
  });

  return map;
}