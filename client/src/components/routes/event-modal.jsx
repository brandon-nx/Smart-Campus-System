"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";

const EventModal = ({ event, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!mounted || !isOpen || !event) return null;

  // Extract date and time from the event date string
  const dateTimeParts = event.date.split("|");
  const date = dateTimeParts[0]?.trim() || "";
  const time = dateTimeParts[1]?.trim() || "";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-start overflow-y-auto pt-4 pb-20">
      <div className="bg-white w-full max-w-md rounded-lg overflow-hidden shadow-xl mx-4 animate-fade-in">
        <div className="relative">
          <button onClick={onClose} className="absolute top-4 left-4 z-10 bg-white/80 p-2 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-48 relative">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>

          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700">{date}</span>
            </div>

            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700">{time}</span>
            </div>

            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-gray-500 mr-3" />
              <span className="text-gray-700">{event.location}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 text-sm whitespace-pre-line">{event.description}</p>
          </div>

          <div className="mt-8 flex justify-between">
            <button onClick={onClose} className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md font-medium">
              CANCEL
            </button>
            <button className="px-6 py-3 bg-red-700 text-white rounded-md font-medium">RSVP</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;