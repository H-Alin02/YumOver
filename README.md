<!-- markdownlint-disable MD041 MD033 -->
<div align="center">

# 🧊 FridgeSavvy → Food Coach

### Learning software engineering by building an app against food waste.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-Node.js%20%7C%20Python%20%7C%20MongoDB-339933)]()

</div>

---

## What is FridgeSavvy?

FridgeSavvy is two things, and they are not the same.

**Food Coach** is an app that tries to tackle food waste differently. Instead of just giving you recipes for leftovers (which is what they all do), it tries to teach you how to waste less upstream: how to shop, how to store, how to cook what you have. The philosophy is a bit anti-commercial: if it works well, over time you won't need it anymore. That is one of the reasons I wanted to build it.

**A learning path.** Every piece of this project is open. The code, the decisions, the mistakes. I am building it while I learn, following a real SDLC cycle from theory to deploy. It is for anyone who wants to see how you go from an idea to a product without skipping steps.

---

## Goal

Teach people to waste less food. Not with a tracker or a mandatory shopping list, but by trying to change how people think about the food they buy and cook.

The app does three things:
- Get 3 recipes adapted to the ingredients you have. No endless lists.
- Track impact: meals saved, money saved.
- Plan: weekly planning, storage tips, challenges down the line. The basics need to work first.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Gateway** | Node.js + Express | API REST, orchestration |
| **AI Worker** | Python + FastAPI | RAG recommendation engine |
| **Database** | MongoDB Atlas | Structured data |
| **Vector DB** | ChromaDB | Embeddings for similarity search |
| **LLM** | Gemini API (free tier) | Recipe refinement |
| **Frontend (future)** | React Native | Cross-platform mobile |

### Architecture

<img src="docs/02_System_Design_e_Architettura/ArchitectureDiagram.svg" alt="Food Coach Architecture" width="100%"/>

The pipeline is simple: embedding search on ChromaDB finds the closest recipes, Gemini adapts them to your ingredients. No fine-tuning, no custom models.

If no recipe matches, the system tries a new combination. If that still falls short, it asks: "Do you also have an egg? With that I could make..."

### Request Flow

<img src="docs/02_System_Design_e_Architettura/FlowDiagram.svg" alt="Request Flow — Recipe Suggestion" width="100%"/>

## Course Structure (SDLC)

The project follows the 6 phases of the Software Development Life Cycle used in the industry:

```
📘 Ch. 00 — Theory Foundations    ✅ (Agile/Scrum, methodologies)
📗 Ch. 01 — Idea & Requirements   ✅ (Feature analysis, brainstorming)
📙 Ch. 02 — System Design         ✅ (Architecture, microservices)
📕 Ch. 03 — Detailed Design       ✅ (Data modeling, API design) ← COMPLETED
📓 Ch. 04 — Development           🔄 (Sprint 1 — Dataset + Backend)
📔 Ch. 05 — Testing & Quality     ⏳
📒 Ch. 06 — Deploy & CI/CD        ⏳
```

Each chapter includes theory docs, exercises, and YouTube links so you can study on your own before writing code.

See the [Full Course Index](docs/Indice_Corso_Software_Engineering.md) and the [Food Coach Design Doc](docs/03_Detailed_Design_e_Modellazione/Food_Coach_Design_Doc.md).

---

## Current Status

The project is in **Phase 4 (Development)**. Phase 3 (Detailed Design) is done.

- [x] Theory foundations (Agile, Scrum, roles)
- [x] Idea validated and requirements defined
- [x] Microservices architecture designed
- [x] Tech stack chosen and justified
- [x] NoSQL data modeling
- [x] REST API design
- [x] Design doc reviewed (/plan-eng-review)
- [ ] Sprint 1 — Recipe dataset + monorepo setup
- [ ] Sprint 2 — AI Core (embedding + RAG pipeline)
- [ ] Sprint 3 — Backend API (Node.js gateway)

---

## Learning Goals

What I am learning by building Food Coach:

- ✅ System design and microservices architecture
- ✅ REST APIs with Node.js + Express
- ✅ NoSQL databases (MongoDB) and data modeling
- ✅ RAG pipeline (embedding search + LLM refinement)
- ✅ Vector databases (ChromaDB)
- ✅ AI integration (Gemini API, sentence-transformers)
- ✅ Python + FastAPI for AI microservices
- ✅ DevOps: CI/CD, Docker, cloud deploy
- ✅ Cross-platform mobile frontend (React Native, future)
- ✅ Git branch strategy and code review

---

## License

MIT License. See [LICENSE](LICENSE) for more information.

---

</div>
