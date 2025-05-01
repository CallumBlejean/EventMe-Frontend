import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { fetchUserByEmail } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setAuthError(null);
        localStorage.removeItem("idToken");
        setLoading(false);
        return;
      }

      currentUser
        .getIdToken(true)
        .then((token) => {
          localStorage.setItem("idToken", token);
          return fetchUserByEmail(currentUser.email, token);
        })
        .then((response) => {
          const userId = response.user_id;
          const userStatus = response.user_status;
          const userName = response.name;

          if (!userId) {
            return Promise.reject(new Error("User ID not found in response"));
          }

          if (userStatus === "banned") {
            return Promise.reject(new Error("This account has been banned."));
          }

          setUser({
            email: currentUser.email,
            uid: currentUser.uid,
            userId,
            userName,
            userStatus,
          });
          setAuthError(null);
        })
        .catch((error) => {
          console.error("Error fetching user ID or status:", error.message || error);
          const auth = getAuth();
          signOut(auth);
          setUser(null);
          setAuthError(error.message || "Authentication error.");
          localStorage.removeItem("idToken");
        })
        .finally(() => {
          setLoading(false);
        });
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, authError }}>
      {loading ? <div className="spinner"></div> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
