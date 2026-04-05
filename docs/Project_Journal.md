# 📖 Project Journal & Handoff (Memoria di FridgeSavvy)

> **Scopo di questo documento:**
> Questo file è il "Diario di Bordo" e il punto di sincronizzazione centrale (Handoff) del progetto. Dato che vi lavorano diversi Agenti AI (Tech Manager, Work Buddy, Brainstormer) con il Lead Developer (Alin), **ogni agente è tenuto a leggere lo stato attuale del progetto qui prima di iniziare a operare**, e ad aggiornarlo se prende decisioni importanti.

---

## 📍 1. Stato Attuale del Progetto (Current Status)
* **Fase SDLC Attuale:** Progettazione (System Design & Requirements)
* **Obiettivo a Breve Termine:** Consolidare i requisiti delle feature (es. Lettura Scontrino) e passare al Data Modeling o Setup del Repository.
* **Architettura Scelta:** Client (React Native), Gateway (Node.js), Microservizio AI (Python), Database NoSQL, Object Storage.

---

## 🗺️ 2. Mappa della Knowledge Base (Dove trovare cosa)
*Se sei un agente appena svegliato, consulta questi file per avere il contesto completo sulle decisioni già prese:*
* **Indice Globale:** [`docs/Indice_Corso_Software_Engineering.md`](Indice_Corso_Software_Engineering.md)
* **Architettura di Sistema:** [`docs/02_System_Design_e_Architettura/Architettura_Sistema.md`](02_System_Design_e_Architettura/Architettura_Sistema.md)
* **Feature Core (Scontrini):** [`docs/01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md`](01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md)

---

## 📝 3. Log delle Decisioni e dei Progressi (Journal)
*Ordina dalla data più recente (in alto) alla più vecchia (in basso). Usa questo formato per passare la palla al prossimo agente.*

### [In corso] - Focus: Consolidamento Feature
* **Autore:** @LeadDeveloper (Alin) & @Brainstormer
* **Descrizione:** Stiamo espandendo le feature specifiche, come il riconoscimento dei prodotti tramite scontrino.
* **Prossimo blocco:** Una volta finita l'ideazione, passare la mano al @TechManager per l'API Design e il Data Model.

### [2026-04-01] - Kickoff Architettura e Lezioni
* **Autore:** @TechManager
* **Descrizione:** Definizione dell'infrastruttura fondamentale (Microservizi vs Monoliti). Iniziato il corso in-repo di Software Engineering per il Lead Developer. Creati i file su NoSQL, SDLC e scelte di stack.
* **Prossimo blocco:** Passare alla progettazione dei sistemi di dettaglio.

---

> **Regola per gli Agenti:** Se modifichi l'architettura o finisci un task rilevante (es. un refactoring o la scrittura di una nuova route backend), aggiungi una voce qui sopra e cambia lo "Stato Attuale del Progetto".
