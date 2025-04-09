import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/managerooms.css"

export default function ManageEvents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Conference");

  const handleBack = () => {
    navigate(-1); // go back
  };

  const handleAddEvent = () => {
    navigate("add-events")  // Correct usage of useNavigate
  }

  const tabs = ["Conference", "Workshop", "Seminar", "Meeting","Competition"];

  const events = [
    { id: "E001", name: "Annual Tech Conference", location: "Main Auditorium" },
    { id: "E002", name: "Leadership Workshop", location: "Room 2R023" },
    { id: "E003", name: "Data Science Seminar", location: "Laboratory 3R024" },
    { id: "E004", name: "Faculty Meeting", location: "Conference Room 3R025" },
    { id: "E005", name: "Student Orientation", location: "Main Hall" },
  ];

  return (
    <div className="manage-rooms-container">
      {/* Header */}
      <header className="rooms-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Events</h1>
      </header>

      {/* Add Event Button */}
      <button className="add-room-button" onClick={handleAddEvent}>
        <Plus className="plus--icon" />
      </button>

      {/* Event Type Tabs */}
      <div className="room-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`room-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div className="room-list">
        {events.map((event) => (
          <div key={event.id} className="room-item">
            <div className="room-info">
              <h3 className="room-name">{event.name}</h3>
              <p className="room-location">{event.location}</p>
            </div>
            <button className="room-action">
              <ChevronRight className="chevron--icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
