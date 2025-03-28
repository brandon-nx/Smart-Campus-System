"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MapPin, Calendar, LogIn, Bell } from "lucide-react";
import EventCard from "./event-card";
import { events } from "@/data/events";



const EventCalendar = () => {
  const [activeCategory, setActiveCategory] = useState("seminar");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="header-bar">
        <div className="header-left">
          <Image
            src="/placeholder.svg?height=42&width=42"
            alt="Logo"
            width={42}
            height={42}
            className="header-logo"
          />
          <h1 className="header-title">Event Calendar</h1>
        </div>
        <button className="icon-button">
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </header>

      <div className="category-slider">
        {[
          { id: "seminar", name: "Seminar" },
          { id: "workshop", name: "Workshop" },
          { id: "gathering", name: "Gathering" },
          { id: "competition", name: "Competition" },
        ].map((category) => (
          <button
            key={category.id}
            className={`category-button ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 space-y-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </main>

      <nav className="flex justify-around items-center bg-white border-t border-gray-200 py-3">
        <button className="flex flex-col items-center text-gray-600">
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button className="flex flex-col items-center text-red-600">
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Event</span>
        </button>
        <button className="flex flex-col items-center text-gray-600">
          <LogIn className="w-6 h-6" />
          <span className="text-xs mt-1">Sign In</span>
        </button>
        <button className="flex flex-col items-center bg-red-600 text-white p-2 rounded-full">
          <Bell className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
};

export default EventCalendar;
