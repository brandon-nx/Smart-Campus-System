import React, { useState } from "react";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import classes from "./styles/NavigationPage.module.css";

export default function NavigationPage() {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Example list of locations
  const locations = [
    "Location 1",
    "Location 2",
    "Location 3",
    "Location 4",
    "Location 5",
    "Location 6",
    "Location 7",
    "Location 8",
    "Location 9",
    "Location 10",
  ];

  return (
    <div className={classes["map-container"]}>
      {/* Top Section with Vertical Search Boxes */}
      <div className={classes["map-top"]}>
        {/* First Search Box: Your Location */}
        <div className={classes["map-top-search-container"]}>
          <div
            className={classes["map-top-search-box"]}
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <img
              src={blueDot}
              alt="Location Icon"
              className={classes["search-icon"]}
            />
            <span>Your Location</span>
          </div>
          {showLocationDropdown && (
            <div className={classes["map-top-dropdown"]}>
              {locations.map((loc, index) => (
                <div key={index} className={classes["map-top-dropdown-item"]}>
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Second Search Box: Search */}
        <div className={classes["map-top-search-container"]}>
          <div
            className={classes["map-top-search-box"]}
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
          >
            <img
              src={redPin}
              alt="Search Icon"
              className={classes["search-icon"]}
            />
            <span>Search</span>
            <img
              src={switchLocation}
              alt="Switch Icon"
              className={classes["switch-icon"]}
            />
          </div>
          {showSearchDropdown && (
            <div className={classes["map-top-dropdown map-top-full-dropdown"]}>
              {locations.map((loc, index) => (
                <div key={index} className={classes["dropdown-item"]}>
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: Map Placeholder */}
      <div className={classes["map"]}>
        <div className={classes["map-placeholder"]}>
          <p>Map goes here</p>
        </div>
      </div>
    </div>
  );
}
