import { ArrowLeft, Plus, ChevronDown, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useState, useRef } from "react";
import "./styles/AddeventPage.css";

export default function AddEvent() {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [startTime, setStartTime] = useState("9:00AM");
  const [endTime, setEndTime] = useState("6:00PM");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  
  const handleBack = () => {
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAddEvent = () => {
    navigate(-1);
  };

  // Open file picker on click
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  // Handle date field click - compatible with React events
  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      // This is the React way to interact with native input elements
      dateInputRef.current.focus();
      dateInputRef.current.click();
      
      // For browsers that support showPicker()
      if (typeof dateInputRef.current.showPicker === 'function') {
        try {
          dateInputRef.current.showPicker();
        } catch (error) {
          console.log("Date picker could not be shown automatically");
        }
      }
    }
  };

  return (
    <div className="add-event-container">
      {/* Header */}
      <header className="add-event-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Add Event</h1>
      </header>

      <div className="form-container">
        {/* Image Upload Area */}
        <div 
          className="image-upload-area" 
          onClick={handleImageClick}
        >
          {imageFile ? (
            <img src={imageFile} alt="Event preview" className="image-preview" />
          ) : (
            <Plus className="plus-icon" />
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="image-upload-input"
          accept="image/*"
          onChange={handleImageChange}
        />

        {/* Event Type */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Event Type</label>
            <ChevronDown className="chevron-icon" />
          </div>
          <select className="field-select">
            <option value="">Select Event Type</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        {/* Event Name */}
        <div className="form-field">
          <input
            type="text"
            placeholder="Event Name"
            className="field-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        {/* Event Venue */}
        <div className="form-field">
          <input
            type="text"
            placeholder="Event Venue"
            className="field-input"
            value={eventVenue}
            onChange={(e) => setEventVenue(e.target.value)}
          />
        </div>

        {/* Event Date - Updated to be React/JSX compatible */}
        <div className="form-field">
          <div 
            className="date-input-container" 
            onClick={handleDateFieldClick}
            role="button"
            tabIndex={0}
            aria-label="Select date"
          >
            <input
              type="date"
              ref={dateInputRef}
              className="date-input"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              // Let React handle event propagation
            />
            <Calendar className="calendar-icon" />
          </div>
        </div>

        {/* Event Hours */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Event Hour:</label>
            <div className="event-hours">
              <select
                className="time-select"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="8:00AM">8:00AM</option>
                <option value="9:00AM">9:00AM</option>
                <option value="10:00AM">10:00AM</option>
                <option value="11:00AM">11:00AM</option>
              </select>
              <span>—</span>
              <select
                className="time-select"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              >
                <option value="4:00PM">4:00PM</option>
                <option value="5:00PM">5:00PM</option>
                <option value="6:00PM">6:00PM</option>
                <option value="7:00PM">7:00PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="form-field">
          <textarea
            placeholder="Description"
            className="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-button" onClick={handleCancel}>
            CANCEL
          </button>
          <button className="add-button" onClick={handleAddEvent}>
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}