import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const auth = getAuth();

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    fetchSignInMethodsForEmail(auth, email.toLowerCase())
      .then(() => {
        return sendPasswordResetEmail(auth, email.toLowerCase());
      })
      .then(() => {
        setSuccessMessage("Password reset email sent! Check your inbox.");
      })
      .catch((err) => {
        console.error("Password Reset Error:", err);
        setError(err.message || "Failed to send password reset email.");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <div className="login-link">
          <p><a href="/login">Back to Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
