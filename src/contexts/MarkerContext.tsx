import React, { createContext, useContext, useState, ReactNode } from "react";

interface MarkerContextType {
    markerPosition: L.LatLng | null;
    setMarkerPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
}

const MarkerContext = createContext<MarkerContextType | undefined>(undefined);

interface MarkerProviderProps {
    children: ReactNode;
}

export const MarkerProvider: React.FC<MarkerProviderProps> = ({ children }) => {
    const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

    return (
        <MarkerContext.Provider value={{ markerPosition, setMarkerPosition }}>
            {children}
        </MarkerContext.Provider>
    );
};

export const useMarker = () => {
    const context = useContext(MarkerContext);
    if (!context) {
        throw new Error("useMarker must be used within a MarkerProvider");
    }
    return context;
};
