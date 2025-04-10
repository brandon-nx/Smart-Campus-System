import React, { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import backIcon from "../../assets/icons/back.png";
import closeIcon from "../../assets/icons/closeIcon.png";

import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import thirdFloorMap from "../../assets/maps/ThirdFloor.svg";
import locationRooms from "../util/locations";
import locationWaypoints from "../util/waypoints";
import graph from "../util/graph";

import { dijkstra, getConstrainedPath } from "../util/dijkstra";
import { getDistance } from "../util/distance";

import classes from "./styles/NavigationPage.module.css";

export default function NavigationPage() {
  // State management
  const [searchQueries, setSearchQueries] = useState({ start: "", destination: "" });
  const [startLocation, setStartLocation] = useState("main-entrance");
  const [destination, setDestination] = useState(null);
  const [editing, setEditing] = useState({ start: false, destination: false });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });
  const [activeFloor, setActiveFloor] = useState("second");
  const [path, setPath] = useState([]);

  // Refs for DOM and images
  const canvasRef = useRef(null);
  const transformRef = useRef(null);
  const startMarkerRef = useRef(null);

  // Merge room and waypoint data
  const locations = { ...locationRooms, ...locationWaypoints };

  // Load blue dot marker once
  useEffect(() => {
    const img = new Image();
    img.src = blueDot;
    startMarkerRef.current = img;
  }, []);

  // Handle dropdown item selection
  const handleDropdownSelect = (location, type) => {
    setSearchQueries(prev => ({ ...prev, [type]: location }));
    setEditing(prev => ({ ...prev, [type]: false }));
    type === "start" ? setStartLocation(location) : setDestination(location);
  };

  // Format raw location key into readable text
  const formatDisplayName = (key) => {
    if (!key) return "";
    const loc = locations[key];
    return loc?.label || key.split("-").filter(Boolean).map(word => /^[0-9]/.test(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  // Render dropdown based on type (start/destination)
  const renderDropdown = (type) => (
    <div className={classes["map-top-dropdown"]}>
      {Object.keys(locations)
        .filter(loc => loc.toLowerCase().includes(searchQueries[type].toLowerCase()))
        .map(loc => (
          <div key={loc} onClick={() => handleDropdownSelect(loc, type)} className={classes["map-top-dropdown-item"]}>
            {formatDisplayName(loc)}
          </div>
        ))}
    </div>
  );

  // Swap start and destination
  const handleSwitchLocations = () => {
    setStartLocation(destination);
    setDestination(startLocation);
    setSearchQueries({ start: destination || "", destination: startLocation || "" });
    setMapLoaded(false);
    setTimeout(() => setMapLoaded(true), 0);
  };

  // Clear the canvas overlay
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Find nearest corridor waypoint
  const findNearestWaypoint = (point) => {
    return Object.entries(locationWaypoints).reduce((nearest, [id, wp]) => {
      if (wp.floor !== point.floor) return nearest; // 👈 Add this!
      const dist = getDistance(point, wp);
      return dist < nearest.minDist ? { id, minDist: dist } : nearest;
    }, { id: null, minDist: Infinity }).id;
  };  

  const splitPathByLift = (fullPath) => {
    const lifts = fullPath.filter(p => p.toLowerCase().includes("lift-lobby"));
    if (lifts.length < 2) return { floor2Path: fullPath, floor3Path: [] };
    const lift2Idx = fullPath.findIndex(p => locations[p]?.floor === "second" && p.toLowerCase().includes("lift-lobby"));
    const lift3Idx = fullPath.findIndex(p => locations[p]?.floor === "third" && p.toLowerCase().includes("lift-lobby"));
    return {
      floor2Path: fullPath.slice(0, lift3Idx + 1),
      floor3Path: fullPath.slice(lift2Idx)
    };
  };

  // Draw only the blue start marker
  const drawStartMarkerOnly = () => {
    const ctx = canvasRef.current?.getContext("2d");
    const startLoc = locations[startLocation];
    const img = startMarkerRef.current;

    if (!ctx || !startLoc || !mapLoaded) return;
    clearCanvas();
    if (img?.complete) ctx.drawImage(img, startLoc.x - 35, startLoc.y - 15, 70, 70);
    else img.onload = () => ctx.drawImage(img, startLoc.x - 35, startLoc.y - 15, 70, 70);
  };
  

  // Draw full path and markers
  const drawPath = (fullPath) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !mapLoaded || !fullPath?.length) return;
  
    clearCanvas();
  
    const { floor2Path, floor3Path } = splitPathByLift(fullPath);
    const path = activeFloor === "second" ? floor2Path : floor3Path;
  
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
  
    path.forEach((key, i) => {
      const { x, y } = locations[key] || {};
      if (typeof x !== "number" || typeof y !== "number") return;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
  
    ctx.stroke();
    ctx.setLineDash([]);

    const startLoc = locations[path[0]];
    const endLoc = locations[path[path.length - 1]];
    if (!startLoc || !endLoc) return;
    const startMarker = new Image();
    const endMarker = new Image();
    startMarker.src = blueDot;
    endMarker.src = redPin;
    if (startLoc.floor === activeFloor) {
      startMarker.onload = () => ctx.drawImage(startMarker, startLoc.x - 35, startLoc.y - 15, 70, 70);
    }
    if (endLoc.floor === activeFloor) {
      endMarker.onload = () => ctx.drawImage(endMarker, endLoc.x - 15, endLoc.y - 30, 70, 70);
    }
  };  

  const findNearestLift = (point, floor) => {
    const liftOptions = Object.entries(locations).filter(([id, loc]) =>
      id.toLowerCase().includes("lift-lobby") && loc.floor === floor
    );
    return liftOptions.reduce((nearest, [id, loc]) => {
      const dist = getDistance(point, loc);
      return dist < nearest.minDist ? { id, minDist: dist } : nearest;
    }, { id: null, minDist: Infinity }).id;
  };

  const findLiftLobbyOnCurrentFloor = () => {
    return path.find(node =>
      node.toLowerCase().includes("lift-lobby") &&
      locations[node]?.floor === activeFloor
    );
  };
  

  // Re-draw on location or map changes
  useEffect(() => {
    if (!mapLoaded || !startLocation) return;
    if (!destination) return drawStartMarkerOnly();
  
    const start = locations[startLocation];
    const end = locations[destination];
    if (!start || !end) return;

    if (start.floor !== activeFloor && end.floor !== activeFloor) return;

    const startWP = findNearestWaypoint(start);
    const endWP = findNearestWaypoint(end);
    if (!startWP || !endWP) return;

    let fullPath = [];

    if (start.floor !== end.floor) {
      const lift2 = findNearestLift(start, "second");

      const lift3 = Object.keys(locations).find(
        k =>
          k.toLowerCase().includes("lift-lobby") &&
          locations[k].floor === "third" &&
          k.toLowerCase().includes(lift2.toLowerCase().includes("left") ? "left" : "right")
      );

      const pathToLift = dijkstra(graph, startWP, lift2);
      console.log("🟦 lift3:", lift3); // Should be 'lift-lobby (Level 3 Left Wing)'
      console.log("🟦 graph[lift3]:", graph[lift3]); // Should contain 'wp-111'

      const entryWP = Object.keys(graph[lift3]).find(k => k.startsWith("wp-"));
      console.log("🚪 entryWP:", entryWP); // Should be 'wp-111'
      console.log("🔗 entryWP neighbors:", graph[entryWP]); // Should include 'wp-112'

      console.log("🎯 endWP:", endWP); // Should be something like 'wp-155'

      const constraints = [
        ["lift-lobby (Level 3 Left Wing)", "lift-lobby (Level 2 Left Wing)"],
        ["lift-lobby (Level 3 Right Wing)", "lift-lobby (Level 2 Right Wing)"],
        ["main-stair (Level 3 Right Wing)", "main-stair (Level 2 Right Wing)"],
      ];
      
      const pathFromLift = getConstrainedPath(graph, entryWP, endWP, constraints);
      console.log("🧭 Path from lift to end:", pathFromLift);
      
      fullPath = [startLocation, ...pathToLift, lift2, lift3, entryWP, ...pathFromLift, destination];



      if (!pathToLift.length || !pathFromLift.length) {
        console.warn("🚫 Path to/from lift is broken");
        return;
      }

      fullPath = [startLocation, ...pathToLift, lift2, lift3, entryWP, ...pathFromLift, destination];
    } else {
      const dijkstraPath = dijkstra(graph, startWP, endWP);
      fullPath = [startLocation, ...dijkstraPath, destination];
    }

    setPath(fullPath);
    drawPath(fullPath);
    
  }, [startLocation, destination, mapLoaded, activeFloor]);
  

  // Automatically center and zoom to start location
  useEffect(() => {
    if (!mapLoaded || !startLocation || !transformRef.current) return;
  
    const start = locations[startLocation];
    const img = document.querySelector(`.${classes["campus-map"]}`);
    const wrapper = document.querySelector(`.${classes["map-zoom-wrapper"]}`);
    if (!img || !wrapper || img.naturalWidth === 0 || img.naturalHeight === 0) return;
  
    const imgRect = img.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scaleX = imgRect.width / img.naturalWidth;
    const scaleY = imgRect.height / img.naturalHeight;
    const pointX = start.x * scaleX;
    const pointY = start.y * scaleY;
    const desiredZoom = 4;
    const positionX = (wrapperRect.width / 2) - (pointX * desiredZoom);
    const positionY = (wrapperRect.height / 2) - (pointY * desiredZoom);

    if (!isNaN(positionX) && !isNaN(positionY)) {
      transformRef.current.setTransform(positionX, positionY, desiredZoom, 400, "easeOut");
    }
  }, [mapLoaded, startLocation, activeFloor]);
  

  // On map image load, set dimensions
  const onMapLoad = ({ target: img }) => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (width && height) {
      setImgDimensions({ width, height });
      setMapLoaded(true);
    }
  };

  // Get current active map
  const getActiveMap = () => {
    switch (activeFloor) {
      case "third":
        return thirdFloorMap;
      case "second":
      default:
        return secondFloorMap;
    }
  };
  
  return (
    <div className={classes["map-container"]}>
      {/* Top Search Inputs */}
      <div className={classes["map-top"]}>
        {["start", "destination"].map((type) => (
          <div className={classes["map-top-search-container"]} key={type}>
            {editing[type] ? (
              <div className={classes["map-top-search-box"]}>
                <img src={backIcon} alt="Back" className={classes["back-icon"]} onClick={() => setEditing({ ...editing, [type]: false })} />
                <div className={classes["search-input-wrapper"]}>
                  <input
                    type="text"
                    placeholder={`Search ${type}...`}
                    value={searchQueries[type]}
                    onChange={(e) => setSearchQueries({ ...searchQueries, [type]: e.target.value })}
                    className={classes["search-input"]}
                  />
                  {searchQueries[type] && (
                    <img src={closeIcon} alt="Clear" className={classes["clear-icon"]} onClick={() => setSearchQueries({ ...searchQueries, [type]: "" })} />
                  )}
                </div>
                {renderDropdown(type)}
              </div>
            ) : (
              <div className={classes["map-top-search-box"]} onClick={() => setEditing({ ...editing, [type]: true })}>
                <img src={type === "start" ? blueDot : redPin} alt="Icon" className={classes[type === "start" ? "blue-dot" : "red-pin"]} />
                <span>{type === "start" ? formatDisplayName(startLocation) : destination ? formatDisplayName(destination) : "Search Destination"}</span>
                {type === "destination" && (
                  <div className={classes["switch-icon-wrapper"]} onClick={(e) => { e.stopPropagation(); handleSwitchLocations(); }}>
                    <img src={switchLocation} alt="Switch Icon" className={classes["switch-icon"]} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Map Viewer */}
      <div className={classes["map"]}>
        <div className={classes["map-inner"]}>
          <TransformWrapper
            ref={transformRef}
            initialScale={1}
            wheel={{ disabled: false }}
            doubleClick={{ disabled: true }}
            pinch={{ disabled: false }}
            panning={{ velocityDisabled: true }}          
          >
            <TransformComponent wrapperClass={classes["map-zoom-wrapper"]}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={getActiveMap()} alt={`${activeFloor} Floor Map`} className={classes["campus-map"]} onLoad={onMapLoad} />
                <canvas
                  ref={canvasRef}
                  className={classes["map-overlay"]}
                  width={imgDimensions.width}
                  height={imgDimensions.height}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
                {(() => {
                  const liftNode = findLiftLobbyOnCurrentFloor();
                  if (!liftNode) return null;

                  const lift = locations[liftNode];
                  return (
                    <button
                      onClick={() => {
                        setActiveFloor(prev => (prev === "second" ? "third" : "second"));
                        console.log("Switching floor to:", activeFloor === "second" ? "third" : "second");
                        setPath([]);
                        setMapLoaded(false);
                        setTimeout(() => setMapLoaded(true), 0);
                      }}
                      style={{
                        position: "absolute",
                        height: "10px",
                        width: "20px",
                        top: `${(lift.y / imgDimensions.height) * 100}%`,
                        left: `${(lift.x / imgDimensions.width) * 100}%`,
                        transform: "translate(-50%, -100%)",
                        zIndex: 999,
                        background: "red",
                        color: "white",
                        border: "1px solid black",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "3px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      }}
                    >
                      Switch Floor
                    </button>
                  );
                })()}
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}