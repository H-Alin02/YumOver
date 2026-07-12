<!-- markdownlint-disable MD041 MD033 -->
<div align="center">

# 🧊 FridgeSavvy

### Dal problema dello spreco alimentare a un'app completa — imparando l'ingegneria del software passo dopo passo.

[![Status](https://img.shields.io/badge/Stato-Detailed%20Design%20(SDLC%203)-blueviolet)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20React%20Native%20%7C%20MongoDB-339933)]()

</div>

---

## 📖 Cos'è FridgeSavvy?

FridgeSavvy è **due cose in una**:

1. **Un'app** che aiuta a ridurre lo spreco alimentare domestico tracciando l'inventario del frigo tramite OCR degli scontrini, con suggerimenti ricette basati su ciò che hai realmente.
2. **Un percorso di apprendimento** costruito come un vero ciclo SDLC aziendale — dalla teoria al deploy — per imparare sviluppo full-stack, architetture di sistema, AI integration e molto altro.

> *"Il miglior modo per imparare è costruire qualcosa di reale."*

---

## 🎯 Obiettivo

Eliminare lo spreco alimentare domestico rendendo la gestione dell'inventario **semplice e automatica**:
- Scansiona lo scontrino → i prodotti entrano nell'inventario
- L'app ti suggerisce ricette con ciò che sta per scadere
- Niente più cibo dimenticato in fondo al frigo

---

## 🛠 Stack Tecnologico

| Layer | Tecnologia | Perché |
|-------|-----------|--------|
| **Backend** | Node.js + Express.js | API REST, gateway del sistema |
| **Frontend** | React Native | Cross-platform (iOS/Android) con un solo codice |
| **Database** | MongoDB | NoSQL flessibile per dati eterogenei |
| **Object Storage** | AWS S3 / Cloud Storage | Immagini scontrini (mai nel DB) |
| **AI Worker** | Python (separato) | Pipeline OCR e matching prodotti |

### Pipeline OCR (Riconoscimento Prodotti)

```
Scontrino ➔ OCR ➔ Parser ➔ Open Food Facts ➔ LLM ➔ Utente
                         (fuzzy match)      (ultima istanza) (conferma)
```

L'LLM viene usato solo come ultima risorsa per minimizzare costi e latenza.

---

## 📚 Struttura del Corso (SDLC)

Il progetto segue le 6 fasi del **Software Development Life Cycle** usate in azienda:

```
📘 Cap. 00 — Fondamenti Teorici    ✅ (Agile/Scrum, metodologie)
📗 Cap. 01 — Idea e Requisiti      ✅ (Feature analysis, brainstorming)
📙 Cap. 02 — System Design         ✅ (Architettura, microservizi)
📕 Cap. 03 — Detailed Design       🔄 (Data modeling, API design) ← siamo qui
📓 Cap. 04 — Sviluppo e Codice     ⏳
📔 Cap. 05 — Testing e Qualità     ⏳
📒 Cap. 06 — Deploy e CI/CD        ⏳
```

Ogni capitolo contiene documenti teorici, esercizi e risorse YouTube per studiare in autonomia prima di scrivere codice.

Vedi l'[Indice Completo del Corso](docs/Indice_Corso_Software_Engineering.md).

---

## 🚦 Stato Attuale

Il progetto è in **Fase 3 (Detailed Design)**. Non c'è ancora codice implementato — stiamo costruendo le fondamenta giuste prima di scrivere la prima riga.

- [x] Fondamenti teorici (Agile, Scrum, ruoli)
- [x] Idea validata e requisiti definiti
- [x] Architettura a microservizi progettata
- [x] Tech stack scelto e motivato
- [ ] Data modeling NoSQL (in corso)
- [ ] API Design REST
- [ ] UI Wireframing
- [ ] Sviluppo backend (Node.js)
- [ ] Pipeline OCR (Python)
- [ ] Frontend mobile (React Native)

---

## 🧠 Obiettivi di Apprendimento

Cosa sto imparando costruendo FridgeSavvy:

- ✅ System Design e architetture a microservizi
- ✅ API REST con Node.js + Express
- ✅ Database NoSQL (MongoDB) e modellazione dati
- ✅ Frontend mobile cross-platform (React Native)
- ✅ Integrazione AI (OCR, LLM, API esterne)
- ✅ DevOps: CI/CD, Docker, deploy cloud
- ✅ Git branch strategy e code review

---

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori informazioni.

---

<div align="center">
  <sub>Costruito con ☕ e determinazione · 2026</sub>
</div>
