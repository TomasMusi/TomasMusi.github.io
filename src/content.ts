export type Lang = 'cs' | 'en'
export type T = Record<Lang, string>

export const profile = {
  name: 'Tomáš Musil',
  role: { cs: 'Software & Backend Developer', en: 'Software & Backend Developer' } as T,
  tagline: {
    cs: 'Zajímám se o desktopové aplikace, embedded systémy a ML/AI.',
    en: 'Interested in desktop apps, embedded systems & ML/AI.',
  } as T,
  intro: {
    cs: 'Student IT střední školy s praxí full-stack vývojáře. Pracuji hlavně s C#/.NET, Reactem a TypeScriptem a aktuálně stavím AI agenty, kteří automatizují právní workflow. Nejradši mám C#, a mimo web mě nejvíc baví embedded systémy.',
    en: 'IT high school student with hands-on experience as a full-stack developer, working mainly with C#/.NET, React and TypeScript. Currently building AI agents that automate legal workflows. C# is my favourite, and outside of the web I have a strong interest in embedded systems.',
  } as T,
  about: {
    cs: 'Technologie ke mně patřily odjakživa. Většinu volného času dnes trávím stavěním projektů s Arduinem a Raspberry Pi. Mimo techniku trénuji zápas a brazilské jiu-jitsu (BJJ).',
    en: 'Technology has always been a part of who I am. These days I spend most of my free time building projects with Arduino and Raspberry Pi. Outside of tech, I train wrestling and Brazilian Jiu-Jitsu (BJJ).',
  } as T,
  location: { cs: 'Brno, Česko', en: 'Brno, Czech Republic' } as T,
  email: 'tomas.musilmt@gmail.com',
  github: 'https://github.com/TomasMusi',
  linkedin: 'https://www.linkedin.com/in/tom%C3%A1%C5%A1-musil-82755537b/',
  cv: '/Tomas_Musil_CV.pdf',
}

export type Job = {
  role: T
  company: string
  kind: T
  period: T
  place?: T
  points: T[]
  tech: string[]
  current?: boolean
}

export const jobs: Job[] = [
  {
    role: { cs: 'Full-Stack Developer', en: 'Full-Stack Developer' },
    company: 'HAVEL & PARTNERS',
    kind: { cs: 'Částečný úvazek · hybridně', en: 'Part-time · hybrid' },
    period: { cs: '10/2025 – současnost', en: 'Oct 2025 – Present' },
    current: true,
    points: [
      {
        cs: 'Stavím AI agenty, kteří automatizují právní workflow.',
        en: 'Building AI agents that automate legal workflows.',
      },
      {
        cs: 'Vyvíjím frontend i backend interního softwaru, který používají právníci napříč celou firmou.',
        en: "Developing frontend and backend of the firm's internal legal software, used by lawyers across the entire firm.",
      },
    ],
    tech: ['C#', 'Python', 'React', 'MySQL', 'Azure'],
  },
  {
    role: { cs: 'Full-Stack Developer', en: 'Full-Stack Developer' },
    company: 'eSports.cz',
    kind: { cs: 'Na volné noze', en: 'Contract' },
    period: { cs: '9/2025 – 2/2026', en: 'Sep 2025 – Feb 2026' },
    points: [
      { cs: 'Vyvinul jsem backend pro Chance Liga Fantasy.', en: 'Developed the backend for Chance Liga Fantasy.' },
      {
        cs: 'Menší webové aplikace pro různé sportovní týmy.',
        en: 'Built smaller web applications for various sports teams.',
      },
    ],
    tech: ['C#', 'TypeScript', 'React', 'Git'],
  },
  {
    role: { cs: 'Backend Developer', en: 'Backend Developer' },
    company: 'StanekTech',
    kind: { cs: 'Živnostník · na dálku', en: 'Contract · remote' },
    period: { cs: '1/2025 – 10/2025', en: 'Jan 2025 – Oct 2025' },
    points: [
      {
        cs: 'Webové a mobilní aplikace a e-shopy pro klienty.',
        en: 'Developed web and mobile applications and e-commerce stores for clients.',
      },
      {
        cs: 'Například React Native aplikace a web pro energetickou firmu Electree.',
        en: 'Example: React Native mobile app and website for the energy company Electree.',
      },
    ],
    tech: ['C#', 'TypeScript', 'React', 'React Native'],
  },
]

