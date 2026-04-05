# Metodologia Agile e Project Management (Kanban / Scrum)

> **Categoria:** Fondamenti Teorici  
> **A cosa serve:** Capire come si organizza il lavoro in un'azienda software professionale — e applicarlo subito a FridgeSavvy.

---

## Perché esiste questa metodologia?

Immagina di voler costruire una casa. Un approccio ingenuo sarebbe: progettare tutto nei minimi dettagli per 6 mesi, poi costruire per 18 mesi, poi aprire la porta. Ma cosa succede se a metà cantiere il cliente cambia idea sulla disposizione delle stanze?

Esattamente questo succedeva nel software degli anni '90, con il cosiddetto modello **Waterfall** (a cascata): si pianificava tutto, si costruiva tutto, si consegnava tutto — e spesso il prodotto finale non corrispondeva più a quello che il mercato voleva.

**Agile** nasce come reazione. L'idea centrale è:

> *"Non sai cosa vuole davvero il cliente finché non glielo fai vedere. Quindi fallo vedere presto, spesso e in piccoli pezzi."*

Invece di costruire la casa intera e poi mostrarla, costruisci prima una camera, la mostri, raccogli feedback, e poi costruisci la successiva — migliorando ogni volta.

---

## 1. Il Vocabolario che useremo da ora in poi

Queste parole le sentirai in qualsiasi azienda tech. Impararle adesso ti darà un vantaggio enorme.

### 🗂️ Kanban Board — La Lavagna Visiva
È la "lavagna" digitale dove si vede lo stato di tutto il progetto a colpo d'occhio. Contiene almeno tre colonne:

| `📋 To Do` | `🔨 In Progress` | `✅ Done` |
|---|---|---|
| Tutto ciò che bisogna fare, ma non si è ancora iniziato | Ciò su cui qualcuno sta lavorando adesso | Ciò che è finito, testato e consegnato |

### 📦 Backlog — La Lista della Spesa del Progetto
È l'elenco completo e ordinato di **tutto** quello che il progetto dovrà fare prima o poi. Non si lavora su tutto insieme — dal backlog si prelevano i task più urgenti e importanti, sprint dopo sprint.

### 🏔️ Epic — Il Grande Obiettivo
Un'epic è un'iniziativa macroscopica, troppo grande per essere completata in una sola sessione di lavoro. Esempio per FridgeSavvy:
- *"Gestione Inventario del Frigo"*
- *"Sistema di Voto Familiare"*
- *"Riconoscimento Prodotti da Scontrino"*

Ogni epic si rompe in tanti **Task** più piccoli e gestibili.

### 🎫 Task (o Issue / Ticket) — Il Compito Elementare
È l'unità atomica di lavoro assegnata a un singolo sviluppatore. Deve essere abbastanza piccolo da completarsi in 1-3 giorni. Esempi:
- *"Scrivere la struttura JSON di un Ingrediente"*
- *"Creare l'endpoint POST /api/scontrino"*
- *"Aggiungere la schermata di conferma prodotti"*

### ⏱️ Sprint — La Corsa Lavorativa
È un periodo di lavoro intenso e delimitato, tipicamente **7-14 giorni**. All'inizio di ogni sprint il team sceglie un certo numero di ticket dal backlog, se li assegna, e si impegna a finirli entro la fine dello sprint. Poi si fa una revisione, si raccolgono feedback, e si riparte con lo sprint successivo.

---

## 2. Lo Strumento Scelto: GitHub Projects

Esistono molti strumenti sul mercato per gestire board e ticket:

| Strumento | Pro | Contro |
|---|---|---|
| **Jira** | Potentissimo, standard enterprise | Complesso, pesante, costoso |
| **Trello** | Semplicissimo e visivo | Disconnesso dal codice |
| **GitHub Projects** | **Integrato con il repository** | Meno funzionalità avanzate di Jira |

Usiamo **GitHub Projects** per una ragione decisiva: il codice e i ticket vivono nello stesso posto.

