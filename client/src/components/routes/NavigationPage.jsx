import React, { useState, useRef, useEffect } from "react";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import thirdFloorMap from "../../assets/maps/ThirdFloor.svg";
import classes from "./styles/NavigationPage.module.css";

export default function NavigationPage() {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [floor, setFloor] = useState("second");
  const canvasRef = useRef(null);

  // List of locations with coordinates
  const locations = {
    "Entrance": { x: 50, y: 400, floor: "second" },
    "Lecture Hall 2R029": { x: 300, y: 100, floor: "second" },
    "Library": { x: 450, y: 250, floor: "third" },
    "Admin Office": { x: 200, y: 300, floor: "third" }
  };

  // Handles selecting a location from the dropdown
  const handleLocationSelect = (location) => {
    setStartLocation(location);
    setShowLocationDropdown(false);
  };

  const handleDestinationSelect = (location) => {
    setDestination(location);
    setShowSearchDropdown(false);
  };

  // Function to switch floors
  const switchFloor = () => {
    setFloor((prevFloor) => (prevFloor === "second" ? "third" : "second"));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; 
  
    // Set canvas size dynamically
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.9;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    if (startLocation && destination) {
      const startPos = locations[startLocation];
      const endPos = locations[destination];
  
      if (startPos && endPos && startPos.floor === endPos.floor) {
        setFloor(startPos.floor);
  
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(endPos.x, endPos.y);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }
  }, [startLocation, destination]);  



  return (
    <div className={classes["map-container"]}>
      {/* Top Section with Search Boxes */}
      <div className={classes["map-top"]}>
        {/* First Search Box: Your Location */}
        <div className={classes["map-top-search-container"]}>
          <div
            className={classes["map-top-search-box"]}
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
          >
            <img src={blueDot} alt="Location Icon" className={classes["blue-dot"]} />
            <span>{startLocation || "Your Location"}</span>
          </div>
          {showLocationDropdown && (
            <div className={classes["map-top-dropdown"]}>
              {Object.keys(locations).map((loc) => (
                <div key={loc} onClick={() => handleLocationSelect(loc)} className={classes["map-top-dropdown-item"]}>
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
            <img src={redPin} alt="Search Icon" className={classes["red-pin"]} />
            <span>{destination || "Search Destination"}</span>
            <img src={switchLocation} alt="Switch Icon" className={classes["switch-icon"]} onClick={switchFloor} />
          </div>
          {showSearchDropdown && (
            <div className={classes["map-top-dropdown map-top-full-dropdown"]}>
              {Object.keys(locations).map((loc) => (
                <div key={loc} onClick={() => handleDestinationSelect(loc)} className={classes["dropdown-item"]}>
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map Display */}
      <div className={classes["map"]}>
        <img
          src={floor === "second" ? secondFloorMap : thirdFloorMap}
          alt={`${floor} Floor Map`}
          className={classes["campus-map"]}
        />
        <canvas ref={canvasRef} className={classes["map-overlay"]} />
      </div>
    </div>
  );
}
