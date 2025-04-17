import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import classes from "./styles/BookingDetailsPage.module.css";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBookingEndSlots,
  fetchBookingRoom,
  fetchBookingStartSlots,
  queryClient,
} from "../util/http";
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
import LoadingIndicator from "../UI/LoadingIndicator";
import { useSelector } from "react-redux";
import Modal from "../UI/Modal";
import SuccessIcon from "../../assets/icons/confirm-icon.svg";
import RejectIcon from "../../assets/icons/red-x-icon.svg";

const amenityIcons = {
  Seating: FaChair,
  Whiteboard: FaChalkboardTeacher,
  '52" LED': FaTv,
  "Wifi Available": FaWifi,
  Projector: FaVideo,
  "Air Conditioning": FaSnowflake,
  "Sound System": FaVolumeUp,
};

export default function BookingDetailsPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const accountEmail = useSelector((state) => state.auth.email);

  const today = new Date().toISOString().split("T")[0];
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const maxDate = oneMonthLater.toISOString().split("T")[0];

  const bookingDateRef = useRef();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartSlot, setSelectedStartSlot] = useState("");
  const [selectedEndSlot, setSelectedEndSlot] = useState("");

  console.log(selectedDate, selectedStartSlot, selectedEndSlot);

  const params = useParams();
  const { data: roomData } = useQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });

  const {
    data: startSlotsData,
    error: startSlotsError,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", "rooms", params.id, { bookingDate: selectedDate }],
    queryFn: ({ signal }) =>
      fetchBookingStartSlots({
        signal,
        id: params.id,
        bookingDate: selectedDate,
      }),
    enabled: !!selectedDate,
  });

  const { data: endSlotsData } = useQuery({
    queryKey: [
      "bookings",
      "rooms",
      params.id,
      { startTime: selectedStartSlot },
    ],
    queryFn: ({ signal }) =>
      fetchBookingEndSlots({
        signal,
        id: params.id,
        bookingDate: selectedDate,
        startTime: selectedStartSlot,
      }),
    enabled: !!selectedStartSlot,
  });

  console.log(endSlotsData);

  const {
    roomName,
    roomCapacity,
    operationalHours,
    amenities,
    roomDescription,
  } = roomData;

  function handleDateChange() {
    const bookingDate = bookingDateRef.current;
    if (bookingDate) {
      setSelectedDate(bookingDate.value);
      setSelectedStartSlot("");
      setSelectedEndSlot("");
    }
  }

  function handleBack(event) {
    event.preventDefault();
    navigate("/bookings");
  }

  useEffect(() => {
    if (
      startSlotsData?.errors?.find((err) => err.field === "bookingDate") &&
      bookingDateRef.current
    ) {
      bookingDateRef.current.value = "";
      bookingDateRef.current.focus();
    }
  }, [startSlotsData]);

  useEffect(() => {
    setSelectedEndSlot("");
  }, [selectedStartSlot]);

  function handleCloseWindow() {
    if (actionData.success) {
      navigate("..", { relative: "path" });
    } else {
      navigate(".", { replace: true });
    }
  }

  return (
    <>
      {actionData && (
        <Modal open={actionData} onClose={handleCloseWindow}>
          <div className="form">
            <img
              src={actionData.success ? SuccessIcon : RejectIcon}
              className={actionData.success ? "icon-success" : "icon-reject"}
              alt={actionData.success ? "Success Icon" : "Reject Icon"}
            />
            <h1
              className={
                actionData.success
                  ? "modal-title-success"
                  : "modal-title-reject"
              }
            >
              {actionData.success ? "Success!" : "Sorry :("}
            </h1>
            <p className="modal-message">{actionData.message}</p>
            <Button
              className={actionData.success ? "success-btn" : "reject-btn"}
              onClick={handleCloseWindow}
            >
              OK
            </Button>
          </div>
        </Modal>
      )}
      <div className={classes["booking-details-page"]}>
        <div className={classes["booking-header"]}>
          <img
            className={classes["booking-image"]}
            src="/path/to/your-image.jpg"
            alt={roomName}
          />
        </div>
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
        <h3 className={classes["booking-subheading"]}>Amenities</h3>
        <div className={classes["booking-amenities"]}>
          <div className={classes["amenity-item"]}>
            <FaChair className={classes["amenity-icon"]} />
            <span className={classes["amenity-text"]}>
              {roomCapacity} Seats
            </span>
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
            <input type="hidden" id="email" name="email" value={accountEmail} />
            <Input
              label="Booking Date"
              disabled={isLoading}
              id="booking-date"
              type="date"
              name="booking-date"
              ref={bookingDateRef}
              min={today}
              max={maxDate}
              onChange={handleDateChange}
              error={
                startSlotsData?.errors?.find(
                  (err) => err.field === "bookingDate"
                )?.message || null
              }
            />
          </div>
          {isLoading && <LoadingIndicator />}
          {isError && <>{startSlotsError.info?.message}</>}
          {selectedDate && startSlotsData && startSlotsData.success && (
            <>
              <h2>Select Booking Start Time</h2>
              <TimeSlotPicker
                name="start-time"
                onChange={setSelectedStartSlot}
                timeSlots={startSlotsData.startSlots}
              />
            </>
          )}
          {selectedStartSlot && endSlotsData && endSlotsData.success && (
            <>
              <h2>Select Booking End Time</h2>
              <TimeSlotPicker
                name="end-time"
                onChange={setSelectedEndSlot}
                timeSlots={endSlotsData.endSlots}
              />
            </>
          )}

          <p className="form-actions-horizontal">
            <Button className="book-btn" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "BOOK"}
            </Button>
            <Button
              className="cancel-btn"
              onClick={(event) => handleBack(event)}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
          </p>
        </Form>
      </div>
    </>
  );
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["bookings", "rooms", params.id],
    queryFn: ({ signal }) => fetchBookingRoom({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const id = params.id;
  const data = await request.formData();

  const bookingData = {
    id: id,
    date: data.get("booking-date"),
    email: data.get("email"),
    startSlot: data.get("start-time"),
    endSlot: data.get("end-time"),
  };

  console.log(bookingData);

  const response = await fetch(
    `http://localhost:8080/bookings/rooms/${id}/book`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }
  );

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      { message: "Something is wrong, booking failed." },
      { status: 500 }
    );
  }

  return response;
}
