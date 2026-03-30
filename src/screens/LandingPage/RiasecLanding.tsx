import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";


const tickerItems = [
  { label: "180", text: "situations" },
  { label: "6", text: "types RIASEC" },
  { label: "Intelligence", text: "comportementale" },
  { label: null, text: "Glisser pour répondre" },
  { label: null, text: "Zéro questionnaire" },
  { label: "Profil", text: "en quelques minutes" },
  { label: null, text: "Résultats détaillés" },
  { label: null, text: "100% gratuit" },
];

const heroCards = [
  {
    className: "card-r",
    chipStyle: { background: "#FF6B3522", color: "#FF6B35" },
    chipLabel: "R · Réaliste",
    title: "Mécanique Automobile",
    sub: "Démonter et réparer un moteur",
  },
  {
    className: "card-i",
    chipStyle: { background: "#3B82F622", color: "#3B82F6" },
    chipLabel: "I · Investigateur",
    title: "Intelligence Artificielle",
    sub: "Entraîner un modèle d'IA",
  },
  {
    className: "card-a",
    chipStyle: { background: "#A855F722", color: "#A855F7" },
    chipLabel: "A · Artistique",
    title: "Direction Créative",
    sub: "Concevoir une identité visuelle",
  },
];

const howSteps = [
  {
    num: "01",
    iconStyle: { background: "#FF6B3512", borderColor: "#FF6B3530" },
    icon: "🃏",
    title: "Tu vois une carte",
    desc: "Chaque carte montre une situation professionnelle réelle — photographiée, mise en scène. Pas de texte aride.",
  },
  {
    num: "02",
    iconStyle: { background: "#A855F712", borderColor: "#A855F730" },
    icon: "👆",
    title: "Tu swipes instinctivement",
    desc: "Glisse à droite si ça t'attire, à gauche sinon. Pas besoin de réfléchir — c'est ta réaction qui compte.",
  },
  {
    num: "03",
    iconStyle: { background: "#3B82F612", borderColor: "#3B82F630" },
    icon: "🧠",
    title: "L'IA analyse ton comportement",
    desc: "Vitesse, hésitations, retours en arrière — chaque geste révèle quelque chose. Pas seulement tes clics.",
  },
  {
    num: "04",
    iconStyle: { background: "#10B98112", borderColor: "#10B98130" },
    icon: "✦",
    title: "Ton profil apparaît",
    desc: "Un code RIASEC à 3 lettres, un radar, des insights comportementaux. Tout ce qu'il faut pour te connaître.",
  },
];

const riasecTypes = [
  { letter: "R", name: "Réaliste", desc: "Outils, machines, nature. Concret et manuel.", color: "#FF6B35" },
  { letter: "I", name: "Investigateur", desc: "Analyse, recherche, science. Curieux et méthodique.", color: "#3B82F6" },
  { letter: "A", name: "Artistique", desc: "Créer, exprimer, imaginer. Libre et original.", color: "#A855F7" },
  { letter: "S", name: "Social", desc: "Aider, soigner, enseigner. Empathique et généreux.", color: "#10B981" },
  { letter: "E", name: "Entreprenant", desc: "Diriger, convaincre, vendre. Ambitieux et leader.", color: "#EF4444" },
  { letter: "C", name: "Conventionnel", desc: "Organiser, structurer, gérer. Précis et rigoureux.", color: "#F59E0B" },
];

const features = [
  { icon: "⏱", title: "Temps de décision", desc: "Chaque milliseconde compte. Décider en 0,3s ou 8s révèle ton rapport à l'ambiguïté et ta confiance en toi.", tag: "Mesure comportementale" },
  { icon: "↔️", title: "Hésitations et revirements", desc: "Draguer à droite, revenir, recommencer — tes hésitations cartographient tes zones de doute professionnel.", tag: "Analyse des patterns" },
  { icon: "🔋", title: "Check-in énergétique", desc: "On mesure ta fatigue en cours de route pour pondérer correctement tes réponses de fin de session.", tag: "Fiabilité accrue" },
  { icon: "🎯", title: "Style de décision", desc: "Intuitif, réflexif ou équilibré — ton profil comportemental complète ton profil RIASEC pour une image complète.", tag: "Méta-insight" },
  { icon: "📊", title: "Radar de personnalité", desc: "Visualise tes 6 dimensions simultanément. Vois d'un coup d'œil tes forces, tes zones d'ombre, ton équilibre.", tag: "Visualisation" },
  { icon: "💯", title: "Score de fiabilité", desc: "On calcule à quel point ton profil est stable et cohérent — pour que tu saches si tu peux lui faire confiance.", tag: "Métrique de confiance" },
];

const resultBars = [
  { letter: "A", color: "#A855F7", width: "82%", val: "25/30" },
  { letter: "I", color: "#3B82F6", width: "70%", val: "21/30" },
  { letter: "S", color: "#10B981", width: "60%", val: "18/30" },
  { letter: "E", color: "#EF4444", width: "37%", val: "11/30" },
  { letter: "R", color: "#FF6B35", width: "27%", val: "8/30" },
  { letter: "C", color: "#F59E0B", width: "17%", val: "5/30" },
];