### Il Super-Potere di GitHub Projects

Quando risolvi un bug o completi una feature, puoi scrivere nel tuo commit Git:

```bash
git commit -m "Aggiunto parser dello scontrino, closes #5"
```

GitHub legge quel messaggio, trova il ticket numero 5 e lo **sposta automaticamente nella colonna Done**. Nessuna azione manuale. Nessuna lavagna dimenticata aggiornare. Codice e project management sincronizzati alla perfezione.

---

## 3. Come Attivare la tua Kanban Board (Guida Pratica)

Segui questi passi sul tuo repository GitHub (`https://github.com/H-Alin02/Project-FridgeSavvy`):

1. **Crea il Progetto (la lavagna):**
   - Vai sul tab **Projects** in alto nel repository
   - Clicca `Link a project` → `New Project`
   - Scegli il template **Board** (le 3 colonne Kanban)

2. **Attiva gli Issues (i post-it digitali):**
   - Vai sul tab **Issues** del repository
   - Ogni nuovo task diventa un `New Issue`
   - Assegna una label, un responsabile, e collegalo al tuo Project

3. **Lavora con le colonne:**
   - Nuovo task → spostalo in `To Do`
   - Stai lavorandoci → spostalo in `In Progress`
   - Finito e testato → `Done` (o fallo automaticamente con il commit)

---

## 4. Il tuo Primo Backlog Operativo

Questi sono i primi tre ticket formali del progetto FridgeSavvy. Aprili su GitHub Issues e inseriscili nella colonna **To Do** della tua board.

---

### `TICKET-001` — [Backend Init] Inizializzare il Server Node.js
**Assegnato a:** Junior Developer  
**Priorità:** 🔴 Alta  
**Epic:** Setup Ambiente di Sviluppo

**Descrizione:**  
Creare la struttura base del server backend. L'obiettivo non è scrivere logica di business, ma avere un ambiente funzionante e pronto a ricevere il codice.

**Criteri di Completamento (Definition of Done):**
- Cartella `backend/` creata nella root del repository
- File `package.json` generato con `npm init`
- Framework per API REST installato (es. Express.js)
- Script `npm run dev` configurato che avvia il server e stampa un log di conferma nel terminale
- Tutto committato su GitHub

---

### `TICKET-002` — [NoSQL Data Modeling] Proporre lo Schema dei Dati
**Assegnato a:** Junior Developer  
**Priorità:** 🔴 Alta  
**Epic:** Progettazione Dati

**Descrizione:**  
Prima di toccare il database, bisogna disegnare su carta (o su file) la struttura dei dati che andremo a salvare. Come sarà fatto un documento `Scontrino`? E una `Ricetta`?

**Criteri di Completamento:**
- File creato in `docs/03_Detailed_Design_e_Modellazione/Lezione_3_Data_Modeling_NoSQL.md`
- Almeno uno schema JSON commentato per l'entità `Scontrino`
- Almeno uno schema JSON commentato per l'entità `Ricetta`
- Gli schemi rispettano le regole NoSQL: nessun dato binario, struttura flessibile

---

### `TICKET-003` — [Linter] Configurare la Formattazione del Codice
**Assegnato a:** Junior Developer  
**Priorità:** 🟡 Media  
**Epic:** Setup Ambiente di Sviluppo

**Descrizione:**  
Prima di scrivere codice vero, bisogna configurare gli strumenti che *controllano automaticamente* la qualità del codice. Un linter è un programma che legge il tuo codice e ti dice se stai usando uno stile inconsistente (es. a volte usi virgolette doppie, a volte singole).

**Criteri di Completamento:**
- Prettier o ESLint installati come dipendenza di sviluppo (`npm install --save-dev`)
- File di configurazione creato (`.prettierrc` o `.eslintrc`)
- Script `npm run lint` configurato nel `package.json`
- Il linter passa senza errori sul codice esistente

---

*Documento vivo — aggiornare man mano che il Sprint avanza.*
