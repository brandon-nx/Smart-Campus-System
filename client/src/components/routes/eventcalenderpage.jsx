"use client";

import { useState } from "react";
import { Search, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents ,fetchEventCategories,queryClient} from "../util/http";
import EventModal from "./event-modal";
import NotificationBell from "./NotificationBell";
import Logo from "../../assets/images/logo.png";
import "./styles/main.css";


export default function EventCalendarPage() {
  // Using React Query to fetch events
  const [activeCategory, setActiveCategory] = useState("Conference");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: categoryData } = useQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
  console.log(categoryData)


  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["events", "data", activeCategory],
    queryFn: ({ signal }) => fetchEvents({ signal, categoryId: activeCategory}),
  });

  console.log(eventsData);


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
        {categoryData?.map((category) => (
          <button
            key={category.eventtype}
            className={`category-button ${activeCategory === category.eventtype ? "active" : ""}`}
            onClick={() => setActiveCategory(category.eventtype)}
          >
    {category.eventtype}
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
          eventsData?.map((event) => {
            const start = new Date(event.eventstart)
            const end = new Date(event.eventend)
            return (
            <div key={event.idevent} className="event-card">
              <div className="event-image-container">
                <img src={event.eventimage || "/placeholder.svg"} alt={event.idevent} className="event-image" /> {/* ✅ Fixed Image */}
              </div>
              <div className="event-content">
                <h2 className="event-title">{event.eventname}</h2>
                <p className="event-location">{event.roomName}</p>
                <p className="event-date">{start.toISOString().slice(0, 10) + ' ' + start.toISOString().slice(11, 16)} || {end.toISOString().slice(0, 10) + ' ' + end.toISOString().slice(11, 16)}</p>
                <p className="event-description">{event.eventdescription}</p>
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
          )})
        )}
      </div>

      {/* Event Modal */}
      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
export function loader(){
  return queryClient.fetchQuery({
    queryKey: ["events", "categories"],
    queryFn: ({ signal }) => fetchEventCategories({ signal }),
  });
}
