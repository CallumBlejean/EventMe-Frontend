import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { app } from "../.firebaseConfig";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSignup = (e) => {

    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    setError("");
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    if (!user) {
      throw new Error("User creation failed. No user object returned.");
    }

    return sendEmailVerification(user).then(() => {
      console.log("Verification email sent!");
      return user; 
    });
  })
  .then((user) => {
    // Save to supabase backend
    return axios.post("https://eventme-backend.onrender.com/api/users", {
        firebase_uid: user.uid, 
        name: name,
        email: email,
      }).then(() => user);
  })
  .then(() => signOut(auth))
  .then(() => {
    setMessage("Account created! Please check your email to verify your account.");
  })
  .catch((err) => {
    console.error("Signup Error:", err);
    setError(err.message || "Failed to sign up. Please try again.");
  })
  .finally(() => {
    setLoading(false);
  });

  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="signup-link">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
