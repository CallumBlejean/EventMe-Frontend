import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { createEvent } from "../api";

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(""); 
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !description || !date || !time || !location) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const formattedDateTime = new Date(`${date}T${time}:00`).toISOString();

    createEvent({
      title,
      description,
      date: formattedDateTime,
      location,
    })
      .then(() => {
        setSuccessMessage("Event created successfully!");
        setTimeout(() => {
          navigate("/find-events");
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to create event. Try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create Event</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            style={{
              width: "100%",
              padding: "0.8em",
              margin: "0.5em 0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            required
          ></textarea>
          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
