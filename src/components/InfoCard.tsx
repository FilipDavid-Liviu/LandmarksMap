import { useState, useEffect } from "react";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext";
import { Landmark } from "../contexts/LandmarkContext";
import { X } from "lucide-react";
import "./InfoCard.css";
import { decimalToDMS } from "./Utils";

const InfoCard = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { selectedMarker, setSelectedMarker } = useSelectedMarker();
    const [landmark, setLandmark] = useState<Landmark | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    useEffect(() => {
        if (selectedMarker) {
            setShowInfo(true);
            setLandmark(selectedMarker);
        } else {
            setShowInfo(false);
        }
    }, [selectedMarker]);

    useEffect(() => {
        let objectUrl: string | null = null;

        if (landmark?.image instanceof File) {
            objectUrl = URL.createObjectURL(landmark.image);
            setImageUrl(objectUrl);
        } else if (typeof landmark?.image === "string") {
            setImageUrl(landmark.image);
        } else {
            setImageUrl(null);
        }

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [landmark]);

    return (
        <div className={`infocard ${showInfo ? "infocard--active" : ""}`}>
            <div className="infocard__image-placeholder">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={landmark?.name || "landmark image"}
                        className="infocard__image"
                    />
                )}
            </div>
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
                    setSelectedMarker(null);
                    setShowInfo(false);
                }}
            />
        </div>
    );
};

export default InfoCard;
