# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Food Coach** è due cose in uno:
1. Un'**app educativa anti-spreco** con filosofia anti-Tinder: l'app ha successo quando l'utente non ha più bisogno dell'app. Invece di limitarsi a dare ricette con gli avanzi, insegna a pianificare la spesa, conservare il cibo e cucinare quello che si ha.
2. Un **percorso di apprendimento strutturato** per il lead developer (Alin) per imparare full-stack software engineering seguendo un ciclo SDLC reale, dalla teoria al deploy.

**Storia:** Il progetto è nato come **FridgeSavvy** (app OCR per scansione scontrini). A Luglio 2026 ha fatto un pivot concettuale a **Food Coach**, poi rinominato **Project Food Coach**. L'architettura a microservizi già definita (Node.js + Python + NoSQL) rimane valida e viene riutilizzata.

**Current Status:** SDLC Phase 3 — Detailed Design ✅ Completata. **Pronti per Phase 4 — Sviluppo.**

Vedi il [Food Coach Design Doc](docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md) per il documento di design completo e approvato.

**Remote:** `https://github.com/H-Alin02/Project-Food-Coach`
**GitHub Project Board:** `https://github.com/users/H-Alin02/projects/4`

---

## SDLC Phases & Project Discipline

The project follows strict SDLC discipline: **no code is written before design is complete**.

| Phase | Status |
|---|---|
| 0 — Theoretical Foundations (Agile/Scrum) | ✅ Complete |
| 1 — Requirements (feature analysis, brainstorming) | ✅ Complete |
| 2 — System Design (architecture, microservices) | ✅ Complete |
| 3 — Detailed Design (data modeling, API design, wireframes) | ✅ Complete |
| 4 — Development & Coding | 🔄 **Next phase — Sprint 1** |
| 5 — Testing & Quality | ⏳ Not started |
| 6 — Deploy & CI/CD | ⏳ Not started |

**Next three steps (Sprint 1):**
1. **Dataset** — create a seed of 30-50 Italian recipes in structured JSON format
2. **Setup monorepo** — `backend/` (Node.js + Express) + `worker/` (Python + FastAPI) + `app/` (React Native, future)
3. **Python notebook** — validate embedding (sentence-transformers) + similarity search (ChromaDB) on recipe seed

---

## Architecture: Backend-First MVP with RAG Pipeline

### Current Architecture (MVP)

```
Utente (Browser Web MVP)     [futuro: React Native App]
         │                             │
         ▼                             │
[Node.js Gateway :8000] ←──────────────┘
    │       ↑
    │       └── HTTP REST ──► [Python AI Worker :8001]
    │                             │
    │                             ├── [ChromaDB] — embedding vettoriali ricette
    │                             └── [Gemini API] — LLM refinement
    │
    ├── [MongoDB Atlas] — utenti, ricette, impatto, preferenze
    └── [futuro] Integrazione supermercati italiani
```

### Key Architectural Decisions

- **MVP = backend-first, API-first.** Nessun frontend mobile inizialmente. Si inizia con interfaccia web semplice. React Native arriva dopo che il recommendation engine è validato.
- **Comunicazione Node.js ↔ Python:** HTTP REST. Python espone `POST /suggest` via FastAPI su porta 8001.
- **Auth:** Nessuna per MVP. App aperta senza login.
- **Monorepo:** `/backend` (Node.js Express), `/worker` (Python FastAPI), `/app` (React Native futuro).

### AI Pipeline: RAG (NO fine-tuning)

```
Input ingredienti → [1] Embedding search (ChromaDB, top-10)
                  → [2] Gemini refinement (grounding context)
                  → 3 ricette adattate
```

**Fallback creativo a 4 livelli:**
- **Livello 1:** Retrieval da DB (match ≥2 ingredienti)
- **Livello 2:** LLM refinement con sostituzioni
- **Livello 3:** Generazione guidata con disclaimer ("Non è una ricetta classica, ma...")
- **Livello 4:** Interazione — "Hai anche X? Con quello potrei fare Y."

---

## Planned Monorepo Structure (non ancora creata — sarà creata in Sprint 1)

```
.
├── backend/            ← Node.js + Express.js (Gateway API, :8000)
│   ├── src/
│   │   ├── routes/     ← Endpoint REST: /api/recipes/suggest, /api/user/...
│   │   ├── models/     ← Mongoose schemas (User, Recipe, MealPlan, ImpactLog)
│   │   └── services/   ← Business logic, chiamate al worker Python
│   ├── package.json
│   └── server.js
├── worker/             ← Python + FastAPI (AI Worker, :8001)
│   ├── app/
│   │   ├── main.py     ← FastAPI app con POST /suggest
│   │   ├── embedder.py ← sentence-transformers per embedding search
│   │   └── llm.py      ← Gemini API per refinement
│   ├── chroma_db/      ← ChromaDB persistente
│   ├── data/           ← Dataset ricette in JSON
│   └── requirements.txt
├── app/                ← React Native (futuro, non ancora creato)
├── data/               ← Dataset ricette seed (JSON)
├── notebooks/          ← Python notebook di validazione embedding
└── docs/               ← Documentazione del progetto
```

