import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import classes from "./styles/EventDetailsPage.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient } from "../util/http";
import Button from "../UI/Button";
import { useSelector } from "react-redux";
import Modal from "../UI/Modal";
import SuccessIcon from "../../assets/icons/confirm-icon.svg";
import RejectIcon from "../../assets/icons/red-x-icon.svg";
import {
  FaCalendarAlt,
  FaChair,
  FaMapMarkerAlt,
  FaRegClock,
} from "react-icons/fa";
import {
  convertEventTimeToDateOnly,
  convertEventTimeToTimeOnly,
} from "../util/converter";
import { useState } from "react";

export default function EventDetailsPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";
  const accountEmail = useSelector((state) => state.auth.email);

  const [isConfirmationBoxOpen, setIsConfirmationBoxOpen] = useState(false);
  
  const params = useParams();
  const { data: eventData } = useQuery({
    queryKey: ["events", "event", params.id],
    queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }),
  });

  console.log(eventData);

  const {
    eventcapacity,
    eventdescription,
    eventend,
    eventimage,
    eventname,
    eventstart,
    venue_id,
    venue_name,
    remaining_capacity,
  } = eventData;

  function handleCloseConfirmationBox(event) {
    if (event) {
      event.preventDefault();
    }
    setIsConfirmationBoxOpen(false);
  }

  function handleBack() {
    navigate("/events");
  }

  function handleCloseWindow() {
    navigate("..", { relative: "path" });
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
      <div className={classes["event-details"]}>
        <img
          className={classes["event-image"]}
          src={eventimage}
          alt={venue_name}
        />
        <div className={classes["event-info"]}>
          <h1 className={classes["event-title"]}>{eventname}</h1>
          <div className={classes["event-subheading"]}>
            <FaCalendarAlt /> {convertEventTimeToDateOnly(eventstart)}
          </div>
          <div className={classes["event-subheading"]}>
            <FaRegClock /> {convertEventTimeToTimeOnly(eventstart, eventend)}
          </div>
          <div className={classes["event-subheading"]}>
            <FaMapMarkerAlt /> {venue_name} ({venue_id})
          </div>
          <div className={classes["event-subheading"]}>
            <FaChair /> {remaining_capacity} / {eventcapacity} available
          </div>
          <p className={classes["event-description"]}>{eventdescription}</p>

            <div className="form-actions-horizontal">
            <Button
              className="rsvp-btn"
              onClick={() => setIsConfirmationBoxOpen(true)}
            >
              RSVP
            </Button>
            <Button
              className="cancel-btn"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </div>

      {isConfirmationBoxOpen && (
        <Modal
          open={isConfirmationBoxOpen}
          onClose={handleCloseConfirmationBox}
        >
          <h1 className="modal-title-red">RSVP Confirmation</h1>
          <h2 className="modal-title">Ready to Join?</h2>
          <p className="modal-message">Click 'YES' to join this event!</p>
          <Form method="post" className="form">
            <input type="hidden" id="email" name="email" value={accountEmail} />
            <p className="form-actions">
              <Button className="rsvp-btn" disabled={isSubmitting}>
                {isSubmitting ? "Joining..." : "YES"}
              </Button>
              <Button
                className="cancel-btn"
                onClick={(event) => handleCloseConfirmationBox(event)}
                disabled={isSubmitting}
              >
                NO
              </Button>
            </p>
          </Form>
        </Modal>
      )}
    </>
  );
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["events", "event", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const id = params.id;
  const data = await request.formData();

  const rsvpData = {
    id: id,
    email: data.get("email"),
  };

  const response = await fetch(`/api/events/events/${id}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rsvpData),
  });

  if (response.status === 422) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      { message: "Something is wrong, rsvp failed." },
      { status: 500 }
    );
  }

  return response;
}
