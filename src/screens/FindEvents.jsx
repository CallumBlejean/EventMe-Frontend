import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllEvents, fetchEventMembers } from "../api";
import { useAuth } from "../AuthContext";

const FindEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [eventMemberships, setEventMemberships] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOption, setSortOption] = useState("soonest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllEvents()
      .then((response) => {
        const eventsData = response.data.events;
        const membershipPromises = eventsData.map((event) => {
          return fetchEventMembers(event.event_id)
            .then((res) => ({ eventId: event.event_id, members: res.data.members }))
            .catch(() => ({ eventId: event.event_id, members: [] }));
        });

        return Promise.all(membershipPromises).then((membershipChecks) => {
          const membershipMap = {};
          membershipChecks.forEach(({ eventId, members }) => {
            membershipMap[eventId] = members.map((m) => m.user_id);
          });
          setEventMemberships(membershipMap);

          eventsData.forEach(event => {
            event.memberCount = membershipMap[event.event_id]?.length || 0;
          });

          setEvents(eventsData);
        });
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (error) return <p className="error-message">{error}</p>;

  const handleEventClick = (event_id) => {
    navigate(`/events/${event_id}`);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const now = new Date();

  const filteredEvents = events.filter((event) => {
    if (filter === "upcoming") return new Date(event.date) >= now;
    if (filter === "past") return new Date(event.date) < now;
    return true;
  });

  const sortEvents = (eventsList) => {
    const sorted = [...eventsList];
    if (sortOption === "soonest") {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "most") {
      sorted.sort((a, b) => b.memberCount - a.memberCount);
    } else if (sortOption === "least") {
      sorted.sort((a, b) => a.memberCount - b.memberCount);
    }
    return sorted;
  };

  const upcomingEvents = sortEvents(filteredEvents.filter(event => new Date(event.date) >= now));
  const pastEvents = sortEvents(filteredEvents.filter(event => new Date(event.date) < now));

  return (
    <div className="find-events-container">
      <h1>Find Events</h1>

      <div style={{ marginBottom: "1em" }}>
        <label htmlFor="filter">Filter by: </label>
        <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Only</option>
          <option value="past">Past Only</option>
        </select>

        <label htmlFor="sort" style={{ marginLeft: "1em" }}>Sort by: </label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="soonest">Earliest Date</option>
          <option value="newest">Latest Date</option>
          <option value="most">Most Signups</option>
          <option value="least">Fewest Signups</option>
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="events-grid">
          {[...upcomingEvents, ...pastEvents].map((event) => {
            const memberIds = eventMemberships[event.event_id] || [];
            const isMember = memberIds.includes(user?.userId);
            const isPast = new Date(event.date) < now;

            return (
              <div
                key={event.event_id}
                className="event-card"
                onClick={() => handleEventClick(event.event_id)}
                style={{
                  cursor: "pointer",
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <p><strong>Date:</strong> {formatDateTime(event.date)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Signed Up:</strong> {memberIds.length} people</p>
                {isMember && (
                  <p style={{ color: "green", fontWeight: "bold", marginTop: "1em" }}>
                    ✅ You've joined this event
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindEvents;
