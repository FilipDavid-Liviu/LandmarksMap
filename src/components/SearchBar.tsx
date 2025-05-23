import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";
import { useLandmarks } from "../contexts/LandmarkContext";
import { useSelectedLocation } from "../contexts/SelectedLocationContext.tsx";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext";
import { isMatchName } from "../components/Utils";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { searched, fetchSearchedLandmarks } = useLandmarks();
    const { setSelectedLocation } = useSelectedLocation();
    const { setSelectedMarker } = useSelectedMarker();

    useEffect(() => {
        fetchSearchedLandmarks(search, 4);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searched.length > 0) {
            const match = searched[0];
            setSearch(match.name);
            setShowDropdown(false);
            setSelectedLocation(match);
            setSelectedMarker(match);
        }
    };
    return (
        <div className={`searchbar ${showDropdown ? "searchbar--active" : ""}`}>
            <div className="searchbar__input-container">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        const newQuery = e.target.value;
                        setSearch(newQuery);
                        const newFilteredSuggestions = searched.filter(
                            (landmark) => isMatchName(landmark, newQuery)
                        );
                        setShowDropdown(
                            newQuery.length > 0 &&
                                newFilteredSuggestions.length > 0
                        );
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search name"
                    className="searchbar__input"
                />
                {search ? (
                    <X
                        className="searchbar__icon"
                        onClick={() => {
                            setSearch("");
                            setShowDropdown(false);
                        }}
                    />
                ) : (
                    <Search className="searchbar__icon" />
                )}
            </div>
            {showDropdown && (
                <ul className="searchbar__dropdown">
                    {searched.map((landmark, index) => (
                        <li
                            key={index}
                            className="searchbar__dropdown-item"
                            onClick={() => {
                                setSearch(landmark.name);
                                setShowDropdown(false);
                                setSelectedLocation(landmark);
                                setSelectedMarker(landmark);
                            }}
                        >
                            {landmark.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
