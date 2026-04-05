# Knowledge Base: Riepilogo delle Decisioni di Progetto

> **Tipo documento:** Punto di Verità Centrale (Source of Truth)  
> **Status progetto:** Fase 3 — Detailed Design (in corso)  
> **A cosa serve:** Una "fotografia" sintetica di tutto quello che è stato deciso finora. Se dimentichi qualcosa o vuoi un ripasso veloce, parti da qui.

---

## Come usare questo documento

Questo file è il **punto di ingresso** della documentazione di FridgeSavvy. Non spiega i concetti in profondità (per quello ci sono i documenti dedicati), ma li riepiloga e linka alle fonti dettagliate. Aggiornalo ogni volta che viene presa una decisione importante.

---

## 1. Dove siamo nell'SDLC

```
✅ Fase 1 — Analisi dei Requisiti     (completata)
✅ Fase 2 — System Design             (completata)
🔄 Fase 3 — Detailed Design          ← SIAMO QUI
⏳ Fase 4 — Coding
⏳ Fase 5 — Testing
⏳ Fase 6 — Deploy e CI/CD
```

**Prossimi tre passi obbligatori prima del coding:**
1. **Data Modeling** — definire la struttura JSON dei dati nel DB
2. **API Design** — definire gli endpoint del server Node.js
3. **UI Wireframing** — schizzare le schermate principali dell'app

📄 *Per approfondire: [Lezione 2 — SDLC e Detailed Design](../01_Idea_e_Requisiti/Lezione_2_SDLC_e_Prossimi_Passi.md)*

---

## 2. Tech Stack Scelto

### Il Problema che FridgeSavvy Risolve
Un'app collaborativa che:
1. Scansiona gli scontrini della spesa e riconosce automaticamente i prodotti
2. Tiene traccia dell'inventario del frigo/dispensa
3. Suggerisce ricette basate su ciò che si ha a disposizione
4. Permette alla famiglia di votare quale ricetta cucinare

---

### Frontend — React Native (Cross-Platform Mobile)

| Voce | Dettaglio |
|---|---|
| **Tecnologia** | React Native |
| **Creato da** | Meta (Facebook) |
| **Cosa permette** | Scrivere il codice una volta sola → pubblica su Android e iOS |
| **Ruolo nel sistema** | Interfaccia utente: mostra dati, raccoglie foto e voti |
| **Cosa NON fa** | Nessuna logica AI, nessun accesso diretto al DB |

---

### Backend — Architettura a Microservizi

Il backend è diviso in due componenti specializzati che girano indipendentemente l'uno dall'altro.

#### Microservizio 1: Core Gateway (Node.js)

| Voce | Dettaglio |
|---|---|
| **Tecnologia** | Node.js + Express.js |
| **Linguaggio** | JavaScript (lato server) |
| **Ruolo** | "Vigile urbano" — orchestratore centrale del sistema |
| **Responsabilità** | Autenticazione utenti, lettura/scrittura DB, routing richieste verso Python |
| **Punto di forza** | Gestisce migliaia di connessioni simultanee in modo asincrono senza bloccarsi |

#### Microservizio 2: AI Worker (Python)

| Voce | Dettaglio |
|---|---|
| **Tecnologia** | Python + framework ML (HuggingFace, LiteLLM, ecc.) |
| **Linguaggio** | Python |
| **Ruolo** | Specialista AI — elabora le immagini e riconosce i prodotti |
| **Responsabilità** | OCR scontrino, normalizzazione nomi prodotti, lookup Open Food Facts |
| **Perché Python** | Ecosistema ML incomparabile: TensorFlow, PyTorch, HuggingFace, Pandas |

---

### Archiviazione — Dati e File

#### Database Principale (NoSQL)

| Voce | Dettaglio |
|---|---|
| **Tipo** | NoSQL (Document Database) |
| **Candidati** | MongoDB Atlas, Firebase Firestore |
| **Formato dati** | Documenti JSON flessibili (no tabelle rigide) |
| **Cosa salva** | Utenti, Famiglie, Scontrini, Ingredienti, Ricette, Sondaggi |
| **Cosa NON salva** | File binari (immagini, video) — solo URL testuali |

#### Object Storage (per i file pesanti)

| Voce | Dettaglio |
|---|---|
| **Tipo** | Cloud Object Storage con CDN |
| **Candidati** | AWS S3, Google Cloud Storage, Cloudflare R2 |
| **Cosa salva** | Immagini degli scontrini fotografati dagli utenti |
| **Perché separato** | I database non sono ottimizzati per file binari pesanti |
| **Come funziona** | Riceve il file → restituisce un URL → l'URL va nel DB |

📄 *Per approfondire: [Architettura del Sistema](./Architettura_Sistema.md)*

---

## 3. Feature in Backlog

Funzionalità pianificate o in discussione, non ancora in sviluppo.

| Feature | Stato | Documento |
|---|---|---|
| Scansione scontrino + OCR | 📐 In design | [Lezione SDLC](../01_Idea_e_Requisiti/Lezione_2_SDLC_e_Prossimi_Passi.md) |
| Riconoscimento intelligente prodotti | 💡 Brainstorming | [Feature Scontrino](../01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md) |
| Suggerimento ricette via LLM | 📋 Backlog | — |
| Sistema di voto familiare | 📋 Backlog | — |
| Tracking grammatura e scadenze | 💡 Brainstorming | — |

---

## 4. Decisioni Prese e Motivazioni

Questa sezione conserva la memoria delle scelte fatte e il *perché* — così in futuro non ci si chiede "ma perché non abbiamo usato X?".

| Decisione | Alternativa scartata | Motivazione |
|---|---|---|
| React Native come frontend | Flutter, App Native | Un unico codebase per iOS e Android. Ecosistema JS già familiare per Node.js. |
| Node.js come API Gateway | Django (Python), Spring (Java) | Eccellente per I/O asincrono. Stesso linguaggio del frontend (JS). Ecosistema npm vastissimo. |
| Python come AI Worker | Integrare AI in Node.js | Python ha il migliore ecosistema ML. Separarli permette scalabilità indipendente. |
| NoSQL invece di SQL | PostgreSQL, MySQL | I dati delle ricette e degli ingredienti sono eterogenei. NoSQL tollera questa variabilità senza migrazioni di schema. |
| Object Storage per immagini | Salvare immagini nel DB come Base64 | Salvare Base64 nel DB è un errore grave: gonfia il DB, lo rallenta, e non scala. Object Storage è ottimizzato per questo. |

---

## 5. Link ai Documenti del Progetto

### Fondamenti Teorici
- [Metodologia Agile e Scrum](../00_Fondamenti_Teorici/Metodologia_Agile_Scrum.md)

### Idea e Requisiti
- [Lezione 2 — SDLC e Detailed Design](../01_Idea_e_Requisiti/Lezione_2_SDLC_e_Prossimi_Passi.md)
- [Feature: Riconoscimento Intelligente Prodotti da Scontrino](../01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md)

### System Design e Architettura
- [Architettura del Sistema (Componenti e Flussi)](./Architettura_Sistema.md)
- [Knowledge Base — questo documento](./Knowledge_Base_Riepilogo.md)

### Detailed Design e Modellazione
- *(in lavorazione)* Data Modeling NoSQL
- *(in lavorazione)* API Design

---

*Ultima modifica: 2026-04-05 — Documento vivo, aggiornare ad ogni decisione architettuale rilevante.*
