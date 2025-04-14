"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import "./styles/main.css";

export default function EventModal({ event, isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        showConfirm ? setShowConfirm(false) : onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose, showConfirm])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!mounted || !isOpen || !event) return null

  const startRawDate = new Date(event.eventstart)
  const endRawDate = new Date(event.eventstart)

  const date = startRawDate.toISOString().slice(0, 10) === endRawDate.toISOString().slice(0, 10)
    ? startRawDate.toISOString().slice(0, 10)
    : `${startRawDate.toISOString().slice(0, 10)} || ${endRawDate.toISOString().slice(0, 10)}`
  const time = startRawDate.toISOString().slice(11, 16)

  const handleRSVP = () => setShowConfirm(true)
  const confirmRSVP = () => {
    setShowConfirm(false)
    console.log("RSVP confirmed!")
    onClose() // This closes the entire modal after confirmation
  }

  const cancelRSVP = () => setShowConfirm(false)

  return (
    <>
      {/* Main Event Modal */}
      <div className="overlay" onClick={onClose}>
        <div className="content" onClick={(e) => e.stopPropagation()}>
          <div className="body">
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
              <button className="cancelButton" onClick={onClose}>CANCEL</button>
              <button className="rsvpButton" onClick={handleRSVP}>RSVP</button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="confirm-overlay" onClick={cancelRSVP}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-title">Confirm RSVP</h3>
            <p className="confirm-message">Are you sure you want to RSVP to this event?</p>
            <div className="confirm-buttons">
              <button className="cancel-delete-button" onClick={cancelRSVP}>Cancel</button>
              <button className="confirm-delete-button" onClick={confirmRSVP}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
