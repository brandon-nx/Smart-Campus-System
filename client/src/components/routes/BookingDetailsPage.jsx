import { useNavigate, useParams } from "react-router-dom";
import classes from "./styles/BookingDetailsPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingRoom, queryClient } from "../util/http";

export default function BookingDetailsPage() {
  const params = useParams();
  const { data: roomData } = useQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });

  console.log(roomData);
  return (
    <div className={classes["booking-details-page"]}>
      {/* Header / Image */}
      <div className={classes["booking-header"]}>
        <img
          className={classes["booking-image"]}
          src="/path/to/your-image.jpg"
          alt="Lecture Hall 2R021"
        />
      </div>

      {/* Title and Basic Info */}
      <div className={classes["booking-info"]}>
        <h1 className={classes["booking-title"]}>Lecture Hall 2R021</h1>
        <p className={classes["booking-operation"]}>
          Operation Hour: 9:00 AM – 6:30 PM
        </p>
        <p className={classes["booking-location"]}>Right Wing 2nd Floor</p>
      </div>

      {/* Amenities */}
      <div className={classes["booking-amenities"]}>
        <div className={classes["amenity-item"]}>
          <span className={classes["amenity-icon"]}>🎓</span>
          <span className={classes["amenity-text"]}>20 Seats</span>
        </div>
        <div className={classes["amenity-item"]}>
          <span className={classes["amenity-icon"]}>📺</span>
          <span className={classes["amenity-text"]}>52" LED</span>
        </div>
        <div className={classes["amenity-item"]}>
          <span className={classes["amenity-icon"]}>📝</span>
          <span className={classes["amenity-text"]}>Whiteboard</span>
        </div>
        <div className={classes["amenity-item"]}>
          <span className={classes["amenity-icon"]}>📶</span>
          <span className={classes["amenity-text"]}>WiFi Available</span>
        </div>
      </div>

      {/* Date Input */}
      <div className={classes["booking-date"]}>
        <label htmlFor="bookingDate" className={classes["date-label"]}>
          Date
        </label>
        <input
          type="date"
          id="bookingDate"
          className={classes["date-input"]}
          placeholder="YYYY/MM/DD"
        />
      </div>

      {/* (Timeslot Section Ignored as requested) */}

      {/* Bottom Action Buttons */}
      <div className={classes["booking-actions"]}>
        <button className={classes["cancel-button"]}>CANCEL</button>
        <button className={classes["book-button"]}>BOOK</button>
      </div>
    </div>
  );
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });
}
