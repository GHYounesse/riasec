import { useEffect, useRef, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useState } from "react";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
// interface Question {
//   id: number;
//   t: keyof typeof T;
//   ti: string;
//   su: string;
//   prompt: string;
// }
type Question = {
  id: number;
  riasec_type: string;
  title: string;
  subtitle: string;
  prompt: string;
};
interface TypeInfo {
  n: string;
  c: string;
  d: string;
}

// interface HistoryEntry {
//   idx: number;
//   liked: boolean;
// }
interface HistoryEntry {
  idx:              number;
  liked:            boolean;
  view_duration_ms: number;  // NOUVEAU : durée réelle de vue (pause corrigée)
  created_at:       number;  // NOUVEAU : timestamp absolu pour base de données
}


interface DragState {
  sx:        number;
  cx:        number;
  pressure?: number;   // NOUVEAU : pression tactile (0–1), Android récents
  tiltX?:    number;   // NOUVEAU : angle stylet X
  tiltY?:    number;   // NOUVEAU : angle stylet Y
  dragStart?: number;  // NOUVEAU : performance.now() au début du drag
}
type Scores = Record<keyof typeof T, number>;

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────
const USE_LOCAL = true;
const LOCAL_DIR = "src/assets/riasec_images";
const STYLE_SUFFIX = ", professional photography, cinematic lighting, shallow depth of field, 8mm film grain";
const IMG_W = 480;
const IMG_H = 720;
const PRELOAD = 4;

function imgSrc(q: Question): string {
  if (USE_LOCAL) {
    const id = String(q.id).padStart(3, "0");
    return `${LOCAL_DIR}/q${id}_${q.riasec_type}.jpg`;
  }
  const seed = q.id * 137 + 42;
  const prompt = encodeURIComponent(q.prompt + STYLE_SUFFIX);
  return `https://image.pollinations.ai/prompt/${prompt}?width=${IMG_W}&height=${IMG_H}&seed=${seed}&nologo=true&enhance=true`;
}

