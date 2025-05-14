import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FullScreen.css";
import { Search, X } from "lucide-react";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext.tsx";
import { useSelectedLocation } from "../contexts/SelectedLocationContext.tsx";

const itemsPerPage = 8;

export const ListScreen: React.FC = () => {
    const { searched, fetchFilteredSortedLandmarks } = useLandmarks();

    const [search, setSearch] = useState("");
    const [isSorted, setIsSorted] = useState(false);
    const [isSortedByEquator, setIsSortedByEquator] = useState(false);
    const [useBackgroundColor, setUseBackgroundColor] = useState(false);
    useEffect(() => {
        fetchFilteredSortedLandmarks(
            search,
            isSorted ? (isSortedByEquator ? 2 : 1) : 0
        );
    }, [search, isSorted, isSortedByEquator]);
    const getBackgroundColor = (lat: number) => {
        const normalizedValue = (90 - Math.abs(lat)) / 90;
        const r = Math.floor(255 * normalizedValue);
        const g = Math.floor(255 * normalizedValue);
        const b = Math.floor(255 * (1 - normalizedValue));
        return `rgb(${r}, ${g}, ${b})`;
    };

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(searched.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedLandmarks = searched.slice(startIndex, endIndex);

    const { setSelectedMarker } = useSelectedMarker();
    const { setSelectedLocation } = useSelectedLocation();
    const navigate = useNavigate();
    const handleLandmarkClick = (landmark: any) => {
        setSelectedMarker(landmark);
        setSelectedLocation(landmark);
        navigate("/");
    };
    return (
        <div className="full-screen-container">
            <div className="main-content">
                {/* Map Background */}
                <div className="map-background">
                    {/* Form Section */}
                    <div className="form-section">
                        <div className="form-container">
                            {/* Left Column */}
                            <div className="left-column">
                                <div className="field-input">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search by name or type"
                                        className="searchbar__input"
                                    />
                                    {search ? (
                                        <X
                                            className="searchbar__icon"
                                            onClick={() => {
                                                setSearch("");
                                            }}
                                        />
                                    ) : (
                                        <Search className="searchbar__icon" />
                                    )}
                                </div>
                                <label
                                    className={`checkbox-label ${
                                        isSorted ? "checked" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSorted}
                                        onChange={() => {
                                            setIsSorted(!isSorted);
                                            setIsSortedByEquator(false);
                                        }}
                                    />
                                    Sort by Latitude
                                </label>
                                <label
                                    className={`checkbox-label ${
                                        isSortedByEquator ? "checked" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSortedByEquator}
                                        onChange={() =>
                                            setIsSortedByEquator(
                                                !isSortedByEquator
                                            )
                                        }
                                        disabled={!isSorted}
                                    />
                                    Sort from N/S to Equator
                                </label>
                                <label
                                    className={`checkbox-label ${
                                        useBackgroundColor ? "checked" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={useBackgroundColor}
                                        onChange={() =>
                                            setUseBackgroundColor(
                                                !useBackgroundColor
                                            )
                                        }
                                    />
                                    Use Latitude-based Background Color
                                </label>
                            </div>

                            {/* Right Column */}
                            <div className="right-column">
                                {displayedLandmarks.length > 0 ? (
                                    <ul className="landmark-list">
                                        {displayedLandmarks.map(
                                            (landmark: any, index: number) => (
                                                <li
                                                    key={index}
                                                    className="landmark-item clickable"
                                                    style={{
                                                        backgroundColor:
                                                            useBackgroundColor
                                                                ? getBackgroundColor(
                                                                      landmark.lat
                                                                  )
                                                                : "",
                                                        borderColor:
                                                            useBackgroundColor
                                                                ? "black"
                                                                : "",
                                                    }}
                                                    onClick={() =>
                                                        handleLandmarkClick(
                                                            landmark
                                                        )
                                                    }
                                                >
                                                    <b>{landmark.name}</b> (
                                                    {landmark.type}) :{" "}
                                                    {landmark.description}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <ul className="landmark-list">
                                        <li className="landmark-item">
                                            No landmarks found
                                        </li>
                                    </ul>
                                )}
                                <div className="pagination">
                                    <button
                                        className="page-button"
                                        disabled={currentPage <= 1}
                                        onClick={() =>
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                    >
                                        Previous
                                    </button>
                                    <span className="page-number">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="page-button"
                                        disabled={currentPage >= totalPages}
                                        onClick={() =>
                                            setCurrentPage((prev) => prev + 1)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="pagination">
                                    <span>Items per page: {itemsPerPage}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
