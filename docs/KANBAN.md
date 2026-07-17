# FridgeSavvy — Kanban Board

> Progetto full-stack per il monitoraggio del frigorifero con AI.
> Aggiornato: 17/07/2026

## 📋 Backlog

| Priority | Task | Dipende da |
|----------|------|------------|
| 🥇 | Node.js + Express setup (`npm init`, server base, `GET /status`) | — |
| 🥇 | `GET /api/products` → lista prodotti (JSON) | Express setup |
| 🥇 | `POST /api/products` → aggiungi prodotto | Express setup |
| 🥇 | Storage locale su file JSON | Express setup |
| 🥈 | `GET /api/products/:id` | CRUD base |
| 🥈 | `DELETE /api/products/:id` | CRUD base |
| 🥈 | Categorie prodotti (dropdown backend) | CRUD base |
| 🥉 | MongoDB integration | — |
| 🥉 | Frontend HTML base (tabella prodotti) | API pronte |
| 🥉 | Autenticazione | — |
| 💡 | OCR scontrino + AI ricette | Dopo CodeLabs |

## 🏗️ In Progress

| Task | Iniziato | Note |
|------|----------|------|
| Node.js crash course | 17/07 | ~2h rimaste |
| Express base (rotte GET/POST) | (next) | |

## ✅ Done

| Task | Completato |
|------|------------|
| — | — |

## Sprint 1 — Backend Base

**Obiettivo:** Server Express con CRUD su file JSON (backend puro).
**Scadenza:** Prima del CodeLabs 24/07 (ideale) o entro fine Luglio.

### Cosa serve sapere per Sprint 1
- [x] JavaScript base fatto
- [ ] Node.js crash course → 30 min rimasti
- [ ] Express rotte GET/POST → dopo Node.js
- [ ] `fs` module per leggere/scrivere JSON