function pollinationsSrc(q: Question): string {
  const seed = q.id * 137 + 42;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    q.prompt + STYLE_SUFFIX
  )}?width=${IMG_W}&height=${IMG_H}&seed=${seed}&nologo=true&enhance=true`;
}

// ─────────────────────────────────────────
// RIASEC TYPES
// ─────────────────────────────────────────
const T: Record<string, TypeInfo> = {
  R: { n: "Réaliste",      c: "#FF6B35", d: "Travailler avec ses mains, outils, machines, en plein air." },
  I: { n: "Investigateur", c: "#3B82F6", d: "Observer, analyser, chercher, résoudre des problèmes complexes." },
  A: { n: "Artistique",    c: "#A855F7", d: "Créer, exprimer, imaginer — arts, musique, design, écriture." },
  S: { n: "Social",        c: "#10B981", d: "Aider, enseigner, conseiller, soigner, accompagner les autres." },
  E: { n: "Entreprenant",  c: "#EF4444", d: "Diriger, convaincre, vendre, manager, prendre des initiatives." },
  C: { n: "Conventionnel", c: "#F59E0B", d: "Organiser, gérer des données, suivre des procédures avec rigueur." },
};

// ─────────────────────────────────────────
// 180 QUESTIONS — PASTE YOUR QS ARRAY HERE
// ─────────────────────────────────────────
// const QS: Question[] = [
// {
// id: 1,
// t: 'R',
// ti: 'Mécanique Automobile',
// su: 'Démonter et réparer un moteur de voiture',
// prompt: 'mechanic repairing car engine in garage, oil-covered hands, cinematic warm workshop lighting, photorealistic'
// },
// {
// id: 2,
// t: 'R',
// ti: 'Menuiserie',
// su: 'Fabriquer un meuble en bois de A à Z',
// prompt: 'skilled carpenter crafting wooden furniture, sawdust in air, warm workshop, photorealistic'
// },
// {
// id: 3,
// t: 'R',
// ti: 'Agriculture',
// su: 'Conduire un tracteur au lever du soleil',
// prompt: 'farmer driving tractor at golden sunrise, vast wheat fields, dust catching light, photorealistic'
// },
// {
// id: 4,
// t: 'R',
// ti: 'Soudure',
// su: 'Assembler des structures métalliques',
// prompt: 'welder in protective mask creating metal sparks, dramatic industrial lighting, photorealistic'
// }, {
// id: 5,
// t: 'R',
// ti: 'Maçonnerie',
// su: 'Construire un mur de briques',
// prompt: 'bricklayer building stone wall, construction site, morning light, callused hands, photorealistic'
// }, {
// id: 6,
// t: 'R',
// ti: 'Jardinage',
// su: 'Tailler des plantes dans un jardin luxuriant',
// prompt: 'professional landscaper pruning garden in full bloom, golden hour light, photorealistic'
// }, {
// id: 7,
// t: 'R',
// ti: 'Électricité',
// su: 'Câbler un panneau électrique',
// prompt: 'electrician wiring electrical panel with precision, focused concentration, photorealistic'
// }, {
// id: 8,
// t: 'R',
// ti: 'Plomberie',
// su: 'Réparer une installation de tuyauterie',
// prompt: 'plumber fixing pipes under sink, professional tools, photorealistic'
// }, {
// id: 9,
// t: 'R',
// ti: 'Pêche',
// su: 'Tirer des filets sur un bateau en mer',
// prompt: 'fisherman hauling fishing nets on boat at sea, dramatic ocean waves, early morning, photorealistic'
// }, {
// id: 10,
// t: 'R',
// ti: 'Élevage',
// su: 'Soigner des animaux à la ferme',
// prompt: 'farmer feeding farm animals at dawn, peaceful rural scene, warm golden light, photorealistic'
// }, {
// id: 11,
// t: 'R',
// ti: 'Maintenance Industrielle',
// su: 'Entretenir de grandes machines en usine',
// prompt: 'industrial mechanic maintaining factory machinery, hard hat, dramatic lighting, photorealistic'
// }, {
// id: 12,
// t: 'R',
// ti: 'Foresterie',
// su: 'Abattre des arbres en forêt',
// prompt: 'forester cutting timber in forest, chainsaw, protective gear, light through trees, photorealistic'
// }, {
// id: 13,
// t: 'R',
// ti: 'Électronique',
// su: 'Souder des composants sur une carte mère',
// prompt: 'electronics technician soldering circuit board under magnification, blue LED workshop, photorealistic'
// }, {
// id: 14,
// t: 'R',
// ti: 'Conduite d\'Engins',
// su: 'Piloter une pelleteuse sur chantier',
// prompt: 'excavator operator in cab maneuvering machinery, construction site, dramatic sky, photorealistic'
// }, {
// id: 15,
// t: 'R',
// ti: 'Carrosserie',
// su: 'Peindre une carrosserie de voiture',
// prompt: 'auto body painter spraying car in professional booth, protective suit, paint mist, photorealistic'
// }, {
// id: 16,
// t: 'R',
// ti: 'Couverture',
// su: 'Poser des tuiles sur un toit',
// prompt: 'roofer laying tiles on steep roof, urban panorama, morning light, steady hands, photorealistic'
// }, {
// id: 17,
// t: 'R',
// ti: 'Viticulture',
// su: 'Tailler des vignes au soleil',
// prompt: 'vintner pruning grapevines in vineyard at golden hour, rolling hills, photorealistic'
// }, {
// id: 18,
// t: 'R',
// ti: 'Modélisme',
// su: 'Assembler une maquette aéronautique',
// prompt: 'hobbyist assembling detailed aircraft model, magnifying glass, warm desk lamp, photorealistic'
// }, {
// id: 19,
// t: 'R',
// ti: 'Escalade',
// su: 'Grimper une paroi rocheuse',
// prompt: 'rock climber scaling vertical cliff face, mountain landscape, chalk on hands, photorealistic'
// }, {
// id: 20,
// t: 'R',
// ti: 'Charpenterie',
// su: 'Assembler la structure d\'une maison',
// prompt: 'carpenter assembling timber frame house, high up, tools on belt, sunlit site, photorealistic'
// }, {
// id: 21,
// t: 'R',
// ti: 'Climatisation',
// su: 'Installer un système CVC en toiture',
// prompt: 'HVAC technician installing air conditioning unit on rooftop, city view below, photorealistic'
// }, {
// id: 22,
// t: 'R',
// ti: 'Imprimerie',
// su: 'Configurer une presse offset',
// prompt: 'printing press operator setting up offset machine, colorful ink rollers, industrial workshop, photorealistic'
// }, {
// id: 23,
// t: 'R',
// ti: 'Taxidermie',
// su: 'Préparer un animal naturalisé',
// prompt: 'taxidermist carefully working on specimen, natural history setting, focused precision, photorealistic'
// }, {
// id: 24,
// t: 'R',
// ti: 'Céramique',
// su: 'Façonner de l\'argile sur un tour',
// prompt: 'potter shaping wet clay on wheel, hands in mud, warm ceramics studio, photorealistic'
// }, {
// id: 25,
// t: 'R',
// ti: 'Fonderie',
// su: 'Couler du métal en fusion',
// prompt: 'metalworker pouring molten metal into mold, dramatic orange glow, industrial foundry, photorealistic'
// }, {
// id: 26,
// t: 'R',
// ti: 'Sculpture sur Pierre',
// su: 'Tailler une statue dans le marbre',
// prompt: 'sculptor chiseling marble statue, stone dust particles, dramatic studio lighting, photorealistic'
// }, {
// id: 27,
// t: 'R',
// ti: 'Cordonnerie',
// su: 'Réparer des chaussures en cuir',
// prompt: 'cobbler repairing leather shoes, vintage workshop, warm lamp, detailed handicraft, photorealistic'
// }, {
// id: 28,
// t: 'R',
// ti: 'Lustrerie',
// su: 'Poser des installations lumineuses',
// prompt: 'lighting technician installing chandelier in ornate building, artistic lighting, photorealistic'
// }, {
// id: 29,
// t: 'R',
// ti: 'Aquaculture',
// su: 'Entretenir des bassins piscicoles',
// prompt: 'fish farmer checking aquaculture pools, fish jumping, water sparkle, outdoor farm, photorealistic'
// }, {
// id: 30,
// t: 'R',
// ti: 'Navigation',
// su: 'Piloter un bateau en haute mer',
// prompt: 'boat captain steering vessel through open sea, sea spray, dramatic ocean sky, photorealistic'
// }, {
// id: 31,
// t: 'I',
// ti: 'Microscopie',
// su: 'Observer des micro-organismes en labo',
// prompt: 'scientist looking through microscope in laboratory, soft blue lab light, focused, photorealistic'
// }, {
// id: 32,
// t: 'I',
// ti: 'Programmation',
// su: 'Coder un algorithme sur plusieurs écrans',
// prompt: 'software developer coding on multiple monitors, glowing screens, dark room, photorealistic'
// }, {
// id: 33,
// t: 'I',
// ti: 'Astronomie',
// su: 'Observer les étoiles au télescope',
// prompt: 'astronomer looking through large telescope at night, star field, observatory dome, photorealistic'
// }, {
// id: 34,
// t: 'I',
// ti: 'Chimie',
// su: 'Mener une expérience en laboratoire',
// prompt: 'chemist conducting experiment with colorful chemicals, protective goggles, lab glassware, photorealistic'
// }, {
// id: 35,
// t: 'I',
// ti: 'Archéologie',
// su: 'Fouiller un site antique',
// prompt: 'archaeologist excavating ancient ruins, brushing artifacts, sunlit dig site, photorealistic'
// }, {
// id: 36,
// t: 'I',
// ti: 'Médecine',
// su: 'Analyser des résultats médicaux complexes',
// prompt: 'doctor analyzing medical scans on light board, concentration, professional white coat, photorealistic'
// }, {
// id: 37,
// t: 'I',
// ti: 'Mathématiques',
// su: 'Résoudre des équations avancées',
// prompt: 'mathematician writing complex equations on blackboard, chalk dust, intense concentration, photorealistic'
// }, {
// id: 38,
// t: 'I',
// ti: 'Biologie Marine',
// su: 'Étudier la vie sous-marine',
// prompt: 'marine biologist scuba diving with coral reef, colorful fish, sunlit ocean, photorealistic'
// }, {
// id: 39,
// t: 'I',
// ti: 'Géologie',
// su: 'Analyser des couches rocheuses',
// prompt: 'geologist examining rock strata in canyon, survey equipment, dramatic landscape, photorealistic'
// }, {
// id: 40,
// t: 'I',
// ti: 'Intelligence Artificielle',
// su: 'Entraîner un modèle d\'IA',
// prompt: 'AI researcher analyzing training data on screens, futuristic office, data visualizations, photorealistic'
// }, {
// id: 41,
// t: 'I',
// ti: 'Physique Nucléaire',
// su: 'Analyser des données de particules',
// prompt: 'particle physicist studying collision data, CERN-like facility, complex graphs, photorealistic'
// }, {
// id: 42,
// t: 'I',
// ti: 'Ethnologie',
// su: 'Mener une enquête culturelle de terrain',
// prompt: 'anthropologist interviewing indigenous community, field notebook, documentary style, photorealistic'
// }, {
// id: 43,
// t: 'I',
// ti: 'Génétique',
// su: 'Séquencer un génome',
// prompt: 'geneticist working with DNA sequencing machine, blue glowing equipment, photorealistic'
// }, {
// id: 44,
// t: 'I',
// ti: 'Météorologie',
// su: 'Analyser des modèles climatiques',
// prompt: 'meteorologist analyzing weather patterns on large screens, storm visualization, photorealistic'
// }, {
// id: 45,
// t: 'I',
// ti: 'Cybersécurité',
// su: 'Détecter une intrusion réseau',
// prompt: 'cybersecurity analyst monitoring network threats, multiple screens, dark room blue light, photorealistic'
// }, {
// id: 46,
// t: 'I',
// ti: 'Neurosciences',
// su: 'Étudier des images cérébrales IRM',
// prompt: 'neuroscientist analyzing brain scan images, MRI visualization, research lab, photorealistic'
// }, {
// id: 47,
// t: 'I',
// ti: 'Économétrie',
// su: 'Modéliser des données économiques',
// prompt: 'economist modeling financial data with graphs, research office, multiple screens, photorealistic'
// }, {
// id: 48,
// t: 'I',
// ti: 'Pharmacologie',
// su: 'Tester de nouveaux composés',
// prompt: 'pharmacologist testing new compounds, pipettes and test tubes, pharmaceutical lab, photorealistic'
// }, {
// id: 49,
// t: 'I',
// ti: 'Robotique',
// su: 'Programmer un bras robotique',
// prompt: 'robotics engineer programming robot arm, high-tech lab, futuristic setting, photorealistic'
// }, {
// id: 50,
// t: 'I',
// ti: 'Archivistique',
// su: 'Numériser des archives historiques',
// prompt: 'archivist handling ancient manuscripts, library setting, white gloves, golden lamp, photorealistic'
// }, {
// id: 51,
// t: 'I',
// ti: 'Épidémiologie',
// su: 'Tracer la propagation d\'une maladie',
// prompt: 'epidemiologist tracking disease spread on world map, research center, serious focus, photorealistic'
// }, {
// id: 52,
// t: 'I',
// ti: 'Astrophysique',
// su: 'Calculer la trajectoire d\'une comète',
// prompt: 'astrophysicist calculating orbital trajectories, space agency, satellite imagery, photorealistic'
// }, {
// id: 53,
// t: 'I',
// ti: 'Linguistique',
// su: 'Décrypter un langage ancien',
// prompt: 'linguist deciphering ancient language on stone tablet, library, reference books, photorealistic'
// }, {
// id: 54,
// t: 'I',
// ti: 'Écologie',
// su: 'Observer des espèces dans leur habitat',
// prompt: 'ecologist observing wildlife in forest habitat, binoculars, lush environment, photorealistic'
// }, {
// id: 55,
// t: 'I',
// ti: 'Biochimie',
// su: 'Analyser des protéines en labo',
// prompt: 'biochemist running protein gel electrophoresis, fluorescent bands, lab equipment, photorealistic'
// }, {
// id: 56,
// t: 'I',
// ti: 'Intelligence Économique',
// su: 'Analyser les tendances d\'un marché',
// prompt: 'market analyst studying global market trends, large screen displays, photorealistic'
// }, {
// id: 57,
// t: 'I',
// ti: 'Océanographie',
// su: 'Collecter des données en haute mer',
// prompt: 'oceanographer collecting water samples from research vessel, ocean horizon, photorealistic'
// }, {
// id: 58,
// t: 'I',
// ti: 'Sociologie',
// su: 'Analyser des données d\'enquête',
// prompt: 'sociologist analyzing survey data and statistics, thoughtful expression, academic, photorealistic'
// }, {
// id: 59,
// t: 'I',
// ti: 'Volcanologie',
// su: 'Observer un volcan actif',
// prompt: 'volcanologist near active volcano crater, protective suit, lava glow, dramatic, photorealistic'
// }, {
// id: 60,
// t: 'I',
// ti: 'Sciences Forensiques',
// su: 'Analyser des indices sur une scène',
// prompt: 'forensic scientist collecting evidence at crime scene, careful analysis, CSI lighting, photorealistic'
// }, {
// id: 61,
// t: 'A',
// ti: 'Peinture',
// su: 'Créer une grande toile abstraite',
// prompt: 'painter creating large abstract canvas in art studio, colorful splashes, artistic lighting, photorealistic'
// }, {
// id: 62,
// t: 'A',
// ti: 'Musique',
// su: 'Jouer de la guitare sur scène',
// prompt: 'musician playing electric guitar on stage, dramatic lighting, passionate expression, photorealistic'
// }, {
// id: 63,
// t: 'A',
// ti: 'Danse Contemporaine',
// su: 'Performer une chorégraphie',
// prompt: 'contemporary dancer performing on stage, dramatic spotlight, graceful movement, photorealistic'
// }, {
// id: 64,
// t: 'A',
// ti: 'Photographie',
// su: 'Capturer des instants de rue',
// prompt: 'street photographer capturing candid moments in city, decisive moment, artistic, photorealistic'
// }, {
// id: 65,
// t: 'A',
// ti: 'Design Graphique',
// su: 'Créer une identité visuelle',
// prompt: 'graphic designer creating brand identity on large screen, creative workspace, photorealistic'
// }, {
// id: 66,
// t: 'A',
// ti: 'Écriture',
// su: 'Rédiger un roman en bibliothèque',
// prompt: 'writer typing novel in cozy library surrounded by books, warm lamp light, photorealistic'
// }, {
// id: 67,
// t: 'A',
// ti: 'Sculpture',
// su: 'Modeler une figure en argile',
// prompt: 'sculptor shaping human figure in clay, art studio, dramatic side lighting, photorealistic'
// }, {
// id: 68,
// t: 'A',
// ti: 'Architecture',
// su: 'Dessiner les plans d\'un bâtiment',
// prompt: 'architect designing innovative building with pencil and plans, model buildings, photorealistic'
// }, {
// id: 69,
// t: 'A',
// ti: 'Cinéma',
// su: 'Réaliser une scène sur un plateau',
// prompt: 'film director on movie set, camera, actors, cinematic lighting, creative directing, photorealistic'
// }, {
// id: 70,
// t: 'A',
// ti: 'Mode',
// su: 'Concevoir une collection couture',
// prompt: 'fashion designer creating haute couture, fitting on mannequin, atelier, photorealistic'
// }, {
// id: 71,
// t: 'A',
// ti: 'Illustration',
// su: 'Dessiner des personnages de BD',
// prompt: 'comic artist illustrating at drawing desk, ink pens, creative sketches on wall, photorealistic'
// }, {
// id: 72,
// t: 'A',
// ti: 'Bijouterie',
// su: 'Créer un bijou en or et gemmes',
// prompt: 'jeweler crafting gold ring with gemstones, fine tools, magnification, luxury workshop, photorealistic'
// }, {
// id: 73,
// t: 'A',
// ti: 'Piano',
// su: 'Interpréter une sonate en concert',
// prompt: 'pianist performing on grand piano in concert hall, elegant lighting, passionate, photorealistic'
// }, {
// id: 74,
// t: 'A',
// ti: 'Calligraphie',
// su: 'Écrire des caractères artistiques',
// prompt: 'calligrapher writing characters with brush, ink on rice paper, zen concentration, photorealistic'
// }, {
// id: 75,
// t: 'A',
// ti: 'Animation 3D',
// su: 'Créer un court métrage animé',
// prompt: '3D animator creating animation on professional workstation, digital sculpt, photorealistic'
// }, {
// id: 76,
// t: 'A',
// ti: 'Tapisserie',
// su: 'Tisser une tapisserie traditionnelle',
// prompt: 'textile weaver creating tapestry on loom, colorful threads, traditional craft, photorealistic'
// }, {
// id: 77,
// t: 'A',
// ti: 'Art Numérique',
// su: 'Créer une illustration en AR',
// prompt: 'digital artist painting with stylus and AR glasses, futuristic canvas, photorealistic'
// }, {
// id: 78,
// t: 'A',
// ti: 'Poésie',
// su: 'Écrire dans un café parisien',
// prompt: 'poet writing in notebook at Parisian cafe, thoughtful, autumn light, literary, photorealistic'
// }, {
// id: 79,
// t: 'A',
// ti: 'Luthierie',
// su: 'Fabriquer un violon à la main',
// prompt: 'luthier carefully crafting violin in workshop, wood shavings, warm artisan light, photorealistic'
// }, {
// id: 80,
// t: 'A',
// ti: 'Théâtre',
// su: 'Jouer un rôle dramatique sur scène',
// prompt: 'stage actor performing dramatic role, spotlight, intense emotion, theatrical costume, photorealistic'
// }, {
// id: 81,
// t: 'A',
// ti: 'Vitrail',
// su: 'Assembler des pièces de verre coloré',
// prompt: 'stained glass artist assembling colorful glass, light through colors, medieval craft, photorealistic'
// }, {
// id: 82,
// t: 'A',
// ti: 'Ballet',
// su: 'Répéter un grand ballet classique',
// prompt: 'ballet dancer rehearsing, white tutu, classical dance studio, graceful performance, photorealistic'
// }, {
// id: 83,
// t: 'A',
// ti: 'Urbanisme Créatif',
// su: 'Concevoir un quartier futuriste',
// prompt: 'urban designer creating futuristic city model, 3D planning, creative architecture office, photorealistic'
// }, {
// id: 84,
// t: 'A',
// ti: 'Graffiti Art',
// su: 'Peindre une fresque murale',
// prompt: 'street artist painting large mural on city wall, spray cans, urban art, photorealistic'
// }, {
// id: 85,
// t: 'A',
// ti: 'Parfumerie',
// su: 'Créer une nouvelle essence',
// prompt: 'perfumer creating fragrance, exotic ingredients, laboratory bottles, sensory artistry, photorealistic'
// }, {
// id: 86,
// t: 'A',
// ti: 'Opéra',
// su: 'Chanter un aria sur scène',
// prompt: 'opera singer performing aria on grand stage, dramatic costume, powerful voice, photorealistic'
// }, {
// id: 87,
// t: 'A',
// ti: 'Gastronomie',
// su: 'Dresser un plat étoilé avec art',
// prompt: 'chef artistically plating gourmet dish, Michelin-star kitchen, beautiful composition, photorealistic'
// }, {
// id: 88,
// t: 'A',
// ti: 'Bande Dessinée',
// su: 'Encrer des planches au pinceau',
// prompt: 'comic book artist inking pages, black and white illustration, creative workspace, photorealistic'
// }, {
// id: 89,
// t: 'A',
// ti: 'Photographie Mode',
// su: 'Diriger un shooting haute couture',
// prompt: 'fashion photographer directing high fashion shoot, professional lighting, photorealistic'
// }, {
// id: 90,
// t: 'A',
// ti: 'UX Design',
// su: 'Concevoir l\'expérience d\'une app',
// prompt: 'UX designer creating mobile app interface, wireframes on screen, creative studio, photorealistic'
// }, {
// id: 91,
// t: 'S',
// ti: 'Enseignement',
// su: 'Expliquer les maths à une classe',
// prompt: 'teacher explaining math to students at blackboard, warm classroom, photorealistic'
// }, {
// id: 92,
// t: 'S',
// ti: 'Soins Infirmiers',
// su: 'Surveiller des patients',
// prompt: 'nurse caring for patient in hospital ward, compassionate care, soft clinical light, photorealistic'
// }, {
// id: 93,
// t: 'S',
// ti: 'Psychologie',
// su: 'Conduire une séance de thérapie',
// prompt: 'psychologist listening to patient in therapy session, empathetic, warm setting, photorealistic'
// }, {
// id: 94,
// t: 'S',
// ti: 'Assistance Sociale',
// su: 'Soutenir une famille en difficulté',
// prompt: 'social worker visiting family home, supportive conversation, documentary style, photorealistic'
// }, {
// id: 95,
// t: 'S',
// ti: 'Médecine',
// su: 'Consulter et rassurer un patient',
// prompt: 'doctor consulting with patient, warm reassuring expression, medical office, photorealistic'
// }, {
// id: 96,
// t: 'S',
// ti: 'Coaching',
// su: 'Motiver une équipe sportive',
// prompt: 'coach motivating sports team huddle, intense motivation, team spirit, photorealistic'
// }, {
// id: 97,
// t: 'S',
// ti: 'Humanitaire',
// su: 'Distribuer de l\'aide d\'urgence',
// prompt: 'humanitarian aid worker distributing supplies, disaster relief zone, photorealistic'
// }, {
// id: 98,
// t: 'S',
// ti: 'Kinésithérapie',
// su: 'Rééduquer un patient post-op',
// prompt: 'physiotherapist helping patient rehabilitation exercises, caring support, clinic, photorealistic'
// }, {
// id: 99,
// t: 'S',
// ti: 'Orthophonie',
// su: 'Aider un enfant à s\'exprimer',
// prompt: 'speech therapist working with child on pronunciation, patient and encouraging, photorealistic'
// }, {
// id: 100,
// t: 'S',
// ti: 'Animation Sociale',
// su: 'Animer un atelier avec des seniors',
// prompt: 'social animator leading creative workshop with elderly, joyful, community center, photorealistic'
// }, {
// id: 101,
// t: 'S',
// ti: 'Orientation Scolaire',
// su: 'Guider un lycéen dans son choix',
// prompt: 'school counselor guiding teenager, supportive conversation, office setting, photorealistic'
// }, {
// id: 102,
// t: 'S',
// ti: 'Médiation',
// su: 'Résoudre un conflit entre parties',
// prompt: 'mediator facilitating resolution between two parties, calm professional setting, photorealistic'
// }, {
// id: 103,
// t: 'S',
// ti: 'Ergothérapie',
// su: 'Aider un patient à retrouver l\'autonomie',
// prompt: 'occupational therapist helping disabled patient, adaptive tools, caring support, photorealistic'
// }, {
// id: 104,
// t: 'S',
// ti: 'Pédiatrie',
// su: 'Examiner un enfant avec bienveillance',
// prompt: 'pediatrician examining child with warmth, child smiling, colorful medical office, photorealistic'
// }, {
// id: 105,
// t: 'S',
// ti: 'Formation Pro',
// su: 'Animer une formation pour adultes',
// prompt: 'professional trainer facilitating adult workshop, engaged participants, photorealistic'
// }, {
// id: 106,
// t: 'S',
// ti: 'Service à Domicile',
// su: 'Aider une personne âgée',
// prompt: 'home caregiver helping elderly person with daily tasks, gentle support, photorealistic'
// }, {
// id: 107,
// t: 'S',
// ti: 'Éducation Spécialisée',
// su: 'Accompagner un enfant handicapé',
// prompt: 'special education teacher supporting child with disability, dedicated, photorealistic'
// }, {
// id: 108,
// t: 'S',
// ti: 'Diététique',
// su: 'Conseiller un patient en nutrition',
// prompt: 'dietitian advising patient on nutrition plan, food charts, healthy consultation, photorealistic'
// }, {
// id: 109,
// t: 'S',
// ti: 'Sage-Femme',
// su: 'Accompagner une naissance',
// prompt: 'midwife assisting during childbirth, caring and professional, hospital, photorealistic'
// }, {
// id: 110,
// t: 'S',
// ti: 'Bénévolat',
// su: 'Servir des repas dans un centre',
// prompt: 'volunteer serving meals at soup kitchen, generous service, community center, photorealistic'
// }, {
// id: 111,
// t: 'S',
// ti: 'Gériatrie',
// su: 'Réconforter un patient âgé',
// prompt: 'geriatric nurse comforting elderly patient, compassionate care, human warmth, photorealistic'
// }, {
// id: 112,
// t: 'S',
// ti: 'Ostéopathie',
// su: 'Traiter une douleur dorsale',
// prompt: 'osteopath treating back pain with manual therapy, healing hands, calm setting, photorealistic'
// }, {
// id: 113,
// t: 'S',
// ti: 'Éducation Parentale',
// su: 'Animer un atelier jeunes parents',
// prompt: 'family educator facilitating parenting workshop, new parents, community, photorealistic'
// }, {
// id: 114,
// t: 'S',
// ti: 'Psychomotricité',
// su: 'Travailler le tonus d\'un enfant',
// prompt: 'psychomotor therapist doing exercises with young child, playful therapy, photorealistic'
// }, {
// id: 115,
// t: 'S',
// ti: 'Accompagnement Deuil',
// su: 'Soutenir en période de deuil',
// prompt: 'grief counselor offering comfort to mourning person, compassionate listening, photorealistic'
// }, {
// id: 116,
// t: 'S',
// ti: 'Protection Enfance',
// su: 'Protéger des enfants en danger',
// prompt: 'child protection worker in caring conversation with child, safe environment, photorealistic'
// }, {
// id: 117,
// t: 'S',
// ti: 'Thérapie',
// su: 'Conduire une consultation',
// prompt: 'therapist in professional consultation session, respectful setting, warm lighting, photorealistic'
// }, {
// id: 118,
// t: 'S',
// ti: 'Addictologie',
// su: 'Accompagner un patient en sevrage',
// prompt: 'addiction counselor supporting patient through recovery, supportive care, photorealistic'
// }, {
// id: 119,
// t: 'S',
// ti: 'Logopédie',
// su: 'Aider à retrouver la parole',
// prompt: 'speech therapist helping adult stroke patient regain speech, rehabilitation, photorealistic'
// }, {
// id: 120,
// t: 'S',
// ti: 'Anthropologie',
// su: 'Étudier les rituels d\'une communauté',
// prompt: 'social anthropologist observing traditional ceremony, field research, cultural immersion, photorealistic'
// }, {
// id: 121,
// t: 'E',
// ti: 'Direction',
// su: 'Présider un COMEX',
// prompt: 'CEO leading executive board meeting in glass tower, commanding presence, photorealistic'
// }, {
// id: 122,
// t: 'E',
// ti: 'Vente',
// su: 'Conclure un grand contrat',
// prompt: 'salesperson closing major business deal with handshake, confident smile, photorealistic'
// }, {
// id: 123,
// t: 'E',
// ti: 'Startup',
// su: 'Pitcher devant des investisseurs',
// prompt: 'startup founder pitching to investors, presentation board, venture capital office, photorealistic'
// }, {
// id: 124,
// t: 'E',
// ti: 'Politique',
// su: 'Prononcer un discours à la tribune',
// prompt: 'politician delivering passionate speech at podium, crowd below, political rally, photorealistic'
// }, {
// id: 125,
// t: 'E',
// ti: 'Négociation',
// su: 'Négocier un accord international',
// prompt: 'business negotiator at international deal table, suits and contracts, photorealistic'
// }, {
// id: 126,
// t: 'E',
// ti: 'Finance',
// su: 'Analyser des opportunités de marché',
// prompt: 'investment banker analyzing market opportunities, trading floor, multiple screens, photorealistic'
// }, {
// id: 127,
// t: 'E',
// ti: 'Marketing',
// su: 'Lancer une campagne mondiale',
// prompt: 'marketing director launching global campaign, creative agency, strategic leadership, photorealistic'
// }, {
// id: 128,
// t: 'E',
// ti: 'Immobilier',
// su: 'Vendre un penthouse de luxe',
// prompt: 'luxury real estate agent showing penthouse, city views, confident presentation, photorealistic'
// }, {
// id: 129,
// t: 'E',
// ti: 'Droit des Affaires',
// su: 'Plaider une affaire au tribunal',
// prompt: 'corporate lawyer arguing case in courtroom, authoritative presence, photorealistic'
// }, {
// id: 130,
// t: 'E',
// ti: 'Journalisme',
// su: 'Interviewer un chef d\'État',
// prompt: 'journalist interviewing head of state, microphone, important press interview, photorealistic'
// }, {
// id: 131,
// t: 'E',
// ti: 'Relations Publiques',
// su: 'Gérer une communication de crise',
// prompt: 'PR director managing crisis communication, press conference, decisive leadership, photorealistic'
// }, {
// id: 132,
// t: 'E',
// ti: 'Consulting',
// su: 'Présenter une stratégie',
// prompt: 'management consultant presenting strategy, executive audience, boardroom, photorealistic'
// }, {
// id: 133,
// t: 'E',
// ti: 'Événementiel',
// su: 'Organiser un grand événement',
// prompt: 'event director coordinating large corporate event, backstage, headset, photorealistic'
// }, {
// id: 134,
// t: 'E',
// ti: 'Banque d\'Investissement',
// su: 'Structurer une fusion-acquisition',
// prompt: 'investment banker structuring M&A deal, documents and screens, high finance, photorealistic'
// }, {
// id: 135,
// t: 'E',
// ti: 'Commerce International',
// su: 'Gérer des négociations à l\'export',
// prompt: 'international trade manager negotiating export deal, multicultural business meeting, photorealistic'
// }, {
// id: 136,
// t: 'E',
// ti: 'Franchise',
// su: 'Développer un réseau de franchises',
// prompt: 'franchise developer presenting expansion plan, network map, business meeting, photorealistic'
// }, {
// id: 137,
// t: 'E',
// ti: 'Diplomatie',
// su: 'Négocier entre deux nations',
// prompt: 'diplomat negotiating between nations, formal diplomatic meeting, flags, photorealistic'
// }, {
// id: 138,
// t: 'E',
// ti: 'Promotion Immobilière',
// su: 'Présenter un projet de construction',
// prompt: 'property developer presenting building project to investors, architectural model, photorealistic'
// }, {
// id: 139,
// t: 'E',
// ti: 'Direction Créative',
// su: 'Diriger une équipe d\'agence',
// prompt: 'creative director leading agency team, inspiring leadership, creative office, photorealistic'
// }, {
// id: 140,
// t: 'E',
// ti: 'Coaching Pro',
// su: 'Accompagner un dirigeant',
// prompt: 'executive coach mentoring senior leader, powerful coaching conversation, photorealistic'
// }, {
// id: 141,
// t: 'E',
// ti: 'Gestion de Crise',
// su: 'Diriger une cellule de crise',
// prompt: 'crisis manager leading emergency response team, situation room, decisive command, photorealistic'
// }, {
// id: 142,
// t: 'E',
// ti: 'Venture Capital',
// su: 'Gérer un portefeuille de startups',
// prompt: 'venture capitalist meeting with portfolio companies, startup office, photorealistic'
// }, {
// id: 143,
// t: 'E',
// ti: 'Influence',
// su: 'Construire une grande audience',
// prompt: 'influencer creating content for large audience, professional studio, digital branding, photorealistic'
// }, {
// id: 144,
// t: 'E',
// ti: 'Syndicalisme',
// su: 'Négocier les conditions de travail',
// prompt: 'union leader negotiating workers conditions, powerful advocacy, labor negotiation, photorealistic'
// }, {
// id: 145,
// t: 'E',
// ti: 'Logistique',
// su: 'Diriger un entrepôt mondial',
// prompt: 'logistics director managing global distribution center, warehouse operations, photorealistic'
// }, {
// id: 146,
// t: 'E',
// ti: 'Audit',
// su: 'Diriger un cabinet international',
// prompt: 'audit firm partner leading international review, corporate headquarters, photorealistic'
// }, {
// id: 147,
// t: 'E',
// ti: 'Assurance',
// su: 'Gérer un portefeuille grands comptes',
// prompt: 'insurance director managing major accounts, professional meeting, photorealistic'
// }, {
// id: 148,
// t: 'E',
// ti: 'Arbitrage',
// su: 'Arbitrer un litige commercial',
// prompt: 'international arbitrator presiding dispute, formal arbitration chamber, photorealistic'
// }, {
// id: 149,
// t: 'E',
// ti: 'Recrutement',
// su: 'Identifier les meilleurs talents',
// prompt: 'head hunter identifying top talent, executive search, professional interview, photorealistic'
// }, {
// id: 150,
// t: 'E',
// ti: 'Hôtellerie Luxe',
// su: 'Gérer un palace cinq étoiles',
// prompt: 'hotel director managing luxury five-star property, elegant lobby, prestigious, photorealistic'
// }, {
// id: 151,
// t: 'C',
// ti: 'Comptabilité',
// su: 'Clôturer les comptes annuels',
// prompt: 'accountant closing annual financial accounts, spreadsheets and calculators, photorealistic'
// }, {
// id: 152,
// t: 'C',
// ti: 'Archivage',
// su: 'Classer et numériser des archives',
// prompt: 'archivist organizing legal documents, white gloves, organized precision, photorealistic'
// }, {
// id: 153,
// t: 'C',
// ti: 'Banque',
// su: 'Gérer des opérations de caisse',
// prompt: 'bank teller processing transactions at counter, professional service, photorealistic'
// }, {
// id: 154,
// t: 'C',
// ti: 'Contrôle de Gestion',
// su: 'Analyser les écarts budgétaires',
// prompt: 'controller analyzing budget variance reports, financial dashboards, corporate, photorealistic'
// }, {
// id: 155,
// t: 'C',
// ti: 'Administration',
// su: 'Gérer l\'agenda d\'un DG',
// prompt: 'executive assistant managing director schedule, organized desk, professional office, photorealistic'
// }, {
// id: 156,
// t: 'C',
// ti: 'Supply Chain',
// su: 'Optimiser une chaîne logistique',
// prompt: 'logistics coordinator optimizing supply chain, warehouse management, systematic, photorealistic'
// }, {
// id: 157,
// t: 'C',
// ti: 'Assurance Sinistres',
// su: 'Instruire un dossier de sinistre',
// prompt: 'insurance claims adjuster reviewing case files, systematic investigation, photorealistic'
// }, {
// id: 158,
// t: 'C',
// ti: 'Paie',
// su: 'Calculer les bulletins de salaire',
// prompt: 'payroll specialist calculating salary payments, HR software, precise data entry, photorealistic'
// }, {
// id: 159,
// t: 'C',
// ti: 'Douanes',
// su: 'Contrôler la conformité douanière',
// prompt: 'customs officer inspecting merchandise documentation, border control, photorealistic'
// }, {
// id: 160,
// t: 'C',
// ti: 'Notariat',
// su: 'Rédiger un acte authentique',
// prompt: 'notary drafting legal deed, meticulous document preparation, formal law office, photorealistic'
// }, {
// id: 161,
// t: 'C',
// ti: 'Fiscalité',
// su: 'Préparer une déclaration fiscale',
// prompt: 'tax specialist preparing complex tax return, legal codes and forms, photorealistic'
// }, {
// id: 162,
// t: 'C',
// ti: 'Qualité ISO',
// su: 'Auditer la conformité d\'une usine',
// prompt: 'quality auditor inspecting manufacturing facility, clipboard and checklist, photorealistic'
// }, {
// id: 163,
// t: 'C',
// ti: 'Statistiques',
// su: 'Produire un rapport statistique',
// prompt: 'statistician producing statistical report, data analysis, charts and graphs, photorealistic'
// }, {
// id: 164,
// t: 'C',
// ti: 'Secrétariat Juridique',
// su: 'Rédiger des actes de procédure',
// prompt: 'legal secretary drafting court proceedings, precise legal documents, law firm, photorealistic'
// }, {
// id: 165,
// t: 'C',
// ti: 'Gestion Patrimoine',
// su: 'Gérer un portefeuille d\'actifs',
// prompt: 'wealth manager reviewing portfolio assets, financial planning, discreet office, photorealistic'
// }, {
// id: 166,
// t: 'C',
// ti: 'Contrôle Aérien',
// su: 'Gérer le trafic aérien',
// prompt: 'air traffic controller managing aircraft on radar screen, control tower, photorealistic'
// }, {
// id: 167,
// t: 'C',
// ti: 'État Civil',
// su: 'Traiter des actes d\'état civil',
// prompt: 'civil registrar processing vital records, administrative precision, government, photorealistic'
// }, {
// id: 168,
// t: 'C',
// ti: 'Bibliothéconomie',
// su: 'Cataloguer des acquisitions',
// prompt: 'librarian cataloging new acquisitions, systematic organization, library stacks, photorealistic'
// }, {
// id: 169,
// t: 'C',
// ti: 'Dossiers Médicaux',
// su: 'Gérer les dossiers d\'une clinique',
// prompt: 'medical records administrator organizing patient files, clinical office, photorealistic'
// }, {
// id: 170,
// t: 'C',
// ti: 'Import-Export',
// su: 'Traiter des documents douaniers',
// prompt: 'import export specialist processing customs documentation, trade office, photorealistic'
// }, {
// id: 171,
// t: 'C',
// ti: 'RGPD',
// su: 'Appliquer une politique de conformité',
// prompt: 'data protection officer implementing GDPR compliance, systematic security audit, photorealistic'
// }, {
// id: 172,
// t: 'C',
// ti: 'Gestion Immobilière',
// su: 'Gérer un parc locatif',
// prompt: 'property manager overseeing rental portfolio, lease management, systematic, photorealistic'
// }, {
// id: 173,
// t: 'C',
// ti: 'Audit Légal',
// su: 'Certifier les comptes d\'une cotée',
// prompt: 'auditor certifying listed company accounts, formal audit setting, precision, photorealistic'
// }, {
// id: 174,
// t: 'C',
// ti: 'Administration RH',
// su: 'Gérer les contrats et la paie',
// prompt: 'HR administrator managing employee contracts and payroll, organized HR, photorealistic'
// }, {
// id: 175,
// t: 'C',
// ti: 'Analyse Crédit',
// su: 'Évaluer la solvabilité d\'une entreprise',
// prompt: 'credit analyst evaluating company creditworthiness, financial documents, photorealistic'
// }, {
// id: 176,
// t: 'C',
// ti: 'Inventaire',
// su: 'Inventorier un entrepôt',
// prompt: 'inventory manager scanning warehouse stock, systematic counting, organized, photorealistic'
// }, {
// id: 177,
// t: 'C',
// ti: 'Traduction',
// su: 'Traduire un contrat juridique',
// prompt: 'translator working on complex legal contract, language dictionaries, photorealistic'
// }, {
// id: 178,
// t: 'C',
// ti: 'Greffe',
// su: 'Retranscrire des débats judiciaires',
// prompt: 'court clerk transcribing trial proceedings, courthouse, systematic recording, photorealistic'
// }, {
// id: 179,
// t: 'C',
// ti: 'Data Analyst',
// su: 'Nettoyer une base de données',
// prompt: 'data analyst cleaning and structuring database, multiple screens, systematic, photorealistic'
// }, {
// id: 180,
// t: 'C',
// ti: 'Actuariat',
// su: 'Calculer des probabilités de risques',
// prompt: 'actuary calculating insurance risk probabilities, mathematical models, photorealistic'
// },
// ];

interface Session {
  id?: string; // optional, will be filled after inserting in DB
  device_fingerprint: string;
  locale: string;
  platform: string;
  screen_width: number;
  screen_height: number;
  images_loaded: boolean;
  started_at: string;
  completed_at?: string;
  total_duration_ms?: number;
}

const getDeviceFingerprint = (): string =>
  btoa(navigator.userAgent + "_" + screen.width + "x" + screen.height);

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function RiasecGame() {
  const stackRef    = useRef<HTMLDivElement>(null);
  const progFillRef = useRef<HTMLDivElement>(null);
  const qNumRef     = useRef<HTMLDivElement>(null);
  const typePillRef = useRef<HTMLDivElement>(null);
  const radarRef    = useRef<HTMLCanvasElement>(null);
  const resultsRef  = useRef<HTMLDivElement>(null);
  const doneRef     = useRef<HTMLDivElement>(null);

  // Mutable game state stored in refs (no re-render needed)
  const cur       = useRef(0);
  const scores    = useRef<Scores>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const history   = useRef<HistoryEntry[]>([]);
  const animLock  = useRef(false);
  // const dragState = useRef<{ sx: number; cx: number } | null>(null);
  const dragState = useRef<DragState | null>(null);
  const pool      = useRef<Record<number, HTMLDivElement>>({});
  const imgReady  = useRef<Record<number, boolean>>({});


  const cardViewStart = useRef<number>(0);
  const pauseStart    = useRef<number>(0);
  const totalPaused   = useRef<number>(0);

  const sessionRef = useRef<Session | null>(null);

  
  const [questions, setQuestions] = useState<Question[]>([]);
 
  useEffect(() => {
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('id, riasec_type, title, subtitle, prompt').limit(8); ;

    if (error) {
      console.error(error);
    } else {
      setQuestions(data || []);
    }
  };

  fetchQuestions();
  
}, []);

 


  // Initialize session once on app load
  useEffect(() => {
  

  const startSession = async () => {
    const newSession: Omit<Session, 'completed_at' | 'total_duration_ms'> = {
      device_fingerprint: getDeviceFingerprint(),
      locale: navigator.language,
      platform: navigator.platform,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      images_loaded: false,
      started_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('sessions')
      .insert([newSession])
      .select('id')
      .single();

    if (error) {
      console.error("Failed to start session:", error);
    } else {
      
      sessionRef.current = { ...newSession, id: data.id };
      console.log("[Session started]", sessionRef.current);
    }
  };

  

  // Start session on mount
  startSession();

  
}, []);
  const loadImg = (idx: number, card: HTMLDivElement) => {
    const q    = questions[idx];
    const img  = card.querySelector<HTMLImageElement>(`#img${idx}`)!;
    const skel = card.querySelector<HTMLDivElement>(`#skel${idx}`)!;

    img.onload = () => {
      img.classList.add("vis");
      skel.classList.add("gone");
      imgReady.current[idx] = true;
    };
    img.onerror = () => {
      if (USE_LOCAL && img.src !== pollinationsSrc(q)) {
        img.src = pollinationsSrc(q);
      } else {
        const imgEl = card.querySelector<HTMLDivElement>(".c-img")!;
        imgEl.style.background = `linear-gradient(145deg,${T[q.riasec_type].c}18,${T[q.riasec_type].c}35)`;
        skel.classList.add("gone");
      }
    };
    img.src = imgSrc(q);
    
    
  };
  // ── Card creation ──────────────────────
  const mkCard = useCallback((idx: number): HTMLDivElement => {
    if (pool.current[idx]) return pool.current[idx];

    //const q    = QS[idx];
    const q= questions[idx];
    //const info = T[q.t];
    const info = T[q.riasec_type];
    const card = document.createElement("div");
    card.className   = "card";
    card.dataset.i   = String(idx);

    card.innerHTML = `
      <div class="c-img"><img id="img${idx}" alt="" draggable="false"/></div>
      <div class="c-skel" id="skel${idx}">
        <div class="skel-center">
          <div class="skel-ring"></div>
          <div class="skel-txt">Image IA en cours…</div>
        </div>
      </div>
      <div class="c-overlay"></div>
      <div class="c-info">
        <div class="c-chip" style="background:${info.c}20;color:${info.c}">
          ${q.riasec_type} · ${info.n}
        </div>
        <div class="c-title">${q.title}</div>
        <div class="c-sub">${q.subtitle}</div>
      </div>
      <div class="sw-y">OUI ♥</div>
      <div class="sw-n">NON ✗</div>
    `;

    loadImg(idx, card);
    pool.current[idx] = card;
    
    return card;
  }, [questions]);

  

  // ── Stack render ───────────────────────
  const posCard = (card: HTMLDivElement, depth: number) => {
    const s = 1 - depth * 0.032;
    const y = depth * 9;
    const b = 1 - depth * 0.12;
    card.style.transition = depth === 0 ? "none" : "transform .3s ease,filter .3s ease";
    card.style.transform  = `scale(${s}) translateY(${y}px)`;
    card.style.filter     = depth > 0 ? `brightness(${b})` : "";
    card.style.zIndex     = String(100 - depth);
    card.style.pointerEvents = depth === 0 ? "" : "none";
  };

  const updateHUD = useCallback(() => {
    const c = cur.current;
    if (c >= questions.length) return;

    const q    = questions[c];
    const info = T[q.riasec_type];
    const pct  = Math.round((c / questions.length) * 100);

    if (progFillRef.current) {
      progFillRef.current.style.width      = pct + "%";
      progFillRef.current.style.background = info.c;
    }
    if (qNumRef.current)   qNumRef.current.textContent   = `${c + 1} / ${questions.length}`;
    if (typePillRef.current) {
      typePillRef.current.textContent      = `${q.riasec_type} · ${info.n}`;
      typePillRef.current.style.background = `${info.c}20`;
      typePillRef.current.style.color      = info.c;
      typePillRef.current.style.border     = `1px solid ${info.c}40`;
    }
  }, [questions]);

  
  const renderStack = useCallback(() => {
  const stack = stackRef.current;
  if (!stack) return;
  stack.querySelectorAll<HTMLDivElement>(".card").forEach((c) => {
    const i = Number(c.dataset.i);
    if (i < cur.current || i > cur.current + 3) c.remove();
  });
  for (let d = 2; d >= 0; d--) {
    const i = cur.current + d;
    if (i >= questions.length) continue;
    const c = mkCard(i);
    if (!stack.contains(c)) stack.insertBefore(c, stack.firstChild);
    posCard(c, d);
  }
  updateHUD();

  // NOUVEAU : démarrer le chrono de vue pour la carte du dessus
  totalPaused.current  = 0;
  cardViewStart.current = performance.now();

  for (let i = cur.current; i < Math.min(cur.current + PRELOAD + 1, questions.length); i++) {
    mkCard(i);
  }
}, [mkCard, updateHUD, questions]);

 useEffect(() => {
  if (questions.length > 0) {
    renderStack();
  }
}, [questions, renderStack]);

  // ── Drag ──────────────────────────────
  const snapBack = useCallback(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const c = stack.querySelector<HTMLDivElement>(`.card[data-i="${cur.current}"]`);
    if (!c) return;
    c.style.transition = "transform .45s cubic-bezier(.34,1.56,.64,1)";
    c.style.transform  = "scale(1) translateY(0)";
    const swY = c.querySelector<HTMLElement>(".sw-y");
    const swN = c.querySelector<HTMLElement>(".sw-n");
    if (swY) swY.style.opacity = "0";
    if (swN) swN.style.opacity = "0";
  }, []);

   // ── Results ────────────────────────────
  

  const drawRadar = (sc: Scores) => {
    const cv  = radarRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = 250, H = 250, cx = 125, cy = 125, R = 88;
    const types = ["R", "I", "A", "S", "E", "C"] as const;
    const MAX = 30;

    ctx.clearRect(0, 0, W, H);

    // Grid rings
    [0.2, 0.4, 0.6, 0.8, 1].forEach((f) => {
      ctx.beginPath();
      types.forEach((_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;

        if (i === 0) {
          ctx.moveTo(cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f);
        } else {
          ctx.lineTo(cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,.06)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Spokes
    types.forEach((_, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.strokeStyle = "rgba(255,255,255,.05)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Polygon
    ctx.beginPath();
    types.forEach((t, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const v = (sc[t] / MAX) * R;

      if (i === 0) {
        ctx.moveTo(cx + Math.cos(a) * v, cy + Math.sin(a) * v);
      } else {
        ctx.lineTo(cx + Math.cos(a) * v, cy + Math.sin(a) * v);
      }
    });
    ctx.closePath();
    ctx.fillStyle   = "rgba(255,255,255,.05)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Dots
    types.forEach((t, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const v = (sc[t] / MAX) * R;
      const x = cx + Math.cos(a) * v;
      const y = cy + Math.sin(a) * v;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = T[t].c + "25";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = T[t].c;
      ctx.fill();
    });

    // Labels
    types.forEach((t, i) => {
      const a  = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const lx = cx + Math.cos(a) * (R + 18);
      const ly = cy + Math.sin(a) * (R + 18);
      ctx.font          = "bold 12px Syne,sans-serif";
      ctx.fillStyle     = T[t].c;
      ctx.textAlign     = "center";
      ctx.textBaseline  = "middle";
      ctx.fillText(t, lx, ly);
    });
  };
  const showResults = useCallback(async() => {
    
    console.log("sessionRef.current",sessionRef.current);
    if (!sessionRef.current) return;
    const sessionId=sessionRef.current.id;

    const completed_at = new Date().toISOString();
    const total_duration_ms =
      new Date(completed_at).getTime() - new Date(sessionRef.current.started_at).getTime();

    const { error } = await supabase
      .from('sessions')
      .update({
        completed_at,
        total_duration_ms,
      })
      .eq('id', sessionId);

    if (error) {
      console.error("Failed to complete session:", error);
    } else {
      console.log("[Session completed]", { completed_at, total_duration_ms });
    }
    
    if (resultsRef.current) resultsRef.current.style.display = "block";

    const sc     = scores.current;
    const sorted = Object.entries(sc).sort((a, b) => b[1] - a[1]) as [keyof typeof T, number][];
    const top3   = sorted.slice(0, 3);
    const total  = Object.values(sc).reduce((s, v) => s + v, 0);
    const code   = top3.map(([t]) => t).join("");

    const resCode   = resultsRef.current?.querySelector<HTMLDivElement>("#resCode");
    const resLabels = resultsRef.current?.querySelector<HTMLDivElement>("#resLabels");
    const resTotal  = resultsRef.current?.querySelector<HTMLDivElement>("#resTotal");
    const resBars   = resultsRef.current?.querySelector<HTMLDivElement>("#resBars");
    const resPcards = resultsRef.current?.querySelector<HTMLDivElement>("#resPcards");
    const ctaExplore = resultsRef.current?.querySelector<HTMLButtonElement>("#ctaExplore");

    if (resCode)   resCode.innerHTML   = top3.map(([t]) => `<span style="color:${T[t].c}">${t}</span>`).join("");
    if (resLabels) resLabels.innerHTML = top3.map(([t]) => T[t].n).join(" · ");
    if (resTotal)  resTotal.textContent = `${total} affinités positives sur ${questions.length} situations`;

    drawRadar(sc);

    // Bars
    if (resBars) {
      resBars.innerHTML = "";
      sorted.forEach(([t, v]) => {
        const pct = Math.round((v / 30) * 100);
        const row = document.createElement("div");
        row.className = "bar-row";
        row.innerHTML = `
          <div class="bar-ltr" style="color:${T[t].c}">${t}</div>
          <div class="bar-track">
            <div class="bar-fill" style="background:${T[t].c};width:0%" data-w="${pct}">
              ${v > 0 ? `<span class="bar-n">${v}</span>` : ""}
            </div>
          </div>
          <div class="bar-val">${v}/30</div>
        `;
        resBars.appendChild(row);
      });
      setTimeout(() => {
        resBars.querySelectorAll<HTMLElement>(".bar-fill").forEach(
          (el) => (el.style.width = (el.dataset.w ?? "0") + "%")
        );
      }, 80);
    }

    // Profile cards
    if (resPcards) {
      resPcards.innerHTML = "";
      const ranks = ["Type dominant", "Type secondaire", "Type tertiaire"];
      top3.forEach(([t, v], i) => {
        const pct  = Math.round((v / 30) * 100);
        const card = document.createElement("div");
        card.className  = "pcard";
        card.style.background   = `${T[t].c}0d`;
        card.style.borderColor  = `${T[t].c}22`;
        card.innerHTML = `
          <div class="pc-rank" style="color:${T[t].c}">${ranks[i]}</div>
          <div class="pc-letter" style="color:${T[t].c}">${t}</div>
          <div class="pc-name"   style="color:${T[t].c}">${T[t].n}</div>
          <div class="pc-desc">${T[t].d}</div>
          <div class="pc-bar-wrap">
            <div class="pc-bar" style="background:${T[t].c};width:0%" data-w="${pct}"></div>
          </div>
          <div class="pc-score">${v} affinités sur 30 · ${pct}%</div>
        `;
        resPcards.appendChild(card);
      });
      setTimeout(() => {
        resPcards.querySelectorAll<HTMLElement>(".pc-bar").forEach(
          (el) => (el.style.width = (el.dataset.w ?? "0") + "%")
        );
      }, 150);
    }

    // CTA
    if (ctaExplore) {
      ctaExplore.textContent  = `✦ Explorer les métiers ${code} →`;
      ctaExplore.style.background = T[top3[0][0]].c;
      ctaExplore.onclick = () => {
        /* sendPrompt or navigate */
        console.log(`Explorer le profil RIASEC ${code}`);
      };
    }
  }, []);
  

  const swipe = useCallback((liked: boolean) => {
  if (animLock.current) return;
  animLock.current = true;

  const stack = stackRef.current;
  if (!stack) { animLock.current = false; return; }

  const c = stack.querySelector<HTMLDivElement>(`.card[data-i="${cur.current}"]`);
  if (!c) { animLock.current = false; return; }

  const q = questions[cur.current];
  if (liked) scores.current[q.riasec_type as keyof Scores]++;

  // NOUVEAU : durée de vue réelle (pause soustraite)
  const rawDuration  = performance.now() - cardViewStart.current;
  const viewDuration = Math.round(rawDuration - totalPaused.current);
  const absoluteTs   = Date.now(); // NOUVEAU : timestamp absolu pour base de données

  history.current.push({
    idx:             cur.current,
    liked:           liked,
    view_duration_ms: viewDuration,   // NOUVEAU
    created_at:       absoluteTs,     // NOUVEAU
  });

  console.debug("[swipe]", {
  "Item ID": q.id,
  "Liked": liked ? "Yes" : "No",
  "View Duration": `${(viewDuration / 1000).toFixed(1)} s`,
  "Timestamp": new Date(absoluteTs).toLocaleString()
  });
  const tx = liked ? window.innerWidth + 300 : -(window.innerWidth + 300);
  c.style.transition = "transform .36s ease-in,opacity .36s ease-in";
  c.style.transform  = `translateX(${tx}px) rotate(${liked ? 28 : -28}deg)`;
  c.style.opacity    = "0";

  const feedback = c.querySelector<HTMLElement>(liked ? ".sw-y" : ".sw-n");
  if (feedback) feedback.style.opacity = "1";

  setTimeout(() => {
    c.remove();
    cur.current++;
    animLock.current = false;

    if (cur.current >= questions.length) {
      if (doneRef.current) doneRef.current.style.display = "flex";
      setTimeout(showResults, 700);
    } else {
      renderStack();
    }
  }, 370);
}, [renderStack, showResults,questions]);

  

  const onDS = useCallback((e: PointerEvent) => {
  if (animLock.current) return;
  dragState.current = {
    sx: e.clientX,
    cx: e.clientX,
    pressure: e.pressure,       // NOUVEAU : pression du doigt (0–1)
    tiltX:    e.tiltX,          // NOUVEAU : angle stylet
    tiltY:    e.tiltY,
    dragStart: performance.now(), // NOUVEAU : timing précis sub-ms
  };
  const stack = stackRef.current;
  const c = stack?.querySelector<HTMLDivElement>(`.card[data-i="${cur.current}"]`);
  if (c) {
    c.style.transition = "none";
    // (stack as HTMLDivElement).setPointerCapture(e.pointerId); // NOUVEAU : capture pointer mobile
    c.setPointerCapture(e.pointerId);
  }
}, []);

  

  const onDM = useCallback((e: PointerEvent) => {
  if (!dragState.current) return;
  const x = e.clientX;
  dragState.current.cx = x;
  const stack = stackRef.current;
  const c = stack?.querySelector<HTMLDivElement>(`.card[data-i="${cur.current}"]`);
  if (!c) return;
  const dx = x - dragState.current.sx;
  c.style.transform = `translateX(${dx}px) rotate(${dx * 0.06}deg)`;
  const r = Math.min(Math.abs(dx) / 80, 1);
  const swY = c.querySelector<HTMLElement>(".sw-y");
  const swN = c.querySelector<HTMLElement>(".sw-n");
  if (swY) swY.style.opacity = dx > 0 ? String(r) : "0";
  if (swN) swN.style.opacity = dx < 0 ? String(r) : "0";
}, []);

  
  //const onDE = useCallback((e: PointerEvent) => {
  const onDE = useCallback(() => {
  
  if (!dragState.current) return;
  const dx       = dragState.current.cx - dragState.current.sx;
  const dragMs   = performance.now() - (dragState.current.dragStart ?? performance.now()); // NOUVEAU
  const pressure = dragState.current.pressure ?? 0; // NOUVEAU
  dragState.current = null;
  const dragS= `${(dragMs / 1000).toFixed(1)} s`;

  // NOUVEAU : log comportemental (drag_duration_ms, pressure disponible sur Android)
  console.debug("[drag]", { dx, dragS, pressure });

  if      (dx >  80) swipe(true);
  else if (dx < -80) swipe(false);
  else               snapBack();
}, [swipe, snapBack]);

  

  // ── Restart ────────────────────────────
  const restartGame = useCallback(() => {
    cur.current     = 0;
    scores.current  = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    history.current = [];

    Object.keys(pool.current).forEach((k) => {
      const card = pool.current[Number(k)];
      if (card.parentNode) card.remove();
      delete pool.current[Number(k)];
    });

    if (resultsRef.current) resultsRef.current.style.display = "none";
    if (doneRef.current)    doneRef.current.style.display    = "none";

    renderStack();
  }, [renderStack]);

  
  
  useEffect(() => {
  const stack = stackRef.current;
  if (!stack) return;

  // NOUVEAU : PointerEvents unifie mouse + touch en 3 listeners
  const handlePointerDown = (e: PointerEvent) => onDS(e);
  const handlePointerMove = (e: PointerEvent) => onDM(e);
  const handlePointerUp   = () => onDE();
  //const handlePointerUp   = (e: PointerEvent) => onDE(e);
  stack.addEventListener("pointerdown", handlePointerDown);
  document.addEventListener("pointermove", handlePointerMove);
  document.addEventListener("pointerup",   handlePointerUp);

  
  const onVisibility = () => {
  if (document.hidden) {
    pauseStart.current = performance.now();
    flush(); // ← fusionner flush ici
  } else {
    totalPaused.current += performance.now() - pauseStart.current;
  }
};
  document.addEventListener("visibilitychange", onVisibility);

  // NOUVEAU : sendBeacon — garantit l'envoi même à la fermeture de l'onglet
  const flush = () => {
    const payload = JSON.stringify({
      scores:  scores.current,
      history: history.current,
      flushed_at: Date.now(), // timestamp absolu
    });
    navigator.sendBeacon("/api/session", payload);
  };
  // document.addEventListener("visibilitychange", () => {
  //   if (document.hidden) flush();
  // });
  document.removeEventListener("visibilitychange", onVisibility); 
  window.addEventListener("beforeunload", flush);

  renderStack();

  return () => {
    stack.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup",   handlePointerUp);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("beforeunload", flush);
  };
}, [onDS, onDM, onDE, renderStack]);

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <>
    <style>{`
    
		/* ═══════════════════════════════════════════════
   DESIGN SYSTEM — Dark luxury, editorial
   ═══════════════════════════════════════════════ */:root
		{
			--bg: #06060A;
			--surface: rgba(255, 255, 255, .04);
			--border: rgba(255, 255, 255, .08);
			--R: #FF6B35;
			--I: #3B82F6;
			--A: #A855F7;
			--S: #10B981;
			--E: #EF4444;
			--C: #F59E0B;
			--green: #4ade80;
			--red: #f87171;
		}
		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
			-webkit-tap-highlight-color: transparent;
			-webkit-user-select: none;
			user-select: none
		}
		html,
		body {
			height: 100%;
			overflow: hidden;
			background: var(--bg)
		}
		body {
			font-family: 'DM Sans', sans-serif;
			display: flex;
			flex-direction: column;
			align-items: center
		}

		/* ── TOP BAR ── */
		.topbar {
			width: 100%;
			max-width: 460px;
			padding: 16px 20px 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-shrink: 0;
			z-index: 10;
		}
		.logo {
			font-family: 'Syne', sans-serif;
			font-size: 0.8rem;
			font-weight: 800;
			letter-spacing: 0.2em;
			color: rgba(255, 255, 255, .8);
			text-transform: uppercase;
		}
		.topright {
			display: flex;
			align-items: center;
			gap: 8px
		}
		.type-pill {
			font-size: 0.65rem;
			font-weight: 700;
			letter-spacing: 0.07em;
			text-transform: uppercase;
			padding: 3px 10px;
			border-radius: 100px;
			transition: all 0.35s ease;
		}
		.q-num {
			font-size: 0.7rem;
			color: rgba(255, 255, 255, .3);
			background: rgba(255, 255, 255, .05);
			padding: 3px 9px;
			border-radius: 100px;
			letter-spacing: 0.04em;
		}

		/* ── PROGRESS BAR ── */
		.progress-wrap {
			width: 100%;
			max-width: 460px;
			padding: 10px 20px 0;
			flex-shrink: 0
		}
		.prog-track {
			height: 2px;
			background: rgba(255, 255, 255, .07);
			border-radius: 2px;
			overflow: hidden
		}
		.prog-fill {
			height: 100%;
			border-radius: 2px;
			transition: width 0.45s ease, background 0.4s
		}

		/* ── CARD STACK ── */
		.stack {
			flex: 1;
			width: 100%;
			max-width: 460px;
			position: relative;
			padding: 10px 14px 0;
			overflow: hidden;
		}

		.card img {
			pointer-events: none;
		}
		.card {
			-webkit-user-drag: none;
			user-drag: none;
		}

		.card {
			position: absolute;
			inset: 0;
			margin: 0;
			border-radius: 24px;
			overflow: hidden;
			touch-action: none;
			will-change: transform;
			cursor: grab;
		}
		.card:active {
			cursor: grabbing
		}

		/* Image layer */
		.c-img {
			position: absolute;
			inset: 0;
			background: #0d0d18
		}
		.c-img img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
			opacity: 0;
			transition: opacity 0.5s ease;
		}
		.c-img img.vis {
			opacity: 1
		}

		/* Skeleton */
		.c-skel {
			position: absolute;
			inset: 0;
			background: linear-gradient(135deg,#0f0f1a,#1a1a2e,#0f0f1a);
			background-size: 300% 300%;
			animation: shim 2s ease-in-out infinite;
			transition: opacity 0.4s;
		}
		.c-skel.gone {
			opacity: 0;
			pointer-events: none
		}
		@keyframes shim {
			0% {
				background-position: 0 50%
			}
			50% {
				background-position: 100% 50%
			}
			100% {
				background-position: 0 50%
			}
		}

		.skel-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;
		}
		.skel-ring {
			width: 44px;
			height: 44px;
			border-radius: 50%;
			border: 2px solid rgba(255, 255, 255, .08);
			border-top-color: rgba(255, 255, 255, .4);
			animation: spin 0.9s linear infinite;
		}
		@keyframes spin {
			to {
				transform: rotate(360deg)
			}
		}
		.skel-txt {
			font-size: 0.65rem;
			letter-spacing: 0.1em;
			color: rgba(255, 255, 255, .25);
			text-transform: uppercase;
			font-weight: 500
		}

		/* Gradient overlay */
		.c-overlay {
			position: absolute;
			inset: 0;
			pointer-events: none;
			background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.2) 55%, rgba(0,0,0,.7) 78%, rgba(0,0,0,.95) 100%);
		}

		/* Card text */
		.c-info {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 22px 22px 28px
		}
		.c-chip {
			display: inline-flex;
			align-items: center;
			gap: 4px;
			padding: 3px 10px;
			border-radius: 100px;
			margin-bottom: 9px;
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			backdrop-filter:blur(16px);
			border: 1px solid rgba(255, 255, 255, .12);
		}
		.c-title {
			font-family: 'Syne', sans-serif;
			font-size: 1.2rem;
			font-weight: 700;
			color: #fff;
			line-height: 1.25;
			margin-bottom: 4px;
			text-shadow: 0 2px 12px rgba(0, 0, 0, .5);
		}
		.c-sub {
			font-size: 0.8rem;
			font-weight: 300;
			font-style: italic;
			color: rgba(255, 255, 255, .55);
			line-height: 1.5;
		}

		/* Swipe feedback */
		.sw-y,
		.sw-n {
			position: absolute;
			top: 26px;
			font-family: 'Syne', sans-serif;
			font-size: 1.4rem;
			font-weight: 800;
			padding: 7px 16px;
			border-radius: 10px;
			border: 3px solid;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.04s;
		}
		.sw-y {
			left: 18px;
			color: var(--green);
			border-color: var(--green);
			transform: rotate(-12deg)
		}
		.sw-n {
			right: 18px;
			color: var(--red);
			border-color: var(--red);
			transform: rotate(12deg)
		}

		/* ── ACTION BUTTONS ── */
		.actions {
			width: 100%;
			max-width: 460px;
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 16px;
			padding: 10px 20px 14px;
			flex-shrink: 0;
		}
		.abtn {
			border: none;
			cursor: pointer;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: inherit;
			transition: transform 0.12s, box-shadow 0.18s;
			backdrop-filter:blur(8px);
		}
		.abtn:active {
			transform: scale(0.88) !important
		}
		.abtn-undo {
			width: 46px;
			height: 46px;
			font-size: 1rem;
			background: rgba(255, 255, 255, .04);
			border: 1.5px solid rgba(255, 255, 255, .1);
			color: rgba(255, 255, 255, .3);
		}
		.abtn-undo:hover {
			background: rgba(255, 255, 255, .08);
			color: rgba(255, 255, 255, .55)
		}
		.abtn-pass {
			width: 60px;
			height: 60px;
			font-size: 1.5rem;
			background: rgba(248, 113, 113, .08);
			border: 1.5px solid rgba(248, 113, 113, .25);
			color: var(--red);
		}
		.abtn-pass:hover {
			box-shadow: 0 0 22px rgba(248, 113, 113, .25)
		}
		.abtn-like {
			width: 74px;
			height: 74px;
			font-size: 1.8rem;
			background: rgba(74, 222, 128, .08);
			border: 1.5px solid rgba(74, 222, 128, .28);
			color: var(--green);
		}
		.abtn-like:hover {
			box-shadow: 0 0 28px rgba(74, 222, 128, .3)
		}
		.hint {
			font-size: 0.64rem;
			color: rgba(255, 255, 255, .18);
			letter-spacing: 0.04em;
			text-align: center;
			padding: 0 0 10px;
			flex-shrink: 0;
		}

		/* ── EMPTY STACK ── */
		.done-state {
			position: absolute;
			inset: 0;
			display: none;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 14px;
		}
		.done-icon {
			font-family: 'Syne', sans-serif;
			font-size: 4rem;
			font-weight: 800;
			opacity: .08
		}
		.done-txt {
			font-size: 0.85rem;
			color: rgba(255, 255, 255, .2);
			letter-spacing: 0.04em
		}

		/* ── RESULTS FULL SCREEN ── */
		#resultsScreen {
			display: none;
			position: fixed;
			inset: 0;
			background: var(--bg);
			overflow-y: auto;
			z-index: 300;
			padding-bottom: 50px;
		}
		.res-wrap {
			width: 100%;
			max-width: 460px;
			margin: 0 auto;
			padding: 26px 18px
		}

		.res-hero {
			text-align: center;
			padding: 30px 20px 24px;
			background: var(--surface);
			border: 1px solid var(--border);
			border-radius: 22px;
			margin-bottom: 22px;
			position: relative;
			overflow: hidden;
		}
		.res-hero::before {
			content: '';
			position: absolute;
			inset: 0;
			background: radial-gradient(ellipse at 50% -20%,rgba(255,255,255,.04),transparent 70%);
			pointer-events: none;
		}
		.res-code {
			font-family: 'Syne', sans-serif;
			font-size: clamp(3rem, 12vw, 5rem);
			font-weight: 800;
			letter-spacing: 0.18em;
			line-height: 1;
			margin-bottom: 8px;
		}
		.res-code-labels {
			font-size: 0.78rem;
			color: rgba(255, 255, 255, .32);
			letter-spacing: 0.04em;
			line-height: 1.6
		}
		canvas {
			display: block;
			margin: 22px auto 0
		}
		.res-total {
			font-size: 0.68rem;
			color: rgba(255, 255, 255, .18);
			margin-top: 10px;
			letter-spacing: 0.03em
		}

		.sec-title {
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.13em;
			text-transform: uppercase;
			color: rgba(255, 255, 255, .22);
			margin: 22px 0 10px;
		}

		/* Bars */
		.bar-row {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 8px
		}
		.bar-ltr {
			font-size: 0.8rem;
			font-weight: 700;
			min-width: 16px
		}
		.bar-track {
			flex: 1;
			height: 12px;
			background: rgba(255, 255, 255, .04);
			border-radius: 6px;
			overflow: hidden
		}
		.bar-fill {
			height: 100%;
			border-radius: 6px;
			transition: width 1s cubic-bezier(0.34,1.56,0.64,1);
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 5px
		}
		.bar-n {
			font-size: 8px;
			font-weight: 700;
			color: rgba(0, 0, 0, .65)
		}
		.bar-val {
			font-size: 0.68rem;
			color: rgba(255, 255, 255, .28);
			min-width: 42px;
			text-align: right
		}

		/* Profile cards */
		.pcards {
			display: grid;
			gap: 10px;
			margin-top: 10px
		}
		.pcard {
			border-radius: 16px;
			padding: 16px;
			border: 1px solid rgba(255, 255, 255, .06);
			position: relative;
			overflow: hidden;
		}
		.pcard::before {
			content: '';
			position: absolute;
			top: -50px;
			right: -50px;
			width: 130px;
			height: 130px;
			border-radius: 50%;
			opacity: .1;
			filter:blur(50px);
			pointer-events: none;
		}
		.pc-rank {
			font-size: 0.6rem;
			font-weight: 700;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			opacity: .5;
			margin-bottom: 3px
		}
		.pc-letter {
			font-family: 'Syne', sans-serif;
			font-size: 2.4rem;
			font-weight: 800;
			line-height: 1
		}
		.pc-name {
			font-size: 0.8rem;
			font-weight: 500;
			margin-top: 2px;
			opacity: .85
		}
		.pc-desc {
			font-size: 0.74rem;
			opacity: .45;
			margin-top: 7px;
			line-height: 1.65
		}
		.pc-bar-wrap {
			height: 3px;
			background: rgba(255, 255, 255, .07);
			border-radius: 2px;
			margin-top: 12px;
			overflow: hidden
		}
		.pc-bar {
			height: 100%;
			border-radius: 2px;
			transition: width 1.1s cubic-bezier(0.34,1.56,0.64,1)
		}
		.pc-score {
			font-size: 0.66rem;
			opacity: .35;
			margin-top: 4px
		}

		/* Buttons */
		.cta-btn {
			width: 100%;
			padding: 15px;
			border-radius: 14px;
			border: none;
			font-family: 'DM Sans', sans-serif;
			font-size: 0.9rem;
			font-weight: 600;
			cursor: pointer;
			margin-top: 10px;
			transition: 0.18s;
			letter-spacing: 0.02em;
		}
		.cta-primary {
			color: #fff
		}
		.cta-primary:hover {
			filter:brightness(1.1);
			transform: translateY(-1px)
		}
		.cta-ghost {
			background: rgba(255, 255, 255, .05);
			color: rgba(255, 255, 255, .5);
		}
		.cta-ghost:hover {
			background: rgba(255, 255, 255, .09);
			color: #fff
		}


    `}</style>
      {/* ── TOP BAR ── */}
      <div className="topbar">
        <div className="logo">RIASEC · AI</div>
        <div className="topright">
          <div className="type-pill" ref={typePillRef} />
          <div className="q-num"    ref={qNumRef}>1 / 180</div>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="progress-wrap">
        <div className="prog-track">
          <div className="prog-fill" ref={progFillRef} style={{ width: "0%" }} />
        </div>
      </div>

      {/* ── CARD STACK ── */}
      <div className="stack" ref={stackRef}>
        <div className="done-state" ref={doneRef}>
          <div className="done-icon">✦</div>
          <div className="done-txt">Calcul de ton profil…</div>
        </div>
      </div>

      {/* ── ACTION BUTTONS ── */}
      <div className="actions">
        <button
          className="abtn abtn-undo"
          onClick={() => {
            if (history.current.length === 0 || animLock.current) return;
            const last = history.current.pop()!;
            if (last.liked) scores.current[questions[last.idx].riasec_type as keyof Scores]--;
            const top = stackRef.current?.querySelector<HTMLDivElement>(`.card[data-i="${cur.current}"]`);
            if (top) top.remove();
            delete pool.current[last.idx];
            cur.current = last.idx;
            renderStack();
          }}
        >↩</button>

        <button className="abtn abtn-pass" onClick={() => { if (!animLock.current) swipe(false); }}>✕</button>
        <button className="abtn abtn-like" onClick={() => { if (!animLock.current) swipe(true);  }}>♥</button>
      </div>

      <div className="hint">← Passer &nbsp;·&nbsp; ♥ J'aime →</div>

      {/* ── RESULTS SCREEN ── */}
      <div id="resultsScreen" ref={resultsRef} style={{ display: "none" }}>
        <div className="res-wrap">
          <div className="res-hero">
            <div className="res-code"        id="resCode" />
            <div className="res-code-labels" id="resLabels" />
            <canvas ref={radarRef} id="radar" width={250} height={250} />
            <div className="res-total" id="resTotal" />
          </div>

          <div className="sec-title">Scores par type</div>
          <div id="resBars" />

          <div className="sec-title">Ton profil détaillé</div>
          <div className="pcards" id="resPcards" />

          <button className="cta-btn cta-primary" id="ctaExplore" />
          <button className="cta-btn cta-ghost"   onClick={restartGame}>↺ Recommencer</button>
        </div>
      </div>
    </>
  );
}