import React, { useState } from "react";
import { api, API, setTokens } from "../api.js";

export default function Login() {
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
      console.log("SEND OTP -> API:", API, "phone:", p);

      const r = await api("/auth/otp/send", { method: "POST", body: { phone: p } });

      console.log("SEND OTP OK:", r);
      setDebug(r.debug_code || "");
      setStep(2);
      setMsg("OTP envoyé ✅ (si tu es en dev, debug_code affiché)");
    } catch (e) {
      console.error("SEND OTP ERROR:", e);
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
      console.log("VERIFY OTP -> API:", API, "phone:", p);

      const r = await api("/auth/otp/verify", { method: "POST", body: { phone: p, code } });

      console.log("VERIFY OTP OK:", r);
      setTokens(r.access_token, r.refresh_token);
      setMsg("Connecté ✅");
    } catch (e) {
      console.error("VERIFY OTP ERROR:", e);
      setMsg(`Erreur: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Connexion (OTP)</h2>

      <p style={{ color: "#475569" }}>
        API utilisée : <b>{API}</b>
      </p>

      <div style={{ maxWidth: 420 }}>
        <label>Téléphone Sénégal</label>
        <input
          style={{ width: "100%", padding: 12, marginTop: 6 }}
          placeholder="77xxxxxxx ou +22177xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {step === 1 && (
          <button style={{ marginTop: 12 }} onClick={sendOtp} disabled={!phone || loading}>
            {loading ? "Envoi..." : "Envoyer OTP"}
          </button>
        )}

        {step === 2 && (
          <div style={{ marginTop: 12 }}>
            <label>Code OTP</label>
            <input
              style={{ width: "100%", padding: 12, marginTop: 6 }}
              placeholder="6 chiffres"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <button style={{ marginTop: 12 }} onClick={verifyOtp} disabled={code.length !== 6 || loading}>
              {loading ? "Vérification..." : "Vérifier"}
            </button>

            {debug && (
              <p style={{ color: "#475569" }}>
                debug_code (dev) : <b>{debug}</b>
              </p>
            )}
          </div>
        )}

        {msg && <p style={{ marginTop: 12, color: msg.startsWith("Erreur") ? "crimson" : "green" }}>{msg}</p>}
      </div>
    </div>
  );
}
