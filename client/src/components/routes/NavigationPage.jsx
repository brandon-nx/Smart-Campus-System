import React, { useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import backIcon from "../../assets/icons/back.png";
import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import locations from "../util/second_floor_locations";
import classes from "./styles/NavigationPage.module.css";

export default function NavigationPage() {
  // State hooks for user input, selected locations, and map image load status
  const [searchQueries, setSearchQueries] = useState({ start: "", destination: "" });
  const [startLocation, setStartLocation] = useState("main-entrance");
  const [destination, setDestination] = useState(null);
  const [editing, setEditing] = useState({ start: false, destination: false });
  const [mapLoaded, setMapLoaded] = useState(false);

  // Refs for accessing canvas and transform controls
  const canvasRef = useRef(null);
  const transformRef = useRef(null);

  // Handle selection from dropdown
  const handleDropdownSelect = (location, type) => {
    const updatedQueries = { ...searchQueries, [type]: location };
    const updatedEditing = { ...editing, [type]: false };

    if (type === "start") setStartLocation(location);
    else setDestination(location);

    setSearchQueries(updatedQueries);
    setEditing(updatedEditing);
  };

  // Convert raw svg id attribute to human-readable display names
  const formatDisplayName = (key) => {
    if (!key) return "";
    const loc = locations[key];
    if (loc?.label) return loc.label;

    return key
      .split("-")
      .filter(Boolean)
      .map((word) =>
        /^[0-9]/.test(word)
          ? word.toUpperCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };
  

  // Renders dropdown menu for either start or destination
  const renderDropdown = (type) => (
    <div className={classes["map-top-dropdown"]}>
      {Object.keys(locations)
        .filter((loc) => loc.toLowerCase().includes(searchQueries[type].toLowerCase()))
        .map((loc) => (
          <div
            key={loc}
            onClick={() => handleDropdownSelect(loc, type)}
            className={classes["map-top-dropdown-item"]}
          >
            {formatDisplayName(loc)}
          </div>
        ))}
    </div>
  );

  // Swap the start and destination values
  const handleSwitchLocations = () => {
    setStartLocation(destination);
    setDestination(startLocation);
    setSearchQueries({ start: destination || "", destination: startLocation || "" });
  };

  // Calculates position of blue dot relative to scaled map
  const getScaledPosition = (x, y) => {
    const img = document.querySelector(`.${classes["campus-map"]}`);
    if (!img) return { left: 0, top: 0 };

    const { width, height } = img.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = img;
    const scaleX = width / naturalWidth;
    const scaleY = height / naturalHeight;

    return {
      left: x * scaleX,
      top: y * scaleY,
    };
  };
  
  return (
    <div className={classes["map-container"]}>
      {/* Top bar with search inputs */}
      <div className={classes["map-top"]}>
        {["start", "destination"].map((type) => (
          <div className={classes["map-top-search-container"]} key={type}>
            {editing[type] ? (
              <div className={classes["map-top-search-box"]}>
                <img
                  src={backIcon}
                  alt="Back"
                  className={classes["back-icon"]}
                  onClick={() => setEditing({ ...editing, [type]: false })}
                />

                <input
                  type="text"
                  placeholder={`Search ${type}...`}
                  value={searchQueries[type]}
                  onChange={(e) =>
                    setSearchQueries({ ...searchQueries, [type]: e.target.value })
                  }
                  className={classes["search-input"]}
                />
                {renderDropdown(type)}
              </div>
            ) : (
              <div className={classes["map-top-search-box"]} onClick={() => setEditing({ ...editing, [type]: true })}>
                <img
                  src={type === "start" ? blueDot : redPin}
                  alt="Icon"
                  className={classes[type === "start" ? "blue-dot" : "red-pin"]}
                />

                <span>
                  {type === "start"
                    ? formatDisplayName(startLocation)
                    : destination
                    ? formatDisplayName(destination)
                    : "Search Destination"}
                </span>
                
                {type === "destination" && (
                  <div
                    className={classes["switch-icon-wrapper"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSwitchLocations();
                    }}
                  >
                    <img
                      src={switchLocation}
                      alt="Switch Icon"
                      className={classes["switch-icon"]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive map viewer */}
      <div className={classes["map"]}>
        <div className={classes["map-inner"]}>
          <TransformWrapper
            ref={transformRef}
            onInit={(utils) => {transformRef.current = utils;}}
            initialScale={1}
            wheel={{ disabled: false }}
            doubleClick={{ disabled: true }}
            pinch={{ disabled: false }}
            panning={{ velocityDisabled: true }}
          >
            <TransformComponent wrapperClass={classes["map-zoom-wrapper"]}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img
                  src={secondFloorMap}
                  alt="Second Floor Map"
                  className={classes["campus-map"]}
                  onLoad={() => setMapLoaded(true)}
                />

                {/* Current location blue dot */}
                {mapLoaded && startLocation === "main-entrance" && (
                  <img
                    src={blueDot}
                    alt="Current Location"
                    className={classes["current-location-dot"]}
                    style={(() => {
                      const { x, y } = locations["main-entrance"];
                      const { left, top } = getScaledPosition(x, y);
                      return { left: `${left}px`, top: `${top}px` };
                    })()}
                  />
                )}

                {/* Canvas for path drawing */}
                <canvas ref={canvasRef}className={classes["map-overlay"]}/>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}