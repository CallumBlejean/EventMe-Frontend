import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { deleteUserAccount } from "../api";
import { getAuth, signOut } from "firebase/auth";

const Profile = () => {
  const { user, loading } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) return <p>Loading your profile...</p>;
  if (!user) return <p>User not found. Please log in again.</p>;

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete your account?");
    if (!confirmed) return;

    if (user.userStatus === "admin") {
      alert("Admins cannot delete their own accounts.");
      return;
    }

    setDeleting(true);
    deleteUserAccount(user.userId)
      .then(() => {
        setMessage("Your account has been deleted.");
        const auth = getAuth();
        signOut(auth);
      })
      .catch((err) => {
        setMessage(err.message || "Failed to delete account.");
      })
      .finally(() => setDeleting(false));
  };

  return (
    <div className="profile-container">
      <h1>Your Profile</h1>
      <div className="profile-info">
        <p><strong>Display Name:</strong> {user.userName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.userStatus}</p>
        {user.userStatus !== "admin" && (
          <button onClick={handleDelete} disabled={deleting} style={{ marginTop: "1em" }}>
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        )}
        {message && <p style={{ marginTop: "1em", color: user.userStatus === "admin" ? "red" : "green" }}>{message}</p>}
      </div>
    </div>
  );
};

export default Profile;