export default function RiasecLanding() {
  // const orbARef = useRef(null);
  // const orbBRef = useRef(null);
  const orbARef = useRef<HTMLDivElement | null>(null);
  const orbBRef = useRef<HTMLDivElement | null>(null);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Parallax orbs on mouse
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     const x = (e.clientX / window.innerWidth - 0.5) * 30;
  //     const y = (e.clientY / window.innerHeight - 0.5) * 30;
  //     if (orbARef.current) orbARef.current.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  //     if (orbBRef.current) orbBRef.current.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
  //   };
  //   window.addEventListener("mousemove", handleMouseMove, { passive: true });
  //   return () => window.removeEventListener("mousemove", handleMouseMove);
  // }, []);
    useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      if (orbARef.current) {
        orbARef.current.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
      }

      if (orbBRef.current) {
        orbBRef.current.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  // Nav highlight on scroll
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollY = window.scrollY;
  //     document.querySelectorAll("section[id]").forEach((sec) => {
  //       const top = sec.offsetTop - 100;
  //       const bot = top + sec.offsetHeight;
  //       const id = sec.getAttribute("id");
  //       if (scrollY >= top && scrollY < bot) {
  //         document.querySelectorAll(".nav-link").forEach((l) => {
  //           l.style.color = l.getAttribute("data-href") === `#${id}` ? "var(--txt)" : "";
  //         });
  //       }
  //     });
  //   };
  //   window.addEventListener("scroll", handleScroll, { passive: true });
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  useEffect(() => {
  const handleScroll = () => {
    const scrollY = window.scrollY;

    document.querySelectorAll<HTMLElement>("section[id]").forEach((sec) => {
      const top = sec.offsetTop - 100;
      const bot = top + sec.offsetHeight;
      const id = sec.id; // ✅ safer than getAttribute

      if (scrollY >= top && scrollY < bot) {
        document.querySelectorAll<HTMLElement>(".nav-link").forEach((l) => {
          l.style.color =
            l.getAttribute("data-href") === `#${id}` ? "var(--txt)" : "";
        });
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // const scrollTo = (id) => {
  //   document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  // };
  const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

  return (
    <>
      <style>{`
        :root
		{
			--bg: #06060E;
			--bg2: #0C0C1A;
			--txt: #EEEBf8;
			--txt2: rgba(238, 235, 248, 0.45);
			--txt3: rgba(238, 235, 248, 0.18);
			--R: #FF6B35;
			--I: #3B82F6;
			--A: #A855F7;
			--S: #10B981;
			--E: #EF4444;
			--C: #F59E0B;
			--border: rgba(255, 255, 255, 0.07);
			--border2: rgba(255, 255, 255, 0.13);
			--ease: cubic-bezier(0.22,1,0.36,1);
			--spring: cubic-bezier(0.34,1.56,0.64,1);
		}

		*,
		*::before,
		*::after {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
		}

		html {
			scroll-behavior: smooth;
		}

		body {
			background: var(--bg);
			color: var(--txt);
			font-family: 'DM Sans', sans-serif;
			overflow-x: hidden;
			cursor: default;
		}

		/* ── NOISE TEXTURE ── */
		body::before {
			content: '';
			position: fixed;
			inset: 0;
			z-index: 0;
			background-image: url("data:image/svg+xml, %3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
			background-size: 200px 200px;
			opacity: .028;
			pointer-events: none;
		}

		/* ═══════════════════════════════════
   NAV
   ═══════════════════════════════════ */
		nav {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20px 40px;
			backdrop-filter: blur(24px);
			background: rgba(6, 6, 14, 0.7);
			border-bottom: 1px solid var(--border);
			animation: fadeDown 0.8s var(--ease) both;
		}
		@keyframes fadeDown {
			from {
				opacity: 0;
				transform: translateY(-12px);
			}
			to {
				opacity: 1;
				transform: none;
			}
		}

		.nav-logo {
			font-family: 'Syne', sans-serif;
			font-size: 0.72rem;
			font-weight: 800;
			letter-spacing: 0.28em;
			text-transform: uppercase;
			color: var(--txt2);
		}

		.nav-right {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		.nav-link {
			font-size: 0.76rem;
			color: var(--txt2);
			text-decoration: none;
			padding: 6px 14px;
			transition: color 0.2s;
		}
		.nav-link:hover {
			color: var(--txt);
		}

		.nav-cta {
			font-family: 'Syne', sans-serif;
			font-size: 0.72rem;
			font-weight: 700;
			letter-spacing: 0.06em;
			background: var(--txt);
			color: var(--bg);
			padding: 9px 20px;
			border-radius: 100px;
			text-decoration: none;
			transition: transform 0.2s var(--spring), box-shadow 0.2s;
		}
		.nav-cta:hover {
			transform: scale(1.04);
			box-shadow: 0 0 28px rgba(238, 235, 248, 0.18);
		}

		/* ═══════════════════════════════════
   HERO
   ═══════════════════════════════════ */
		.hero {
			min-height: 100vh;
			display: flex;
			align-items: center;
			padding: 120px 60px 80px;
			position: relative;
			overflow: hidden;
			max-width: 1200px;
			margin: 0 auto;
			gap: 60px;
		}
		.hero-text {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
		@media(max-width: 800px) {
			.hero {
				flex-direction: column;
				text-align: center;
				padding: 120px 24px 60px;
			}
			.hero-text {
				align-items: center;
			}
			.hero-eyebrow {
				align-self: center;
			}
		}

		/* Gradient orbs */
		.orb {
			position: absolute;
			border-radius: 50%;
			pointer-events: none;
			will-change: transform;
		}
		.orb-a {
			width: 700px;
			height: 700px;
			background: radial-gradient(circle, #A855F722 0%, transparent 70%);
			top: -200px;
			left: -200px;
			animation: drift1 18s ease-in-out infinite alternate;
		}
		.orb-b {
			width: 600px;
			height: 600px;
			background: radial-gradient(circle, #3B82F618 0%, transparent 70%);
			bottom: -150px;
			right: -150px;
			animation: drift2 22s ease-in-out infinite alternate;
		}
		.orb-c {
			width: 400px;
			height: 400px;
			background: radial-gradient(circle, #FF6B3514 0%, transparent 70%);
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
			animation: pulse 8s ease-in-out infinite;
		}
		@keyframes drift1 {
			from {
				transform: translate(0, 0) rotate(0deg);
			}
			to {
				transform: translate(80px, 60px) rotate(15deg);
			}
		}
		@keyframes drift2 {
			from {
				transform: translate(0, 0);
			}
			to {
				transform: translate(-60px, -80px);
			}
		}
		@keyframes pulse {
			0%,
			100% {
				opacity: .6;
				transform: translate(-50%, -50%) scale(1);
			}
			50% {
				opacity: 1;
				transform: translate(-50%, -50%) scale(1.15);
			}
		}

		/* Hero eyebrow */
		.hero-eyebrow {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			background: rgba(255, 255, 255, 0.05);
			border: 1px solid var(--border2);
			border-radius: 100px;
			padding: 6px 16px;
			margin-bottom: 32px;
			font-size: 0.68rem;
			font-weight: 500;
			letter-spacing: 0.09em;
			text-transform: uppercase;
			color: var(--txt2);
			animation: fadeUp 0.9s 0.15s var(--ease) both;
		}
		.eyebrow-dot {
			width: 5px;
			height: 5px;
			border-radius: 50%;
			background: var(--A);
			animation: blink 2s ease-in-out infinite;
		}
		@keyframes blink {
			0%,
			100% {
				opacity: 1
			}
			50% {
				opacity: .3
			}
		}

		.hero-title {
			font-family: 'DM Sans', sans-serif;
			font-size: clamp(2.6rem, 5.5vw, 4.8rem);
			font-weight: 400;
			line-height: 1.12;
			letter-spacing: -0.02em;
			margin-bottom: 28px;
			animation: fadeUp 1s 0.25s var(--ease) both;
		}
		.hero-title em {
			font-style: normal;
		}
		.word-swipe {
			display: inline-block;
			position: relative;
		}
		.word-swipe::after {
			content: '';
			position: absolute;
			bottom: 4px;
			left: 0;
			right: 0;
			height: 3px;
			background: linear-gradient(90deg, var(--A), var(--I));
			border-radius: 2px;
			transform: scaleX(0);
			transform-origin: left;
			animation: underlineIn 0.8s 0.9s var(--ease) forwards;
		}
		@keyframes underlineIn {
			to {
				transform: scaleX(1);
			}
		}

		.hero-sub {
			font-size: clamp(0.9rem, 1.5vw, 1.05rem);
			font-weight: 300;
			color: var(--txt2);
			line-height: 1.75;
			max-width: 480px;
			margin-bottom: 40px;
			animation: fadeUp 1s 0.35s var(--ease) both;
		}

		.hero-btns {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: wrap;
			animation: fadeUp 1s 0.45s var(--ease) both;
		}

		.btn-primary {
			font-family: 'Syne', sans-serif;
			font-size: 0.84rem;
			font-weight: 700;
			letter-spacing: 0.05em;
			background: var(--txt);
			color: var(--bg);
			padding: 15px 32px;
			border-radius: 100px;
			text-decoration: none;
			display: inline-flex;
			align-items: center;
			gap: 8px;
			transition: transform 0.25s var(--spring), box-shadow 0.25s;
			box-shadow: 0 0 0 0 rgba(238, 235, 248, 0);
		}
		.btn-primary:hover {
			transform: scale(1.05) translateY(-2px);
			box-shadow: 0 12px 40px rgba(238, 235, 248, 0.15);
		}
		.btn-primary .arrow {
			display: inline-block;
			transition: transform 0.25s var(--spring);
		}
		.btn-primary:hover .arrow {
			transform: translateX(4px);
		}

		.btn-ghost {
			font-size: 0.84rem;
			font-weight: 400;
			color: var(--txt2);
			padding: 15px 24px;
			border-radius: 100px;
			text-decoration: none;
			border: 1px solid var(--border2);
			display: inline-flex;
			align-items: center;
			gap: 8px;
			transition: color 0.2s, border-color 0.2s, background 0.2s;
		}
		.btn-ghost:hover {
			color: var(--txt);
			border-color: rgba(255, 255, 255, 0.22);
			background: rgba(255, 255, 255, 0.04);
		}

		@keyframes fadeUp {
			from {
				opacity: 0;
				transform: translateY(18px);
			}
			to {
				opacity: 1;
				transform: none;
			}
		}

		/* ── CARD PREVIEW STACK ── */
		.hero-cards {
			position: relative;
			flex-shrink: 0;
			width: 300px;
			height: 420px;
			animation: fadeUp 1.1s 0.6s var(--ease) both;
		}
		.h-card {
			position: absolute;
			left: 50%;
			top: 0;
			width: 260px;
			height: 380px;
			border-radius: 20px;
			overflow: hidden;
			transform-origin: bottom center;
			border: 1px solid rgba(255, 255, 255, 0.1);
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
			min-height: 300px; /* adjust to match your design */
		}

		.h-card:nth-child(1) {
			transform: translateX(-50%) rotate(-7deg) translateY(12px);
			z-index: 1;
			animation: floatCard1 6s ease-in-out infinite;
		}
		.h-card:nth-child(2) {
			transform: translateX(-50%) rotate(3deg) translateY(6px);
			z-index: 2;
			animation: floatCard2 6s ease-in-out infinite;
		}
		.h-card:nth-child(3) {
			transform: translateX(-50%) rotate(-1deg);
			z-index: 3;
			animation: floatCard3 6s ease-in-out infinite;
		}
		@keyframes floatCard1 {
			0%,
			100% {
				transform: translateX(-50%) rotate(-7deg) translateY(12px);
			}
			50% {
				transform: translateX(-50%) rotate(-6deg) translateY(8px);
			}
		}
		@keyframes floatCard2 {
			0%,
			100% {
				transform: translateX(-50%) rotate(3deg) translateY(6px);
			}
			50% {
				transform: translateX(-50%) rotate(4deg) translateY(2px);
			}
		}
		@keyframes floatCard3 {
			0%,
			100% {
				transform: translateX(-50%) rotate(-1deg) translateY(0);
			}
			50% {
				transform: translateX(-50%) rotate(0deg) translateY(-4px);
			}
		}

		.h-card-inner {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			padding: 18px 16px;
			position:relative;z-index:1;
		}
		.h-card-chip {
			font-size: 0.55rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			padding: 3px 9px;
			border-radius: 100px;
			display: inline-block;
			margin-bottom: 8px;
			width: fit-content;
		}
		.h-card-title {
			font-family: 'Syne', sans-serif;
			font-size: 0.96rem;
			font-weight: 700;
			color: #fff;
			line-height: 1.25;
		}
		.h-card-sub {
			font-size: 0.68rem;
			color: rgba(255, 255, 255, 0.45);
			margin-top: 3px;
		}
		.h-card-bg{
			position: absolute; inset: 0;
			background: linear-gradient(to top, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.15) 100%);
			z-index: 0;
		}
		/* ─ Card visuals ─ */
		/* ─ Card visuals ─ */
		.card-r {
			background: url('src/assets/riasec_images/q001_R.jpg') center/cover no-repeat;
		}
		.card-i {
			background: url('src/assets/riasec_images/q002_R.jpg') center/cover no-repeat;
		}
		.card-a {
			background: url('src/assets/riasec_images/q003_R.jpg') center/cover no-repeat;
		}

		/* ═══════════════════════════════════
   SOCIAL PROOF TICKER
   ═══════════════════════════════════ */
		.ticker-wrap {
			overflow: hidden;
			border-top: 1px solid var(--border);
			border-bottom: 1px solid var(--border);
			padding: 14px 0;
			background: rgba(255, 255, 255, 0.018);
		}
		.ticker-track {
			display: flex;
			gap: 0;
			animation: ticker 28s linear infinite;
			width: max-content;
		}
		@keyframes ticker {
			from {
				transform: translateX(0)
			}
			to {
				transform: translateX(-50%)
			}
		}
		.ticker-item {
			display: inline-flex;
			align-items: center;
			gap: 8px;
			padding: 0 40px;
			white-space: nowrap;
			font-size: 0.72rem;
			color: var(--txt3);
			letter-spacing: 0.05em;
		}
		.ticker-item strong {
			color: var(--txt2);
			font-weight: 500;
		}
		.tick-sep {
			color: var(--txt3);
			font-size: 0.6rem;
		}

		/* ═══════════════════════════════════
   SECTION CONTAINER
   ═══════════════════════════════════ */
		.section {
			max-width: 1100px;
			margin: 0 auto;
			padding: 100px 24px;
			position: relative;
			z-index: 1;
		}

		.sec-label {
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.2em;
			text-transform: uppercase;
			color: var(--txt3);
			margin-bottom: 18px;
		}
		.sec-title {
			font-family: 'DM Sans', sans-serif;
			font-size: clamp(1.9rem, 4vw, 3rem);
			font-weight: 400;
			line-height: 1.1;
			letter-spacing: -0.02em;
			margin-bottom: 20px;
		}
		.sec-sub {
			font-size: 1rem;
			color: var(--txt2);
			line-height: 1.8;
			font-weight: 300;
			max-width: 500px;
		}

		/* ═══════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════ */
		.how-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
			gap: 2px;
			margin-top: 56px;
			border: 1px solid var(--border);
			border-radius: 24px;
			overflow: hidden;
		}
		.how-card {
			padding: 36px 32px;
			background: rgba(255, 255, 255, 0.025);
			border-right: 1px solid var(--border);
			transition: background 0.3s;
			position: relative;
			overflow: hidden;
		}
		.how-card:last-child {
			border-right: none;
		}
		.how-card::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(ellipse at 30% 20%, currentColor, transparent 65%);
			opacity: 0;
			transition: opacity 0.4s;
		}
		.how-card:hover::before {
			opacity: .035;
		}
		.how-card:hover {
			background: rgba(255, 255, 255, 0.04);
		}

		.how-num {
			font-family: 'Syne', sans-serif;
			font-size: 3.5rem;
			font-weight: 800;
			line-height: 1;
			opacity: .08;
			margin-bottom: 16px;
		}
		.how-icon {
			width: 42px;
			height: 42px;
			border-radius: 12px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 1.3rem;
			margin-bottom: 20px;
			border: 1px solid rgba(255, 255, 255, 0.08);
		}
		.how-h {
			font-family: 'Syne', sans-serif;
			font-size: 1.05rem;
			font-weight: 700;
			margin-bottom: 10px;
		}
		.how-p {
			font-size: 0.82rem;
			color: var(--txt2);
			line-height: 1.7;
			font-weight: 300;
		}

		/* ═══════════════════════════════════
   RIASEC TYPES
   ═══════════════════════════════════ */
		.types-section {
			padding: 100px 24px;
			position: relative;
			z-index: 1;
		}
		.types-inner {
			max-width: 1100px;
			margin: 0 auto;
		}

		.types-grid {
			display: grid;
			grid-template-columns: repeat(6, 1fr);
			gap: 10px;
			margin-top: 52px;
		}
		@media(max-width: 900px) {
			.types-grid {
				grid-template-columns: repeat(3, 1fr);
			}
		}
		@media(max-width: 500px) {
			.types-grid {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.type-card {
			border-radius: 20px;
			padding: 28px 20px 24px;
			border: 1px solid rgba(255, 255, 255, 0.06);
			cursor: default;
			position: relative;
			overflow: hidden;
			transition: transform 0.3s var(--spring), box-shadow 0.3s, border-color 0.3s;
		}
		.type-card:hover {
			transform: translateY(-6px) scale(1.01);
		}
		.type-card::after {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(ellipse at 50% 0%, currentColor, transparent 70%);
			opacity: 0;
			transition: opacity 0.4s;
		}
		.type-card:hover::after {
			opacity: .08;
		}

		.tc-letter {
			font-family: 'Syne', sans-serif;
			font-size: 2.4rem;
			font-weight: 800;
			line-height: 1;
			margin-bottom: 10px;
		}
		.tc-name {
			font-size: 0.7rem;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			margin-bottom: 10px;
			opacity: .6;
		}
		.tc-desc {
			font-size: 0.74rem;
			color: var(--txt2);
			line-height: 1.65;
		}

		.tc-bar {
			height: 2px;
			border-radius: 2px;
			margin-top: 20px;
			opacity: .3;
			transition: opacity 0.3s;
		}
		.type-card:hover .tc-bar {
			opacity: .7;
		}

		/* ═══════════════════════════════════
   FEATURE SPLIT
   ═══════════════════════════════════ */
		.split {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 60px;
			align-items: center;
			margin-top: 0;
		}
		@media(max-width: 700px) {
			.split {
				grid-template-columns: 1fr;
			}
		}

		.split-visual {
			position: relative;
			height: 380px;
		}
		.split-phone {
			width: 200px;
			height: 360px;
			border-radius: 32px;
			border: 1.5px solid rgba(255, 255, 255, 0.12);
			background: var(--bg2);
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
			overflow: hidden;
		}
		.sp-inner {
			padding: 24px 16px;
			height: 100%;
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
		.sp-bar {
			height: 2px;
			border-radius: 2px;
			margin-bottom: 6px;
		}
		.sp-mini-card {
			flex: 1;
			border-radius: 16px;
			padding: 16px;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			position: relative;
			overflow: hidden;
		}
		.sp-chip {
			font-size: 0.52rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			padding: 3px 8px;
			border-radius: 100px;
			width: fit-content;
			margin-bottom: 6px;
		}
		.sp-mtitle {
			font-family: 'Syne', sans-serif;
			font-size: 0.88rem;
			font-weight: 700;
			color: #fff;
		}
		.sp-msub {
			font-size: 0.64rem;
			color: rgba(255, 255, 255, 0.4);
			margin-top: 3px;
		}

		.sp-actions {
			display: flex;
			justify-content: center;
			gap: 10px;
			padding: 0 8px;
		}
		.sp-btn {
			border-radius: 50%;
			border: 1.5px solid;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.9rem;
		}
		.sp-pass {
			width: 42px;
			height: 42px;
			border-color: rgba(248, 113, 113, 0.3);
			color: #f87171;
		}
		.sp-like {
			width: 52px;
			height: 52px;
			border-color: rgba(74, 222, 128, 0.3);
			color: #4ade80;
			background: rgba(74, 222, 128, 0.05);
		}

		/* Floating labels */
		.float-label {
			position: absolute;
			background: rgba(12, 12, 26, 0.92);
			border: 1px solid var(--border2);
			border-radius: 12px;
			padding: 10px 14px;
			font-size: 0.7rem;
			white-space: nowrap;
			box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		}
		.fl-right {
			right: -10px;
			top: 80px;
			animation: floatY 4s ease-in-out infinite;
		}
		.fl-left {
			left: -10px;
			bottom: 100px;
			animation: floatY 4s 1.5s ease-in-out infinite;
		}
		@keyframes floatY {
			0%,
			100% {
				transform: translateY(0);
			}
			50% {
				transform: translateY(-8px);
			}
		}
		.fl-emoji {
			font-size: 1rem;
		}
		.fl-title {
			font-weight: 600;
			color: var(--txt);
			margin-top: 1px;
		}
		.fl-sub {
			color: var(--txt3);
			font-size: 0.64rem;
		}

		/* ═══════════════════════════════════
   BEHAVIORAL FEATURES
   ═══════════════════════════════════ */
		.features-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
			gap: 12px;
			margin-top: 52px;
		}
		.feat-card {
			background: rgba(255, 255, 255, 0.025);
			border: 1px solid var(--border);
			border-radius: 20px;
			padding: 28px 26px;
			transition: background 0.3s, border-color 0.3s, transform 0.3s var(--spring);
			position: relative;
			overflow: hidden;
		}
		.feat-card:hover {
			background: rgba(255, 255, 255, 0.04);
			border-color: var(--border2);
			transform: translateY(-3px);
		}
		.feat-icon {
			font-size: 1.5rem;
			margin-bottom: 16px;
			display: block;
		}
		.feat-h {
			font-family: 'Syne', sans-serif;
			font-size: 0.96rem;
			font-weight: 700;
			margin-bottom: 8px;
		}
		.feat-p {
			font-size: 0.8rem;
			color: var(--txt2);
			line-height: 1.7;
			font-weight: 300;
		}
		.feat-tag {
			display: inline-block;
			margin-top: 14px;
			font-size: 0.6rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			padding: 4px 10px;
			border-radius: 100px;
			background: rgba(255, 255, 255, 0.06);
			color: var(--txt3);
		}

		/* ═══════════════════════════════════
   RESULTS PREVIEW
   ═══════════════════════════════════ */
		.res-preview {
			max-width: 600px;
			margin: 52px auto 0;
			background: rgba(255, 255, 255, 0.03);
			border: 1px solid var(--border);
			border-radius: 24px;
			overflow: hidden;
		}
		.rp-top {
			padding: 36px;
			text-align: center;
			border-bottom: 1px solid var(--border);
		}
		.rp-code {
			font-family: 'Syne', sans-serif;
			font-size: 4rem;
			font-weight: 800;
			letter-spacing: 0.25em;
			line-height: 1;
			margin-bottom: 8px;
		}
		.rp-sub {
			font-size: 0.78rem;
			color: var(--txt2);
		}
		.rp-bars {
			padding: 24px 36px;
		}
		.rp-bar-row {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 12px;
		}
		.rp-ltr {
			font-size: 0.78rem;
			font-weight: 700;
			min-width: 12px;
		}
		.rp-track {
			flex: 1;
			height: 8px;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 4px;
			overflow: hidden;
		}
		.rp-fill {
			height: 100%;
			border-radius: 4px;
		}
		.rp-val {
			font-size: 0.66rem;
			color: var(--txt3);
			min-width: 36px;
			text-align: right;
		}

		/* ═══════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════ */
		.cta-section {
			max-width: 1100px;
			margin: 0 auto;
			padding: 40px 24px 120px;
			position: relative;
			z-index: 1;
		}
		.cta-box {
			border-radius: 28px;
			padding: 72px 48px;
			text-align: center;
			position: relative;
			overflow: hidden;
			background: radial-gradient(ellipse at 50% -20%, rgba(168,85,247,.12), transparent 60%), radial-gradient(ellipse at 80% 120%, rgba(59, 130, 246, 0.09), transparent 60%), rgba(255, 255, 255, 0.025);
			border: 1px solid rgba(255, 255, 255, 0.1);
		}
		.cta-box::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg, rgba(168,85,247,.03), transparent 50%, rgba(59,130,246,.03));
			pointer-events: none;
		}
		.cta-eyebrow {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			font-size: 0.65rem;
			font-weight: 700;
			letter-spacing: 0.14em;
			text-transform: uppercase;
			color: var(--txt3);
			margin-bottom: 22px;
		}
		.cta-title {
			font-family: 'DM Sans', sans-serif;
			font-size: clamp(2rem, 5vw, 3.4rem);
			font-weight: 400;
			letter-spacing: -0.02em;
			line-height: 1.1;
			margin-bottom: 18px;
		}
		.cta-sub {
			font-size: 0.96rem;
			color: var(--txt2);
			font-weight: 300;
			max-width: 420px;
			margin: 0 auto 38px;
			line-height: 1.75;
		}
		.cta-meta {
			font-size: 0.68rem;
			color: var(--txt3);
			margin-top: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 14px;
		}
		.cta-meta-dot {
			width: 3px;
			height: 3px;
			border-radius: 50%;
			background: var(--txt3);
		}

		/* ═══════════════════════════════════
   FOOTER
   ═══════════════════════════════════ */
		footer {
			border-top: 1px solid var(--border);
			padding: 28px 40px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			z-index: 1;
		}
		@media(max-width: 600px) {
			footer {
				flex-direction: column;
				gap: 14px;
				text-align: center;
			}
		}
		.footer-logo {
			font-family: 'Syne', sans-serif;
			font-size: 0.68rem;
			font-weight: 800;
			letter-spacing: 0.22em;
			text-transform: uppercase;
			color: var(--txt3);
		}
		.footer-links {
			display: flex;
			gap: 24px;
		}
		.footer-link {
			font-size: 0.72rem;
			color: var(--txt3);
			text-decoration: none;
			transition: color 0.2s;
		}
		.footer-link:hover {
			color: var(--txt2);
		}
		.footer-copy {
			font-size: 0.68rem;
			color: var(--txt3);
		}

		/* ═══════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════ */
		.reveal {
			opacity: 0;
			transform: translateY(24px);
			transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
		}
		.reveal.in {
			opacity: 1;
			transform: none;
		}
		.reveal-d1 {
			transition-delay: 0.1s;
		}
		.reveal-d2 {
			transition-delay: 0.2s;
		}
		.reveal-d3 {
			transition-delay: 0.3s;
		}
		.reveal-d4 {
			transition-delay: 0.4s;
		}

      `}</style>
      {/* ── NAV ── */}
      <nav >
        <div className="nav-logo">RIASEC · AI</div>
        <div className="nav-right">
          <span className="nav-link" data-href="#how" onClick={() => scrollTo("how")}>Comment ça marche</span>
          <span className="nav-link" data-href="#types" onClick={() => scrollTo("types")}>Les 6 types</span>
          {/* <a href="./index.html" className="nav-cta">Commencer →</a> */}
          <Link to="/index"  className="nav-cta" >Commencer →</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="orb orb-a" ref={orbARef} />
        <div className="orb orb-b" ref={orbBRef} />
        <div className="orb orb-c" />

        <div className="hero-text">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Test RIASEC · 180 situations · Intelligence comportementale
          </div>

          <h1 className="hero-title">
            <span className="word-swipe">Swipe</span>
            <br />
            <em>ton</em> Avenir
          </h1>

          <p className="hero-sub">
            180 situations professionnelles. Un glisser de doigt.
            Découvre ton profil de personnalité en quelques minutes — sans questions, juste des images.
          </p>

          <div className="hero-btns">
            {/* <a href="./index.html" className="btn-primary">
              Découvrir mon profil <span className="arrow">→</span>
            </a> */}
             <Link to="/index" className="btn-primary">
             Découvrir mon profil <span className="arrow">→</span>
             </Link>
            <span className="btn-ghost" onClick={() => scrollTo("how")}>
              ▷ Comment ça marche
            </span>
          </div>
        </div>

        {/* Card Stack */}
        <div className="hero-cards">
          {heroCards.map((card, i) => (
            <div key={i} className={`h-card ${card.className}`}>
              <div className="h-card-bg" />
              <div className="h-card-inner">
                <div className="h-card-chip" style={card.chipStyle}>{card.chipLabel}</div>
                <div className="h-card-title">{card.title}</div>
                <div className="h-card-sub">{card.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div className="ticker-item" key={i}>
              {item.label && <strong>{item.label}</strong>}
              {item.text}
              <span className="tick-sep">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section" id="how">
        <div className="sec-label reveal">Fonctionnement</div>
        <h2 className="sec-title reveal reveal-d1">Aussi simple<br />qu'un swipe.</h2>
        <p className="sec-sub reveal reveal-d2">
          Pas de questions ambiguës. Pas de longues listes à cocher.
          Tu vois une image, tu swipes — et on fait le reste.
        </p>
        <div className="how-grid reveal reveal-d2">
          {howSteps.map((step) => (
            <div className="how-card" key={step.num}>
              <div className="how-num">{step.num}</div>
              <div className="how-icon" style={step.iconStyle}>{step.icon}</div>
              <div className="how-h">{step.title}</div>
              <div className="how-p">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 TYPES ── */}
      <section className="types-section" id="types">
        <div className="types-inner">
          <div className="sec-label reveal">Le modèle RIASEC</div>
          <h2 className="sec-title reveal reveal-d1">Six façons d'être<br />au monde.</h2>
          <p className="sec-sub reveal reveal-d2">
            Développé par John Holland, le modèle RIASEC identifie six grands profils d'intérêts professionnels.
            Chacun définit une façon naturelle d'interagir avec le travail.
          </p>
          <div className="types-grid">
            {riasecTypes.map((type, i) => (
              <div
                key={type.letter}
                className={`type-card reveal reveal-d${i % 4}`}
                style={{ background: `${type.color}08`, borderColor: `${type.color}20` }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = `${type.color}45`)}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = `${type.color}20`)}
              >
                <div className="tc-letter" style={{ color: type.color }}>{type.letter}</div>
                <div className="tc-name">{type.name}</div>
                <div className="tc-desc">{type.desc}</div>
                <div className="tc-bar" style={{ background: type.color, width: "100%" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEHAVIORAL FEATURES ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="sec-label reveal">Au-delà du questionnaire</div>
        <h2 className="sec-title reveal reveal-d1">Ce que ton comportement<br />dit de toi.</h2>
        <p className="sec-sub reveal reveal-d2">
          Contrairement aux tests classiques, on analyse comment tu décides,
          pas seulement ce que tu choisis.
        </p>
        <div className="features-grid">
          {features.map((feat, i) => (
            <div className={`feat-card reveal reveal-d${i % 4}`} key={feat.title}>
              <span className="feat-icon">{feat.icon}</span>
              <div className="feat-h">{feat.title}</div>
              <div className="feat-p">{feat.desc}</div>
              <span className="feat-tag">{feat.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESULTS PREVIEW ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div className="sec-label reveal" style={{ justifyContent: "center", display: "flex" }}>
            Exemple de résultats
          </div>
          <h2 className="sec-title reveal reveal-d1">Ton code, en clair.</h2>
          <p className="sec-sub reveal reveal-d2" style={{ margin: "0 auto" }}>
            À la fin des 180 cartes, un profil complet t'attend — avec des scores, des insights,
            et un code à 3 lettres qui te suit partout.
          </p>
        </div>
        <div className="res-preview reveal reveal-d2">
          <div className="rp-top">
            <div className="rp-code">
              <span style={{ color: "#A855F7" }}>A</span>
              <span style={{ color: "#3B82F6" }}>I</span>
              <span style={{ color: "#10B981" }}>S</span>
            </div>
            <div className="rp-sub">Artistique · Investigateur · Social</div>
          </div>
          <div className="rp-bars">
            {resultBars.map((bar) => (
              <div className="rp-bar-row" key={bar.letter}>
                <div className="rp-ltr" style={{ color: bar.color }}>{bar.letter}</div>
                <div className="rp-track">
                  <div className="rp-fill" style={{ background: bar.color, width: bar.width }} />
                </div>
                <div className="rp-val">{bar.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section">
        <div className="cta-box reveal">
          <div className="cta-eyebrow">✦ &nbsp; Gratuit · Immédiat · Sans inscription</div>
          <h2 className="cta-title">Prêt à te<br />découvrir ?</h2>
          <p className="cta-sub">
            180 situations. Quelques minutes.
            Un profil qui te ressemble vraiment.
          </p>
          {/* <a href="./index.html" className="btn-primary" style={{ fontSize: ".92rem", padding: "17px 40px" }}>
            Commencer maintenant <span className="arrow">→</span>
          </a> */}
          <Link to="/index" className="btn-primary" style={{ fontSize: ".92rem", padding: "17px 40px" }}>
          Commencer maintenant <span className="arrow">→</span>
          </Link>
          <div className="cta-meta">
            <span>180 situations</span>
            <span className="cta-meta-dot" />
            <span>≈ 8 minutes</span>
            <span className="cta-meta-dot" />
            <span>Résultats instantanés</span>
            <span className="cta-meta-dot" />
            <span>100% gratuit</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">RIASEC · AI</div>
        <div className="footer-links">
          <span className="footer-link" onClick={() => scrollTo("how")}>Fonctionnement</span>
          <span className="footer-link" onClick={() => scrollTo("types")}>Les 6 types</span>
          {/* <a href="./index.html" className="footer-link">Commencer</a> */}
          <Link to="/index" className="footer-link">Commencer</Link>
        </div>
        <div className="footer-copy">Basé sur le modèle RIASEC de John Holland</div>
      </footer>

    </>
  );
}