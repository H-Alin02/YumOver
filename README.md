<!-- markdownlint-disable MD041 MD033 -->
<div align="center">

# 🧊 FridgeSavvy → Food Coach

### Dal problema dello spreco alimentare a un'app educativa — imparando l'ingegneria del software passo dopo passo.

[![Status](https://img.shields.io/badge/Stato-Design%20Completato%20(SDLC%203)-blueviolet)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Python%20%7C%20MongoDB-339933)]()

</div>

---

## 📖 Cos'è FridgeSavvy?

FridgeSavvy è **due cose in una**:

1. **Food Coach** — un'app educativa che aiuta a ridurre lo spreco alimentare insegnando a pianificare la spesa, conservare il cibo, cucinare gli avanzi e prendere consapevolezza dell'impatto economico e ambientale. Filosofia anti-Tinder: l'app ha successo quando l'utente non ha più bisogno dell'app.
2. **Un percorso di apprendimento** costruito come un vero ciclo SDLC aziendale — dalla teoria al deploy — per imparare sviluppo full-stack, architetture di sistema, AI integration e molto altro.

> *"Il miglior modo per imparare è costruire qualcosa di reale."*

---

## 🎯 Obiettivo

Eliminare lo spreco alimentare domestico **alla radice**: educando le persone a pianificare, conservare e cucinare meglio.
- Inserisci gli ingredienti che hai → ricevi 3 ricette adattate con AI
- L'app ti insegna a fare la spesa in modo intelligente
- Impatto tracciato: € risparmiati, pasti salvati
- Filosofia educativa: l'app lavora per rendersi superflua

---

## 🛠 Stack Tecnologico

| Layer | Tecnologia | Perché |
|-------|-----------|--------|
| Layer | Tecnologia | Perché |
|---|---|---|---|
| **Backend Gateway** | Node.js + Express | API REST, orchestratore |
| **AI Worker** | Python + FastAPI | Recommendation engine (RAG) |
| **Database** | MongoDB Atlas | NoSQL per dati eterogenei |
| **Vector DB** | ChromaDB | Embedding per similarity search |
| **LLM** | Gemini API (free tier) | Refinement ricette |
| **Frontend futuro** | React Native | Cross-platform mobile |

### Pipeline AI (RAG — NO fine-tuning)

```
Input ingredienti ➔ Embedding search (ChromaDB) ➔ Gemini refinement ➔ 3 ricette adattate
```

**Fallback creativo:** se nessuna ricetta matcha, il sistema suggerisce combinazioni nuove con disclaimer. Se serve, chiede all'utente "Hai anche un uovo? Con quello potrei fare..."

---

## 📚 Struttura del Corso (SDLC)

Il progetto segue le 6 fasi del **Software Development Life Cycle** usate in azienda:

```
📘 Cap. 00 — Fondamenti Teorici    ✅ (Agile/Scrum, metodologie)
📗 Cap. 01 — Idea e Requisiti      ✅ (Feature analysis, brainstorming)
📙 Cap. 02 — System Design         ✅ (Architettura, microservizi)
📕 Cap. 03 — Detailed Design       ✅ (Data modeling, API design) ← COMPLETATO
📓 Cap. 04 — Sviluppo e Codice     🔄 (Sprint 1 — Dataset + Backend)
📔 Cap. 05 — Testing e Qualità     ⏳
📒 Cap. 06 — Deploy e CI/CD        ⏳
```

Ogni capitolo contiene documenti teorici, esercizi e risorse YouTube per studiare in autonomia prima di scrivere codice.

Vedi l'[Indice Completo del Corso](docs/Indice_Corso_Software_Engineering.md) e il [Design Doc Food Coach](docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md).

---

## 🚦 Stato Attuale

Il progetto è in **Fase 4 (Sviluppo)**. Fase 3 (Detailed Design) è completata.

- [x] Fondamenti teorici (Agile, Scrum, ruoli)
- [x] Idea validata e requisiti definiti
- [x] Architettura a microservizi progettata
- [x] Tech stack scelto e motivato
- [x] Data modeling NoSQL
- [x] API Design REST
- [x] Design doc revisionato (/plan-eng-review)
- [ ] Sprint 1 — Dataset ricette + setup monorepo
- [ ] Sprint 2 — AI Core (embedding + RAG pipeline)
- [ ] Sprint 3 — Backend API (Node.js gateway)

---

## 🧠 Obiettivi di Apprendimento

Cosa sto imparando costruendo Food Coach:

- ✅ System Design e architetture a microservizi
- ✅ API REST con Node.js + Express
- ✅ Database NoSQL (MongoDB) e modellazione dati
- ✅ RAG pipeline (embedding search + LLM refinement)
- ✅ Database vettoriali (ChromaDB)
- ✅ AI integration (Gemini API, sentence-transformers)
- ✅ Python + FastAPI per microservizi AI
- ✅ DevOps: CI/CD, Docker, deploy cloud
- ✅ Frontend mobile cross-platform (React Native, futuro)
- ✅ Git branch strategy e code review

---

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori informazioni.

---

<div align="center">
  <sub>Costruito con ☕ e determinazione · 2026</sub>
</div>
