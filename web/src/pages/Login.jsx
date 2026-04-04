
import React, { useState } from "react";
import { api, setTokens } from "../api.js";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [debug, setDebug] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  const normalizeSN = (v) => {
    const digits = v.replace(/\D/g, "");
    if (digits.startsWith("221") && digits.length === 12) return `+${digits}`;
    if ((digits.startsWith("77") || digits.startsWith("76")) && digits.length === 9) return `+221${digits}`;
    if (v.startsWith("+")) return v;
    return `+${digits}`;
  };

  async function sendOtp() {
    setMsg("");
    try {
      const r = await api("/auth/otp/send", { method: "POST", body: { phone: normalizeSN(phone) } });
      setDebug(r.debug_code || "");
      setStep(2);
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function verifyOtp() {
    setMsg("");
    try {
      const r = await api("/auth/otp/verify", { method: "POST", body: { phone: normalizeSN(phone), code } });
      setTokens(r.access_token, r.refresh_token);
      setMsg("Connecté ✅");
    } catch (e) {
      setMsg(e.message);
    }
  }

  return (
    <div>
      <h2>Connexion (OTP)</h2>

      <div style={{ maxWidth: 420 }}>
        <label>Téléphone Sénégal</label>
        <input
          style={{ width: "100%", padding: 12, marginTop: 6 }}
          placeholder="77xxxxxxx ou +22177xxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {step === 1 && (
          <button style={{ marginTop: 12 }} onClick={sendOtp} disabled={!phone}>
            Envoyer OTP
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
            <button style={{ marginTop: 12 }} onClick={verifyOtp} disabled={code.length !== 6}>
              Vérifier
            </button>

            {debug && (
              <p style={{ color: "#475569" }}>
                debug_code (dev) : <b>{debug}</b>
              </p>
            )}
          </div>
        )}

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}
