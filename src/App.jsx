import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate  } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "./components/Header";
import Login from "./screens/Login";
import Navigation from "./components/Navigation";
import Home from './screens/Home';
import NotFound from "./screens/NotFound";
import Signup from "./screens/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./screens/ForgotPassword"
import About from "./screens/About"
import Profile from "./screens/Profile"
import FindEvents from "./screens/FindEvents";
import "./styles.css";
import MyEvents from "./screens/MyEvents";
import EventDetails from "./screens/EventDetails";
import CreateEvent from './screens/CreateEvent';
import AdminControl from "./screens/AdminControl";


const App = () => {
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false); 
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser ) {
        setUser(currentUser);
        setIsVerified(true);
      } else {
        setUser(null);
        setIsVerified(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header />
        {user && isVerified && <Navigation />} 
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LoginRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/find-events" element={<ProtectedRoute><FindEvents /></ProtectedRoute>} />
            <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/events/:event_id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminControl /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const LoginRedirect = () => {
  const auth = getAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) return <div className="spinner"></div>;

  return <Navigate to={isAuthenticated ? "/home" : "/login"} />;
};

export default App;