export type Project = {
  id: string
  name: string
  kicker: T
  period: T
  summary: T
  body: T[]
  steps?: { title: T; text: T }[]
  highlights: T[]
  tech: string[]
  accent: 'orange' | 'mint' | 'red'
  image?: { src: string; alt: T }
}

export const projects: Project[] = [
  {
    id: 'pillsken',
    name: 'Pill sken',
    kicker: { cs: 'Rakathon 2026 · AI ve zdravotnictví', en: 'Rakathon 2026 · AI in healthcare' },
    period: { cs: '2026', en: '2026' },
    summary: {
      cs: 'Pill sken převede fotku krabičky léku či poznámky pomocí AI na přehledný seznam medikací, který pacient bezpečně předá lékaři.',
      en: 'Pill sken uses AI to turn a photo of a medicine box or a handwritten note into a clear list of medications that the patient can safely hand over to their doctor.',
    },
    body: [
      {
        cs: 'Problém: Pacienti, zvlášť onkologičtí, často užívají mnoho léků od různých lékařů. V ordinaci si nepamatují přesné názvy, síly ani dávkování a lékař nemá úplný přehled. Ruční přepisování je pomalé a chybové a snadno se přehlédnou interakce i duplicity účinných látek.',
        en: "The problem: patients, especially oncology patients, often take many medicines prescribed by different doctors. At the appointment they don't remember exact names, strengths or dosages, so the doctor lacks the full picture. Manual transcription is slow and error-prone, and interactions or duplicate active substances are easy to miss.",
      },
      {
        cs: 'Řešení: mobilní webová aplikace, která z fotky udělá strukturovaný záznam o léku. Lékař dostane přehlednou tabulku s řazením a volitelnými moduly — interakce, souvislost s onkologickou léčbou a duplicita účinných látek — a každou automaticky vyplněnou hodnotu může upravit, takže AI a vytížený lékař spolupracují.',
        en: 'The solution: a mobile web app that turns a photo into a structured medication record. The doctor gets a clear, sortable table with optional modules — interactions, relation to oncology treatment and duplicate active substances — and can edit every auto-filled value, so AI and a busy doctor work together.',
      },
      {
        cs: 'Aplikaci jsme postavili od nuly, s využitím veřejně dostupných seznamů léků a knihovny obrázků krabiček.',
        en: 'We built the app from scratch, using only publicly available drug lists and a library of medicine-box images.',
      },
    ],
    steps: [
      {
        title: { cs: 'Sken', en: 'Scan' },
        text: {
          cs: 'Pacient vyfotí krabičku nebo ručně psanou poznámku. AI vytáhne název, sílu, dávkování a účinnou látku.',
          en: 'The patient snaps the box or a handwritten note. AI extracts the name, strength, dosage and active substance.',
        },
      },
      {
        title: { cs: 'Kontrola', en: 'Review' },
        text: {
          cs: 'Pacient údaje zkontroluje, případně opraví, a uloží do osobní knihovny léků.',
          en: 'The patient reviews and corrects the data, then saves it to a personal medicine library.',
        },
      },
      {
        title: { cs: 'Ruční přidání', en: 'Manual entry' },
        text: {
          cs: 'Bez krabičky lze lék zapsat ručně — aplikace zápis porovná s databází léků a upozorní na chyby.',
          en: 'No box at hand? Type it in — the app checks the entry against a drug database and flags mistakes.',
        },
      },
      {
        title: { cs: 'Knihovna', en: 'Library' },
        text: {
          cs: 'Léky lze procházet, hledat, řadit a filtrovat podle názvu, dávkování a dalších údajů.',
          en: 'Browse, search, sort and filter medicines by name, dosage and more.',
        },
      },
      {
        title: { cs: 'Export lékaři', en: 'Share with doctor' },
        text: {
          cs: 'Pacient vybere léky a vygeneruje QR kód s PINem platným jednu minutu. Lékař ho naskenuje nebo zadá PIN.',
          en: 'The patient picks medicines and generates a QR code with a PIN valid for one minute. The doctor scans it or enters the PIN.',
        },
      },
    ],
    highlights: [
      {
        cs: 'Anonymní účet — jen přezdívka, bez jména a data narození',
        en: 'Anonymous account — nickname only, no name or date of birth',
      },
      {
        cs: 'Data se předávají jen osobně, na vyžádání a krátce platným kódem',
        en: 'Data is shared only in person, on request, with a short-lived code',
      },
      {
        cs: 'Po skončení relace se data smažou ze serverů a zůstávají jen v zařízení pacienta',
        en: "After the session the data is deleted from the servers and stays only on the patient's device",
      },
    ],
    tech: [],
    accent: 'red',
    image: {
      src: 'pillsken',
      alt: {
        cs: 'Pill sken — ukázka mobilní aplikace a pohledu lékaře',
        en: "Pill sken — the mobile app and the doctor's view",
      },
    },
  },
  {
    id: 'yspace',
    name: 'YSpace · CIMER',
    kicker: { cs: 'Studentský satelit · FEKT VUT', en: 'Student satellite · FEKT VUT' },
    period: { cs: '2025 – 2026 · 5 měsíců', en: '2025 – 2026 · 5 months' },
    summary: {
      cs: 'Výzkum a vývoj satelitních technologií na Fakultě elektrotechniky a komunikačních technologií VUT v Brně.',
      en: 'Research and development of satellite technology at the Faculty of Electrical Engineering and Communication, Brno University of Technology.',
    },
    body: [
      {
        cs: 'Programoval jsem komunikační protokoly pro firmware satelitu.',
        en: "I programmed communication protocols for the satellite's firmware.",
      },
      {
        cs: 'Podílel jsem se na návrhových výzvách projektu a spolupracoval s týmem na řešeních pro družicový výzkum.',
        en: "I took part in the project's design challenges and worked with the team on solutions for satellite research.",
      },
    ],
    highlights: [
      {
        cs: 'CIMER vybrán do programu ESA Fly Your Satellite! Design Booster',
        en: 'CIMER selected for ESA Fly Your Satellite! Design Booster',
      },
      {
        cs: 'Mentoring, workshopy a testovací zázemí ESA',
        en: 'ESA mentoring, workshops and test facilities',
      },
    ],
    tech: ['C', 'C++', 'Firmware'],
    accent: 'mint',
  },
  {
    id: 'linearium',
    name: 'Lineárium',
    kicker: { cs: 'Starší projekt · bývalý vedoucí týmu', en: 'Past project · former team lead' },
    period: { cs: '2025 · již se nepodílím', en: '2025 · no longer involved' },
    summary: {
      cs: 'Pokračování prototypu z Hackathonu 2025 — matematické funkce jako hra pro školy. Jde o starší projekt, na kterém se již nepodílím.',
      en: 'The continuation of our Hackathon 2025 prototype — mathematical functions turned into a game for schools. This is a past project I am no longer involved in.',
    },
    body: [
      {
        cs: 'Cílem je zpřístupnit a zatraktivnit výuku matematiky pomocí herních mechanik, vizualizace a interaktivních úloh.',
        en: 'The goal is to make learning maths more accessible and engaging through game mechanics, visualisation and interactive tasks.',
      },
      {
        cs: 'Vedl jsem programátorský tým — koordinoval frontend i backend, rozděloval úkoly, řešil technickou architekturu a hlídal, aby vývoj byl plynulý, kvalitní a udržitelný.',
        en: 'I led the engineering team — coordinating frontend and backend, splitting work, owning the technical architecture and keeping development smooth, high-quality and sustainable.',
      },
      {
        cs: 'Projekt na hackathonu nadchl kreativního ředitele Bohemia Interactive, se kterým jsem pak úzce spolupracoval — pomáhal nám s vizuálním a uživatelským směrem hry.',
        en: 'At the hackathon the project caught the attention of the creative director of Bohemia Interactive, whom I then worked closely with on shaping the visual and user-experience direction of the game.',
      },
    ],
    highlights: [
      { cs: 'Tým se rozrostl o další vývojáře a designéry', en: 'Team grew with more developers and designers' },
      { cs: 'Směřoval ke školnímu a edukačnímu využití', en: 'Aimed at real use in schools' },
      {
        cs: 'Úzká spolupráce s kreativním ředitelem Bohemia Interactive',
        en: 'Close collaboration with the creative director of Bohemia Interactive',
      },
    ],
    tech: ['React', 'TypeScript', 'C#', '.NET'],
    accent: 'orange',
  },
]

