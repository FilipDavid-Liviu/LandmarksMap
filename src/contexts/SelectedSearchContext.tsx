import React, { createContext, useContext, useState } from "react";

interface SelectedSearchContextType {
    selectedSearch: {
        lat: number;
        lng: number;
    } | null;
    setSelectedSearch: (search: { lat: number; lng: number } | null) => void;
}

const SelectedSearchContext = createContext<
    SelectedSearchContextType | undefined
>(undefined);

export const SelectedSearchProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [selectedSearch, setSelectedSearch] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    return (
        <SelectedSearchContext.Provider
            value={{ selectedSearch, setSelectedSearch }}
        >
            {children}
        </SelectedSearchContext.Provider>
    );
};

export const useSelectedSearch = () => {
    const context = useContext(SelectedSearchContext);
    if (!context) {
        throw new Error(
            "useSelectedSearch must be used within a SelectedSearchProvider"
        );
    }
    return context;
};
