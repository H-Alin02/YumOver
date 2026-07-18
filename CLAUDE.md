# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**FridgeSavvy** is two things in one:
1. A **planned mobile app** to reduce household food waste by tracking refrigerator inventory via OCR of grocery receipts, with recipe suggestions based on actual holdings.
2. A **structured learning path** for the lead developer (Alin) to learn full-stack software engineering, following a real-world SDLC process.

**Current Status:** SDLC Phase 3 — Detailed Design ✅ Completata. **Pronti per Phase 4 — Sviluppo.**

Il progetto ha recentemente fatto un **pivot concettuale**: da app OCR per scansione scontrini a **Food Coach** — un'app educativa anti-spreco con filosofia anti-Tinder (l'app ha successo quando l'utente non ha più bisogno dell'app). Vedi [Food Coach Design Doc](docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md).

**Remote:** `https://github.com/H-Alin02/Project-Food-Coach`

---

## SDLC Phases & Project Discipline

The project follows strict SDLC discipline: **no code is written before design is complete**.

| Phase | Status |
|---|---|
| 0 — Theoretical Foundations (Agile/Scrum) | ✅ Complete |
| 1 — Requirements (feature analysis, brainstorming) | ✅ Complete |
| 2 — System Design (architecture, microservices) | ✅ Complete |
| 3 — Detailed Design (data modeling, API design, wireframes) | 🔄 **In progress** |
| 4 — Development & Coding | ⏳ Not started |
| 5 — Testing & Quality | ⏳ Not started |
| 6 — Deploy & CI/CD | ⏳ Not started |

**Next three steps (Sprint 1):**
1. Dataset — create seed of 30 recipes in JSON
2. Setup monorepo — backend/ (Node.js) + worker/ (Python) + app/ (future)
3. Python notebook — validate embedding + similarity search on recipe seed

---

## Architecture: 3-Layer Microservices

### Client Layer
- **React Native** (cross-platform iOS/Android)
- Thin client: UI rendering, photo capture, voting. No AI logic, no direct DB access.

### Backend Layer (two microservices)
- **Gateway API (Node.js + Express.js)** — orchestrator: authentication, DB read/write, routes requests to Python worker
- **AI Worker (Python)** — specialist: OCR receipt analysis, product name normalization, Open Food Facts lookup, LLM fallback

### Storage Layer (two components)
- **NoSQL Database** (MongoDB Atlas or Firebase Firestore) — stores users, receipts (structured text + image URL), ingredients, recipes, polls
- **Object Storage** (AWS S3 / Google Cloud Storage / Cloudflare R2) — stores receipt images only. Images never touch the DB; only URLs are stored

### Request Flow (Receipt Scan)
```
App → Node.js (Gateway) → Object Storage (stores image, returns URL)
                         → Python AI Worker (OCR + product matching)
                         → NoSQL DB (stores structured data)
Node.js → App (confirmation)
```

### Core AI Pipeline (RAG — NO fine-tuning)
```
Input ingredienti → [1] Embedding search (ChromaDB) → [2] Gemini refinement → 3 ricette adattate
```

**Fallback creativo a 4 livelli:**
- **Livello 1:** Retrieval da DB (match ≥2 ingredienti)
- **Livello 2:** Refinement con sostituzioni
- **Livello 3:** Generazione guidata con disclaimer ("Non è una ricetta classica, ma...")
- **Livello 4:** Interazione — "Hai anche X? Con quello potrei fare Y."

---

## Repository Structure

```
.
├── CLAUDE.md                        ← This file
├── README.md                        ← Project overview (Italian)
├── .gitignore
├── .claude/                         ← Claude Code config (settings.local.json with API key)
├── .idea/                           ← IntelliJ IDEA project files (gitignored)
├── .obsidian/                       ← Obsidian workspace (gitignored)
├── Data/                            ← Sample receipt images (4 JPEGs from Italian supermarkets)
└── docs/                            ← All project content: educational + design docs
    ├── Indice_Corso_Software_Engineering.md    ← Course table of contents (start here for full index)
    ├── Project_Journal.md                      ← Living journal & handoff document for AI agents
    ├── 00_Fondamenti_Teorici/                  ← Agile/Scrum, software engineering concepts
    ├── 01_Idea_e_Requisiti/                    ← Requirements, feature specs
    ├── 02_System_Design_e_Architettura/        ← Architecture, tech stack decisions, system diagrams
    └── 03_Detailed_Design_e_Modellazione/      ← Data modeling, API design (in progress)
```

