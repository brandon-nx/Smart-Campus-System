import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaMapMarkerAlt,
  FaTheaterMasks,
  FaSignInAlt,
  FaCalendarCheck,
  FaUserCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import classes from "./styles/RootNavigation.module.css";
import Modal from "../../../client/src/components/routes/Modal"; // Adjust path if needed

function RootNavigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const sosHandler = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
        <>
          <NavLink
            to={"/bookings"}
            className={({ isActive }) =>
              `${classes["nav-item"]} ${isActive ? classes.active : ""}`
            }
          >
            <FaCalendarCheck className={classes["nav-icon"]} />
            <span>Booking</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${classes["nav-item"]} ${isActive ? classes.active : ""}`
            }
          >
            <FaUserCircle className={classes["nav-icon"]} />
            <span>Profile</span>
          </NavLink>
        </>
      )}

      <button onClick={sosHandler} className={classes["sos-btn"]}>
        <FaExclamationTriangle className={classes["sos-icon"]} />
      </button>

      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}

export default RootNavigation;
