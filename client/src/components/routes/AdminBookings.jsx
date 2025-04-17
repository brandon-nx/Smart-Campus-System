import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./styles/Managebookings.css"; // Reuse the same styling for consistency

const AdminBookings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Pending");

  const filters = ["Pending", "Approved", "Rejected"];

  const bookings = [
    {
      id: 1,
      room: "Lecture Hall 2R022",
      email: "student1@example.com",
      status: "Pending",
    },
    {
      id: 2,
      room: "Lecture Room 3L105",
      email: "student2@example.com",
      status: "Approved",
    },
    {
      id: 3,
      room: "Workshop 1W001",
      email: "student3@example.com",
      status: "Rejected",
    },
    {
      id: 4,
      room: "Laboratory 2L205",
      email: "student4@example.com",
      status: "Pending",
    },
  ];

  const handleStatusChange = (id, newStatus) => {
    // Handle status update logic here (API call or local state update)
    console.log(`Booking ${id} marked as ${newStatus}`);
  };

  return (
    <div className="bookings-container">
      <header className="bookings-header">
        <button onClick={() => navigate("/admin/dashboard")} className="back-button">
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">Manage Bookings</h1>
      </header>

      <div className="room-tabs">
        {filters.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`room-tab ${filter === tab ? "active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="room-list">
        {bookings
          .filter((b) => b.status === filter)
          .map((booking) => (
            <div key={booking.id} className="room-item">
              <div className="room-info">
                <h3 className="room-name">{booking.room}</h3>
                <p className="room-location">{booking.email}</p>
              </div>
              {filter === "Pending" && (
                <div className="room-action">
                  <button
                    className="accept-button"
                    onClick={() => handleStatusChange(booking.id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleStatusChange(booking.id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminBookings;
