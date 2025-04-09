"use client";

import { useState } from "react";
import { Search, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "/lib/http";
import EventModal from "./event-modal";
import NotificationBell from "./NotificationBell";
import Logo from "../../assets/images/logo.png";
import "./styles/main.css";


export default function EventCalendarPage() {
  // Using React Query to fetch events
  const { data: eventsData = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
  });
 
  const [activeCategory, setActiveCategory] = useState("Seminar");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-col min-h-screen">
      {/* Top Navigation */}
      <header className="header">
        <div className="header-left">
          <img src={Logo} alt="Logo" width={42} height={42} className="header-logo" /> {/* ✅ Fixed Image */}
          <h1 className="header-title">Event Calendar</h1>
        </div>
        <div className="header-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <NotificationBell count={3} />
          <button className="icon-button">
            <Search className="nav-icon" />
          </button>
        </div>
      </header>

      {/* Category Filter */}
      <div className="category-slider">
        {["Seminar", "Workshop", "Gathering", "Competition"].map((category) => (
          <button
            key={category}
            className={`category-button ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Event List */}
      <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          eventsData?.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image-container">
                <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" /> {/* ✅ Fixed Image */}
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
                  <button
                    className="rsvp-button"
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsModalOpen(true);
                    }}
                  >
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Modal */}
      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
