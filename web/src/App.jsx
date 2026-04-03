import React from "react";
import { Routes, Route, Link } from "react-router-dom";
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
        <a href="/docs" style={{ marginLeft: "auto" }}>Docs</a>
      </header>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </div>
  );
}
