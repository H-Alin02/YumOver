# Progetto-Food-Coach: Documentazione di Software Engineering

> Benvenuto nell'indice generale del progetto Food Coach.  
> Questa cartella `docs/` e i suoi sottocapitoli contengono il percorso logico, metodologico e ingegneristico che seguiamo per costruire il prodotto. L'ordine dei capitoli **rispetta rigorosamente le fasi dell'SDLC** (Software Development Life Cycle) — lo stesso processo usato nelle aziende tech professionali.

---

## 🗺️ Dove Siamo Ora

```
✅ Capitolo 00 — Fondamenti Teorici     (completato)
✅ Capitolo 01 — Idea e Requisiti       (in aggiornamento continuo)
✅ Capitolo 02 — System Design          (completato)
🔄 Capitolo 03 — Detailed Design       ← siamo qui
⏳ Capitolo 04 — Sviluppo e Codice
⏳ Capitolo 05 — Testing e Qualità
⏳ Capitolo 06 — Deploy e CI/CD
```

---

## 📖 Indice dei Capitoli

---

### Capitolo 00 — Fondamenti Teorici
*Concetti trasversali e metodologie che un Software Engineer usa ogni giorno, indipendentemente dal progetto.*

| Documento | Descrizione |
|---|---|
| [Metodologia Agile e Scrum](./00_Fondamenti_Teorici/Metodologia_Agile_Scrum.md) | Come si organizza il lavoro in team con Sprint, Backlog, e Kanban Board su GitHub Projects. Include i primi 3 ticket del progetto. |

---

### Capitolo 01 — Idea e Requisiti (Requirements Gathering)
*Cosa vogliamo costruire, perché lo facciamo, e come si analizzano i requisiti in modo professionale.*

| Documento | Descrizione |
|---|---|
| [Lezione 2 — SDLC e Detailed Design](./01_Idea_e_Requisiti/Lezione_2_SDLC_e_Prossimi_Passi.md) | Le fasi professionali della creazione software, con focus su Data Modeling e API Design — i due step che precedono il coding. |
| [Feature: Riconoscimento Prodotti dallo Scontrino](./01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md) | Brainstorming e piano dettagliato per risolvere il problema dei nomi abbreviati sugli scontrini. Include la pipeline a 4 livelli, Open Food Facts, e il Flywheel effect. |

---

### Capitolo 02 — System Design e Architettura (High-Level Design)
*Come dividere il sistema in macro-blocchi separati e come comunicano tra loro.*

| Documento | Descrizione |
|---|---|
| [Knowledge Base — Riepilogo Decisioni](./02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md) | Punto di verità centrale: tech stack scelto, motivazioni, stato del progetto, e link a tutti i documenti. Partire da qui per un ripasso veloce. |
| [Architettura del Sistema](./02_System_Design_e_Architettura/Architettura_Sistema.md) | Descrizione dettagliata di ogni componente (React Native, Node.js, Python, NoSQL, Object Storage) e il flusso completo di una richiesta dall'app al database. |

---

### Capitolo 03 — Detailed Design e Modellazione *(in corso)*
*La progettazione microscopica: struttura dei dati, flussi di logica, design delle API, e wireframe dell'interfaccia.*

| Documento | Descrizione |
|---|---|
| [Data Modeling NoSQL](./03_Detailed_Design_e_Modellazione/Lezione_3_Data_Modeling_NoSQL.md) | *(In redazione)* Gli schemi JSON delle entità principali: `Scontrino`, `Ingrediente`, `Ricetta`, `Utente`, `Sondaggio`. |
| API Design | *(Da creare)* L'elenco completo degli endpoint REST del server Node.js con esempi di request e response. |
| UI Wireframing | *(Da creare)* Schizzi logici delle schermate principali dell'app (Inventario, Scansione, Ricette, Voto). |

---

### Capitolo 04 — Sviluppo e Codice *(in attesa)*
*Snippet, configurazioni e note pratiche su come scrivere il codice di React Native, Node.js ed esporre l'AI con Python.*

> ⏳ Questo capitolo verrà riempito solo dopo aver completato il Capitolo 03.

---

### Capitolo 05 — Testing e Qualità *(in attesa)*
*Come testare ogni componente del sistema per garantire che non ci siano bug prima di andare in produzione.*

Conterrà:
- **Unit Testing:** testare ogni funzione in isolamento (es. il parser dello scontrino)
- **Integration Testing:** verificare che Node.js, Python e il Database comunichino correttamente
- **End-to-End Testing:** simulare un utente reale dall'apertura dell'app alla conferma dei prodotti

> ⏳ Questo capitolo verrà riempito durante il Capitolo 04.

---

### Capitolo 06 — Deploy e CI/CD *(in attesa)*
*Come mettere il software online e come automatizzare le pubblicazioni degli aggiornamenti.*

Conterrà:
- **Deploy su Cloud:** come configurare un server VPS o un servizio cloud (Railway, Render, AWS) per eseguire Node.js e Python h24
- **CI/CD (Continuous Integration / Continuous Deployment):** come configurare GitHub Actions per eseguire i test automaticamente ad ogni push e pubblicare il nuovo codice in modo automatico
- **Docker:** come "inscatolare" ogni microservizio per renderlo portabile e riproducibile su qualsiasi macchina

> ⏳ Questo capitolo verrà riempito dopo il Testing.

---

## 🔑 Come Muoversi in questa Documentazione

- **Stai studiando un concetto nuovo?** → Parti dal Capitolo 00 o 01
- **Vuoi sapere cosa abbiamo deciso e perché?** → [Knowledge Base](./02_System_Design_e_Architettura/Knowledge_Base_Riepilogo.md)
- **Vuoi capire come funziona il sistema nel dettaglio?** → [Architettura del Sistema](./02_System_Design_e_Architettura/Architettura_Sistema.md)
- **Stai guardando una nuova idea o feature?** → [Feature: Riconoscimento Prodotti](./01_Idea_e_Requisiti/Feature_Riconoscimento_Prodotti_Scontrino.md)
- **Vuoi sapere cosa fare adesso?** → [Kanban Board su GitHub](https://github.com/H-Alin02/Project-Food-Coach/projects)

---

*Documentazione costruita seguendo le best practices dell'industria software. Aggiornata continuamente man mano che il progetto avanza.*
