import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import {
  fetchUserByEmail,
  fetchAllUsers,
  updateUserStatus
} from "../api";

const AdminControl = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState({});
  const [statusChanges, setStatusChanges] = useState({});

  const handleEmailSearch = () => {
    setError("");
    setUserInfo(null);
    setLoading(true);

    fetchUserByEmail(email)
      .then((res) => {
        setUserInfo(res);
        setStatusChanges((prev) => ({ ...prev, [res.user_id]: res.user_status }));
        setStatusDropdowns((prev) => ({ ...prev, [res.user_id]: false }));
      })
      .catch(() => {
        setError("User not found or error fetching user info.");
      })
      .finally(() => setLoading(false));
  };

  const handleFetchAllUsers = () => {
    setError("");
    setUserList([]);
    setLoading(true);

    fetchAllUsers()
      .then((res) => {
        setUserList(res);
      })
      .catch(() => {
        setError("Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  };

  const toggleDropdown = (userId) => {
    if (user.userId === userId) return;
    setStatusDropdowns((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    setStatusChanges((prev) => ({
      ...prev,
      [userId]: userList.find((u) => u.user_id === userId)?.user_status || userInfo?.user_status || "active",
    }));
  };

  const handleSelectChange = (userId, newStatus) => {
    setStatusChanges((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));
  };

  const handleConfirmStatusChange = (userId) => {
    if (user.userId === userId) return;
    const newStatus = statusChanges[userId];
    updateUserStatus(userId, newStatus)
      .then(() => {
        setUserList((prev) =>
          prev.map((u) =>
            u.user_id === userId ? { ...u, user_status: newStatus } : u
          )
        );
        if (userInfo && userInfo.user_id === userId) {
          setUserInfo((prev) => ({ ...prev, user_status: newStatus }));
        }
        setStatusDropdowns((prev) => ({ ...prev, [userId]: false }));
      })
      .catch(() => {
        alert("Failed to update user status.");
      });
  };

  if (user?.userStatus !== "admin") {
    return <p>You do not have access to this page.</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Control Panel</h2>

        <input
          type="email"
          placeholder="Search user by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleEmailSearch}>Search</button>

        {loading && <div className="spinner"></div>}
        {error && <p className="error-message">{error}</p>}

        {userInfo && (
          <div style={{ marginTop: "1em" }}>
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p>
              <strong>Status:</strong> {userInfo.user_status} {" "}
              {user.userId === userInfo.user_id ? (
                <span title="You cannot change your own status" style={{ marginLeft: "0.5em" }}>🔒</span>
              ) : (
                <button onClick={() => toggleDropdown(userInfo.user_id)} style={{ marginLeft: "1em" }}>
                  ▼
                </button>
              )}
            </p>
            {statusDropdowns[userInfo.user_id] && (
              <div style={{ marginTop: "0.5em" }}>
                <select
                  value={statusChanges[userInfo.user_id] || userInfo.user_status}
                  onChange={(e) => handleSelectChange(userInfo.user_id, e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                  <option value="banned">banned</option>
                </select>
                <button
                  onClick={() => handleConfirmStatusChange(userInfo.user_id)}
                  style={{ marginLeft: "0.5em" }}
                >
                  Confirm
                </button>
              </div>
            )}
            <p><strong>User ID:</strong> {userInfo.user_id}</p>
          </div>
        )}

        <hr style={{ margin: "2em 0" }} />

        <button onClick={handleFetchAllUsers}>Fetch All Users</button>

        {userList.length > 0 && (
          <div style={{ marginTop: "1em" }}>
            <h3>All Users</h3>
            {userList.map((u) => (
              <div key={u.user_id} style={{ marginBottom: "1.5em" }}>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
                <p>
                  <strong>Status:</strong> {u.user_status} {" "}
                  {user.userId === u.user_id ? (
                    <span title="You cannot change your own status" style={{ marginLeft: "0.5em" }}>🔒</span>
                  ) : (
                    <button onClick={() => toggleDropdown(u.user_id)} style={{ marginLeft: "1em" }}>
                      ▼
                    </button>
                  )}
                </p>
                {statusDropdowns[u.user_id] && (
                  <div style={{ marginTop: "0.5em" }}>
                    <select
                      value={statusChanges[u.user_id] || u.user_status}
                      onChange={(e) => handleSelectChange(u.user_id, e.target.value)}
                    >
                      <option value="active">active</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                      <option value="banned">banned</option>
                    </select>
                    <button
                      onClick={() => handleConfirmStatusChange(u.user_id)}
                      style={{ marginLeft: "0.5em" }}
                    >
                      Confirm
                    </button>
                  </div>
                )}
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminControl;
