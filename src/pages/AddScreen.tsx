import React, { useState, useEffect } from "react";
import "./HalfScreen.css";
import { useMarker } from "../contexts/MarkerContext.tsx";
import { decimalToDMS } from "../components/Utils.tsx";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";
import DropdownTypes from "../components/DropdownTypes.tsx";
import PieChartTypes from "../components/PieChartTypes.tsx";
import BarChartQuadrants from "../components/BarChartQuadrants.tsx";
import ScatterPlotLandmarks from "../components/ScatterChartLandmarks.tsx";

export const AddScreen: React.FC = () => {
    const { addLandmark } = useLandmarks();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorText] = useState(
        "*Please fill out the name and type fields and select a location on the map"
    );
    const { markerPosition, setMarkerPosition } = useMarker();
    const [showChartsVisible, setShowChartsVisible] = useState(false);
    const toggleShowCharts = () => {
        setShowChartsVisible((prevState) => !prevState);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (
            e.target.value.trim() !== "" &&
            type.trim() !== "" &&
            markerPosition
        ) {
            setIsError(false);
        }
    };

    useEffect(() => {
        if (markerPosition && name.trim() !== "" && type.trim() !== "") {
            setIsError(false);
        }
    }, [markerPosition]);

    useEffect(() => {
        if (type.trim() !== "" && name.trim() !== "" && markerPosition) {
            setIsError(false);
        }
    }, [type]);

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };
    const handleAddLandmark = () => {
        if (name.trim() === "" || type.trim() === "" || !markerPosition) {
            setIsError(true);
            return;
        }
        const newLandmark = {
            id: Math.random() / 2,
            lat: markerPosition.lat,
            lng: markerPosition.lng,
            name,
            type,
            description,
        };
        addLandmark(newLandmark);
        setName("");
        setType("");
        setDescription("");
        setMarkerPosition(null);
    };
    return (
        <div className="half-screen-container">
            {/* Main Content */}
            <div className="main-content">
                {/* Map Background */}
                <div className="map-background">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="form-container">
                            {/* Left Column */}
                            <div className="left-column">
                                {/* Name Field */}
                                <div className="field-row">
                                    <label className="field-label">Name</label>
                                    <input
                                        placeholder="Enter name"
                                        className="field-input"
                                        value={name}
                                        onChange={handleNameChange}
                                        required
                                    />
                                </div>

                                {/* Type Field */}
                                <div className="field-row">
                                    <label className="field-label">Type</label>
                                    <DropdownTypes
                                        selectedType={type}
                                        onTypeChange={setType}
                                    />
                                </div>

                                {/* Description Field */}
                                <div className="description-row">
                                    <label className="description-label">
                                        Description
                                    </label>
                                    <textarea
                                        placeholder="Enter description"
                                        className="field-textarea"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="right-column">
                                {/* Add Landmark Button */}
                                <p
                                    className={`error-message ${
                                        isError ? "" : "inv"
                                    }`}
                                >
                                    {errorText}
                                </p>
                                <div className="button-container">
                                    <button
                                        className="btn-outline"
                                        onClick={handleAddLandmark}
                                    >
                                        Add Landmark
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="coord-card">
                        <div className="coord-card-content">
                            <span
                                className="coord-text"
                                dangerouslySetInnerHTML={{
                                    __html: markerPosition
                                        ? `${decimalToDMS(
                                              markerPosition.lat,
                                              true
                                          )} <br /> ${decimalToDMS(
                                              markerPosition.lng,
                                              false
                                          )}`
                                        : "No coordinates",
                                }}
                            />
                        </div>
                    </div>
                    <div className="button-charts-container">
                        <label
                            className={`checkbox-label ${
                                showChartsVisible ? "checked" : ""
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={showChartsVisible}
                                onChange={toggleShowCharts}
                                className="checkbox-input"
                            />
                            Show Charts
                        </label>
                    </div>
                    {showChartsVisible && (
                        <div className="pie-chart-card">
                            <div className="card-content">
                                <PieChartTypes />
                            </div>
                        </div>
                    )}
                    {showChartsVisible && (
                        <div className="bar-chart-card">
                            <div className="card-content to-left">
                                <BarChartQuadrants />
                            </div>
                        </div>
                    )}
                    {showChartsVisible && (
                        <div className="scatter-chart-card">
                            <div className="card-content scatter to-left">
                                <ScatterPlotLandmarks />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
