import React, { createContext, useContext, useState } from "react";

interface SelectedMarkerContextType {
    selectedMarker: {
        id: number;
        lat: number;
        lng: number;
        name: string;
        type: string;
        description: string;
    } | null;
    setSelectedMarker: (
        marker: {
            id: number;
            lat: number;
            lng: number;
            name: string;
            type: string;
            description: string;
        } | null
    ) => void;
}

const SelectedMarkerContext = createContext<
    SelectedMarkerContextType | undefined
>(undefined);

export const SelectedMarkerProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [selectedMarker, setSelectedMarker] = useState<{
        id: number;
        lat: number;
        lng: number;
        name: string;
        type: string;
        description: string;
    } | null>(null);

    return (
        <SelectedMarkerContext.Provider
            value={{ selectedMarker, setSelectedMarker }}
        >
            {children}
        </SelectedMarkerContext.Provider>
    );
};

export const useSelectedMarker = () => {
    const context = useContext(SelectedMarkerContext);
    if (!context) {
        throw new Error(
            "useSelectedMarker must be used within a SelectedMarkerProvider"
        );
    }
    return context;
};
