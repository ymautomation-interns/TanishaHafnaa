import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../../api.js";

export default function RequireAdmin({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
