import "./ButtonBar.css";
import userIcon from "../assets/user.svg";
import listIcon from "../assets/list2.svg";
import plusIcon from "../assets/plus.svg";
import minusIcon from "../assets/minus.svg";
import mapIcon from "../assets/map.svg";
import connection from "../assets/connection.svg";
import { Link } from "react-router-dom";
import { useLandmarks } from "../contexts/LandmarkContext.tsx";

const ButtonBar = () => {
    const { isServerUp } = useLandmarks();
    return (
        <div className="button-bar">
            <div className="top-buttons">
                <Link to="/">
                    <img src={mapIcon} className="icon" alt="Free Roam" />
                </Link>
                <Link to="/add">
                    <img src={plusIcon} className="icon" alt="Add Landmark" />
                </Link>
                <Link to="/update">
                    <img
                        src={minusIcon}
                        className="icon"
                        alt="Update/Delete Landmark"
                    />
                </Link>
                <Link to="/list">
                    <img src={listIcon} className="icon" alt="Landmark List" />
                </Link>
                <Link to="/profile">
                    <img src={userIcon} className="icon" alt="User Profile" />
                </Link>
            </div>
            <Link className="con" to="localhost:8000">
                {isServerUp ? (
                    <div></div>
                ) : (
                    <img src={connection} className="icon" alt="Connection" />
                )}
            </Link>
        </div>
    );
};

export default ButtonBar;
