import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { pickExam, saveExamScore } from "../content.js";

const N = 25;
const DURATION = 20 * 60; // 20 minutes
const PASS = 21; // seuil indicatif

function fmt(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export default function Exam() {
  const [phase, setPhase] = useState("intro"); // intro | run | result
  const [qs, setQs] = useState([]);
  const [ans, setAns] = useState([]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const timer = useRef(null);

  function start() {
    const picked = pickExam(N);
    setQs(picked);
    setAns(Array(picked.length).fill(null));
    setI(0);
    setLeft(DURATION);
    setPhase("run");
  }

  function finish() {
    if (timer.current) clearInterval(timer.current);
    const score = qs.reduce((acc, q, idx) => acc + (ans[idx] === q.answer ? 1 : 0), 0);
    saveExamScore(score, qs.length);
    setPhase("result");
  }

  useEffect(() => {
    if (phase !== "run") return;
    timer.current = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) { clearInterval(timer.current); finish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current);
    // eslint-disable-next-line
  }, [phase]);

  // ---- INTRO ----
  if (phase === "intro") {
    return (
      <div className="page" style={{ maxWidth: 620 }}>
        <span className="eyebrow">Entraînement</span>
        <h2 className="h-lg" style={{ marginTop: 8 }}>Examen blanc</h2>
        <p className="sub" style={{ fontSize: 16 }}>Mets-toi dans les conditions réelles : {N} questions, {DURATION / 60} minutes, sans correction pendant l'épreuve.</p>
        <div className="card" style={{ marginTop: 18 }}>
          <ul className="clist">
            <li><i className="tick">✓</i><span><b>{N} questions</b> tirées au hasard dans toutes les leçons.</span></li>
            <li><i className="tick">✓</i><span><b>Minuteur de {DURATION / 60} min</b> — l'examen se termine automatiquement à la fin du temps.</span></li>
            <li><i className="tick">✓</i><span>Résultat détaillé à la fin, avec la correction de chaque question.</span></li>
            <li><i className="tick">✓</i><span>Seuil de réussite indicatif : <b>{PASS}/{N}</b>.</span></li>
          </ul>
          <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: 8 }} onClick={start}>Commencer l'examen</button>
        </div>
        <p className="sub" style={{ textAlign: "center", marginTop: 14 }}><Link to="/lessons" style={{ color: "var(--vert)", fontWeight: 700 }}>Revoir les cours d'abord</Link></p>
        {styles}
      </div>
    );
  }

  // ---- RESULT ----
  if (phase === "result") {
    const score = qs.reduce((acc, q, idx) => acc + (ans[idx] === q.answer ? 1 : 0), 0);
    const pass = score >= PASS;
    return (
      <div className="page" style={{ maxWidth: 720 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 46 }}>{pass ? "🎉" : "📚"}</div>
          <h2 className="h-lg" style={{ margin: "6px 0" }}>{score} / {qs.length}</h2>
          <p style={{ fontFamily: "Sora", fontWeight: 700, color: pass ? "var(--vert-d)" : "var(--rouge)" }}>{pass ? "Réussi (seuil indicatif atteint)" : "À retravailler"}</p>
          <p className="sub">Temps utilisé : {fmt(DURATION - left)}. Score enregistré ✓</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
            <button className="btn btn-primary" onClick={start}>Refaire un examen</button>
            <Link to="/lessons" className="btn btn-ghost">Revoir les cours</Link>
          </div>
        </div>
        <h3 style={{ fontFamily: "Sora", fontSize: 20, margin: "26px 0 12px" }}>Correction</h3>
        {qs.map((q, idx) => {
          const ok = ans[idx] === q.answer;
          return (
            <div key={idx} className="rev">
              <div className="revh"><span className={`revb ${ok ? "g" : "r"}`}>{idx + 1}</span><b>{q.q}</b></div>
              <p className="revok">Bonne réponse : {q.options[q.answer]}</p>
              {!ok && <p className="revko">Ta réponse : {ans[idx] === null ? "aucune" : q.options[ans[idx]]}</p>}
              <p className="revx">{q.explain}</p>
            </div>
          );
        })}
        {styles}
      </div>
    );
  }

  // ---- RUN ----
  const q = qs[i];
  const answered = ans.filter((a) => a !== null).length;
  const low = left <= 60;
  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <div className="ebar">
        <span className="ecount">Question {i + 1} / {qs.length}</span>
        <span className={`etimer ${low ? "low" : ""}`}>⏱ {fmt(left)}</span>
      </div>
      <div className="qbar" style={{ marginBottom: 18 }}><i style={{ width: `${(answered / qs.length) * 100}%` }} /></div>

      <div className="card">
        <span className="tag" style={{ background: "var(--fond)", color: "var(--gris)" }}>{q.chapter}</span>
        <h3 className="qq" style={{ marginTop: 8 }}>{q.q}</h3>
        <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
          {q.options.map((o, idx) => (
            <button key={idx} className={`qopt ${ans[i] === idx ? "sel" : ""}`} onClick={() => { const a = [...ans]; a[i] = idx; setAns(a); }}>
              <span className="qletter">{String.fromCharCode(97 + idx)}</span>{o}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <button className="btn btn-ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Précédent</button>
        {i + 1 < qs.length
          ? <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setI(i + 1)}>Suivant</button>
          : <button className="btn btn-primary" style={{ flex: 1 }} onClick={finish}>Terminer l'examen</button>}
      </div>
      <p className="sub" style={{ textAlign: "center", marginTop: 12, fontSize: 12.5 }}>{answered}/{qs.length} répondues</p>
      {styles}
    </div>
  );
}

const styles = (
  <style>{`
    .clist{list-style:none;padding:0;margin:0}
    .clist li{display:flex;gap:10px;align-items:flex-start;margin-bottom:11px;font-size:15px}
    .clist li .tick{margin-top:2px;flex:none}
    .ebar{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
    .ecount{font-family:"Sora";font-weight:700;font-size:15px}
    .etimer{font-family:"Sora";font-weight:800;font-size:17px;background:var(--vert-l);color:var(--vert-d);padding:5px 12px;border-radius:20px}
    .etimer.low{background:var(--rouge-l);color:var(--rouge)}
    .qbar{height:7px;background:var(--bord);border-radius:6px;overflow:hidden}
    .qbar i{display:block;height:100%;background:var(--vert);border-radius:6px;transition:.2s}
    .qq{font-family:"Sora";font-size:18px}
    .qopt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:var(--fond);border:1.5px solid var(--bord);border-radius:12px;padding:13px 14px;font-size:15px;font-family:inherit;cursor:pointer;transition:.12s;color:var(--ink)}
    .qopt:hover{border-color:var(--vert)}
    .qopt.sel{border-color:var(--vert);background:var(--vert-l)}
    .qletter{width:26px;height:26px;flex:none;border-radius:8px;background:#fff;border:1px solid var(--bord);display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;text-transform:uppercase}
    .rev{background:#fff;border:1px solid var(--bord);border-radius:14px;padding:16px;margin-bottom:11px;box-shadow:var(--sh)}
    .revh{display:flex;gap:10px;align-items:flex-start;font-size:15px}
    .revb{width:24px;height:24px;flex:none;border-radius:7px;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:12px}
    .revb.g{background:var(--vert)} .revb.r{background:var(--rouge)}
    .revok{color:var(--vert-d);font-size:14px;margin-top:8px;font-weight:600}
    .revko{color:var(--rouge);font-size:14px;margin-top:2px}
    .revx{color:var(--gris);font-size:13.5px;margin-top:6px}
  `}</style>
);
