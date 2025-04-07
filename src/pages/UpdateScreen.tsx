import React, { useState, useEffect } from "react";
import "./HalfScreen.css";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext.tsx";
import { decimalToDMS } from "../components/Utils.tsx";
import { X } from "lucide-react";
import DropdownTypes from "../components/DropdownTypes.tsx";
import PieChartTypes from "../components/PieChartTypes.tsx";
import BarChartQuadrants from "../components/BarChartQuadrants.tsx";
import ScatterPlotLandmarks from "../components/ScatterChartLandmarks.tsx";

export const UpdateScreen: React.FC = () => {
    const { updateLandmark } = useLandmarks();
    const { removeLandmark } = useLandmarks();

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isErrorUpdate, setIsErrorUpdate] = useState(false);
    const [isErrorDelete, setIsErrorDelete] = useState(false);
    const [errorTextUpdate] = useState(
        "*Please first select a pin on the map and fill out the name and type fields"
    );
    const [errorTextDelete] = useState("*Please select a pin on the map");
    const { selectedMarker, setSelectedMarker } = useSelectedMarker();
    const [showChartsVisible, setShowChartsVisible] = useState(false);
    const toggleShowCharts = () => {
        setShowChartsVisible((prevState) => !prevState);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        if (
            e.target.value.trim() !== "" &&
            type.trim() !== "" &&
            selectedMarker
        ) {
            setIsErrorUpdate(false);
        }
    };

    useEffect(() => {
        if (selectedMarker) {
            setIsErrorUpdate(false);
            setIsErrorDelete(false);
        }
    }, [selectedMarker]);

    useEffect(() => {
        if (type.trim() !== "" && name.trim() !== "" && selectedMarker) {
            setIsErrorUpdate(false);
        }
    }, [type]);

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setDescription(e.target.value);
    };
    const handleUpdateLandmark = () => {
        if (name.trim() === "" || type.trim() === "" || !selectedMarker) {
            setIsErrorUpdate(true);
            return;
        }
        const newLandmark = {
            id: Math.random(),
            lat: selectedMarker ? selectedMarker.lat : 0,
            lng: selectedMarker ? selectedMarker.lng : 0,
            name,
            type,
            description,
        };
        updateLandmark(newLandmark);
        setName("");
        setType("");
        setDescription("");
        setSelectedMarker(null);
    };
    const handleRemoveLandmark = () => {
        if (!selectedMarker) {
            setIsErrorDelete(true);
            return;
        }
        removeLandmark(selectedMarker.lat, selectedMarker.lng);
        setName("");
        setType("");
        setDescription("");
        setSelectedMarker(null);
    };

    useEffect(() => {
        if (selectedMarker) {
            setName(selectedMarker.name);
            setType(selectedMarker.type);
            setDescription(selectedMarker.description);
        } else {
            setName("");
            setType("");
            setDescription("");
        }
    }, [selectedMarker]);

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
                                    <label className="field-label">
                                        New Name
                                    </label>
                                    <input
                                        placeholder="Enter name"
                                        className="field-input"
                                        value={name}
                                        onChange={handleNameChange}
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
                                        New Description
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
                                {/* Update Delete Landmark Buttons */}
                                <div className="button-container">
                                    <div className="button-error-pair">
                                        <p
                                            className={`error-message ${
                                                isErrorUpdate ? "" : "inv"
                                            }`}
                                        >
                                            {errorTextUpdate}
                                        </p>
                                        <button
                                            className="btn-outline"
                                            onClick={handleUpdateLandmark}
                                        >
                                            Update Landmark
                                        </button>
                                    </div>
                                    <div className="button-error-pair">
                                        <p
                                            className={`error-message ${
                                                isErrorDelete ? "" : "inv"
                                            }`}
                                        >
                                            {errorTextDelete}
                                        </p>
                                        <button
                                            className="btn-outline"
                                            onClick={handleRemoveLandmark}
                                        >
                                            Delete Landmark
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="coord-card">
                        <div className="coord-card-content">
                            <span
                                className="coord-text"
                                dangerouslySetInnerHTML={{
                                    __html: selectedMarker
                                        ? `${decimalToDMS(
                                              selectedMarker.lat,
                                              true
                                          )} <br /> ${decimalToDMS(
                                              selectedMarker.lng,
                                              false
                                          )}`
                                        : "No coordinates",
                                }}
                            />
                        </div>
                    </div>
                    {selectedMarker ? (
                        <div className="coord-card-x">
                            <div className="coord-card-content">
                                <X
                                    className="coord-x"
                                    onClick={() => {
                                        setName("");
                                        setType("");
                                        setDescription("");
                                        setSelectedMarker(null);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <span />
                    )}
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
