import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronDown, Plus } from "lucide-react";
import "./styles/RoomDetails.css";
import { fetchRoom,queryClient,deleteRoom,fetchRoomStats} from "../util/http";
import { useQuery } from "@tanstack/react-query";
import { eventsConfig} from "./adminChartConfig";
// Import image if it's inside the src folder
import seminarImage from "../../assets/images/seminar.jpg"; // Update path based on your folder structure

// Add more rooms to the sampleRooms object


function RoomDetails() {
  const { id } = useParams(); // Get room ID from URL
  const navigate = useNavigate(); // Use navigate for history handling
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: currentRoomQuery, isLoading, error } = useQuery({
    queryKey: ["event", "data", id],
    queryFn: ({ signal }) => fetchRoom({ signal, id }),
  });

  console.log (currentRoomQuery)

  const roomData = currentRoomQuery

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true); // Show the delete confirmation dialog
  };

  const confirmDelete = () => {
    queryClient.fetchQuery({
          queryKey: ["events", "delete",id],
          queryFn: ({ signal }) => deleteRoom({signal,id}),
        });
        navigate(-1)
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
        <h1 className="header-title">{roomData.roomName}</h1>
        <button className="delete-button" onClick={handleDelete}>
          <Trash2 className="trash-icon" />
        </button>
      </header>

      <div className="room-image-container">
        <img
          src={ seminarImage} // Use the imported image or fallback to a default image
          alt={roomData.name}
          className="room-image"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="image-upload-input"
          accept="image/*"
        />
      </div>

      <div className="room-details-content">
        <div className="form-container">
          {/* Room Type */}
          <div className="form-field">
              <label className="field-select-visible">Room Name: {roomData.roomName}</label>
          </div>
          <div className="form-field">
          <label className="field-select-visible">Room Description: {roomData.roomDescription}</label>
          </div>
          <div className="form-field">
            <label className="field-select-visible">Amenities List: </label>
            <label className="field-select-visible">
              {roomData.amenities.map(am => am.name).join(", ")}
            </label>
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
