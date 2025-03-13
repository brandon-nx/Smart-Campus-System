import classes from "./styles/RootNavigation.module.css";
import mapIcon from "../assets/icons/mapIcon.png";
import eventIcon from "../assets/icons/eventIcon.png";
import signInIcon from "../assets/icons/signInIcon.png";
import sosIcon from "../assets/icons/sosIcon.png";
import { NavLink } from "react-router-dom";

function sosHandler() {}

export default function RootNavigation() {
  return (
    <div className={classes["nav-container"]}>
      <NavLink to={"/map"} className={classes["nav-item"]} end>
        <img src={mapIcon} alt="Map Icon" className={classes["nav-icon"]} />
        <span>Map</span>
      </NavLink>
      <NavLink to={"/events"} className={classes["nav-item"]}>
        <img src={eventIcon} alt="Event Icon" className={classes["nav-icon"]} />
        <span>Event</span>
      </NavLink>
      <NavLink to={"/login"} className={classes["nav-item"]}>
        <img src={signInIcon} alt="Sign In Icon" className={classes["nav-icon"]} />
        <span>Sign In</span>
      </NavLink>
      <button onClick={sosHandler} className={classes["sos-btn"]}>
        <img src={sosIcon} alt="SOS" className={classes["sos-icon"]} />
      </button>
    </div>
  );
}
