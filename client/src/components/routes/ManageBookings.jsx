import React, { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // 👈 Add useNavigate
import "./styles/Managebookings.css";

const ManageBookings = () => {
  const [activeTab, setActiveTab] = useState("Lecture Hall");
  const navigate = useNavigate(); // 👈 Initialize navigate

  const tabs = ["Lecture Hall", "Lecture Room", "Laboratory", "Workshop"];

  const lectureHalls = [
    { id: "2R022", name: "Lecture Hall 2R022", location: "Right Wing 2nd Floor" },
    { id: "2R023", name: "Lecture Hall 2R023", location: "Right Wing 2nd Floor" },
    { id: "3R024", name: "Lecture Hall 3R024", location: "Right Wing 3rd Floor" },
    { id: "3R025", name: "Lecture Hall 3R025", location: "Right Wing 3rd Floor" },
    { id: "3R026", name: "Lecture Hall 3R026", location: "Right Wing 3rd Floor" },
  ];

  return (
    <div className="bookings-container">
      <header className="bookings-header">
        <button onClick={() => navigate("/admin")} className="back-button">
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Bookings</h1>
      </header>

      <div className="room-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`room-tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="room-list">
        {lectureHalls.map((room) => (
          <Link
            key={room.id}
            to={`/manage-bookings/${room.id}`}
            className="room-item"
          >
            <div className="room-info">
              <h3 className="room-name">{room.name}</h3>
              <p className="room-location">{room.location}</p>
            </div>
            <div className="room-action">
              <ChevronRight className="chevron-icon" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ManageBookings;
