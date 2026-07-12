import React from "react";
import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Lessons from "./pages/Lessons.jsx";
import LessonDetail from "./pages/LessonDetail.jsx";
import Exam from "./pages/Exam.jsx";
import Booking from "./pages/Booking.jsx";
import Onboarding from "./pages/Onboarding.jsx";

// TODO : remplacer par le numéro WhatsApp officiel Codéna
const WHATSAPP = "https://wa.me/221784484519?text=Bonjour%20Cod%C3%A9na%20%F0%9F%91%8B";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
:root{
  --vert:#0E9F6E;--vert-d:#0A7A54;--vert-l:#E8F7F0;
  --jaune:#FBBF24;--jaune-l:#FEF3D6;--rouge:#F04438;--rouge-l:#FDE7E5;
  --ink:#0C1E17;--gris:#5A6B63;--bord:#E7EEEB;--fond:#F6FAF8;--blanc:#fff;
  --sh:0 10px 30px rgba(12,30,23,.08);--sh-lg:0 24px 60px rgba(12,30,23,.14);--r:18px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:"Manrope",system-ui,sans-serif;color:var(--ink);background:var(--blanc);-webkit-font-smoothing:antialiased;line-height:1.55}
h1,h2,h3,h4{font-family:"Sora",sans-serif;letter-spacing:-.03em;line-height:1.1;margin:0}
a{color:inherit;text-decoration:none}
.wrap{max-width:1120px;margin:0 auto;padding:0 22px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:13px;font-family:"Sora";font-weight:700;font-size:15px;padding:13px 22px;cursor:pointer;transition:.15s}
.btn:disabled{opacity:.5;cursor:not-allowed}
.btn-primary{background:var(--vert);color:#fff}.btn-primary:hover:not(:disabled){background:var(--vert-d)}
.btn-jaune{background:var(--jaune);color:#3d2f00}
.btn-ghost{background:#fff;color:var(--ink);border:1.5px solid var(--bord)}.btn-ghost:hover{border-color:var(--vert);color:var(--vert)}
.btn-lg{padding:16px 28px;font-size:16px;border-radius:15px}
.btn-block{width:100%}
.pill{display:inline-flex;align-items:center;gap:7px;background:var(--vert-l);color:var(--vert-d);font-weight:600;font-size:13px;padding:7px 14px;border-radius:30px}
.eyebrow{font-family:"Sora";font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--vert)}
.tick{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:var(--vert-l);color:var(--vert-d);font-size:11px;font-weight:800;flex:none}

/* promo + nav */
.promo{background:var(--ink);color:#fff;font-size:13.5px;text-align:center;padding:9px 16px;font-weight:500}
.promo b{color:var(--jaune)}
header.app{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--bord)}
.nav{display:flex;align-items:center;justify-content:space-between;height:68px}
.brand{display:flex;align-items:center;gap:10px;font-family:"Sora";font-weight:800;font-size:21px;color:var(--ink)}
.light{width:20px;height:31px;border-radius:6px;background:var(--ink);display:flex;flex-direction:column;justify-content:space-between;padding:3px}
.light span{display:block;height:6px;border-radius:50%}
.light .r{background:var(--rouge)}.light .y{background:var(--jaune)}.light .g{background:var(--vert)}
.navlinks{display:flex;align-items:center;gap:26px;font-weight:600;font-size:15px;color:#33413b}
.navlinks a.active,.navlinks a:hover{color:var(--vert)}
.navcta{display:flex;align-items:center;gap:12px}
.navcta .login{font-family:"Sora";font-weight:700;font-size:15px}
@media(max-width:820px){.navlinks{display:none}}

/* page container for app pages */
.page{max-width:760px;margin:0 auto;padding:36px 22px 60px}
.card{background:#fff;border:1px solid var(--bord);border-radius:20px;padding:26px;box-shadow:var(--sh)}
.h-lg{font-size:30px;font-weight:800}
.sub{color:var(--gris);font-size:15px;margin-top:6px}
label{display:block;font-size:12.5px;font-weight:700;color:var(--gris);margin:0 0 7px 2px}
input{width:100%;border:1.5px solid var(--bord);border-radius:12px;padding:14px;font-size:16px;font-family:inherit;outline:none;background:var(--fond)}
input:focus{border-color:var(--vert);background:#fff}
.note{font-size:13px;padding:11px 14px;border-radius:11px;margin-top:14px;font-weight:600}
.note.ok{background:var(--vert-l);color:var(--vert-d)}
.note.err{background:var(--rouge-l);color:#b02525}
.debug{font-size:12.5px;color:var(--gris);background:var(--fond);border:1px dashed var(--bord);border-radius:10px;padding:10px 12px;margin-top:12px}

/* rows/cards for lessons & booking */
.row{background:#fff;border:1px solid var(--bord);border-radius:15px;padding:15px;display:flex;gap:13px;align-items:center;margin-bottom:11px;box-shadow:var(--sh)}
.row .ic{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex:none}
.g{background:var(--vert-l)}.y{background:var(--jaune-l)}.r{background:var(--rouge-l)}
.row h4{font-size:15.5px}
.row .meta{font-size:12.5px;color:var(--gris);margin-top:3px}
.row .right{margin-left:auto}
.tag{display:inline-block;font-size:11px;font-weight:700;padding:3px 9px;border-radius:20px;margin-top:5px}
.centre{cursor:pointer;transition:.12s;border:1.5px solid var(--bord)}
.centre.sel{border-color:var(--vert);background:#f2fbf6}
.chips{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}

footer.app{background:var(--ink);color:#cbd5cf;padding:44px 0 26px;margin-top:20px}
footer.app .fg{display:flex;justify-content:space-between;flex-wrap:wrap;gap:20px;align-items:center}
footer.app .brand{color:#fff}
footer.app small{color:#8ea299;font-size:12.5px}
footer.app .flinks{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;font-weight:600}
footer.app .flinks a:hover{color:#fff}

/* WhatsApp flottant */
.wa-float{position:fixed;right:18px;bottom:18px;z-index:60;width:54px;height:54px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25);transition:.15s}
.wa-float:hover{transform:scale(1.06)}
.wa-float svg{width:29px;height:29px;fill:#fff}
`;

function Header() {
  return (
    <header className="app">
      <div className="wrap nav">
        <Link to="/" className="brand">
          <span className="light"><span className="r"></span><span className="y"></span><span className="g"></span></span>
          Codéna
        </Link>
        <nav className="navlinks">
          <NavLink to="/lessons">Le code</NavLink>
          <NavLink to="/booking">L'examen</NavLink>
          <a href="/#tarifs">Tarifs</a>
        </nav>
        <div className="navcta">
          <Link to="/login" className="login">Se connecter</Link>
          <Link to="/login" className="btn btn-primary">Commencer</Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="app">
      <div className="wrap fg">
        <span className="brand" style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Sora", fontWeight: 800, fontSize: 20 }}>
          <span className="light"><span className="r"></span><span className="y"></span><span className="g"></span></span>
          Codéna
        </span>
        <nav className="flinks">
          <a href="/#faq">FAQ</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="mailto:contact@codena.sn">Contact</a>
          <a href="/mentions-legales.html">Mentions légales</a>
        </nav>
        <small>© 2026 Codéna — Dakar, Sénégal. Fait avec ❤️ pour les candidats au permis.</small>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a className="wa-float" href={WHATSAPP} aria-label="Nous écrire sur WhatsApp" target="_blank" rel="noopener noreferrer">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 2.9C8.8 2.9 2.9 8.8 2.9 16c0 2.6.8 5 2.1 7.1L2.7 29.3l6.4-2.2c2 1.2 4.4 1.8 6.9 1.8 7.2 0 13.1-5.9 13.1-13.1S23.2 2.9 16 2.9zm0 23.9c-2.2 0-4.3-.6-6.1-1.7l-.4-.3-3.8 1.3 1.3-3.7-.3-.4c-1.2-1.9-1.9-4.1-1.9-6.4C4.8 9.9 9.9 4.8 16 4.8S27.2 9.9 27.2 16 22.1 26.8 16 26.8zm6.1-8.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-1.8-1-2.5-.3-.6-.6-.5-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/></svg>
    </a>
  );
}

export default function App() {
  const loc = useLocation();
  const isHome = loc.pathname === "/";
  return (
    <>
      <style>{CSS}</style>
      {isHome && (
        <div className="promo">🚀 Offre de lancement — <b>7 jours de code offerts</b> ce mois-ci.</div>
      )}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bienvenue" element={<Onboarding />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/lessons/:id" element={<LessonDetail />} />
        <Route path="/examen" element={<Exam />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="*" element={<div className="page"><h2 className="h-lg">Page introuvable</h2><p className="sub">Cette page n'existe pas. <Link to="/" style={{ color: "var(--vert)", fontWeight: 700 }}>Retour à l'accueil</Link></p></div>} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
