import React, { useEffect, useState } from "react";
import { api } from "../api.js";

const ICONS = [
  { ic: "🚦", cls: "g" },
  { ic: "⚠️", cls: "y" },
  { ic: "🛡️", cls: "r" },
  { ic: "🅿️", cls: "g" },
  { ic: "🚗", cls: "y" },
];

export default function Lessons() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/content/lessons")
      .then((d) => setItems(d || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <span className="eyebrow">Le code de la route</span>
      <h2 className="h-lg" style={{ marginTop: 8 }}>Cours de code</h2>
      <p className="sub">Révise à ton rythme, leçon par leçon.</p>

      {err && <p className="note err">{err}</p>}
      {loading && <p className="sub" style={{ marginTop: 20 }}>Chargement…</p>}

      <div style={{ marginTop: 22 }}>
        {items.map((l, i) => {
          const t = ICONS[i % ICONS.length];
          return (
            <div className="row" key={l.id}>
              <div className={`ic ${t.cls}`}>{t.ic}</div>
              <div>
                <h4>{l.title}</h4>
                <span className={`tag ${t.cls === "g" ? "g" : t.cls === "y" ? "y" : "r"}`}
                  style={{ background: "var(--fond)", color: "var(--gris)" }}>{l.chapter}</span>
              </div>
              <div className="right" style={{ color: "var(--gris)", fontSize: 22 }}>›</div>
            </div>
          );
        })}
      </div>

      {!loading && !err && items.length === 0 && (
        <p className="sub" style={{ marginTop: 20 }}>Aucune leçon pour le moment.</p>
      )}
    </div>
  );
}
