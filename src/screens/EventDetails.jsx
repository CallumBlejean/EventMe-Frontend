import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchEventById,
  fetchEventMembers,
  joinEvent,
  leaveEvent,
  deleteEvent,
  createGoogleCalendarLink,
} from "../api";
import { useAuth } from "../AuthContext";

const EventDetails = () => {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    Promise.all([fetchEventById(event_id), fetchEventMembers(event_id)])
      .then(([eventRes, membersRes]) => {
        setEvent(eventRes.data.event);
        setMembers(membersRes.data.members);
      })
      .catch((err) => {
        console.error("Error loading event:", err);
        setMessage("Failed to load event details. Please try again later.");
        setMessageType("error");
      })
      .finally(() => setLoading(false));
  }, [event_id]);

  const handleJoin = () => {
    setJoining(true);
    joinEvent(event_id)
      .then(() => {
        setMembers((prev) => [
          ...prev,
          {
            user_id: user.userId,
            name: user.userName,
            email: user.email,
          },
        ]);
        setMessage("You successfully joined the event!");
        setMessageType("success");
      })
      .catch((err) => {
        console.error("Join failed:", err);
        setMessage("Could not join the event.");
        setMessageType("error");
      })
      .finally(() => setJoining(false));
  };

  const handleLeave = () => {
    setJoining(true);
    leaveEvent(event_id, user.userId)
      .then(() => {
        setMembers((prev) => prev.filter((m) => m.user_id !== user.userId));
        setMessage("You have left the event.");
        setMessageType("success");
      })
      .catch((err) => {
        console.error("Leave failed:", err);
        setMessage("Could not leave the event.");
        setMessageType("error");
      })
      .finally(() => setJoining(false));
  };

  const handleDeleteEvent = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    )
      return;
    deleteEvent(event_id)
      .then(() => {
        navigate("/find-events");
      })
      .catch((err) => {
        console.error("Delete failed:", err);
        setMessage("Could not delete the event.");
        setMessageType("error");
      });
  };

  if (loading) return <div className="spinner"></div>;

  const isMember = members.some((m) => m.user_id === user?.userId);

  return (
    <div className="event-details-container">
      <h1>{event.title}</h1>
      <p>
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Description:</strong> {event.description}
      </p>
      <p>
        <strong>Created by:</strong> {event.created_by}
      </p>
      <p>
        <strong>Attendees:</strong> {members.length}
      </p>

      {isMember && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "1em" }}>
          ✅ You've joined this event
        </p>
      )}

      {message && (
        <p
          className={
            messageType === "success" ? "success-message" : "error-message"
          }
          style={{ marginTop: "1em" }}
        >
          {message}
        </p>
      )}

      {isMember ? (
        <button onClick={handleLeave} disabled={joining}>
          {joining ? "Leaving..." : "Leave Event"}
        </button>
      ) : (
        <button onClick={handleJoin} disabled={joining}>
          {joining ? "Joining..." : "Join Event"}
        </button>
      )}

      {event && (
        <a
          href={createGoogleCalendarLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "1em", display: "inline-block" }}
        >
          <button style={{ backgroundColor: "#4285F4" }}>
            Add to Google Calendar
          </button>
        </a>
      )}

      {user?.userStatus === "admin" && (
        <button
          onClick={handleDeleteEvent}
          style={{ marginTop: "1em", backgroundColor: "#cc0000" }}
        >
          Delete Event
        </button>
      )}
    </div>
  );
};

export default EventDetails;
