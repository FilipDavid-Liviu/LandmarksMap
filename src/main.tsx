import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "leaflet/dist/leaflet.css";
import { MarkerProvider } from "./contexts/MarkerContext.tsx";
import { LandmarkProvider } from "./contexts/LandmarkContext.tsx";
import { SelectedMarkerProvider } from "./contexts/SelectedMarkerContext.tsx";
import { SelectedLocationProvider } from "./contexts/SelectedLocationContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LandmarkProvider>
            <AuthProvider>
                <MarkerProvider>
                    <SelectedMarkerProvider>
                        <SelectedLocationProvider>
                            <App />
                        </SelectedLocationProvider>
                    </SelectedMarkerProvider>
                </MarkerProvider>
            </AuthProvider>
        </LandmarkProvider>
    </StrictMode>
);
