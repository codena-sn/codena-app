import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/content/lessons")
      .then(setItems)
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div>
      <h2>Cours</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <ul>
        {items.map((l) => (
          <li key={l.id}>
            <b>{l.title}</b> — {l.chapter}
          </li>
        ))}
      </ul>
    </div>
  );
}
