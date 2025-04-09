import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import "./SearchBar.css";
import { useLandmarks } from "../contexts/LandmarkContext";
import { useSelectedSearch } from "../contexts/SelectedSearchContext";

const SearchBar = () => {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { searched, fetchSearchedLandmarks } = useLandmarks();
    const { setSelectedSearch } = useSelectedSearch();

    useEffect(() => {
        fetchSearchedLandmarks(search);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (searched.length === 1) {
                const match = searched[0];
                setSearch(match.name);
                setShowDropdown(false);
                setSelectedSearch(match);
            } else {
                const match = searched.find(
                    (landmark) =>
                        landmark.name.toLowerCase() === search.toLowerCase()
                );

                if (match) {
                    setSearch(match.name);
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
                    value={search}
                    onChange={(e) => {
                        const newQuery = e.target.value;
                        setSearch(newQuery);
                        const newFilteredSuggestions = searched
                            .filter((landmark) =>
                                landmark.name
                                    .toLowerCase()
                                    .includes(newQuery.toLowerCase())
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
