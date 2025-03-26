"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import EventModal from "./event-modal";

export default function EventCard({ event }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
        <div className="relative h-40">
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="object-cover w-full h-full" />
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
              onClick={() => setIsModalOpen(true)}
            >
              RSVP
            </button>
          </div>
        </div>
      </div>

      <EventModal event={event} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
