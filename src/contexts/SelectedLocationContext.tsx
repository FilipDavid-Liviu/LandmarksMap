import React, { createContext, useContext, useState } from "react";

interface SelectedLocationContextType {
    selectedLocation: {
        lat: number;
        lng: number;
    } | null;
    setSelectedLocation: (search: { lat: number; lng: number } | null) => void;
}

const SelectedLocationContext = createContext<
    SelectedLocationContextType | undefined
>(undefined);

export const SelectedLocationProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    return (
        <SelectedLocationContext.Provider
            value={{ selectedLocation, setSelectedLocation }}
        >
            {children}
        </SelectedLocationContext.Provider>
    );
};

export const useSelectedLocation = () => {
    const context = useContext(SelectedLocationContext);
    if (!context) {
        throw new Error(
            "useSelectedLocation must be used within a SelectedLocationProvider"
        );
    }
    return context;
};
