import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Lessons from "./pages/Lessons.jsx";
import Booking from "./pages/Booking.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 24, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <h1 style={{ margin: "0 12px 0 0" }}>Codéna</h1>

        <Link to="/login">Connexion</Link>
        <Link to="/lessons">Cours</Link>
        <Link to="/booking">Réserver</Link>

        <a
          href="https://codena-backend.onrender.com/docs"
          target="_blank"
          rel="noreferrer"
          style={{ marginLeft: "auto" }}
        >
          API Docs
        </a>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </div>
  );
}
