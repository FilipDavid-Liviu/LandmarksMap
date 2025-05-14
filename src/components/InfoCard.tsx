import { useState, useEffect } from "react";
import { useSelectedMarker } from "../contexts/SelectedMarkerContext";
import { Landmark } from "../contexts/LandmarkContext";
import { X } from "lucide-react";
import "./InfoCard.css";
import { decimalToDMS } from "./Utils";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";
import { useAuth } from "../contexts/AuthContext";

const InfoCard = () => {
    const [showInfo, setShowInfo] = useState(false);
    const { selectedMarker, setSelectedMarker } = useSelectedMarker();
    const [landmark, setLandmark] = useState<Landmark | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (selectedMarker) {
            let objectUrl: string | null = null;

            if (selectedMarker.image instanceof File) {
                objectUrl = URL.createObjectURL(selectedMarker.image);
                setImageUrl(objectUrl);
            } else if (typeof selectedMarker.image === "string") {
                setImageUrl(selectedMarker.image);
            } else {
                setImageUrl(null);
            }

            setLandmark(selectedMarker);
            setShowInfo(true);

            return () => {
                if (objectUrl) URL.revokeObjectURL(objectUrl);
            };
        } else {
            setShowInfo(false);
            setLandmark(null);
            setImageUrl(null);
        }
    }, [selectedMarker]);

    const { savedLandmarkIds, saveLandmark, unsaveLandmark } = useLandmarks();

    const handleToggleSave = () => {
        if (!landmark) return;
        if (savedLandmarkIds.includes(landmark.id)) {
            unsaveLandmark(landmark.id);
        } else {
            saveLandmark(landmark.id);
        }
    };
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
            {isAuthenticated && (
                <img
                    src={
                        landmark && savedLandmarkIds.includes(landmark.id)
                            ? "./src/assets/bookmark2.svg"
                            : "./src/assets/bookmark1.svg"
                    }
                    className="infocard__save-icon"
                    onClick={handleToggleSave}
                />
            )}
        </div>
    );
};

export default InfoCard;
