import React, { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import backIcon from "../../assets/icons/back.png";
import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import { dijkstra } from "../util/dijkstra";
import { getDistance } from "../util/distance";
import locationRooms from "../util/second_floor_locations"; 
import locationWaypoints from "../util/second_floor_locations_waypoints"; 
import graph from "../util/graph";
import classes from "./styles/NavigationPage.module.css";


export default function NavigationPage() {
  // State hooks for user input, selected locations, and map image load status
  const [searchQueries, setSearchQueries] = useState({ start: "", destination: "" });
  const [startLocation, setStartLocation] = useState("main-entrance");
  const [destination, setDestination] = useState(null);
  const [editing, setEditing] = useState({ start: false, destination: false });
  const [mapLoaded, setMapLoaded] = useState(false);

  // All Locations 
  const locations = { ...locationRooms, ...locationWaypoints };

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

  // Draw path using Dijisktra Path Finding Algorithm
  const drawPath = (path) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !mapLoaded || !path || path.length === 0) return;
  
    const img = document.querySelector(`.${classes["campus-map"]}`);
    const displayWidth = img.clientWidth;
    const displayHeight = img.clientHeight;
    const scale = window.devicePixelRatio || 1;
  
    // Fix canvas scaling
    canvas.width = displayWidth * scale;
    canvas.height = displayHeight * scale;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.setLineDash([2]); // Optional: Dash-dot pattern
  
    ctx.beginPath();
    path.forEach((key, i) => {
      const loc = locations[key];
      if (!loc) return;
      const { left, top } = getScaledPosition(loc.x, loc.y);
      if (i === 0) ctx.moveTo(left, top);
      else ctx.lineTo(left, top);
    });
  
    ctx.stroke();
    ctx.setLineDash([]);
  };
  
  
  
  // Find nearest waypoint (corridor)
  const findNearestWaypoint = (point) => {
    let nearest = null;
    let minDist = Infinity;
  
    for (const [id, wp] of Object.entries(locationWaypoints)) {
      const dist = getDistance(point, wp);
      if (dist < minDist) {
        minDist = dist;
        nearest = id;
      }
    }
  
    return nearest;
  };

  useEffect(() => {
    if (!mapLoaded || !startLocation || !destination) return;

    const startPoint = locations[startLocation];
    const endPoint = locations[destination];
    if (!startPoint || !endPoint) return;

    const startWP = findNearestWaypoint(startPoint);
    const endWP = findNearestWaypoint(endPoint);

    if (!startWP || !endWP) return;

    const waypointPath = dijkstra(graph, startWP, endWP);
    if (!waypointPath || waypointPath.length === 0) return;

    const fullPath = [startWP, ...waypointPath, destination];
    drawPath(fullPath);
  }, [startLocation, destination, mapLoaded]);

  
  
  
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
                      const nearestWP = findNearestWaypoint(locations["main-entrance"]);
                      const { x, y } = locations[nearestWP];
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