# Appunti di Software Engineering e System Design
*Progetto: FridgeSavvy*

Questo documento raccoglie le nozioni teoriche e pratiche apprese durante lo sviluppo del progetto. Viene redatto con un approccio accademico per fungere da riferimento (knowledge base) per colloqui tecnici e per il consolidamento delle competenze ingegneristiche.

---

## 1. Cos'è il System Design?
Il **System Design** (Progettazione di Sistemi) è il processo attraverso il quale si definiscono l'architettura, i componenti, i moduli, le diverse interfacce e la gestione dei dati per un sistema software, con l'obiettivo di soddisfare requisiti specifici predeterminati.
Nel Software Engineering moderno, è considerato un "antipattern" (una cattiva pratica) iniziare a scrivere il codice sorgente senza aver prima affrontato questa fase.

Il System Design richiede l'analisi dei **Trade-off** (compromessi): non esiste quasi mai una tecnologia perfetta in assoluto, ma esiste la tecnologia migliore in base a specifici vincoli (tempo, budget, competenze del team, requisiti di performance, scalabilità).

---

## 2. Architetture di Sistema (System Architectures)
L'architettura definisce come i vari nodi computazionali di un software comunicano tra loro.

### 2.1 Modello Client-Server
È il paradigma dominante sul web. Prevede una rigida separazione dei ruoli:
*   **Client (Livello di Presentazione):** L'applicazione sul dispositivo dell'utente (smartphone, browser). Inizia la comunicazione inviando richieste (Request). È considerato "stupido" in quanto si occupa principalmente di renderizzare l'interfaccia utente (UI) e catturare gli input.
*   **Server (Livello Logico e Dati):** Un computer remoto ad alte prestazioni. Ascolta le richieste, elabora la "Business Logic" (la logica applicativa), interroga il database e restituisce una risposta (Response) al client.
*   *Vantaggio principale:* Centralizzazione. Aggiornando il server, tutti i client beneficiano istantaneamente delle nuove logiche senza dover scaricare un aggiornamento dell'app. Inoltre, preserva batteria e CPU dei dispositivi mobili.

### 2.2 Altri Modelli
*   **Standalone:** L'applicazione è interamente contenuta nel dispositivo (nessuna connessione di rete). Scartata per app moderne basate su Intelligenza Artificiale a causa dell'enorme costo computazionale per l'esecuzione locale dei modelli LLM (Large Language Models).
*   **Peer-to-Peer (P2P):** Ogni nodo funge da client e da server. Tipico del file sharing (es. BitTorrent) o della blockchain.

### 2.3 Monolite vs Microservizi
All'interno del backend (il Server), l'architettura può essere strutturata in due modi:
*   **Architettura Monolitica:** Tutto il codice del backend (autenticazione, elaborazione immagini, gestione utenti) risiede in un unico gigantesco programma in un solo linguaggio.
    *   *Pro:* Semplice da avviare e testare inizialmente.
    *   *Contro:* Difficile da scalare e da mantenere man mano che il progetto cresce.
*   **Architettura a Microservizi:** L'approccio moderno. Il backend è suddiviso in "mini-server" indipendenti che comunicano tra loro tramite rete (API).
    *   *Esempio in FridgeSavvy:* Un servizio in **Node.js** (eccellente per gestire un elevato volume di richieste concorrenti di I/O) che fa da "vigile urbano" e gestisce utenti e database, affiancato da un microservizio separato in **Python** (eccellente nel Data Science e AI) dedicato unicamente a interfacciarsi con i modelli di Intelligenza Artificiale per l'analisi visiva degli scontrini.

---

## 3. Scelte Architetturali per il Frontend (Client Android)
Lo sviluppo lato Client per dispositivi mobili presenta tre paradigmi principali:

