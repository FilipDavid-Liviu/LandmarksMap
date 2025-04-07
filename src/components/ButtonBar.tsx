import "./ButtonBar.css";
import userIcon from '../assets/user.svg'
import listIcon from '../assets/list2.svg'
import plusIcon from '../assets/plus.svg'
import minusIcon from '../assets/minus.svg'
import mapIcon from '../assets/map.svg'
import { Link } from "react-router-dom";


const ButtonBar = () => {
    return (
        <div className="button-bar">
        <Link to="/">
          <img src={mapIcon} className="icon" alt="Free Roam" />
        </Link>
        <Link to="/add">
          <img src={plusIcon} className="icon" alt="Add Landmark" />
        </Link>
        <Link to="/update">
          <img src={minusIcon} className="icon" alt="Update/Delete Landmark" />
        </Link>
        <Link to="/list">
          <img src={listIcon} className="icon" alt="Landmark List" />
        </Link>
        <Link to="/profile">
          <img src={userIcon} className="icon" alt="User Profile" />
        </Link>
      </div>
    );
};

export default ButtonBar;
