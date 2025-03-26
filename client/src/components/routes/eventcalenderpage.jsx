"use client";

import { useState } from "react";
import { Search, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../../lib/http";
import EventModal from "./event-modal";
import logo from "/src/assets/images/logo.png"; 
import styles from "./styles/EventPage.module.css";



const EventCalendarPage = () => { 
  const { data: eventsData = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
  });

  const [activeCategory, setActiveCategory] = useState("Seminar");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="header-bar">
        <div className="header-left">
          <img src={logo} alt="Logo" className="header-logo w-10 h-10" />
          <h1 className="header-title">Event Calendar</h1>
        </div>
        <button className="icon-button">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
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
      <div className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <div className="loading-indicator-container">
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          eventsData?.map((event) => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
              <div className="relative h-40">
                <img
                  src={event.image || "/images/seminar.png"}
                  alt={event.title}
                  className="object-cover w-full h-40"
                />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-xl text-gray-900">{event.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                <p className="text-sm text-gray-500 mt-0.5 mb-2">{event.date}</p>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300">
                    <Phone className="w-5 h-5 text-red-600" />
                  </button>
                  <button
                    className="bg-red-700 text-white text-sm font-medium py-2 px-6 rounded-md hover:bg-red-800"
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
};


export default EventCalendarPage;
