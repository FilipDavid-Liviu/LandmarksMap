import { useState } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";
import { useLandmarks } from "../contexts/LandmarkContext";
import { useSelectedSearch } from "../contexts/SelectedSearchContext";

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { landmarks } = useLandmarks();
    const { setSelectedSearch } = useSelectedSearch();

    const normalizeName = (name: string) => name.toLowerCase();

    const filteredSuggestions = landmarks.filter((landmark) =>
        normalizeName(landmark.name).includes(normalizeName(query))
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (filteredSuggestions.length === 1) {
                const match = filteredSuggestions[0];
                setQuery(match.name);
                setShowDropdown(false);
                setSelectedSearch(match);
            } else {
                const match = filteredSuggestions.find(
                    (landmark) =>
                        normalizeName(landmark.name) === normalizeName(query)
                );

                if (match) {
                    setQuery(match.name);
                    setShowDropdown(false);
                    setSelectedSearch(match);
                }
            }
        }
    };
    return (
        <div className={`searchbar ${showDropdown ? "searchbar--active" : ""}`}>
            <div className="searchbar__input-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        const newQuery = e.target.value;
                        setQuery(newQuery);
                        const newFilteredSuggestions = landmarks
                            .filter((landmark) =>
                                normalizeName(landmark.name).includes(
                                    normalizeName(newQuery)
                                )
                            )
                            .slice(0, 3);
                        setShowDropdown(
                            newQuery.length > 0 &&
                                newFilteredSuggestions.length > 0
                        );
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search name"
                    className="searchbar__input"
                />
                {query ? (
                    <X
                        className="searchbar__icon"
                        onClick={() => {
                            setQuery("");
                            setShowDropdown(false);
                        }}
                    />
                ) : (
                    <Search className="searchbar__icon" />
                )}
            </div>
            {showDropdown && (
                <ul className="searchbar__dropdown">
                    {filteredSuggestions.map((landmark, index) => (
                        <li
                            key={index}
                            className="searchbar__dropdown-item"
                            onClick={() => {
                                setQuery(landmark.name);
                                setShowDropdown(false);
                                setSelectedSearch(landmark);
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
