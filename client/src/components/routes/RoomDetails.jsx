import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronDown, Plus } from "lucide-react";
import "./styles/RoomDetails.css";
import { fetchRoom,queryClient} from "../util/http"
// Import image if it's inside the src folder
import seminarImage from "../../assets/images/seminar.jpg"; // Update path based on your folder structure

// Add more rooms to the sampleRooms object


function RoomDetails() {
  const { id } = useParams(); // Get room ID from URL
  const navigate = useNavigate(); // Use navigate for history handling
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true); // Show the delete confirmation dialog
  };

  const confirmDelete = () => {
    alert("Room deleted!");
    navigate("/manage-rooms"); // Navigate back after deletion
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false); // Hide the delete confirmation dialog
  };





  if (isLoading) {
    return (
      <div className="room-details-container">
        <header className="room-details-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="header-title">Loading...</h1>
        </header>
        <div className="loading-indicator">Loading room details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-details-container">
        <header className="room-details-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="header-title">Error</h1>
        </header>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="room-details-container">
        <header className="room-details-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="header-title">Room Not Found</h1>
        </header>
        <div className="error-message">Room with ID "{id}" could not be found.</div>
      </div>
    );
  }

  return (
    <div className="room-details-container">
      <header className="room-details-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">{roomData.name}</h1>
        <button className="delete-button" onClick={handleDelete}>
          <Trash2 className="trash-icon" />
        </button>
      </header>

      <div className="room-image-container" onClick={handleImageClick}>
        <img
          src={selectedImage || seminarImage} // Use the imported image or fallback to a default image
          alt={roomData.name}
          className="room-image"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="image-upload-input"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="room-details-content">
        <div className="form-container">
          {/* Room Type */}
          <div className="form-field">
            <div className="form-field-with-icon">
              <select
                className="field-select-visible"
                value={roomData.type}
                onChange={(e) => setRoomData({ ...roomData, type: e.target.value })}
              >
                <option value="Lecture Hall">Lecture Hall</option>
                <option value="Lecture Room">Lecture Room</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Workshop">Workshop</option>
              </select>
              <ChevronDown className="chevron-icon" />
            </div>
          </div>

          {/* Room Name */}
          <div className="form-field">
            <input
              type="text"
              value={roomData.name}
              className="field-input"
              onChange={(e) => setRoomData({ ...roomData, name: e.target.value })}
            />
          </div>

          {/* Operation Hours */}
          <div className="form-field">
            <div className="form-field-with-icon">
              <label className="field-label">Operation Hour:</label>
              <div className="operation-hours">
                <select
                  className="time-select"
                  value={roomData.startTime}
                  onChange={(e) => setRoomData({ ...roomData, startTime: e.target.value })}
                >
                  <option value="8:00AM">8:00AM</option>
                  <option value="9:00AM">9:00AM</option>
                  <option value="10:00AM">10:00AM</option>
                  <option value="11:00AM">11:00AM</option>
                </select>
                <span>—</span>
                <select
                  className="time-select"
                  value={roomData.endTime}
                  onChange={(e) => setRoomData({ ...roomData, endTime: e.target.value })}
                >
                  <option value="4:00PM">4:00PM</option>
                  <option value="5:00PM">5:00PM</option>
                  <option value="6:00PM">6:00PM</option>
                  <option value="7:00PM">7:00PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="form-field">
            <div className="form-field-with-icon">
              <input
                type="number"
                value={roomData.capacity}
                className="capacity-input"
                onChange={(e) => setRoomData({ ...roomData, capacity: Number.parseInt(e.target.value) || 0 })}
              />
              <span className="capacity-label">Seat</span>
            </div>
            <ChevronDown className="chevron-icon" />
          </div>

          {/* Amenities */}
          <div className="form-field">
            <div className="form-field-with-icon">
              <input
                type="text"
                value={roomData.amenities[0]}
                className="field-input"
                onChange={(e) => {
                  const newAmenities = [...roomData.amenities];
                  newAmenities[0] = e.target.value;
                  setRoomData({ ...roomData, amenities: newAmenities });
                }}
              />
              <div className="amenities-actions">
                <ChevronDown className="chevron-icon" />
                <button className="add-button">
                  <Plus className="plus-icon-small" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="cancel-button" onClick={handleBack}>
              CANCEL
            </button>
            <button className="edit-button" onClick={handleBack}>
              SAVE
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h2 className="delete-confirm-title">Delete Room</h2>
            <p className="delete-confirm-message">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="delete-confirm-buttons">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-button" onClick={confirmDelete}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomDetails;
