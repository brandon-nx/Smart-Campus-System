import React, { useState } from "react";
import blueDot from "../assets/icons/blueDot.png";
import redPin from "../assets/icons/redPin.png";
import switchLocation from "../assets/icons/switchLocation.png";

function Index() {
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
        <div className="index-container">
            {/* Top Section with Vertical Search Boxes */}
            <div className="index-top">
                {/* First Search Box: Your Location */}
                <div className="search-container">
                <div 
                    className="search-box" 
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                    <img
                    src={blueDot}
                    alt="Location Icon"
                    className="search-icon"
                    />
                    <span>Your Location</span>
                </div>
                {showLocationDropdown && (
                    <div className="dropdown">
                    {locations.map((loc, index) => (
                        <div key={index} className="dropdown-item">
                        {loc}
                        </div>
                    ))}
                    </div>
                )}
                </div>
        
                {/* Second Search Box: Search */}
                <div className="search-container">
                <div 
                    className="search-box" 
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                >
                    <img
                    src={redPin}
                    alt="Search Icon"
                    className="search-icon"
                    />
                    <span>Search</span>
                    <img
                    src={switchLocation}
                    alt="Switch Icon"
                    className="switch-icon"
                    />
                </div>
                {showSearchDropdown && (
                    <div className="dropdown full-dropdown">
                    {locations.map((loc, index) => (
                        <div key={index} className="dropdown-item">
                        {loc}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
        
            {/* Middle Section: Map Placeholder */}
            <div className="index-map">
                <div className="map-placeholder">
                <p>Map goes here</p>
                </div>
            </div>
        </div>
    );
}
    
export default Index;


