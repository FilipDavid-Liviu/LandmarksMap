import React, { useState } from "react";
import "./Dropdown.css";

type Props = {
    selectedType: string;
    onTypeChange: (type: string) => void;
};

const landmarkTypes = [
    "Monument",
    "Place of Worship",
    "Religious Monument",
    "Castle/Fortress",
    "Palace",
    "Ancient Ruins",
    "Natural",
    "Not specified",
];

const DropdownTypes: React.FC<Props> = ({ selectedType, onTypeChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {selectedType || "Select a type"}
            </div>

            {isOpen && (
                <ul className="dropdown-list">
                    {landmarkTypes.map((type) => (
                        <li
                            key={type}
                            className="dropdown-item"
                            onClick={() => {
                                onTypeChange(type);
                                setIsOpen(false);
                            }}
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropdownTypes;