export type Award = { name: string; result?: T; year?: string; note?: T }

export const awards: Award[] = [
  {
    name: 'Rakathon',
    year: '2026',
    note: { cs: 'Výzva PillGaze', en: 'PillGaze challenge' },
  },
  { name: 'ExxonMobil', year: '2026' },
  { name: 'Samsung Solve for Tomorrow', year: '2026' },
  { name: 'AT&T Hackathon Junior', year: '2025' },
]

export const rakathon = {
  title: { cs: 'Rakathon 2026 — až do finále', en: 'Rakathon 2026 — all the way to the final' },
  body: [
    {
      cs: 'S týmem jsme se probojovali až do finále v Praze. Úkolem bylo vyvinout aplikaci pro výzvu PillGaze — ve velmi krátkém čase zpracovat zadání, navrhnout řešení, rozdělit role a proměnit to ve funkční prototyp.',
      en: 'Our team made it all the way to the final in Prague. The task was to build an app for the PillGaze challenge — in very little time we had to digest the brief, design a solution, split roles and turn it into a working prototype.',
    },
    {
      cs: 'Pohybovali jsme se mezi lékaři a IT odborníky a mohli jsme řešení probrat s lidmi, kteří problematiku znají z praxe. Finále navíc navštívil premiér i ministr zdravotnictví.',
      en: 'We worked alongside doctors and IT experts and could discuss our solution with people who know the problem first-hand. The final was also attended by the Prime Minister and the Minister of Health.',
    },
  ] as T[],
  team: 'Davyd Steslavskyi · Jiří Pölzer · Tobiáš Trkan',
}

