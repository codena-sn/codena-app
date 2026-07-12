import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAccess } from "../api.js";

const CITIES = ["Dakar", "Thiès", "Autre"];
const GOALS = [
  { id: "1m", label: "Dans moins d'1 mois" },
  { id: "3m", label: "Dans 1 à 3 mois" },
  { id: "later", label: "Plus tard, je me renseigne" },
];

const chip = (active) => ({
  padding: "11px 16px",
  borderRadius: 12,
  border: active ? "1.5px solid var(--vert)" : "1.5px solid var(--bord)",
  background: active ? "var(--vert-l)" : "#fff",
  color: active ? "var(--vert-d)" : "var(--ink)",
  fontFamily: "Sora",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
});

export default function Onboarding() {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [goal, setGoal] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!getAccess()) nav("/login");
  }, [nav]);

  const finalCity = city === "Autre" ? otherCity : city;
  const ready = firstName.trim() && finalCity.trim();

  async function save() {
    setLoading(true);
    setMsg("");
    try {
      await api("/me", {
        method: "PATCH",
        auth: true,
        body: {
          first_name: firstName.trim(),
          city: finalCity.trim(),
          exam_goal: goal || null,
          marketing_consent: consent,
        },
      });
      nav("/lessons");
    } catch (e) {
      setMsg(`Erreur: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function skip() {
    localStorage.setItem("codena_onboard_skip", "1");
    nav("/lessons");
  }

  return (
    <div className="page" style={{ maxWidth: 500 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span className="pill">👋 Bienvenue sur Codéna</span>
      </div>
      <div className="card">
        <h2 className="h-lg">Fais-nous connaissance</h2>
        <p className="sub">20 secondes pour personnaliser ton parcours vers le permis.</p>

        <div style={{ marginTop: 20 }}>
          <label>Ton prénom</label>
          <input
            placeholder="Ex : Awa"
            value={firstName}
            autoFocus
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <label>Ta ville</label>
          <div className="chips" style={{ marginBottom: 0 }}>
            {CITIES.map((c) => (
              <button key={c} type="button" style={chip(city === c)} onClick={() => setCity(c)}>
                {c}
              </button>
            ))}
          </div>
          {city === "Autre" && (
            <input
              style={{ marginTop: 10 }}
              placeholder="Ta ville"
              value={otherCity}
              onChange={(e) => setOtherCity(e.target.value)}
            />
          )}
        </div>

        <div style={{ marginTop: 18 }}>
          <label>Tu vises l'examen pour quand ?</label>
          <div className="chips" style={{ marginBottom: 0, flexDirection: "column", alignItems: "stretch" }}>
            {GOALS.map((g) => (
              <button key={g.id} type="button" style={{ ...chip(goal === g.id), textAlign: "left" }} onClick={() => setGoal(g.id)}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 20, fontSize: 13, fontWeight: 500, color: "var(--gris)", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            style={{ width: "auto", marginTop: 2, accentColor: "var(--vert)" }}
          />
          <span>
            J'accepte de recevoir les bons plans Codéna et les offres de ses partenaires
            (assurance, services auto…) par SMS ou WhatsApp. Désinscription possible à tout moment.
          </span>
        </label>

        <button
          className="btn btn-primary btn-block btn-lg"
          style={{ marginTop: 20 }}
          onClick={save}
          disabled={!ready || loading}
        >
          {loading ? "Enregistrement…" : "C'est parti 🚀"}
        </button>

        {msg && <p className="note err">{msg}</p>}

        <p style={{ textAlign: "center", marginTop: 14 }}>
          <button type="button" onClick={skip} style={{ background: "none", border: "none", color: "var(--gris)", fontSize: 13, cursor: "pointer", textDecoration: "underline" }}>
            Plus tard
          </button>
        </p>
      </div>
    </div>
  );
}
