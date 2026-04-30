import mapboxgl from "mapbox-gl";

export function addMapLayers(map: mapboxgl.Map) {

    // POINTS
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
            "circle-radius": 10,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
        },
    });

    // POLYGONS
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
}