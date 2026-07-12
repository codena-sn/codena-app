import React from "react";
import { Link } from "react-router-dom";

const CSS = `
.hero{background:radial-gradient(1100px 480px at 82% -12%,var(--vert-l),transparent),#fff;padding:58px 0 40px;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center}
.hero h1{font-size:50px;font-weight:800;margin:16px 0 16px}
.hero h1 .hl{color:var(--vert)}
.hero .lead{font-size:18px;color:var(--gris);max-width:520px;margin-bottom:24px}
.hero-cta{display:flex;gap:13px;flex-wrap:wrap;margin-bottom:24px}
.hero-trust{display:flex;gap:20px;flex-wrap:wrap;font-size:13.5px;color:var(--gris);font-weight:600}
.hero-trust span{display:flex;align-items:center;gap:7px}
.phone-wrap{display:flex;justify-content:center;position:relative}
.blob{position:absolute;width:340px;height:340px;background:linear-gradient(160deg,var(--jaune-l),var(--vert-l));border-radius:44% 56% 60% 40%/50% 45% 55% 50%;top:16px;z-index:0}
.mock{position:relative;z-index:1;width:270px;background:var(--fond);border:9px solid var(--ink);border-radius:36px;box-shadow:var(--sh-lg);overflow:hidden}
.mock .bar{height:20px;background:var(--ink)}
.mock .top{background:#fff;padding:13px 15px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--bord);font-family:"Sora";font-weight:800;font-size:15px}
.mock .top .light{width:14px;height:22px;padding:2px}.mock .top .light span{height:4px}
.mock .body{padding:15px}
.mh{background:linear-gradient(150deg,var(--vert),var(--vert-d));color:#fff;border-radius:15px;padding:15px}
.mh h4{font-family:"Sora";font-size:16px;font-weight:800;line-height:1.2;margin-bottom:5px}
.mh p{font-size:11.5px;opacity:.9;margin-bottom:11px}
.mh .b{background:var(--jaune);color:#3d2f00;font-family:"Sora";font-weight:700;font-size:12px;text-align:center;border-radius:9px;padding:8px}
.mc{background:#fff;border:1px solid var(--bord);border-radius:12px;padding:10px;display:flex;gap:9px;align-items:center;margin-top:9px}
.mc .ic{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex:none}
.mc h5{font-family:"Sora";font-size:12px;font-weight:700}.mc p{font-size:10px;color:var(--gris)}

.strip{background:var(--fond);border-top:1px solid var(--bord);border-bottom:1px solid var(--bord);padding:18px 0}
.strip .in{display:flex;flex-wrap:wrap;justify-content:center;gap:12px 34px;color:#33413b;font-weight:600;font-size:14px}
.strip span{display:flex;align-items:center;gap:9px}
.strip .dot{width:8px;height:8px;border-radius:50%;background:var(--vert)}

.sec{padding:66px 0}
.sec-head{text-align:center;max-width:620px;margin:0 auto 40px}
.sec-head h2{font-size:36px;font-weight:800;margin:10px 0}
.sec-head .p{font-size:17px;color:var(--gris)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.step{background:#fff;border:1px solid var(--bord);border-radius:18px;padding:24px;box-shadow:var(--sh)}
.step .num{width:40px;height:40px;border-radius:11px;background:var(--vert);color:#fff;font-family:"Sora";font-weight:800;font-size:18px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.step h3{font-size:18px;margin-bottom:7px}.step p{color:var(--gris);font-size:14.5px}

.feat{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center}
.feat.rev .fig{order:-1}
.feat h2{font-size:31px;font-weight:800;margin:12px 0 14px}
.feat ul{list-style:none;margin:16px 0 24px;padding:0}
.feat li{display:flex;gap:11px;align-items:flex-start;margin-bottom:12px;font-size:15.5px}
.feat li .tick{margin-top:2px}
.fig{background:linear-gradient(160deg,var(--vert-l),#fff);border:1px solid var(--bord);border-radius:22px;min-height:300px;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh);position:relative;padding:22px}
.fig .stack{display:flex;flex-direction:column;gap:11px;width:100%;max-width:300px}
.fig .c2{background:#fff;border:1px solid var(--bord);border-radius:13px;box-shadow:var(--sh);padding:13px;display:flex;gap:11px;align-items:center}
.fig .c2 .ic{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:21px;flex:none}
.fig .c2 h5{font-family:"Sora";font-size:14.5px;font-weight:700}.fig .c2 p{font-size:12px;color:var(--gris)}
.taglbl{position:absolute;top:16px;left:16px;background:#fff;border:1px solid var(--bord);border-radius:30px;padding:6px 13px;font-size:12px;font-weight:700;color:var(--vert-d);box-shadow:var(--sh)}

.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch}
.plan{background:#fff;border:1.5px solid var(--bord);border-radius:20px;padding:26px;display:flex;flex-direction:column;box-shadow:var(--sh)}
.plan.pop{border-color:var(--vert);box-shadow:var(--sh-lg);position:relative}
.plan.pop .bdg{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--vert);color:#fff;font-family:"Sora";font-weight:700;font-size:12px;padding:6px 14px;border-radius:20px}
.plan h3{font-size:19px;margin-bottom:4px}.plan .pr{font-family:"Sora";font-weight:800;font-size:34px;margin:8px 0 2px}
.plan .pr small{font-size:14px;color:var(--gris);font-weight:600}
.plan .d{color:var(--gris);font-size:14px;margin-bottom:16px;min-height:38px}
.plan ul{list-style:none;margin:0 0 20px;padding:0;flex:1}
.plan li{display:flex;gap:9px;align-items:flex-start;font-size:14px;margin-bottom:10px}
.ex{font-size:12px;color:var(--gris);text-align:center;margin-top:16px}

.tc{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.tcard{background:#fff;border:1px solid var(--bord);border-radius:18px;padding:22px;box-shadow:var(--sh)}
.stars{color:var(--jaune);letter-spacing:2px;margin-bottom:10px}
.tcard p{font-size:14.5px;color:#2d3b34;margin-bottom:16px}
.who{display:flex;align-items:center;gap:11px}
.av{width:40px;height:40px;border-radius:50%;background:var(--vert-l);color:var(--vert-d);display:flex;align-items:center;justify-content:center;font-family:"Sora";font-weight:800}
.who b{font-family:"Sora";font-size:14px;display:block}.who span{font-size:12.5px;color:var(--gris)}

.faq{max-width:760px;margin:0 auto}
.faq details{border:1px solid var(--bord);border-radius:14px;margin-bottom:11px;background:#fff;overflow:hidden}
.faq summary{padding:18px 20px;font-family:"Sora";font-weight:700;font-size:16px;cursor:pointer;list-style:none;display:flex;justify-content:space-between}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--vert);font-size:22px;line-height:1}
.faq details[open] summary::after{content:"–"}
.faq .a{padding:0 20px 18px;color:var(--gris);font-size:14.5px}

.cta{background:linear-gradient(150deg,var(--vert),var(--vert-d));border-radius:26px;padding:48px 36px;text-align:center;color:#fff;box-shadow:var(--sh-lg)}
.cta h2{font-size:34px;font-weight:800;margin-bottom:10px}
.cta p{opacity:.92;font-size:17px;margin-bottom:24px}

@media(max-width:820px){
  .hero-grid{grid-template-columns:1fr;text-align:center}
  .hero h1{font-size:34px}.hero-cta,.hero-trust{justify-content:center}.hero .lead{margin:0 auto 24px}
  .phone-wrap{margin-top:18px}
  .steps,.plans,.tc{grid-template-columns:1fr}
  .feat{grid-template-columns:1fr;gap:24px}.feat.rev .fig{order:0}
  .sec-head h2,.feat h2,.cta h2{font-size:26px}
}
`;

