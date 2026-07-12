import React, { useEffect, useState } from "react";
import { api, getAccess } from "../api.js";

function fmt(dt) {
  try {
    const d = new Date(dt);
    if (isNaN(d)) return dt;
    return d.toLocaleString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return dt;
  }
}

export default function Booking() {
  const [centers, setCenters] = useState([]);
  const [slots, setSlots] = useState([]);
  const [sel, setSel] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/booking/centers").then((d) => setCenters(d || [])).catch((e) => setErr(e.message));
  }, []);

  async function loadSlots(center) {
    setMsg("");
    setErr("");
    setSel(center.id);
    try {
      const s = await api(`/booking/centers/${center.id}/slots`);
      setSlots(s || []);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function reserve(slotId) {
    setMsg("");
    setErr("");
    try {
      if (!getAccess()) return setErr("Connecte-toi d'abord pour réserver.");
      const r = await api("/booking/reserve", { method: "POST", body: { slot_id: slotId }, auth: true });
      setMsg(`Réservé ✅ Ta confirmation est prête (PDF + QR code).`);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="page">
      <span className="eyebrow">L'examen</span>
      <h2 className="h-lg" style={{ marginTop: 8 }}>Réserver l'examen</h2>
      <p className="sub">Choisis d'abord ton centre, puis un créneau.</p>

      {err && <p className="note err">{err}</p>}
      {msg && <p className="note ok">{msg}</p>}

      <div style={{ marginTop: 22 }}>
        {centers.map((c) => (
          <div key={c.id} className={`row centre ${sel === c.id ? "sel" : ""}`} onClick={() => loadSlots(c)}>
            <div className="ic g">📍</div>
            <div>
              <h4>{c.name}</h4>
              <div className="meta">{[c.city, c.instructions].filter(Boolean).join(" · ")}</div>
            </div>
            {sel === c.id && <div className="right"><span className="tick">✓</span></div>}
          </div>
        ))}
      </div>

      {sel && (
        <>
          <h3 style={{ fontSize: 16, margin: "26px 4px 14px", color: "var(--gris)", textTransform: "uppercase", letterSpacing: ".05em" }}>Créneaux disponibles</h3>
          {slots.length === 0 && <p className="sub">Aucun créneau pour ce centre.</p>}
          {slots.slice(0, 12).map((s) => (
            <div className="row" key={s.id}>
              <div className="ic y">🕒</div>
              <div>
                <h4 style={{ textTransform: "capitalize" }}>{fmt(s.dt_utc)}</h4>
                <div className="meta">Places : {s.booked}/{s.capacity}</div>
              </div>
              <div className="right">
                <button className="btn btn-primary" onClick={() => reserve(s.id)}>Réserver</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
