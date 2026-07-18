# 📖 Project Journal & Handoff (Memoria di FridgeSavvy)

> **Scopo di questo documento:**
> Questo file è il "Diario di Bordo" e il punto di sincronizzazione centrale (Handoff) del progetto. Dato che vi lavorano diversi Agenti AI (Tech Manager, Work Buddy, Brainstormer) con il Lead Developer (Alin), **ogni agente è tenuto a leggere lo stato attuale del progetto qui prima di iniziare a operare**, e ad aggiornarlo se prende decisioni importanti.

---

## 📍 1. Stato Attuale del Progetto (Current Status)
* **Fase SDLC Attuale:** Fase 3 — Detailed Design (completata ✅). Pronti per Fase 4 — Sviluppo.
* **Prodotto:** **Food Coach** (pivot da OCR scontrini → coach educativo anti-spreco)
* **Filosofia:** Anti-Tinder — l'app ha successo quando l'utente non ha più bisogno dell'app perché ha interiorizzato le competenze
* **Architettura:** Node.js (gateway) + Python (AI Worker RAG) + MongoDB + ChromaDB
* **Backlog:** https://github.com/users/H-Alin02/projects/4

---

## 🗺️ 2. Mappa della Knowledge Base (Dove trovare cosa)
*Se sei un agente appena svegliato, consulta questi file per avere il contesto completo sulle decisioni già prese:*
* **Design Doc Completo:** [`docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md`](03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md)
* **Architettura di Sistema:** [`docs/02_System_Design_e_Architettura/Architettura_Sistema.md`](02_System_Design_e_Architettura/Architettura_Sistema.md)
* **Knowledge Base Decisioni:** [`docs/02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md`](02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md)
* **Indice Globale:** [`docs/Indice_Corso_Software_Engineering.md`](Indice_Corso_Software_Engineering.md)

---

## 📝 3. Log delle Decisioni e dei Progressi (Journal)

### [2026-07-19] — Pivot: da OCR Scontrini a Food Coach
* **Autore:** @LeadDeveloper (Alin) & @Claude (Office Hours + Plan Eng Review)
* **Descrizione:** Dopo analisi di mercato approfondita e brainstorming, il progetto FridgeSavvy cambia direzione. L'idea originale (scansione scontrini + inventario frigo) era troppo vista. La nuova direzione è **Food Coach**: un'app educativa che insegna alle persone a sprecare meno cibo attraverso coaching, pianificazione e consapevolezza, non solo ricette.
* **Decisioni chiave:**
  - Filosofia anti-Tinder: l'app lavora per rendersi superflua
  - RAG pipeline (retrieval + Gemini refinement, NO fine-tuning)
  - Fallback creativo a 4 livelli per ricette "strane"
  - Si parte da backend (Node.js + Python) — React Native dopo
  - MongoDB Atlas + ChromaDB per storage
  - Auth saltata per MVP
  - Design doc completo e revisionato da /plan-eng-review
* **Link:** Design doc in `docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md`
* **Prossimo blocco:** Sprint 1 — Dataset ricette JSON + setup monorepo

### [2026-04-01] - Kickoff Architettura e Lezioni
* **Autore:** @TechManager
* **Descrizione:** Definizione dell'infrastruttura fondamentale (Microservizi vs Monoliti). Iniziato il corso in-repo di Software Engineering per il Lead Developer. Creati i file su NoSQL, SDLC e scelte di stack.
* **Prossimo blocco:** Passare alla progettazione dei sistemi di dettaglio.

---

> **Regola per gli Agenti:** Se modifichi l'architettura o finisci un task rilevante (es. un refactoring o la scrittura di una nuova route backend), aggiungi una voce qui sopra e cambia lo "Stato Attuale del Progetto".
