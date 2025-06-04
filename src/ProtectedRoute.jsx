// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const isAuth = localStorage.getItem("auth") === "true";
//   return isAuth ? children : <Navigate to="/login" replace />;
// }



import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("auth") === "true";
  const loginTime = localStorage.getItem("login_time");

  // Check if it's been more than 24 hours
  if (loginTime) {
    const lastLogin = new Date(loginTime);
    const now = new Date();
    const diffHours = (now - lastLogin) / (1000 * 60 * 60);
    if (diffHours >= 24) {
      localStorage.removeItem("auth");
      localStorage.removeItem("login_time");
      return <Navigate to="/login" replace />;
    }
  }

  return isAuth ? children : <Navigate to="/login" replace />;
}
