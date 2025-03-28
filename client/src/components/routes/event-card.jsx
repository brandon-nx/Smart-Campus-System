"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone } from "lucide-react"
import EventModal from "./event-modal"
import "./styles/main.css"

export default function EventCard({ event }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="event-card">
        <div className="event-image-container">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="event-image" />
        </div>
        <div className="event-content">
          <h2 className="event-title">{event.title}</h2>
          <p className="event-location">{event.location}</p>
          <p className="event-date">{event.date}</p>
          <p className="event-description">{event.description}</p>
          <div className="event-actions">
            <button className="phone-button">
              <Phone className="phone-icon" />
            </button>
            <button className="rsvp-button" onClick={() => setIsModalOpen(true)}>
              RSVP
            </button>
          </div>
        </div>
      </div>

      <EventModal event={event} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}