export default function Home() {
  return (
    <div>
      <style>{CSS}</style>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="pill">🇸🇳 L'auto-école en ligne au Sénégal</span>
            <h1>Ton permis de conduire, <span className="hl">plus simple</span> et moins cher.</h1>
            <p className="lead">Révise le code, réserve ton examen et suis ta progression — 100% en ligne, depuis ton téléphone. Pas de paperasse, pas de mot de passe.</p>
            <div className="hero-cta">
              <Link to="/login" className="btn btn-primary btn-lg">Commencer maintenant</Link>
              <a href="#comment" className="btn btn-ghost btn-lg">Comment ça marche</a>
            </div>
            <div className="hero-trust">
              <span><i className="tick">✓</i> 100% en ligne</span>
              <span><i className="tick">✓</i> Dakar &amp; Thiès</span>
              <span><i className="tick">✓</i> Connexion par SMS</span>
            </div>
          </div>
          <div className="phone-wrap">
            <div className="blob"></div>
            <div className="mock">
              <div className="bar"></div>
              <div className="top"><span className="light"><span className="r"></span><span className="y"></span><span className="g"></span></span>Codéna</div>
              <div className="body">
                <div className="mh"><h4>Bonjour 👋<br/>Prêt à réviser ?</h4><p>Ta progression : 35% du code.</p><div className="b">Reprendre le cours</div></div>
                <div className="mc"><div className="ic g">🚦</div><div><h5>Priorités à droite</h5><p>Leçon · Priorités</p></div></div>
                <div className="mc"><div className="ic y">⚠️</div><div><h5>Cédez le passage</h5><p>Leçon · Signalisation</p></div></div>
                <div className="mc"><div className="ic r">📅</div><div><h5>Examen — 13 juil.</h5><p>Centre Dakar Plateau</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="strip"><div className="wrap in">
        <span><i className="dot"></i> Auto-école nouvelle génération</span>
        <span><i className="dot"></i> Cours conformes à l'examen sénégalais</span>
        <span><i className="dot"></i> Support local 6j/7</span>
        <span><i className="dot"></i> Sans engagement</span>
      </div></div>

      <section className="sec" id="comment"><div className="wrap">
        <div className="sec-head"><span className="eyebrow">Simple comme bonjour</span><h2>Ton permis en 3 étapes.</h2><p className="p">De l'inscription à l'examen, tout au même endroit.</p></div>
        <div className="steps">
          <div className="step"><div className="num">1</div><h3>Crée ton compte</h3><p>Entre ton numéro, reçois un code par SMS, et te voilà connecté. Aucun mot de passe.</p></div>
          <div className="step"><div className="num">2</div><h3>Révise le code</h3><p>Des leçons claires et des questions conformes à l'examen, à ton rythme.</p></div>
          <div className="step"><div className="num">3</div><h3>Réserve ton examen</h3><p>Choisis ton centre et ton créneau en quelques clics.</p></div>
        </div>
      </div></section>

      <section className="sec" id="code" style={{ background: "var(--fond)" }}><div className="wrap feat">
        <div>
          <span className="eyebrow">Le code de la route</span>
          <h2>Une préparation qui te mène droit au succès.</h2>
          <p style={{ color: "var(--gris)", fontSize: 16 }}>Des cours faits pour être compris et retenus, et des séries comme le jour de l'examen.</p>
          <ul>
            <li><i className="tick">✓</i> Leçons claires par thème.</li>
            <li><i className="tick">✓</i> Questions conformes à l'examen sénégalais.</li>
            <li><i className="tick">✓</i> Examens blancs avec corrections.</li>
            <li><i className="tick">✓</i> Suivi de ta progression.</li>
          </ul>
          <Link to="/lessons" className="btn btn-primary btn-lg">Je révise mon code</Link>
        </div>
        <div className="fig"><span className="taglbl">📚 Révision</span><div className="stack">
          <div className="c2"><div className="ic g">🚦</div><div><h5>Priorités à droite</h5><p>Terminé · 20/20</p></div></div>
          <div className="c2"><div className="ic y">⚠️</div><div><h5>Signalisation</h5><p>En cours · 12/20</p></div></div>
          <div className="c2"><div className="ic r">🛡️</div><div><h5>Distances de sécurité</h5><p>À réviser</p></div></div>
        </div></div>
      </div></section>

      <section className="sec" id="examen"><div className="wrap feat rev">
        <div>
          <span className="eyebrow">L'examen</span>
          <h2>Réserve ta place en quelques clics.</h2>
          <p style={{ color: "var(--gris)", fontSize: 16 }}>Le centre le plus proche, un créneau qui t'arrange, et un rappel avant le jour J.</p>
          <ul>
            <li><i className="tick">✓</i> Centres à Dakar et Thiès (bientôt plus).</li>
            <li><i className="tick">✓</i> Créneaux et places en temps réel.</li>
            <li><i className="tick">✓</i> Rappel automatique avant l'examen.</li>
          </ul>
          <Link to="/booking" className="btn btn-primary btn-lg">Je réserve mon examen</Link>
        </div>
        <div className="fig"><span className="taglbl">📅 Réservation</span><div className="stack">
          <div className="c2" style={{ borderColor: "var(--vert)" }}><div className="ic g">📍</div><div><h5>Centre Dakar Plateau</h5><p>Dakar · Pièce d'identité</p></div></div>
          <div className="c2"><div className="ic y">🕕</div><div><h5>Lun. 13 juil. — 06:00</h5><p>Places : 8/20</p></div></div>
          <div className="c2"><div className="ic g">🕗</div><div><h5>Lun. 13 juil. — 08:00</h5><p>Places : 3/20</p></div></div>
        </div></div>
      </div></section>

      <section className="sec" id="tarifs" style={{ background: "var(--fond)" }}><div className="wrap">
        <div className="sec-head"><span className="eyebrow">Tarifs</span><h2>Des prix clairs, sans surprise.</h2><p className="p">Commence gratuitement, passe à l'offre complète quand tu es prêt.</p></div>
        <div className="plans">
          <div className="plan"><h3>Découverte</h3><div className="pr">Gratuit</div><div className="d">Pour tester et commencer à réviser.</div>
            <ul><li><i className="tick">✓</i> 3 leçons de code</li><li><i className="tick">✓</i> 1 examen blanc</li><li><i className="tick">✓</i> Connexion par SMS</li></ul>
            <Link to="/login" className="btn btn-ghost btn-block">Créer mon compte</Link></div>
          <div className="plan pop"><span className="bdg">Le plus choisi</span><h3>Code illimité</h3><div className="pr">5 000 <small>FCFA/mois</small></div><div className="d">Toutes les leçons et les séries.</div>
            <ul><li><i className="tick">✓</i> Toutes les leçons</li><li><i className="tick">✓</i> Examens blancs illimités</li><li><i className="tick">✓</i> Suivi de progression</li><li><i className="tick">✓</i> Support prioritaire</li></ul>
            <Link to="/login" className="btn btn-primary btn-block">Je m'abonne</Link></div>
          <div className="plan"><h3>Permis complet</h3><div className="pr">Sur devis</div><div className="d">Code + accompagnement jusqu'à l'examen.</div>
            <ul><li><i className="tick">✓</i> Tout Code illimité</li><li><i className="tick">✓</i> Réservation incluse</li><li><i className="tick">✓</i> Accompagnement perso</li></ul>
            <Link to="/login" className="btn btn-ghost btn-block">Être rappelé</Link></div>
        </div>
        <p className="ex">Tarifs donnés à titre d'exemple — à ajuster selon ton offre réelle.</p>
      </div></section>

      <section className="sec"><div className="wrap">
        <div className="sec-head"><span className="eyebrow">Ils nous font confiance</span><h2>Les premiers avis de nos élèves.</h2></div>
        <div className="tc">
          <div className="tcard"><div className="stars">★★★★★</div><p>« J'ai révisé le code dans le bus, entre deux cours. Bien plus pratique que les fascicules. »</p><div className="who"><div className="av">AF</div><div><b>Awa F.</b><span>Dakar</span></div></div></div>
          <div className="tcard"><div className="stars">★★★★★</div><p>« La connexion par SMS c'est top, pas de mot de passe oublié. Les examens blancs aident vraiment. »</p><div className="who"><div className="av">MS</div><div><b>Moussa S.</b><span>Thiès</span></div></div></div>
          <div className="tcard"><div className="stars">★★★★★</div><p>« J'ai réservé mon examen en 2 minutes depuis mon téléphone. Simple et clair. »</p><div className="who"><div className="av">FN</div><div><b>Fatou N.</b><span>Dakar</span></div></div></div>
        </div>
        <p className="ex">Témoignages d'illustration — à remplacer par de vrais avis.</p>
      </div></section>

      <section className="sec" id="faq" style={{ background: "var(--fond)" }}><div className="wrap">
        <div className="sec-head"><span className="eyebrow">Aide</span><h2>Vos questions, nos réponses.</h2></div>
        <div className="faq">
          <details><summary>Comment je me connecte à Codéna ?</summary><div className="a">Tu entres ton numéro de téléphone, on t'envoie un code par SMS que tu saisis. Aucun mot de passe à créer.</div></details>
          <details><summary>Les cours sont-ils conformes à l'examen sénégalais ?</summary><div className="a">Oui, les leçons et les questions sont alignées sur le programme et le format de l'examen au Sénégal.</div></details>
          <details><summary>Où puis-je passer l'examen ?</summary><div className="a">À Dakar et à Thiès pour l'instant, avec d'autres villes bientôt. Tu réserves ton créneau dans l'app.</div></details>
          <details><summary>Faut-il un ordinateur ?</summary><div className="a">Non, tout fonctionne sur ton téléphone. Codéna est pensé mobile d'abord.</div></details>
        </div>
      </div></section>

      <section className="sec"><div className="wrap"><div className="cta">
        <h2>Prêt à décrocher ton permis ?</h2>
        <p>Crée ton compte en 30 secondes et commence à réviser dès aujourd'hui.</p>
        <Link to="/login" className="btn btn-jaune btn-lg">Commencer gratuitement</Link>
      </div></div></section>
    </div>
  );
}
