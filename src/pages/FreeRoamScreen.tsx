import React from "react";
import SearchBar from "../components/SearchBar";
import InfoCard from "../components/InfoCard";
import "./NoScreen.css";

export const FreeRoamScreen: React.FC = () => {
    return (
        <div className="no-screen-container">
            {/* Main Content */}
            <div className="main-content">
                {/* Map Background */}
                <div className="map-background">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="search-bar">
                            <SearchBar />
                        </div>
                        <InfoCard />
                    </div>
                </div>
            </div>
        </div>
    );
};
