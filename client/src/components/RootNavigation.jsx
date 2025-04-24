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
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";

import classes from "./styles/RootNavigation.module.css";
import Modal from "../../../client/src/components/routes/Modal"; // Adjust path if needed

function RootNavigation() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const accountVerified = useSelector((state) => state.auth.verified);
  const sosHandler = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const verifiedAccount = isAuthenticated && accountVerified;
  const unverifiedAccount = isAuthenticated && !accountVerified;
  const noAccount = !isAuthenticated;

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

      {!!verifiedAccount && (
        <NavLink
          to={"/events"}
          className={({ isActive }) =>
            `${classes["nav-item"]} ${isActive ? classes.active : ""}`
          }
        >
          <FaTheaterMasks className={classes["nav-icon"]} />
          <span>Event</span>
        </NavLink>
      )}

      {!!noAccount && (
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

      {!!verifiedAccount && (
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

      {!!unverifiedAccount && (
        <NavLink
          to={"/verify"}
          className={({ isActive }) =>
            `${classes["nav-item"]} ${isActive ? classes.active : ""}`
          }
        >
          <FaCheckCircle className={classes["nav-icon"]} />
          <span>Verify Account</span>
        </NavLink>
      )}

      {!!unverifiedAccount && (
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

      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
}

export default RootNavigation;
