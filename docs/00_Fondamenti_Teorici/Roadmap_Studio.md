# 🗺️ Roadmap di Studio: Verso FridgeSavvy

Questa "mappa del tesoro" è pensata per guidarti nello studio autonomo (es. YouTube, documentazione ufficiale o corsi Udemy) prima di sporcarti le mani con il codice del progetto. L'obiettivo non è diventare un master assoluto di ognuna di queste enormi tecnologie, ma comprendere **il "perché" si usano e le loro basi della sintassi**, in modo da non sentirti mai spaesato quando riprenderemo la fase pratica insieme.

---

### 🟢 Modulo 1: System Design per Principianti
Prima di scrivere qualsiasi codice, devi capire l'infrastruttura globale di internet e del software.
*   **Argomenti Chiave:**
    *   Cos'è il paradigma *Client-Server*? (La differenza tra chi chiede e chi risponde).
    *   Cos'è un'**API REST**? (GET, POST, PUT, DELETE, Headers, Corpo della richiesta - JSON).
    *   *Monolite* vs *Microservizi* (Perché abbiamo separato Node.js da Python per l'App?).
*   **Cosa cercare su YouTube:** *"System Design Basics", "Client Server Architecture explained", "REST API Tutorial for Beginners"*.

### 🟡 Modulo 2: Node.js e le basi del Backend
Questo sarà il cuore operativo della piattaforma. Ti serve capire come far girare un server in locale sul tuo PC.
*   **Argomenti Chiave:**
    *   Cos'è **Node.js**? (E perché è diverso da uno script nel browser HTML/Chrome).
    *   Cos'è **NPM** o *Yarn*? (Come si scaricano i pacchetti/librerie altrui).
    *   Introduzione a **Express.js** (Il framework standard per creare API in Node: come si crea una rotta `app.get('/prova', ...)`).
    *   Programmazione **Asincrona** in JavaScript (Promesse, `async / await` - Fondamentale per non bloccare il server).
*   **Cosa cercare su YouTube:** *"Node.js per principianti ITA / ENG", "Express JS Crash Course", "Javascript Async Await explained"*.

### 🟠 Modulo 3: Il Database NoSQL (MongoDB / Firestore)
Dove finiscono fisicamente i dati degli scontrini?
*   **Argomenti Chiave:**
    *   La differenza enorme tra Database **Relazionali (SQL)** (Righe e Colonne) e Database **Non-Relazionali (NoSQL)** (Documenti e Collezioni in stile cartelle).
    *   Il formato **JSON**: Capire bene le parentesi graffe `{ }` e le quadre `[ ]`, perché in NoSQL ogni dato è un gigantesco JSON "salvato su disco".
    *    *(Consigliato)* Approfondimento primario su **MongoDB** (essendo il NoSQL più famoso ed usato in coppia con Node.js, detto stack *MERN*).
*   **Cosa cercare su YouTube:** *"SQL vs NoSQL explained", "JSON in 10 minutes", "MongoDB Crash Course for beginners"*.

### 🟣 Modulo 4: Object Storage (Mistero dello Scontrino)
Come si caricano i file pesanti moderni senza far crashare il Node.js.
*   **Argomenti Chiave:**
    *   Cos'è un ***Blob*** (Binary Large Object) o file binario.
    *   Perché **non salveremo mai e poi mai** immagini nel Database NoSQL.
    *   Il concetto di un **Bucket Cloud** (Amazon S3, Google Cloud Storage, Firebase Storage, o alternative gratuite).
*   **Cosa cercare su YouTube:** *"Why you shouldn't store images in a Database", "Amazon S3 Basics / Object Storage explained"*.

### 🔵 Modulo 5: Frontend e App Mobile con React Native (Fase successiva)
Quando il server risponderà correttamente, dovremmo disegnare l'App.
*   **Argomenti Chiave:**
    *   Componenti, Stato (State) e Proprietà (Props) in React.
    *   Sviluppo Cross-Platform vs Nativo: come React Native usa la "magia" per tradurre codice JS in visuali Android e iPhone (Views, Text, Image al posto dei soliti `div` web).
    *   Come si fa una "Fetch" (ovvero come un'App invia dati a un server Node.js premendo un bottone).
*   **Cosa cercare su YouTube:** *"React Native Crash Course 2024", "Fetch API Tutorial"*.

### 🔴 Modulo 6: (Avanzato/Opzionale da fare alla fine) - Python & IA
*   **Argomenti Chiave:**
    *   Come si crea un minuscolo serverino in Python (es. usando **FastAPI** o *Flask*).
    *   Come richiamare l'API di un modello linguistico come OpenAI (ChatGPT) passandogli un link a un'immagine per farsi rispondere in JSON analizzando lo scontrino.
*   **Cosa cercare su YouTube:** *"FastAPI Crash Course", "OpenAI Vision API Python"*.

---
> 💡 L'approccio migliore è studiare le basi teoriche (M2, M3, M4) e poi saltare su VSCode per sporcarsi le mani insieme. Il codice si impara leggendolo ma soprattutto sbagliandolo centinaia di volte! 
