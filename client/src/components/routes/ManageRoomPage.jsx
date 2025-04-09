import { ArrowLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./styles/managerooms.css"

export default function ManageRooms() {
  const navigate = useNavigate()  // Use useNavigate from react-router-dom
  const [activeTab, setActiveTab] = useState("Lecture Hall")

  const handleBack = () => {
    navigate(-1)  // Go back one page
  }

  const handleAddRoom = () => {
    navigate("add-rooms")  // Correct usage of useNavigate
  }

  const tabs = ["Lecture Hall", "Lecture Room", "Laboratory", "Workshop"]

  const rooms = [
    { id: "2R022", name: "Lecture Hall 2R022", location: "Right Wing 2nd Floor" },
    { id: "2R023", name: "Lecture Hall 2R023", location: "Right Wing 2nd Floor" },
    { id: "3R024", name: "Lecture Hall 3R024", location: "Right Wing 3rd Floor" },
    { id: "3R025", name: "Lecture Hall 3R025", location: "Right Wing 3rd Floor" },
    { id: "3R025-2", name: "Lecture Hall 3R025", location: "Right Wing 3rd Floor" },
  ]

  return (
    <div className="manage-rooms-container">
      {/* Header */}
      <header className="rooms-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Rooms</h1>
      </header>

      {/* Add Room Button */}
      <button className="add-room-button" onClick={handleAddRoom}>
        <Plus className="plus--icon" />
      </button>

      {/* Room Type Tabs */}
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

      {/* Room List */}
      <div className="room-list">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="room-item"
            onClick={() => navigate(`room-details/${room.id}`)}  // Navigate on click anywhere on the room item
          >
            <div className="room-info">
              <h3 className="room-name">{room.name}</h3>
              <p className="room-location">{room.location}</p>
            </div>
            <ChevronRight className="chevron--icon" />  {/* Optional, keeps chevron icon for visual appeal */}
          </div>
        ))}
      </div>
    </div>
  )
}
