import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchBookings,updateBookingStatus,queryClient} from "../util/http";
import { useQuery } from "@tanstack/react-query";
import "./styles/Managebookings.css"; // Reuse the same styling for consistency

const AdminBookings = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("Pending");

  const filters = ["Pending", "Approved", "Rejected"];

  const { data: bookings, isLoading, error } = useQuery({
      queryKey: ["event", "data",filter],
      queryFn: ({ signal }) => fetchBookings({ signal,categoryId:filter}),
    });

  const handleStatusChange = (id, newStatus) => {
    const data = {id:id,booking_status:newStatus}
    // Handle status update logic here (API call or local state update)
    queryClient.fetchQuery({
            queryKey: ["bookings", "update"],
            queryFn: ({ signal }) => updateBookingStatus({ signal , data}),
    });
    console.log(`Booking ${id} marked as ${newStatus}`);
  };

  return (
    <div className="bookings-container">
      <header className="bookings-header">
        <button onClick={() => navigate("/admin")} className="back-button">
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
        {bookings?.map((booking) => (
            <div key={booking.id} className="room-item">
              <div className="room-info">
                <h3 className="room-name">{booking.roomID}</h3>
                <p className="room-location">{booking.user_email}</p>
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