---

## Key Documents

| Document | Purpose |
|---|---|
| `docs/Project_Journal.md` | **Handoff document** — AI agents must read this first to understand current state and log decisions |
| `docs/Indice_Corso_Software_Engineering.md` | Full course index linking all chapters |
| `docs/02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md` | Central source of truth: all decisions made and why |
| `docs/02_System_Design_e_Architettura/Architettura_Sistema.md` | Detailed system architecture with component descriptions |
| `docs/01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md` | Core feature spec: product recognition from receipts |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native |
| Backend Gateway | Node.js + Express.js |
| AI Worker | Python (HuggingFace, LiteLLM) |
| Database | NoSQL (MongoDB Atlas / Firebase Firestore) |
| Object Storage | AWS S3 / Google Cloud Storage / Cloudflare R2 |
| OCR | Google ML Kit (on-device) or Tesseract (server-side) |
| Product Matching | Open Food Facts API + RapidFuzz/FAISS + LLM fallback |

---

## Core Data Entities

- `User` (Profile, dietary preferences, allergies, cooking skill, impact totals)
- `Recipe` (Title, ingredients, instructions, prep time, difficulty, tags, embedding vector)
- `MealPlan` (Weekly plan: days, meals, shopping list)
- `ImpactLog` (Meals saved, money saved, ingredients used)

---

## Multi-Agent Development Workflow

This project uses a multi-agent development pattern. AI agents collaborate with the lead developer through the `docs/Project_Journal.md` handoff document. Agent roles include:
- **Tech Manager** — infrastructure decisions, project structure, data modeling
- **Work Buddy** — coding assistance, implementation
- **Brainstormer** — feature ideation, problem-solving

**Convention:** Every agent must read `docs/Project_Journal.md` before starting work, and update it after making important decisions.

---

## gstack (Global Stack)

This project uses [gstack](https://github.com/garrytan/gstack) to provide a shared set of skills for Claude Code.

**Web browsing:** Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

### Available gstack skills

| Skill | Purpose |
|---|---|
| `/office-hours` | Pair with another agent (AI or human) for help |
| `/plan-ceo-review` | Get CEO-level strategic review of a plan |
| `/plan-eng-review` | Get engineering review of a plan |
| `/plan-design-review` | Get design review of a plan |
| `/design-consultation` | Consult on design approach |
| `/design-shotgun` | Generate many design variations quickly |
| `/design-html` | Generate or iterate on design HTML |
| `/review` | Review current changes or PR |
| `/ship` | Ship changes with full QA pipeline |
| `/land-and-deploy` | Land and deploy changes |
| `/canary` | Run a canary check |
| `/benchmark` | Benchmark performance |
| `/browse` | Web browsing skill |
| `/connect-chrome` | Connect Chrome browser for debugging |
| `/qa` | Run QA checks |
| `/qa-only` | Run QA checks only |
| `/design-review` | Design-focused review |
| `/setup-browser-cookies` | Set up browser cookies |
| `/setup-deploy` | Set up deployment |
| `/setup-gbrain` | Set up gbrain |
| `/retro` | Run a retrospective |
| `/investigate` | Investigate an issue |
| `/document-release` | Document a release |
| `/document-generate` | Generate documentation |
| `/codex` | Codex-related operations |
| `/cso` | CSO review |
| `/autoplan` | Auto-generate plans |
| `/plan-devex-review` | Get developer experience review of a plan |
| `/devex-review` | Developer experience review |
| `/careful` | Careful mode for sensitive operations |
| `/freeze` | Freeze a branch or release |
| `/guard` | Guard against regressions |
| `/unfreeze` | Unfreeze a branch or release |
| `/gstack-upgrade` | Upgrade gstack itself |
| `/learn` | Learn about gstack features |

---

## Commands

Since no code has been written yet, there are no build, test, or lint commands. These will be added as each phase begins:
- **Phase 4** will add: package.json scripts (npm start, npm test), Python venv setup
- **Phase 5** will add: testing frameworks and runners
- **Phase 6** will add: Docker, CI/CD pipeline commands

---

## Notes

- All documentation is in **Italian** (the lead developer's native language).
- The `.claude/settings.local.json` file contains a **live API key** for DeepSeek API — treat as sensitive.
- `.idea/` is gitignored (IntelliJ IDEA project files).
- `.obsidian/` is gitignored (Obsidian vault config).
