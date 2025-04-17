import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronDown, Plus } from "lucide-react";
import "./styles/RoomDetails.css";
import defaultImage from "../../assets/images/seminar.jpg";

const sampleEvents = {
  E001: {
    name: "Annual Tech Conference",
    type: "Conference",
    location: "Main Auditorium",
    startTime: "9:00AM",
    endTime: "6:00PM",
    capacity: 100,
  },
  E002: {
    name: "Leadership Workshop",
    type: "Workshop",
    location: "Room 2R023",
    startTime: "10:00AM",
    endTime: "4:00PM",
    capacity: 50,
  },
};

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const foundEvent = sampleEvents[id];
      if (foundEvent) {
        setEventData({ id, ...foundEvent });
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => navigate(-1);
  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    
  };

  const cancelDelete = () => setShowDeleteConfirm(false);

  if (isLoading) {
    return (
      <div className="room-details-container">
        <header className="room-details-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft />
          </button>
          <h1 className="header-title">Loading...</h1>
        </header>
        <div className="loading-indicator">Loading event details...</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="room-details-container">
        <header className="room-details-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft />
          </button>
          <h1 className="header-title">Event Not Found</h1>
        </header>
        <div className="error-message">No event found with ID "{id}"</div>
      </div>
    );
  }

  return (
    <div className="room-details-container">
      <header className="room-details-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft />
        </button>
        <h1 className="header-title">{eventData.name}</h1>
        <button className="delete-button" onClick={handleDelete}>
          <Trash2 />
        </button>
      </header>

      <div className="room-image-container" onClick={handleImageClick}>
        <img
          src={selectedImage || defaultImage}
          alt={eventData.name}
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
          {/* Event Type */}
          <div className="form-field">
            <div className="form-field-with-icon">
              <select
                className="field-select-visible"
                value={eventData.type}
                onChange={(e) =>
                  setEventData({ ...eventData, type: e.target.value })
                }
              >
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Meeting">Meeting</option>
                <option value="Competition">Competition</option>
              </select>
              <ChevronDown className="chevron-icon" />
            </div>
          </div>

          {/* Name */}
          <div className="form-field">
            <input
              type="text"
              value={eventData.name}
              className="field-input"
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
            />
          </div>

          {/* Time */}
          <div className="form-field">
            <label className="field-label">Time:</label>
            <div className="operation-hours">
              <select
                className="time-select"
                value={eventData.startTime}
                onChange={(e) =>
                  setEventData({ ...eventData, startTime: e.target.value })
                }
              >
                <option value="8:00AM">8:00AM</option>
                <option value="9:00AM">9:00AM</option>
                <option value="10:00AM">10:00AM</option>
              </select>
              <span>—</span>
              <select
                className="time-select"
                value={eventData.endTime}
                onChange={(e) =>
                  setEventData({ ...eventData, endTime: e.target.value })
                }
              >
                <option value="4:00PM">4:00PM</option>
                <option value="5:00PM">5:00PM</option>
                <option value="6:00PM">6:00PM</option>
              </select>
            </div>
          </div>

          {/* Capacity */}
          <div className="form-field">
            <input
              type="number"
              className="capacity-input"
              value={eventData.capacity}
              onChange={(e) =>
                setEventData({
                  ...eventData,
                  capacity: parseInt(e.target.value) || 0,
                })
              }
            />
            <span className="capacity-label">Attendees</span>
          </div>

          {/* Buttons */}
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

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h2 className="delete-confirm-title">Delete Event</h2>
            <p className="delete-confirm-message">
              Are you sure you want to delete this event?
            </p>
            <div className="delete-confirm-buttons">
              <button className="cancel-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={confirmDelete}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