1.  **Sviluppo Nativo (Kotlin/Java per Android, Swift per iOS):**
    *   Si utilizzano gli SDK ufficiali forniti dai produttori dei sistemi operativi.
    *   *Pro:* Accesso di basso livello all'hardware (fotocamera, sensori), prestazioni massime (rendering nativo a 60/120fps).
    *   *Contro:* Codice non riutilizzabile. Il team deve scrivere e mantenere due "codebase" distinte (una per Android, una per iOS). Curva di apprendimento molto elevata per un ingegnere che non ha basi Mobile.

2.  **Sviluppo Cross-Platform (Es. React Native, Flutter):**
    *   Si scrive il codice una sola volta utilizzando un framework (es. in JavaScript/TypeScript o Dart), che viene poi "compilato" (o mediato tramite un bridge) per generare interfacce native sia su Android che su iOS.
    *   *Pro:* *Time-to-market* ridotto (si dimezzano i tempi di sviluppo), ampia richiesta nel mercato del lavoro, condivisione di conoscenze con lo sviluppo web (React Native condivide gran parte dei concetti con React.js).
    *   *Contro:* Leggero overhead computazionale rispetto al nativo puro (solitamente impercettibile per l'utente finale).

3.  **Progressive Web App (PWA):**
    *   Applicazioni Web progettate e ottimizzate per essere eseguite all'interno del browser del telefono mobile, ma che mascherano l'interfaccia del browser per apparire come app native (inclusa la presenza dell'icona nella Home Screen dell'utente).
    *   *Pro:* Sviluppo identico al Web classico. Nessun passaggio attraverso gli Store ufficiali (Google Play, App Store).
    *   *Contro:* Meno performanti, estetica spesso "meno nativa", assenza dalla vetrina promozionale degli Store ufficiali.

---

## 4. Persistenza dei Dati (Database ed Object Storage)

### 4.1 SQL (Relazionale) vs NoSQL (Non-Relazionale)
*   **Database Relazionali (SQL - es. PostgreSQL, MySQL):** Basati su tabelle, righe e colonne. Richiedono uno schema rigido definito a priori. Tutelano fortemente l'integrità dei dati tramite la standardizzazione ACID. Sono perfetti per dati fortemente strutturati e relazionati (Sistemi bancari, ERP).
*   **Database Non-Relazionali (NoSQL - es. MongoDB, Firebase/Firestore):** Basati su collezioni e documenti (solitamente formato JSON o BSON). Lo schema è flessibile ("Schema-less"). Sono eccellenti per scenari in cui la struttura dei dati cambia di frequente o per la prototipazione rapida (Agile Development). Nel progetto FridgeSavvy, NoSQL offre la flessibilità necessaria per gestire ricette complesse o liste di ingredienti eterogenee.

### 4.2 La Gestione dei File Binari Pesanti (Immagini/Scontrini)
Un errore critico in fase di System Design, tipico dei sistemisti Junior, è prevedere l'inserimento di **file multimediali pesanti (foto, video, audio) direttamente all'interno del Database** (salvandoli come stringhe Base64 o campi BLOB - Binary Large Object).

*Perché è un errore (Antipattern)?*
1.  **Deterioramento delle Performance:** I database sono ottimizzati per ricercare (querying) piccole stringhe di testo in millisecondi. Caricare blocchi da 5MB (una foto) appesantisce la memoria RAM (Buffer Pool) del server DB.
2.  **Costi:** Lo spazio su un server Database ad alte prestazioni è estremamente costoso rispetto a un normale disco fisso.
3.  **Gestione Cache:** Le query ai DB sono difficili da inserire in cache rispetto al servire file statici.

*La Soluzione Ingegneristica Standard:* **Object Storage (es. Amazon S3, Google Cloud Storage)**
*   Le immagini vengono caricate su server specializzati chiamati **Object Storage** (o Bucket).
*   Il servizio Storage restituisce un **URL pubblico** (un semplice link HTTP).
*   Nel **Database NoSQL/SQL viene salvata esclusivamente la stringa di testo dell'URL**.
*   *Flusso dati:* Il Client richiede l'Oggetto al DB (leggerissimo, pochi byte) -> riceve l'URL -> scarica l'immagine in parallelo passivamente dal server di Storage.
