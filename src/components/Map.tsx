import React, { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    LayersControl,
    useMapEvents,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { useLocation } from "react-router-dom";
import { useMarker } from "../contexts/MarkerContext";
import { useLandmarks } from "../contexts/LandmarkContext";
import { useState } from "react";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext";
import { useSelectedSearch } from "../contexts/SelectedSearchContext";

type MapProps = {};

const Map: React.FC<MapProps> = () => {
    const { landmarks } = useLandmarks();
    const { selectedMarker, setSelectedMarker } = useSelectedMarker();
    const { selectedSearch, setSelectedSearch } = useSelectedSearch();

    const markerIcon = L.icon({
        iconUrl: "./src/assets/marker.svg",
        iconSize: [24, 24],
        iconAnchor: [11, 24],
        popupAnchor: [0, -30],
    });
    const selectedMarkerIcon = L.icon({
        iconUrl: "./src/assets/marker2.svg",
        iconSize: [24, 24],
        iconAnchor: [11, 24],
        popupAnchor: [0, -30],
    });

    const { markerPosition, setMarkerPosition } = useMarker() || {
        markerPosition: null,
        setMarkerPosition: () => {},
    };

    const location = useLocation();

    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                if (location.pathname === "/add")
                    setMarkerPosition(event.latlng);
            },
        });
        return null;
    };

    useEffect(() => {
        if (location.pathname !== "/add") {
            setMarkerPosition(null);
        }
    }, [location.pathname]);

    const [selectedPosition, setSelectedPosition] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    useEffect(() => {
        if (selectedSearch) {
            setSelectedPosition(selectedSearch);
        }
    }, [selectedSearch]);

    const MapController = ({
        position,
        setPosition,
    }: {
        position: { lat: number; lng: number } | null;
        setPosition: (pos: null) => void;
    }) => {
        const map = useMap();

        useEffect(() => {
            if (location.pathname !== "/add" && location.pathname !== "/list") {
                if (position) {
                    if (location.pathname !== "/update") {
                        const zoom = map.getZoom();
                        const offset = zoom > 10 ? 0 : 0.3;
                        map.flyTo(
                            [position.lat, position.lng - offset],
                            Math.max(10, zoom),
                            {
                                duration: 1.5,
                            }
                        );
                        const timeout = setTimeout(() => {
                            setPosition(null);
                            setSelectedSearch(null);
                        }, 500);
                        return () => clearTimeout(timeout);
                    } else {
                        const zoom = map.getZoom();
                        const offset = zoom > 10 ? 0 : 0.25;
                        map.flyTo(
                            [position.lat + offset, position.lng],
                            Math.max(10, zoom),
                            {
                                duration: 1.5,
                            }
                        );
                        const timeout = setTimeout(
                            () => setPosition(null),
                            500
                        );
                        return () => clearTimeout(timeout);
                    }
                }
            }
            if (location.pathname == "/add") {
                setSelectedMarker(null);
            }
        }, [position, map, setPosition]);

        return null;
    };

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={5}
            style={{ height: "100vh", width: "100%" }}
            worldCopyJump={true}
            maxBounds={[
                [-1000, -Infinity],
                [1000, Infinity],
            ]}
            maxBoundsViscosity={1.0}
            minZoom={3}
        >
            <LayersControl position="bottomright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="OpenTopoMap">
                    <TileLayer
                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>

            {landmarks.map((landmark) => (
                <Marker
                    key={landmark.id}
                    position={[landmark.lat, landmark.lng]}
                    icon={
                        selectedMarker?.id === landmark.id
                            ? selectedMarkerIcon
                            : markerIcon
                    }
                    eventHandlers={{
                        click: () => {
                            if (location.pathname !== "/add") {
                                setSelectedPosition({
                                    lat: landmark.lat,
                                    lng: landmark.lng,
                                });
                                setSelectedMarker({
                                    id: landmark.id,
                                    lat: landmark.lat,
                                    lng: landmark.lng,
                                    name: landmark.name,
                                    type: landmark.type,
                                    description: landmark.description,
                                    image: landmark.image,
                                });
                            }
                        },
                    }}
                >
                    {location.pathname !== "/" && (
                        <Popup>
                            {landmark.name} ({landmark.type}):
                            <span style={{ fontWeight: "500" }}>
                                {" "}
                                {landmark.description}
                            </span>
                        </Popup>
                    )}
                </Marker>
            ))}
            {markerPosition && (
                <Marker position={markerPosition} icon={selectedMarkerIcon}>
                    <Popup>Position for the new Landmark</Popup>
                </Marker>
            )}

            <MapClickHandler />

            <MapController
                position={selectedPosition}
                setPosition={setSelectedPosition}
            />
        </MapContainer>
    );
};

export default Map;