---

## Repository Structure (stato attuale — solo documentazione)

```
.
├── CLAUDE.md                        ← This file
├── README.md                        ← Project overview (Italian)
├── .gitignore                       ← gitignore (NOTA: ignora CLAUDE.md, ma è già tracciato)
├── .claude/                         ← Claude Code config (settings.local.json)
├── docs/                            ← Tutta la documentazione
│   ├── Indice_Corso_Software_Engineering.md    ← Course index — start here
│   ├── Project_Journal.md                      ← Handoff journal — READ BEFORE WORKING
│   ├── 00_Fondamenti_Teorici/                  ← Agile/Scrum, SDLC theory
│   ├── 01_Idea_e_Requisiti/                    ← Requirements, feature specs
│   ├── 02_System_Design_e_Architettura/        ← Architecture, tech stack, system diagrams
│   ├── 03_Detailed_Design_e_Modellazione/      ← Data modeling, API design, Food Coach Design Doc
│   └── diagrams/                                ← Excalidraw architecture diagram
```

---

## Key Documents

| Document | Purpose |
|---|---|
| [docs/Project_Journal.md](docs/Project_Journal.md) | **Handoff document** — AI agents MUST read this first to understand current state and log decisions |
| [docs/Indice_Corso_Software_Engineering.md](docs/Indice_Corso_Software_Engineering.md) | Full course index linking all chapters |
| [docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md](docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md) | **Food Coach Design Doc** — design completo, approvato, con data model, API surface, RAG pipeline, competitor analysis |
| [docs/02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md](docs/02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md) | Central source of truth: all decisions and rationale (⚠️ parzialmente stale dopo il pivot — prioritizzare Food_Coach_Design_Doc.md) |
| [docs/02_System_Design_e_Architettura/Architettura_Sistema.md](docs/02_System_Design_e_Architettura/Architettura_Sistema.md) | Detailed system architecture (⚠️ parzialmente stale — descrive la vecchia pipeline OCR) |

---

## Tech Stack

| Layer | Technology | Why / Notes |
|---|---|---|
| **Backend Gateway** | Node.js + Express.js | Orchestrator API REST |
| **AI Worker** | Python + FastAPI | RAG pipeline (embedding + LLM refinement) |
| **Database** | MongoDB Atlas (free tier, 512MB) | NoSQL: users, recipes, impact, preferences |
| **Vector DB** | ChromaDB (open source, Python) | 384-dim embedding vectors for similarity search |
| **Embedding Model** | sentence-transformers/all-MiniLM-L6-v2 | CPU-only, lightweight, free |
| **LLM Refinement** | Gemini API (free tier) | Recipe refinement with grounding context |
| **Frontend (futuro)** | React Native | Cross-platform mobile (dopo MVP backend) |
| **Object Storage (futuro)** | Cloudflare R2 (free tier, 10GB) | Per immagini ricette/ingredienti (v2) |
| **Hosting** | Railway / Render free tiers | Zero-budget MVP |

### Core API Endpoints (MVP Surface)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/recipes/suggest` | Suggest 3 recipes from ingredients via RAG pipeline |
| GET | `/api/user/impact` | Get user impact totals (meals saved, money saved) |
| POST | `/api/user/preferences` | Save dietary preferences and allergies |

### Data Entities

- **User** — profile, dietaryPreferences, allergies, cookingSkill, impactTotals
- **Recipe** — title, ingredients (with category), instructions, prepTime, difficulty, tags, embedding vector (384-dim), source, servings
- **MealPlan** — userId, weekStart, days (with meals), shoppingList
- **ImpactLog** — userId, date, mealsSaved, moneySaved (mealsSaved × €3.50), ingredientsUsed

---

## Multi-Agent Development Workflow

This project uses a multi-agent development pattern. AI agents collaborate with the lead developer through the [docs/Project_Journal.md](docs/Project_Journal.md) handoff document. Agent roles include:
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

Since no code has been written yet (Phase 3 completed, Phase 4 not started), there are no build, test, or lint commands. These will be added as each phase begins:

- **Phase 4** will add: package.json scripts (npm start, npm test), Python venv setup, requirements.txt
- **Phase 5** will add: testing frameworks and runners
- **Phase 6** will add: Docker, CI/CD pipeline commands

---

## Notes

- All documentation is in **Italian** (the lead developer's native language).
- The `.claude/settings.local.json` file contains a **live API key for DeepSeek API** — treat as sensitive.
- `.gitignore` lists `CLAUDE.md` as ignored (line 23), but the file is already tracked via `git add --force` (commit ca3d0cf). Don't remove it from tracking.
- `.idea/` is gitignored (IntelliJ IDEA project files).
- `.obsidian/` is gitignored (Obsidian vault config).
- **Documents stale after pivot:** `Knowledge_Base_Riepilogo.md` e `Architettura_Sistema.md` descrivono ancora il vecchio prodotto OCR. Per le decisioni correnti, fare riferimento a `Food_Coach_Design_Doc.md`.
- Costo mensile stimato MVP: **€0-5** (tutto su free tier).