export const juniorHack = {
  title: { cs: 'Junior HackAthon 2025', en: 'Junior HackAthon 2025' },
  body: {
    cs: 'Skvělá zkušenost plná inspirace, intenzivního učení a týmové spolupráce. Výzva, ale i příležitost posunout naše dovednosti na další úroveň.',
    en: 'A great experience full of inspiration, intense learning and teamwork. A challenge, but also a chance to push our skills to the next level.',
  } as T,
  team: 'Tomáš Adam · Davyd Steslavskyi',
}

export const skills: { group: T; items: string[] }[] = [
  { group: { cs: 'Jazyky', en: 'Languages' }, items: ['C#', 'C', 'C++', 'TypeScript', 'Python'] },
  {
    group: { cs: 'Frameworky', en: 'Frameworks' },
    items: ['.NET', 'Entity Framework', 'React', 'React Native'],
  },
  { group: { cs: 'Databáze', en: 'Databases' }, items: ['MySQL', 'PostgreSQL'] },
  {
    group: { cs: 'Nástroje', en: 'Tools' },
    items: ['Git', 'Docker', 'Linux', 'CI/CD', 'SSMS', 'Azure'],
  },
  {
    group: { cs: 'Hardware', en: 'Hardware' },
    items: ['Arduino', 'Raspberry Pi'],
  },
]

