import Link from 'next/link';
import styles from './page.module.css';

const modules = [
  { 
    id: "fisi", 
    title: "FiSi Quiz", 
    desc: "Prüfungsfragen für Fachinformatiker Systemintegration (Netzwerk, Hardware, Software).", 
    link: "/quiz/fisi",
    icon: "💻"
  },
  { 
    id: "wiso", 
    title: "WiSo Quiz", 
    desc: "Original-Prüfungsfragen zu Wirtschaft und Soziales (WiSo).", 
    link: "/quiz/wiso",
    icon: "📈"
  },
  { 
    id: "bit-trainer", 
    title: "Der Bit-Detektiv", 
    desc: "Lerne krumme Präfixe (/51, /54) und den visuellen Bit-Schnitt.", 
    link: "/tools/bit-trainer",
    icon: "🔍"
  },
  { 
    id: "table-trainer", 
    title: "Tabellen-Trainer", 
    desc: "Berechne Anfangs- und Endadressen (Subnetting Tabellen).", 
    link: "/tools/table-trainer",
    icon: "📊"
  },
  { 
    id: "header-trainer", 
    title: "Header-Detektiv", 
    desc: "IPv4 & IPv6 Hex-Traces knacken und analysieren.", 
    link: "/tools/header-trainer",
    icon: "🕵️"
  },
  {
    id: "schreibtisch-test",
    title: "Schreibtischtest",
    desc: "Übe den Schreibtischtest (Trace Table) an zufälligen Algorithmen.",
    link: "/tools/schreibtisch-test",
    icon: "📝"
  },
  {
    id: "sql-dojo",
    title: "SQL Dojo",
    desc: "Dein Trainingsraum für die AP2. Schreibe echtes SQL.",
    link: "/tools/sql-dojo",
    icon: "🗄️"
  },
  {
    id: "raid-simulator",
    title: "RAID Simulator",
    desc: "Lerne RAID 0, 1, 5, 10 kennen und berechne Ausfallsicherheit & Kapazität.",
    link: "/tools/raid-simulator",
    icon: "💾"
  },
  {
    id: "ai-tutor",
    title: "KI-Prüfungstrainer (AP2)",
    desc: "Interaktiver KI-Tutor für Fachinformatiker Systemintegration.",
    link: "/tools/ai-tutor",
    icon: "🤖"
  }
];

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.bgBlob} />
      <div className={styles.bgBlob2} />
      
      <header className={styles.header}>
        <h1 className={`${styles.title} text-gradient`}>IHK Lern-Akademie</h1>
        <p className={styles.subtitle}>Dein interaktiver Prüfungstrainer für Fachinformatiker Systemintegration.</p>
      </header>

      <div className={styles.grid}>
        {modules.map((mod) => (
          <Link href={mod.link} key={mod.id} className={styles.card}>
            <div className={styles.cardIcon}>{mod.icon}</div>
            <h2 className={styles.cardTitle}>{mod.title}</h2>
            <p className={styles.cardDesc}>{mod.desc}</p>
            <div className={styles.cardAction}>
              Starten
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
