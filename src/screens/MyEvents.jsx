import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { fetchEventsByUserId } from "../api";

const MyEvents = () => {
  const { user, loading } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user) return;

    fetchEventsByUserId(user.userId)
      .then((response) => {
        setMyEvents(response.data.events);
      })
      .catch((err) => {
        console.error("Error fetching my events:", err);
        setError("Failed to load your events. Please join an event near you!");
      })
      .finally(() => {
        setLoadingEvents(false);
      });
  }, [user, loading]);

  if (loading || loadingEvents) return <div className="spinner"></div>;
  if (error) return <p className="error-message">{error}</p>;

  const today = new Date();

  const upcomingEvents = myEvents.filter(event => new Date(event.date) >= today);
  const pastEvents = myEvents.filter(event => new Date(event.date) < today);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="my-events-container">
      <h1>My Events</h1>

      <h2>Upcoming Events</h2>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <div className="events-grid">
          {upcomingEvents.map((event) => (
            <div key={event.event_id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {formatDateTime(event.date)}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: "40px" }}>Past Events</h2>
      {pastEvents.length === 0 ? (
        <p>No past events attended yet.</p>
      ) : (
        <div className="events-grid">
          {pastEvents.map((event) => (
            <div key={event.event_id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {formatDateTime(event.date)}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
