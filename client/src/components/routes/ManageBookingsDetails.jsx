import { ArrowLeft, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/RoomBooking.css";
import stockimage from "../../assets/images/seminar.jpg";

// Sample data for unavailable time slots
const unavailableSlots = ["9:30 AM", "11:30 AM", "1:30 AM", "3:30 AM", "5:30 AM"];

export default function RoomBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDateError, setShowDateError] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

  // Time slots for booking
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 AM", "12:30 AM",
    "1:00 AM", "1:30 AM", "2:00 AM", "2:30 AM",
    "3:00 AM", "3:30 AM", "4:00 AM", "4:30 AM",
    "5:00 AM", "5:30 AM", "6:00 AM", "6:30 AM",
  ];

  // Load room data
  useEffect(() => {
    if (!id) return;

    setIsLoading(true);

    setTimeout(() => {
      setRoomData({
        id: id,
        name: `Lecture Hall ${id}`,
        operationHour: "9:00AM - 6:30PM",
        location: "Right Wing 2nd Floor",
        image: stockimage,
      });
      setIsLoading(false);
    }, 300);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const isTimeSlotAvailable = (timeSlot) => {
    return !unavailableSlots.includes(timeSlot);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    if (!selectedDate) {
      setShowDateError(true);
      return;
    }
    if (isTimeSlotAvailable(timeSlot)) {
      setSelectedTimeSlot(timeSlot);
      setShowDateError(false); // clear error
    }
  };

  const handleBookNow = () => {
    // Show confirmation modal
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    // Handle the booking logic here
    console.log(`Room booked on ${selectedDate} at ${selectedTimeSlot}`);
    setShowModal(false); // Close the modal
  };

  const handleCancelBooking = () => {
    setShowModal(false); // Close the modal without booking
  };

  if (isLoading) {
    return (
      <div className="booking-details-container">
        <header className="booking-header">
          <button className="back-button" onClick={handleBack}>
            <ArrowLeft className="back-icon" />
          </button>
          <h1 className="header-title">Loading...</h1>
        </header>
        <div className="loading-indicator">Loading room details...</div>
      </div>
    );
  }

  return (
    <div className="booking-details-container">
      {/* Header */}
      <header className="booking-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft className="back-icon" />
        </button>
        <h1 className="header-title">{roomData.name}</h1>
      </header>

      {/* Room Image */}
      <div className="room-image-container">
        <img
          src={roomData.image || "/placeholder.svg"}
          alt={roomData.name}
          className="room-image"
        />
      </div>

      {/* Room Details */}
      <div className="room-details">
        <h2 className="room-name">{roomData.name}</h2>
        <p className="room-operation-hour">
          Operation Hour: {roomData.operationHour}
        </p>
        <p className="room-location">{roomData.location}</p>
      </div>

      {/* Date Selection */}
      <div className="booking-section">
        <label className="booking-label">Date</label>
        <div className="date-input-container">
          <input
            type="date"
            className="date-input"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setShowDateError(false);
            }}
          />
          <Calendar className="calendar-icon" />
        </div>
        {showDateError && (
          <p className="date-error-message">
            Please select a date before picking a time slot.
          </p>
        )}
      </div>

      {/* Time Slot Selection */}
      <div className="booking-section">
        <label className="booking-label">Select Time Slot</label>
        <div className="time-slots-grid">
          {timeSlots.map((timeSlot) => (
            <button
              key={timeSlot}
              className={`time-slot-button ${!isTimeSlotAvailable(timeSlot) ? "unavailable" : ""} ${
                selectedTimeSlot === timeSlot ? "selected" : ""
              }`}
              onClick={() => handleTimeSlotSelect(timeSlot)}
              disabled={!isTimeSlotAvailable(timeSlot)}
            >
              {timeSlot}
            </button>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <div className="booking-actions">
        <button
          className="book-button"
          disabled={!selectedDate || !selectedTimeSlot}
          onClick={handleBookNow}
        >
          BOOK NOW
        </button>
      </div>

      {/* Modal for booking confirmation */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Booking</h2>
            <p className="modal-message">
              Are you sure you want to book the room for {selectedDate} at{" "}
              {selectedTimeSlot}?
            </p>
            <div className="modal-buttons">
              <button className="cancel-button" onClick={handleCancelBooking}>
                CANCEL
              </button>
              <button className="confirm-button" onClick={handleConfirmBooking}>
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
