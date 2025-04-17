import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt, // for Map
  FaTheaterMasks, // for Event
  FaSignInAlt, // for Sign In
  FaCalendarCheck, // for Booking
  FaSignOutAlt, // for Logout
  FaExclamationTriangle, // for SOS
} from "react-icons/fa";

import classes from "./styles/RootNavigation.module.css";

function sosHandler() {
  alert("SOS triggered!");
}

export default function RootNavigation() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className={classes["nav-container"]}>
      <NavLink
        to={"/"}
        className={({ isActive }) =>
          `${classes["nav-item"]} ${isActive ? classes.active : ""}`
        }
        end
      >
        <FaMapMarkerAlt className={classes["nav-icon"]} />
        <span>Map</span>
      </NavLink>

      <NavLink
        to={"/events"}
        className={({ isActive }) =>
          `${classes["nav-item"]} ${isActive ? classes.active : ""}`
        }
      >
        <FaTheaterMasks className={classes["nav-icon"]} />
        <span>Event</span>
      </NavLink>

      {!isAuthenticated && (
        <NavLink
          to={"/login"}
          className={({ isActive }) =>
            `${classes["nav-item"]} ${isActive ? classes.active : ""}`
          }
        >
          <FaSignInAlt className={classes["nav-icon"]} />
          <span>Sign In</span>
        </NavLink>
      )}

      {isAuthenticated && (
        <NavLink
          to={"/bookings"}
          className={({ isActive }) =>
            `${classes["nav-item"]} ${isActive ? classes.active : ""}`
          }
        >
          <FaCalendarCheck className={classes["nav-icon"]} />
          <span>Booking</span>
        </NavLink>
      )}

      {isAuthenticated && (
        <NavLink
          to={"/logout"}
          className={({ isActive }) =>
            `${classes["nav-item"]} ${isActive ? classes.active : ""}`
          }
        >
          <FaSignOutAlt className={classes["nav-icon"]} />
          <span>Logout</span>
        </NavLink>
      )}

      <button onClick={sosHandler} className={classes["sos-btn"]}>
        <FaExclamationTriangle className={classes["sos-icon"]} />
      </button>
    </div>
  );
}
