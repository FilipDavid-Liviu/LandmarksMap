import { useState, useEffect } from "react";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext";
import { Landmark } from "../contexts/LandmarkContext";
import { X } from "lucide-react";
import "./InfoCard.css";
import { decimalToDMS } from "./Utils";

const InfoCard = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { selectedMarker } = useSelectedMarker();
    const [landmark, setLandmark] = useState<Landmark | null>(null);
    useEffect(() => {
        if (selectedMarker) {
            setShowInfo(true);
            setLandmark(selectedMarker);
        } else {
            setShowInfo(false);
        }
    }, [selectedMarker]);
    return (
        <div className={`infocard ${showInfo ? "infocard--active" : ""}`}>
            <div className="infocard__image-placeholder"></div>
            <div className="infocard__firstpart">
                <div className="infocard__leftpart">
                    <div className="infocard__title">{landmark?.name}</div>
                    <div className="infocard__type">{landmark?.type}</div>
                </div>

                {landmark && (
                    <div className="infocard__rightpart">
                        <div className="infocard__coordinates">
                            {decimalToDMS(landmark.lat, true)}
                        </div>
                        <div className="infocard__coordinates">
                            {decimalToDMS(landmark.lng, false)}
                        </div>
                    </div>
                )}
            </div>

            <div className="infocard__section">
                <div className="infocard__descriptiontitle">Description</div>
                <div className="infocard__description">
                    {landmark?.description || "No description available."}
                </div>
            </div>
            <X
                className="infocard__close-icon"
                onClick={() => {
                    setShowInfo(false);
                }}
            />
        </div>
    );
};

export default InfoCard;