export const education = {
  field: { cs: 'Informační technologie', en: 'Information Technology' } as T,
  school: { cs: 'EDUCAnet Brno — střední odborná škola', en: 'EDUCAnet Brno — Secondary Vocational School' } as T,
  period: { cs: '9/2023 – současnost', en: 'Sep 2023 – Present' } as T,
}


export type Photo = { src: string; alt: T; tall?: boolean }

// Order matters: the tall photos sit at positions 3 and 6 so the 3-column dense grid packs into
// exactly 5 full rows (and 7 rows on mobile, where the last tall one renders short).
export const gallery: Photo[] = [
  { src: 'att-team', alt: { cs: 'AT&T Hackathon Junior 2025 — sledujeme prezentace', en: 'AT&T Hackathon Junior 2025 — watching the pitches' } },
  { src: 'pitch-2', alt: { cs: 'Prezentace řešení před porotou', en: 'Pitching our solution to the jury' } },
  { src: 'teamwork', alt: { cs: 'Práce v týmu během hackathonu', en: 'Teamwork during the hackathon' }, tall: true },
  { src: 'coding', alt: { cs: 'Programování v hledišti', en: 'Coding in the lecture hall' } },
  { src: 'group-1', alt: { cs: 'Všichni účastníci Rakathonu Brno', en: 'All Rakathon Brno participants' } },
  { src: 'finalists', alt: { cs: 'Týmy na pódiu', en: 'Teams on stage' }, tall: true },
  { src: 'exxon-2nd', alt: { cs: 'ExxonMobil 2026', en: 'ExxonMobil 2026' } },
  { src: 'audience', alt: { cs: 'Publikum při vyhlášení', en: 'The audience during the announcement' } },
  { src: 'pitch-1', alt: { cs: 'Pitch s mikrofonem', en: 'Pitching with the mic' } },
  { src: 'organizer', alt: { cs: 'Úvodní slovo organizátora', en: 'Opening words from the organiser' } },
  { src: 'crowd', alt: { cs: 'Účastníci a mentoři', en: 'Participants and mentors' } },
  { src: 'lecture-1', alt: { cs: 'Zahájení v aule VUT', en: 'Opening in the VUT auditorium' } },
  { src: 'hall-1', alt: { cs: 'Hosté finále', en: 'Guests at the final' } },
]

