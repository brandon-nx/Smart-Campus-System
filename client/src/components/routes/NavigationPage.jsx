import React, { useState, useRef, useEffect } from "react";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import backIcon from "../../assets/icons/back.png";
import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import thirdFloorMap from "../../assets/maps/ThirdFloor.svg";
import classes from "./styles/NavigationPage.module.css";


// Use database
const locations = {
  "Entrance": { x: 50, y: 400, floor: "second" },
  "Lecture Hall 2R029": { x: 300, y: 100, floor: "second" },
  "Library": { x: 450, y: 250, floor: "third" },
  "Admin Office": { x: 200, y: 300, floor: "third" }
};

export default function NavigationPage() {
  const [searchQueries, setSearchQueries] = useState({ start: "", destination: "" });
  const [startLocation, setStartLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [floor, setFloor] = useState("second");
  const [editing, setEditing] = useState({ start: false, destination: false }); // New state to track edit mode
  const canvasRef = useRef(null);

  // Function to open dropdown menu
  const handleDropdownSelect = (location, type) => {
    if (type === "start") {
      setStartLocation(location);
      setSearchQueries({ ...searchQueries, start: location });
      setEditing({ ...editing, start: false }); // Close input mode
    } else {
      setDestination(location);
      setSearchQueries({ ...searchQueries, destination: location });
      setEditing({ ...editing, destination: false }); // Close input mode
    }
  };

  const renderDropdown = (type) => (
    <div className={classes["map-top-dropdown"]}>
      {Object.keys(locations)
        .filter((loc) => loc.toLowerCase().includes(searchQueries[type].toLowerCase()))
        .map((loc) => (
          <div key={loc} onClick={() => handleDropdownSelect(loc, type)} className={classes["map-top-dropdown-item"]}>
            {loc}
          </div>
        ))}
    </div>
  );

  // Function to switch location
  const handleSwitchLocations = () => {
    setStartLocation(destination);
    setDestination(startLocation);
    setSearchQueries({ start: destination || "", destination: startLocation || "" }); // Ensure search queries are updated
  };

  // Draw path from current location to destiantion using a pathfinding algorithm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      <div className={classes["map-top"]}>
        {/* Start Location */}
        <div className={classes["map-top-search-container"]}>
          {editing.start ? (
            <div className={classes["map-top-search-box"]}>
              <img src={backIcon} alt="Back" className={classes["back-icon"]} onClick={() => setEditing({ ...editing, start: false })} />
              <input
                type="text"
                placeholder="Search location..."
                value={searchQueries.start}
                onChange={(e) => setSearchQueries({ ...searchQueries, start: e.target.value })}
                className={classes["search-input"]}
              />
              {renderDropdown("start")}
            </div>
          ) : (
            <div className={classes["map-top-search-box"]} onClick={() => setEditing({ ...editing, start: true })}>
              <img src={blueDot} alt="Location Icon" className={classes["blue-dot"]} />
              <span>{startLocation || "Your Location"}</span>
            </div>
          )}
        </div>

        {/* Destination Location */}
        <div className={classes["map-top-search-container"]}>
          {editing.destination ? (
            <div className={classes["map-top-search-box"]}>
              <img src={backIcon} alt="Back" className={classes["back-icon"]} onClick={() => setEditing({ ...editing, destination: false })} />
              <input
                type="text"
                placeholder="Search destination..."
                value={searchQueries.destination}
                onChange={(e) => setSearchQueries({ ...searchQueries, destination: e.target.value })}
                className={classes["search-input"]}
              />
              {renderDropdown("destination")}
            </div>
          ) : (
            <div className={classes["map-top-search-box"]} onClick={() => setEditing({ ...editing, destination: true })}>
              <img src={redPin} alt="Search Icon" className={classes["red-pin"]} />
              <span onClick={() => setEditing({ ...editing, destination: true })}>{destination || "Search Destination"}</span>
              <img
                src={switchLocation}
                alt="Switch Icon"
                className={classes["switch-icon"]}
                onClick={handleSwitchLocations}
              />
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className={classes["map"]}>
        <div className={classes["map-inner"]}>
          {/* Map Image */}
          <img 
            src={floor === "second" ? secondFloorMap : thirdFloorMap} 
            alt={`${floor} Floor Map`} 
            className={classes["campus-map"]} 
          />
          {/* Canvas Overlay for Drawing Paths */}
          <canvas ref={canvasRef} className={classes["map-overlay"]} />
        </div>
      </div>
    </div>
  );
}