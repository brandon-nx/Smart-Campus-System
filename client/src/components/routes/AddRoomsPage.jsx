import React, { useState, useRef } from "react"
import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom" // Use react-router-dom's useNavigate instead
import "./styles/AddroomPage.css"

export default function AddRoom() {
  const navigate = useNavigate() // Use navigate from react-router-dom
  const fileInputRef = useRef(null)
  const [roomName, setRoomName] = useState("")
  const [startTime, setStartTime] = useState("9:00AM")
  const [endTime, setEndTime] = useState("6:00PM")
  const [amenities, setAmenities] = useState([])
  const [newAmenity, setNewAmenity] = useState("")
  const [image, setImage] = useState(null)

  const handleBack = () => navigate(-1) // Use navigate to go back
  const handleCancel = () => navigate(-1) // Use navigate to go back
  const handleAddRoom = () => navigate(-1) // Redirect to another page after adding the room

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setAmenities([...amenities, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="add-room-container">
      {/* Header */}
      <header className="add-room-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Add Room</h1>
      </header>

      <div className="form-container">
        {/* Image Upload Area */}
        <div className="image-upload-area" onClick={handleImageClick}>
          {image ? (
            <img src={image || "/placeholder.svg"} alt="Room preview" className="uploaded-image" />
          ) : (
            <Plus className="plus-icon" />
          )}
        </div>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

        {/* Room Type */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Room Type</label>
            <ChevronDown className="chevron-icon" />
          </div>
          <select className="field-select">
            <option value="">Select Room Type</option>
            <option value="lecture-hall">Lecture Hall</option>
            <option value="lecture-room">Lecture Room</option>
            <option value="laboratory">Laboratory</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>

        {/* Room Name */}
        <div className="form-field">
          <input
            type="text"
            placeholder="Room Name"
            className="field-input"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        {/* Operation Hours */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Operation Hour:</label>
            <div className="operation-hours">
              <select className="time-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                <option value="8:00AM">8:00AM</option>
                <option value="9:00AM">9:00AM</option>
                <option value="10:00AM">10:00AM</option>
                <option value="11:00AM">11:00AM</option>
              </select>
              <span>—</span>
              <select className="time-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                <option value="4:00PM">4:00PM</option>
                <option value="5:00PM">5:00PM</option>
                <option value="6:00PM">6:00PM</option>
                <option value="7:00PM">7:00PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Amenities Dropdown */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Amenities</label>
            <ChevronDown className="chevron-icon" />
          </div>
          <select className="field-select">
            <option value="">Select Amenity</option>
            <option value="projector">Projector</option>
            <option value="whiteboard">Whiteboard</option>
            <option value="computer">Computer</option>
            <option value="air-conditioning">Air Conditioning</option>
          </select>
        </div>

        {/* Add Custom Amenity */}
        <div className="form-field">
          <div className="amenities-header">
            <label className="field-label">Custom Amenities</label>
            <div className="amenities-actions">
              <ChevronDown className="chevron-icon" />
              <button className="add-button" onClick={addAmenity}>
                <Plus className="chevron-icon" />
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Add custom amenity"
            className="field-input"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addAmenity()}
          />
        </div>

        {/* Display added amenities */}
        {amenities.length > 0 && (
          <div className="amenities-tags">
            {amenities.map((amenity, index) => (
              <div key={index} className="amenity-tag">
                {amenity}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-button-roomspage" onClick={handleCancel}>
            CANCEL
          </button>
          <button className="add-main-button-roomspage" onClick={handleAddRoom}>
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}
