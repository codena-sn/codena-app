import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, API, setTokens } from "../api.js";

export default function Login() {
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [debug, setDebug] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizeSN = (v) => {
    const digits = v.replace(/\D/g, "");
    if (digits.startsWith("221") && digits.length === 12) return `+${digits}`;
    if ((digits.startsWith("77") || digits.startsWith("76")) && digits.length === 9) return `+221${digits}`;
    if (v.startsWith("+")) return v;
    return `+${digits}`;
  };

  async function sendOtp() {
    setLoading(true);
    setMsg("");
    try {
      const p = normalizeSN(phone);
      const r = await api("/auth/otp/send", { method: "POST", body: { phone: p } });
      setDebug(r.debug_code || "");
      setStep(2);
      setMsg("Code envoyé ✅ Vérifie tes SMS.");
    } catch (e) {
      setMsg(`Erreur: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setMsg("");
    try {
      const p = normalizeSN(phone);
      const r = await api("/auth/otp/verify", { method: "POST", body: { phone: p, code } });
      setTokens(r.access_token, r.refresh_token);
      setMsg("Connecté ✅");
      // Onboarding : si le profil n'est pas complété, on fait connaissance.
      let dest = "/lessons";
      try {
        const me = await api("/me", { auth: true });
        const skipped = localStorage.getItem("codena_onboard_skip") === "1";
        if (me && !me.profile_completed && !skipped) dest = "/bienvenue";
      } catch {
        // endpoint indisponible : on continue normalement
      }
      nav(dest);
    } catch (e) {
      setMsg(`Erreur: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const isErr = msg.startsWith("Erreur");

  return (
    <div className="page" style={{ maxWidth: 460 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span className="pill">🔑 Connexion sécurisée</span>
      </div>
      <div className="card">
        <h2 className="h-lg">Connexion</h2>
        <p className="sub">Entre ton numéro de téléphone. Nous t'enverrons un code de connexion par SMS.</p>

        <div style={{ marginTop: 20 }}>
          <label>Numéro de téléphone</label>
          <input
            placeholder="77 123 45 67"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && step === 1 && phone && !loading && sendOtp()}
          />

          {step === 1 && (
            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }} onClick={sendOtp} disabled={!phone || loading}>
              {loading ? "Envoi…" : "Recevoir mon code"}
            </button>
          )}

          {step === 2 && (
            <div style={{ marginTop: 18 }}>
              <label>Code reçu par SMS</label>
              <input
                placeholder="6 chiffres"
                inputMode="numeric"
                style={{ letterSpacing: 6, fontWeight: 700, fontSize: 20, textAlign: "center" }}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && code.length === 6 && !loading && verifyOtp()}
              />
              <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }} onClick={verifyOtp} disabled={code.length !== 6 || loading}>
                {loading ? "Vérification…" : "Se connecter"}
              </button>
              {debug && (
                <p className="debug">Code (mode démo) : <b style={{ color: "var(--ink)" }}>{debug}</b></p>
              )}
            </div>
          )}

          {msg && <p className={`note ${isErr ? "err" : "ok"}`}>{msg}</p>}
        </div>
      </div>
      <p className="sub" style={{ textAlign: "center", marginTop: 18 }}>
        En continuant, tu acceptes nos conditions d'utilisation.
      </p>
    </div>
  );
}
