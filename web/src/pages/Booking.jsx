import React, { useEffect, useState } from "react";
import { api, getAccess } from "../api.js";

export default function Booking() {
  const [centers, setCenters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/booking/centers").then(setCenters).catch((e) => setMsg(e.message));
  }, []);

  async function loadSlots(centerId) {
    setMsg("");
    const s = await api(`/booking/centers/${centerId}/slots`);
    setSlots(s);
  }

  async function reserve(slotId) {
    setMsg("");
    try {
      if (!getAccess()) return setMsg("Connecte-toi d’abord (OTP).");
      const r = await api("/booking/reserve", { method: "POST", body: { slot_id: slotId }, auth: true });
      setMsg(`Réservé ✅ PDF: ${r.pdf_url} | QR: ${r.qr_data}`);
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div>
      <h2>Réserver</h2>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {centers.map((c) => (
          <button key={c.id} onClick={() => loadSlots(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <ul style={{ marginTop: 16 }}>
        {slots.slice(0, 10).map((s) => (
          <li key={s.id}>
            {s.dt_utc} ({s.booked}/{s.capacity})
            <button style={{ marginLeft: 8 }} onClick={() => reserve(s.id)}>
              Réserver
            </button>
          </li>
        ))}
      </ul>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
