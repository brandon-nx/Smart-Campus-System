import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronDown, Plus } from "lucide-react";
import "./styles/RoomDetails.css";
import defaultImage from "../../assets/images/seminar.jpg";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent, fetchAttendance,deleteEvent, queryClient } from "../util/http"
//id search event


export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("Events");
  console.log(id)
  const { data: eventData ,isLoading} = useQuery({
    queryKey: ["event", "data", id],
    queryFn: ({ signal }) => fetchEvent({id, signal}),
  });
  const tabs = ["Events", "Attendance", "Bookings"];

  const { data: pastAttendanceData } = useQuery({
      queryKey: ["attendance", "categories"],
      queryFn: ({ signal }) => fetchAttendance({ signal ,id}),
  });


  const handleBack = () => navigate(-1);
  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    queryClient.fetchQuery({
      queryKey: ["events", "delete",id],
      queryFn: ({ signal }) => deleteEvent({ signal,id}),
    });
    navigate(-1)
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
        <h1 className="header-title">{eventData.eventname}</h1>
        <button className="delete-button" onClick={handleDelete}>
          <Trash2 />
        </button>
      </header>

      <div className="room-image-container">
        <img
          src={eventData.eventimage || defaultImage}
          alt={eventData.eventname}
          className="room-image"
        />
      </div>

      <div className="room-details-content">
        <div className="form-container">
          {/* Name */}
          <div className="form-field">
            <label className="field-label">{eventData.eventname}</label>
          </div>
          {/* Description */}
          <div className="form-field">
            <label className="field-label">
              Description: {eventData.eventdescription}
            </label>
          </div>
          {/* Capacity */}
          <div className="form-field">
            <label className="field-label">Total capacity: {eventData.eventcapacity}</label>
          </div>
          {/* Attending */}
          <div className="form-field">
            <label className="field-label">
              Attendance Count: {pastAttendanceData && pastAttendanceData.length > 0 ? pastAttendanceData[0].value : "No attendance data"}
            </label>
          </div>

          </div></div>
          

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