export const ui = {
  nav: {
    work: { cs: 'Praxe', en: 'Work' },
    projects: { cs: 'Projekty', en: 'Projects' },
    hackathons: { cs: 'Soutěže', en: 'Competitions' },
    gallery: { cs: 'Galerie', en: 'Gallery' },
    contact: { cs: 'Kontakt', en: 'Contact' },
  },
  hello: { cs: 'Ahoj, jsem', en: "Hi, I'm" },
  downloadCv: { cs: 'Stáhnout CV', en: 'Download CV' },
  contactMe: { cs: 'Napiš mi', en: 'Get in touch' },
  sections: {
    work: { cs: 'Pracovní zkušenosti', en: 'Work experience' },
    projects: { cs: 'Projekty', en: 'Projects' },
    hackathons: { cs: 'Hackathony a soutěže', en: 'Hackathons & competitions' },
    gallery: { cs: 'Ze zákulisí', en: 'Behind the scenes' },
    skills: { cs: 'Dovednosti', en: 'Skills' },
    about: { cs: 'Mimo kód', en: 'Off the keyboard' },
    contact: { cs: 'Pojďme něco postavit', en: "Let's build something" },
  },
  stats: {
    years: { cs: 'firmy, pro které jsem vyvíjel', en: 'companies I have shipped code for' },
    hacks: { cs: 'soutěže a hackathony', en: 'competitions & hackathons' },
    projects: { cs: 'projekty, na kterých jsem pracoval', en: 'projects I have worked on' },
    tech: { cs: 'technologií, se kterými pracuji', en: 'technologies I work with' },
  },
  team: { cs: 'Tým', en: 'Team' },
  education: { cs: 'Vzdělání', en: 'Education' },
  moreAbout: { cs: 'Víc o projektu Pill sken', en: 'More about Pill sken' },
  howItWorks: { cs: 'Jak to funguje', en: 'How it works' },
  videoCaption: { cs: 'AT&T Hackathon Junior 2025 — odpočet do konce', en: 'AT&T Hackathon Junior 2025 — the final countdown' },
  playVideo: { cs: 'Přehrát video', en: 'Play video' },
  close: { cs: 'Zavřít', en: 'Close' },
  prev: { cs: 'Předchozí', en: 'Previous' },
  next: { cs: 'Další', en: 'Next' },
  contactText: {
    cs: 'Hledáš vývojáře na backend, full-stack nebo něco s hardwarem? Ozvi se.',
    en: 'Looking for a backend, full-stack or hardware-minded developer? Say hi.',
  },
  copy: { cs: 'Kopírovat e-mail', en: 'Copy email' },
  copied: { cs: 'Zkopírováno', en: 'Copied' },
  copyFailed: { cs: 'Kopírování se nepovedlo — napiš mi přímo na e-mail výše.', en: "Couldn't copy — just use the email address above." },
  skip: { cs: 'Přeskočit na obsah', en: 'Skip to content' },
  scroll: { cs: 'Posunout dolů', en: 'Scroll down' },
  primaryNav: { cs: 'Hlavní navigace', en: 'Primary' },
  menu: { cs: 'Menu', en: 'Menu' },
  language: { cs: 'Jazyk', en: 'Language' },
  pauseMotion: { cs: 'Pozastavit animace', en: 'Pause animations' },
  newTab: { cs: 'otevře se v nové kartě', en: 'opens in a new tab' },
  at: { cs: 've firmě', en: 'at' },
  galleryAside: { cs: 'Rakathon 2026 · AT&T Hackathon 2025 · ExxonMobil 2026', en: 'Rakathon 2026 · AT&T Hackathon 2025 · ExxonMobil 2026' },
  galleryDialog: { cs: 'Fotka z galerie', en: 'Gallery photo' },
  photoStack: { cs: 'Fotky z Rakathonu 2026: pitch, práce v týmu a finalisté na pódiu', en: 'Photos from Rakathon 2026: pitching, teamwork and the finalists on stage' },
  videoLabel: { cs: 'Video z AT&T Hackathonu Junior 2025 — odpočet do konce, bez řeči', en: 'Video from AT&T Hackathon Junior 2025 — the final countdown, no speech' },
  signalLabel: { cs: 'Satelit ↔ pozemní stanice', en: 'Satellite ↔ ground station' },
  portraitAlt: { cs: 'Tomáš Musil — portrét', en: 'Tomáš Musil — portrait' },
}

export const langNames: T = { cs: 'Čeština', en: 'English' }

export const meta = {
  title: {
    cs: 'Tomáš Musil — Full-Stack & Backend vývojář (Brno)',
    en: 'Tomáš Musil — Full-Stack & Backend Developer (Brno)',
  } as T,
  description: {
    cs: 'Tomáš Musil, full-stack a backend vývojář z Brna. C#/.NET, React, TypeScript, embedded systémy a AI agenti pro právní praxi.',
    en: 'Tomáš Musil, full-stack and backend developer from Brno. C#/.NET, React, TypeScript, embedded systems and AI agents for legal work.',
  } as T,
  ogImageAlt: { cs: 'Tomáš Musil, full-stack vývojář', en: 'Tomáš Musil, full-stack developer' } as T,
}
