import mapboxgl from "mapbox-gl";

export function addMapInteractions(map: mapboxgl.Map) {

    // CLICK
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["unclustered-point", "polygons-fill"],
        });

        if (!features.length) return;

        const pointFeature = features.find(f => f.layer?.id === "unclustered-point");
        const polygonFeature = features.find(f => f.layer?.id === "polygons-fill");

        // POINT POPUP
        if (pointFeature) {
            const props = pointFeature.properties || {};
            const coords = (pointFeature.geometry as any).coordinates;

            map.flyTo({ center: coords, zoom: 14, speed: 1.2 });

            new mapboxgl.Popup({ className: "custom-popup" })
                .setLngLat(coords)
                .setHTML(`
                  <div class="popup-box">
                    <h3>${props.name ?? "Unknown"}</h3>
                    <p><strong>Category:</strong> ${props.category ?? "-"}</p>
                    <p>${props.description ?? ""}</p>
                  </div>
                `)
                .addTo(map);

            return;
        }

        // POLYGON POPUP (TOP CENTER)
        if (polygonFeature) {
            const props = polygonFeature.properties || {};
            const coordinates = (polygonFeature.geometry as any).coordinates[0];

            let maxLat = -Infinity;
            coordinates.forEach((c: number[]) => {
                if (c[1] > maxLat) maxLat = c[1];
            });

            const topPoints = coordinates.filter(
                (c: number[]) => Math.abs(c[1] - maxLat) < 0.00001
            );

            let lngSum = 0;
            let latSum = 0;

            topPoints.forEach((c: number[]) => {
                lngSum += c[0];
                latSum += c[1];
            });

            const popupPosition: [number, number] = [
                lngSum / topPoints.length,
                latSum / topPoints.length,
            ];

            new mapboxgl.Popup({ className: "custom-popup" })
                .setLngLat(popupPosition)
                .setHTML(`
                  <div class="popup-box">
                    <h3>${props.name ?? "Polygon"}</h3>
                    <p><strong>Type:</strong> ${props.type ?? "-"}</p>
                    <p>${props.info ?? ""}</p>
                  </div>
                `)
                .addTo(map);
        }
    });

    // HOVER
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

    // CURSOR
    ["unclustered-point", "clusters", "polygons-fill"].forEach(layer => {
        map.on("mouseenter", layer, () => {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layer, () => {
            map.getCanvas().style.cursor = "";
        });
    });
}