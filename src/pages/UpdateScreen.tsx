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
            id: selectedMarker.id,
            lat: selectedMarker ? selectedMarker.lat : 0,
            lng: selectedMarker ? selectedMarker.lng : 0,
            name,
            type,
            description,
            image,
        };
        updateLandmark(newLandmark);
        setName("");
        setType("");
        setDescription("");
        setSelectedMarker(null);
        handleDeleteImage();
    };
    const handleRemoveLandmark = () => {
        if (!selectedMarker) {
            setIsErrorDelete(true);
            return;
        }
        removeLandmark(selectedMarker.id);
        setName("");
        setType("");
        setDescription("");
        setSelectedMarker(null);
        handleDeleteImage();
    };

    useEffect(() => {
        if (selectedMarker) {
            console.log("Selected marker:", selectedMarker);
            setName(selectedMarker.name);
            setType(selectedMarker.type);
            setDescription(selectedMarker.description + selectedMarker.image);
            setImage(selectedMarker.image ?? undefined);
        } else {
            setName("");
            setType("");
            setDescription("");
            handleDeleteImage();
        }
    }, [selectedMarker]);

    const [image, setImage] = useState<string | File | undefined>(undefined);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            if (file) {
                setImage(file);
            }
        }
    };

    const handleDeleteImage = () => {
        setImage(undefined);
        const inputElement = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (inputElement) {
            inputElement.value = "";
        }
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
                                <div className="single-column">
                                    <label className="field-label">
                                        Upload Images
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png"
                                        onChange={handleImageUpload}
                                    />
                                </div>
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
                    <div className="image-preview-container">
                        {image && (
                            <>
                                <img
                                    src={
                                        typeof image === "string"
                                            ? image
                                            : URL.createObjectURL(image)
                                    }
                                    alt="preview"
                                    className="preview-image"
                                />
                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={handleDeleteImage}
                                >
                                    ✖
                                </button>
                            </>
                        )}
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
