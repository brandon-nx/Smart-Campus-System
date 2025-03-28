import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import classes from "./styles/BookingDetailsPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchBookingRoom, queryClient } from "../util/http";
import { convert24To12 } from "../util/converter";
import {
  FaChair,
  FaChalkboardTeacher,
  FaTv,
  FaWifi,
  FaVideo,
  FaSnowflake,
  FaVolumeUp,
  FaQuestionCircle, // default icon if needed
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Input from "../UI/Input";
import Button from "../UI/Button";
import TimeSlotPicker from "../UI/TimeSlotPicker";
import { generateTimeSlots } from "../util/generator";

export default function BookingDetailsPage() {
  const navigation = useNavigation();
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const today = new Date().toISOString().split("T")[0];
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const maxDate = oneMonthLater.toISOString().split("T")[0];

  const [hours, setHours] = useState(null);
  const [selectedStartSlot, setSelectedStartSlot] = useState("");
  const [selectedEndSlot, setSelectedEndSlot] = useState("");

  const amenityIcons = {
    Seating: FaChair,
    Whiteboard: FaChalkboardTeacher,
    '52" LED': FaTv,
    "Wifi Available": FaWifi,
    Projector: FaVideo,
    "Air Conditioning": FaSnowflake,
    "Sound System": FaVolumeUp,
  };

  const params = useParams();
  const { data: roomData } = useQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });

  const {
    roomName,
    roomCapacity,
    operationalHours,
    amenities,
    roomDescription,
  } = roomData;

  const bookingDateRef = useRef();

  function handleDateChange() {
    const bookingDate = bookingDateRef.current.value;
    if (bookingDate) {
      const bookingDateObj = new Date(bookingDate);
      const dayIndex = bookingDateObj.getDay();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const dayName = daysOfWeek[dayIndex];

      const opHour = operationalHours.find((op) => op.day === dayName);
      setHours(opHour);
    }
  }

  useEffect(() => {
    if (data && data.errors) {
      if (
        data.errors.find((err) => err.field === "bookingDate") &&
        bookingDateRef.current
      ) {
        bookingDateRef.current.value = "";
        bookingDateRef.current.focus();
      }
    }
  }, [data]);

  return (
    <div className={classes["booking-details-page"]}>
      {/* Header / Image */}
      <div className={classes["booking-header"]}>
        <img
          className={classes["booking-image"]}
          src="/path/to/your-image.jpg"
          alt={roomName}
        />
      </div>
      {/* Title and Basic Info */}
      <div className={classes["booking-info"]}>
        <h1 className={classes["booking-title"]}>{roomName}</h1>
        <div className={classes["booking-operation"]}>
          <h3 className={classes["booking-subheading"]}>Operation Hours</h3>
          {operationalHours.length === 0 && (
            <div className={classes["no-hours"]}>
              <p>Not Operational</p>
            </div>
          )}
          {operationalHours.length !== 0 && (
            <div className={classes["operational-hours-scroll"]}>
              {operationalHours.map(({ day, open, close }) => (
                <div key={day} className={classes["day-card"]}>
                  <div className={classes["day"]}>{day}</div>
                  <div className={classes["time"]}>
                    {convert24To12(open)} – {convert24To12(close)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={classes["booking-description"]}>{roomDescription}</p>
      </div>
      {/* Amenities */}
      <h3 className={classes["booking-subheading"]}>Amenities</h3>
      <div className={classes["booking-amenities"]}>
        <div className={classes["amenity-item"]}>
          <FaChair className={classes["amenity-icon"]} />
          <span className={classes["amenity-text"]}>{roomCapacity} Seats</span>
        </div>

        {amenities.length !== 0 &&
          amenities.map((amenity) => {
            const Icon = amenityIcons[amenity.name] || FaQuestionCircle;
            return (
              <div key={amenity.id} className={classes["amenity-item"]}>
                <Icon className={classes["amenity-icon"]} />
                <span className={classes["amenity-text"]}>52" LED</span>
              </div>
            );
          })}
      </div>
      <Form method="post" className="form">
        <div className={classes["booking-date"]}>
          <Input
            label="Booking Date"
            id="booking-date"
            type="date"
            name="booking-date"
            ref={bookingDateRef}
            min={today}
            max={maxDate}
            onChange={handleDateChange}
            error={
              data?.errors?.find((err) => err.field === "bookingDate")
                ?.message || null
            }
          />
        </div>
        {hours && (
          <>
            <h2>Select Booking Start Time</h2>
            <TimeSlotPicker
              name="start-time"
              onChange={setSelectedStartSlot}
              timeSlots={generateTimeSlots(hours.open, hours.close)}
            />
          </>
        )}

        <p className="form-actions">
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Booking..." : "BOOK"}
          </Button>
          <Button disabled={isSubmitting}>CANCEL</Button>
        </p>
      </Form>
    </div>
  );
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });
}
