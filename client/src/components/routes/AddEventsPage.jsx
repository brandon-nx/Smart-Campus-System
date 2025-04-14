import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, ChevronDown, Calendar } from "lucide-react"
import "./styles/AddeventPage.css";

export default function AddEvent() {
  const navigate = useNavigate()
  const [eventName, setEventName] = useState("")
  const [eventVenue, setEventVenue] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("9:00AM")
  const [endTime, setEndTime] = useState("6:00PM")
  const [description, setDescription] = useState("")
  const [imageFile, setImageFile] = useState(null)

  const fileInputRef = useRef(null)
  const dateInputRef = useRef(null)

  const handleBack = () => {
    navigate(-1)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const handleAddEvent = () => {
    console.log({
      eventName,
      eventVenue,
      eventDate,
      startTime,
      endTime,
      description,
      hasImage: !!imageFile,
    })
    navigate(-1)
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(URL.createObjectURL(file))
    }
  }

  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus()
      dateInputRef.current.click()

      if (typeof dateInputRef.current.showPicker === "function") {
        try {
          dateInputRef.current.showPicker()
        } catch (error) {
          console.log("Date picker could not be shown automatically")
        }
      }
    }
  }

  return (
    <div className="add-event-container">
      {/* Header */}
      <header className="add-event-header">
        <button className="back-button-eventspage" onClick={handleBack} type="button">
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Add Event</h1>
      </header>

      <div className="form-container">
        {/* Image Upload Area */}
        <div className="image-upload-area" onClick={handleImageClick}>
          {imageFile ? (
            <img src={imageFile || "/placeholder.svg"} alt="Event preview" className="image-preview" />
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

        {/* Event Date */}
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
            />
            <Calendar className="calendar-icon" />
          </div>
        </div>

        {/* Event Hours */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">Event Hour:</label>
            <div className="event-hours">
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
        <div className="action-buttons-eventspage">
          <button type="button" className="cancel-button-eventspage" onClick={handleCancel}>
            CANCEL
          </button>
          <button type="button" className="add-button-primary-eventspage" onClick={handleAddEvent}>
            ADD
          </button>
        </div>
      </div>
    </div>
  )
}
