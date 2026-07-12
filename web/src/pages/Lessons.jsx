import React from "react";
import { Link } from "react-router-dom";
import { LESSONS } from "../content.js";

export default function Lessons() {
  return (
    <div className="page">
      <span className="eyebrow">Le code de la route</span>
      <h2 className="h-lg" style={{ marginTop: 8 }}>Cours de code</h2>
      <p className="sub">Des leçons illustrées, adaptées au Sénégal, avec un quiz à la fin de chacune.</p>

      <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
        {LESSONS.map((l, i) => (
          <Link to={`/lessons/${l.id}`} key={l.id} className="lcard">
            <div className="lthumb" dangerouslySetInnerHTML={{ __html: l.svg }} />
            <div className="lbody">
              <span className={`tag ${l.cls}`} style={{ background: "var(--fond)", color: "var(--gris)" }}>{l.chapter}</span>
              <h3>{l.title}</h3>
              <p>{l.quiz.length} questions · {l.sections.length} points clés</p>
            </div>
            <div className="lchev">›</div>
          </Link>
        ))}
      </div>

      <style>{`
        .lcard{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--bord);border-radius:18px;padding:14px;box-shadow:var(--sh);transition:.12s}
        .lcard:hover{border-color:var(--vert);transform:translateY(-1px)}
        .lthumb{width:120px;flex:none;border-radius:12px;overflow:hidden}
        .lthumb svg{border-radius:12px}
        .lbody{flex:1}
        .lbody h3{font-family:"Sora";font-size:17px;margin:6px 0 3px}
        .lbody p{font-size:13px;color:var(--gris)}
        .lchev{color:var(--gris);font-size:24px;padding-right:6px}
        @media(max-width:560px){.lthumb{width:88px}.lbody h3{font-size:15px}}
      `}</style>
    </div>
  );
}
