import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { fetchUserByEmail } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return userCredential.user.getIdToken(true).then((token) => {
          return fetchUserByEmail(userCredential.user.email, token)
            .then((backendUser) => {
              if (backendUser.user_status === "banned") {
                throw new Error("This account has been banned.");
              }
              navigate("/home");
            });
        });
      })
      .catch((err) => {
        console.error("Login Error:", err);
        setError(err.message || "Failed to log in. Please check your details.");
        signOut(auth);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resendVerificationEmail = () => {
    if (!auth.currentUser) {
      setError("Please log in first.");
      return;
    }

    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer} seconds before resending.`);
      return;
    }

    sendEmailVerification(auth.currentUser)
      .then(() => {
        alert("Verification email sent! Check your inbox.");
        setResendTimer(60);
        const timerInterval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => {
        console.error("Error sending verification email:", err);
        setError(err.message || "Failed to send verification email.");
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <div className="forgot-password-link">
          <p><a href="/forgot-password">Forgot Password?</a></p>
        </div>
        {showResend && <button onClick={resendVerificationEmail} className="resend-button">Resend Verification Email</button>}
        <div className="signup-link">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
