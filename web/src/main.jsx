import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Codéna</h1>
      <p>Build OK ✅</p>
      <p>
        API Docs :{" "}
        <a href="https://codena-backend.onrender.com/docs" target="_blank" rel="noreferrer">
          Swagger
        </a>
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
