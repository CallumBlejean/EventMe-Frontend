import axios from "axios";
import { getAuth } from "firebase/auth";


const baseURL = "https://eventme-backend.onrender.com/api"

export function deleteUserAccount(userId) {
  const auth = getAuth();

  return auth.currentUser
    .getIdToken(true)
    .then((idToken) => {
      return axios.delete(`${baseURL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
    })
    .then(() => {
      return auth.currentUser.delete();
    })
    .then(() => true)
    .catch((error) => {
      console.error("Error deleting account:", error);
      throw new Error(error?.response?.data?.msg || error.message || "Failed to delete account");
    });
}


  export function fetchAllEvents() {
    const auth = getAuth();
    
    return auth.currentUser.getIdToken(true).then((idToken) => {
      return axios.get(`${baseURL}/events`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    });
  }

  export function fetchEventsByUserId(userId) {
    const auth = getAuth();
  
    return auth.currentUser.getIdToken(true).then((idToken) => {
      return axios.get(`${baseURL}/events/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
    });
  }

  export function createEvent(eventData) {
    const auth = getAuth();
  
    return auth.currentUser
      .getIdToken(true)
      .then((idToken) => {
        return axios.post(`${baseURL}/events`, eventData, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
      })
      .catch((error) => {
        console.error(
          "Error creating event:",
          error.response?.data || error.message
        );
        throw new Error(error.response?.data?.msg || "Failed to create event");
      });
  }

  export function fetchEventMembers(eventId) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((idToken) => {
      return axios.get(`${baseURL}/events/${eventId}/members`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
    });
  }
  
  export function joinEvent(eventId) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios.post(`${baseURL}/events/${eventId}/members`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  }
  
  export function leaveEvent(eventId, userId) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios.delete(`${baseURL}/events/${eventId}/members/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  }

  export function fetchEventById(eventId) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios.get(`${baseURL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  }
  
  export function fetchUserByEmail(email) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios
        .get(`${baseURL}/users/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data.user);
    });
  }
  
  export function fetchAllUsers() {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios
        .get(`${baseURL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => res.data.users);
    });
  }
  
  export function updateUserStatus(userId, status) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios.patch(
        `${baseURL}/users/${userId}/status`,
        { user_status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    });
  }
  
  export function deleteEvent(eventId) {
    const auth = getAuth();
    return auth.currentUser.getIdToken(true).then((token) => {
      return axios.delete(`${baseURL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  }
  
  