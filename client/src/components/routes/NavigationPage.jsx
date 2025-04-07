import React, { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import blueDot from "../../assets/icons/blueDot.png";
import redPin from "../../assets/icons/redPin.png";
import switchLocation from "../../assets/icons/switchLocation.png";
import backIcon from "../../assets/icons/back.png";
import closeIcon from "../../assets/icons/closeIcon.png";
import secondFloorMap from "../../assets/maps/SecondFloor.svg";
import { dijkstra } from "../util/dijkstra";
import { getDistance } from "../util/distance";
import locationRooms from "../util/second_floor_locations";
import locationWaypoints from "../util/second_floor_locations_waypoints";
import graph from "../util/graph";
import classes from "./styles/NavigationPage.module.css";

export default function NavigationPage() {
  // State management
  const [searchQueries, setSearchQueries] = useState({ start: "", destination: "" });
  const [startLocation, setStartLocation] = useState("main-entrance");
  const [destination, setDestination] = useState(null);
  const [editing, setEditing] = useState({ start: false, destination: false });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [refreshCanvas, setRefreshCanvas] = useState(false);
  const [imgDimensions, setImgDimensions] = useState({ width: 1, height: 1 });

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
      const dist = getDistance(point, wp);
      return dist < nearest.minDist ? { id, minDist: dist } : nearest;
    }, { id: null, minDist: Infinity }).id;
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
  const drawPath = (path) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !mapLoaded || !path?.length) return;

    clearCanvas();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();

    path.forEach((key, i) => {
      const { x, y } = locations[key] || {};
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.setLineDash([]);

    // Draw start and end markers
    const startLoc = locations[path[0]];
    const endLoc = locations[path[path.length - 1]];

    const startMarker = new Image();
    const endMarker = new Image();
    startMarker.src = blueDot;
    endMarker.src = redPin;

    startMarker.onload = () => ctx.drawImage(startMarker, startLoc.x - 35, startLoc.y - 15, 70, 70);
    endMarker.onload = () => ctx.drawImage(endMarker, endLoc.x - 15, endLoc.y - 30, 70, 70);
  };

  // Re-draw on location or map changes
  useEffect(() => {
    if (!mapLoaded || !startLocation) return;
    if (!destination) return drawStartMarkerOnly();

    const start = locations[startLocation];
    const end = locations[destination];
    if (!start || !end) return;

    const startWP = findNearestWaypoint(start);
    const endWP = findNearestWaypoint(end);
    if (!startWP || !endWP) return;

    const fullPath = [startLocation, ...dijkstra(graph, startWP, endWP), destination];
    drawPath(fullPath);
  }, [startLocation, destination, mapLoaded]);

  // Automatically center and zoom to start location
  useEffect(() => {
    if (!mapLoaded || !startLocation || !transformRef.current) return;
  
    const start = locations[startLocation];
    const img = document.querySelector(`.${classes["campus-map"]}`);
    const wrapper = document.querySelector(`.${classes["map-zoom-wrapper"]}`);
    if (!img || !wrapper) return;
  
    const imgRect = img.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const scaleX = imgRect.width / img.naturalWidth;
    const scaleY = imgRect.height / img.naturalHeight;
    const pointX = start.x * scaleX;
    const pointY = start.y * scaleY;
    const desiredZoom = 4;
    const positionX = (wrapperRect.width / 2) - (pointX * desiredZoom);
    const positionY = (wrapperRect.height / 2) - (pointY * desiredZoom);
  
    transformRef.current.setTransform(positionX, positionY, desiredZoom, 400, "easeOut");
  }, [mapLoaded]);
  

  // On map image load, set dimensions
  const onMapLoad = ({ target: img }) => {
    setMapLoaded(true);
    setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
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
            onZoomStop={() => setRefreshCanvas(prev => !prev)}
            onPanningStop={() => setRefreshCanvas(prev => !prev)}            
          >
            <TransformComponent wrapperClass={classes["map-zoom-wrapper"]}>
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={secondFloorMap} alt="Second Floor Map" className={classes["campus-map"]} onLoad={onMapLoad} />
                <canvas
                  ref={canvasRef}
                  className={classes["map-overlay"]}
                  width={imgDimensions.width}
                  height={imgDimensions.height}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                />
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
    </div>
  );
}