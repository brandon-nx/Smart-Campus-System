import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, ChevronDown, Calendar } from "lucide-react"
import "./styles/AddeventPage.css"
import { useQuery } from "@tanstack/react-query";
import { addNewEvent,fetchEventCategories,fetchRoomIDs,queryClient} from "../util/http"
export default function AddEvent() {
  const navigate = useNavigate()
  const [eventType, setEventType] = useState("Conference")
  const [eventName, setEventName] = useState("")
  const [eventVenue, setEventVenue] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [startTime, setStartTime] = useState("9:00AM")
  const [endTime, setEndTime] = useState("6:00PM")
  const [description, setDescription] = useState("")
  const [eventCapacity, setEventCapacity] = useState(null)
  const [imageUrl, setImageUrl] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const dateInputRef = useRef(null)

  const handleBack = () => navigate(-1)
  const handleCancel = () => navigate(-1)
  const { data: categoryData } = useQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
  const { data: roomData } = useQuery({
    queryKey: ["rooms", "ids"],
    queryFn: ({ signal }) => fetchRoomIDs({ signal }),
  });

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

  const handleShowConfirmation = () => setShowConfirmation(true)
  const handleConfirmAdd = () => {
    let data = { eventname: eventName,
      eventdescription: description,
      eventstart: (eventDate + " " + startTime),
      eventend: (eventDate + " " + endTime),
      eventcapacity:eventCapacity,
      eventimage:imageUrl,
      roomid: eventVenue, 
      event_type_id: eventType}
    
    setShowConfirmation(false)
    queryClient.fetchQuery({
      queryKey: ["events", "adding"],
      queryFn: ({ signal }) => addNewEvent({ signal,data }),
    });
    navigate(-1)
  }

  const handleCancelConfirmation = () => setShowConfirmation(false)

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
        {/* Image URL Input */}
        <div className="form-field">
          <label className="field-label">Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            className="field-input"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        {imageUrl && (
          <div className="image-preview-container">
            <img src={imageUrl} alt="Event preview" className="image-preview" />
          </div>
        )}

        {/* Event Type */}
        <div className="form-field">
          <div className="form-field-with-icon">
            <label className="field-label">{eventType}</label>
            <ChevronDown className="chevron-icon" />
          </div>
<select className="field-select" value={eventType} onChange={(e)=>setEventType(e.target.value)}>
  {categoryData?.map((tab) => (<option key={tab.id} value={tab.id}>{tab.type_name}</option>))}
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
          <div className="form-field-with-icon">
            <label className="field-label">{eventVenue}</label>
            <ChevronDown className="chevron-icon" />
          </div>
          <select className="field-select" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)}>
            {roomData?.map((tab) => (<option key={tab.roomID} value={tab.roomID}>{tab.roomName}</option>))}
          </select>
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
        <div className="form-field">
          <textarea
            placeholder="Number Of Attendees 0 - 99999"
            className="description-input"
            value={eventCapacity}
            onChange={(e) => setEventCapacity(e.target.value)}
          ></textarea>
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
          <button type="button" className="add-button-primary-eventspage" onClick={handleShowConfirmation}>
            ADD
          </button>
        </div>
      </div>

      {/* Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-title">Confirm Add</div>
            <div className="modal-message">Are you sure you want to add this event?</div>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelConfirmation}>CANCEL</button>
              <button className="confirm-delete-button" onClick={handleConfirmAdd}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
