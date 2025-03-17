import classes from "./styles/RootNavigation.module.css";
import mapIcon from "../assets/icons/mapIcon.png";
import eventIcon from "../assets/icons/eventIcon.png";
import signInIcon from "../assets/icons/signInIcon.png";
import sosIcon from "../assets/icons/sosIcon.png";
//import readCookies from "./util/cookieHandler.jsx";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";



function sosHandler() {}
function signinHandler() {
//CODE BELOW DOESN'T WORK UNLESS A LOCAL INSTANCE IS CREATED TO STORE COOKIES
//  const data = readCookies();
//const response = fetch(`http://localhost:8080/tokenlogin`, {
//  method: "POST",
//  headers: {
//    "Content-Type": "application/json",
//  },
//  body: JSON.stringify(data),
//});
//if (response.status === 422 || response.status === 401) {
//  return redirect("/login");
//}

//else if (!response.ok) {
//  console.log({ message: "Something is wrong, authenticate failed.", status: 500 });
//  return redirect("/login"); 
//}
  
  return ("/login");
}
export default function RootNavigation() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  
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
      {!isAuthenticated && <NavLink to={"/login"} className={classes["nav-item"]}>
        <img src={signInIcon} alt="Sign In Icon" className={classes["nav-icon"]} />
        <span>Sign In</span>
      </NavLink>}
      {isAuthenticated && <NavLink to={"/logout"} className={classes["nav-item"]}>
        <img src={signInIcon} alt="Sign In Icon" className={classes["nav-icon"]} />
        <span>Logout</span>
      </NavLink>}
      <button onClick={sosHandler} className={classes["sos-btn"]}>
        <img src={sosIcon} alt="SOS" className={classes["sos-icon"]} />
      </button>
    </div>
  );
}
