import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setMenuOpen(false);
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="navigation">
      {user?.userStatus === "admin" || user?.userStatus === "staff" ? (
        <button onClick={() => handleNavigation("/create-event")}>
          || Create Event ||{" "}
        </button>
      ) : null}
      <button onClick={() => handleNavigation("/find-events")}>
        Find Events
      </button>
      <button onClick={() => handleNavigation("/my-events")}>My Events</button>

      {/* Hamburger Menu for Settings */}
      <div className="dropdown">
        <button
          className="hamburger-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        {menuOpen && (
          <div className="dropdown-content">
            {user?.userStatus === "admin" && (
              <button onClick={() => handleNavigation("/admin")}>
                Admin Control
              </button>
            )}
            <button onClick={() => handleNavigation("/home")}>Home</button>
            <button onClick={() => handleNavigation("/about")}>About</button>
            <button onClick={() => handleNavigation("/profile")}>
              Profile
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
