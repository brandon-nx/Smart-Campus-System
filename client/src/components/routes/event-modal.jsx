"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

export default function EventModal({ event, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)

  // Handle escape key press
  useEffect(() => {
    setMounted(true)

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!mounted || !isOpen || !event) return null

  // Extract date and time from the event date string
  const startRawDate = new Date(event.eventstart)
  const endRawDate = new Date(event.eventstart)
  let date = "0000-00-00 || 0000-00-00"
  if (startRawDate.toISOString().slice(0, 10) === endRawDate.toISOString().slice(0, 10)){
    date = startRawDate.toISOString().slice(0, 10)
  }
  else{ date = startRawDate.toISOString().slice(0, 10) + " || "+ endRawDate.toISOString().slice(0, 10) }
  const time = startRawDate.toISOString().slice(11, 16) || endRawDate.toISOString().slice(11, 16)
  const handleModalClick = (e) => {
    e.stopPropagation()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div className="content" onClick={handleModalClick}>
        <div className="body">
          {/* Event Image with better resolution handling */}
          <img
            src={event.eventimage || "/fallback-image.jpg"}
            alt={event.eventname}
            className="eventImage"
          />

          <h2 className="title">{event.eventname}</h2>

          <div className="info">
            <div className="infoItem">
              <Calendar className="infoIcon" />
              <span className="infoText">{date}</span>
            </div>

            <div className="infoItem">
              <Clock className="infoIcon" />
              <span className="infoText">{time}</span>
            </div>

            <div className="infoItem">
              <MapPin className="infoIcon" />
              <span className="infoText">{event.roomName}</span>
            </div>
          </div>

          <div className="descriptionSection">
            <h3 className="descriptionTitle">Description</h3>
            <p className="descriptionText">{event.eventdescription}</p>
          </div>

          <div className="modalActions">
            <button
              className="cancelButton"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
            >
              CANCEL
            </button>
            <button
              className="rsvpButton"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log("Modal RSVP button clicked")
              }}
            >
              RSVP
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
