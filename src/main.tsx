import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import { MarkerProvider } from "./contexts/MarkerContext.tsx";
import { LandmarkProvider } from "./contexts/LandmarkContext.tsx";
import { SelectedMarkerProvider } from "./contexts/SelectedMarkerContext.tsx";
import { SelectedSearchProvider } from "./contexts/SelectedSearchContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LandmarkProvider>
            <MarkerProvider>
                <SelectedMarkerProvider>
                    <SelectedSearchProvider>
                        <App />
                    </SelectedSearchProvider>
                </SelectedMarkerProvider>
            </MarkerProvider>
        </LandmarkProvider>
    </StrictMode>
);
