// Das Inhaltsverzeichnis deiner Akademie
const moduleList = [
    { 
        id: 1, 
        title: "Modul 1: Der Bit-Detektiv", 
        desc: "Lerne krumme Präfixe (/51, /54) und den visuellen Bit-Schnitt.", 
        file: "module/01_bit_trainer.html" 
    },
    { 
        id: 2, 
        title: "Modul 2: Tabellen-Trainer", 
        desc: "Berechne Anfangs- und Endadressen (wie in Aufgabe 5.11).", 
        file: "module/02_table_trainer.html" 
    },
    { 
        id: 3, 
        title: "Modul 3: Header-Detektiv", 
        desc: "IPv4 & IPv6 Hex-Traces knacken (wie in Aufgabe 7.3).", 
        file: "module/03_header_trainer.html" 
    },
    {
        id: 4,
        title: "Modul 4: Schreibtischtest Trainer",
        desc: "Übe den Schreibtischtest (Trace Table) an zufälligen Algorithmen.",
        file: "module/04_schreibtisch_test.html"
    },
    {
        id: 5,
        title: "Modul 5: FiSi Quiz (Softwareentwicklung)",
        desc: "Quiz mit typischen Fragen für Fachinformatiker Systemintegration.",
        file: "module/05_fisi_quiz.html"
    },
    {
        id: 6,
        title: "Modul 6: WiSo Quiz",
        desc: "Original-Prüfungsfragen zu Wirtschaft und Soziales (WiSo).",
        file: "module/06_wiso_quiz.html"
    },
    {
        id: 7,
        title: "Modul 7: SQL Dojo",
        desc: "Dein Trainingsraum für die AP2 als Fachinformatiker Systemintegration. Schreibe echtes SQL.",
        file: "inhalt/SQL/sql_dojo.html"
    }
];

function renderWebsite() {
    const container = document.getElementById("modul-container");
    
    // Sicherheitscheck: Gibt es den Container überhaupt?
    if (!container) {
        console.error("FEHLER: Container 'modul-container' wurde in der HTML nicht gefunden!");
        return;
    }

    container.innerHTML = ""; // Vorher leeren

    moduleList.forEach(modul => {
        const card = document.createElement("div");
        card.className = "modul-card";
        card.innerHTML = `
            <h2>${modul.title}</h2>
            <p>${modul.desc}</p>
            <button class="start-btn">Jetzt starten</button>
        `;
        
        // Klick auf die Karte öffnet das Modul
        card.onclick = () => {
            window.location.href = modul.file;
        };
        
        container.appendChild(card);
    });
}

// Startet die Funktion, sobald die Seite geladen ist
window.addEventListener('DOMContentLoaded', renderWebsite);