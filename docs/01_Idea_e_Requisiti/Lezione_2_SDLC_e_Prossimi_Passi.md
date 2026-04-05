# Lezione 2: Il Ciclo di Vita del Software (SDLC) e il Detailed Design

> **Categoria:** Idea e Requisiti  
> **Progetto:** FridgeSavvy  
> **A cosa serve:** Capire in quale "fase" del progetto ci troviamo, e cosa dobbiamo fare prima di poter scrivere la prima riga di codice vero.

---

## Perché esiste l'SDLC?

Immagina di chiedere a un muratore di costruire una casa senza un progetto dell'architetto. Potrebbe farlo — ma rischieresti di ritrovarti con muri nei posti sbagliati, cavi elettrici non pianificati, e una cucina troppo piccola. Buttare giù un muro a lavori finiti costa 10 volte di più che spostarlo su carta prima di iniziare.

Nel software è uguale. Scrivere codice senza pianificazione crea **debito tecnico**: codice difficile da modificare, bug nascosti, e architetture fragili che crollano sotto il peso di nuove funzionalità.

L'**SDLC (Software Development Life Cycle)** è il processo standardizzato che le aziende usano per evitare questo disastro. È la sequenza ordinata di fasi che porta da un'idea grezza a un prodotto stabile in produzione.

---

## 1. Le Fasi dell'SDLC

### Fase 1 — Analisi dei Requisiti (Requirements Gathering)
**Domanda centrale:** *Cosa dobbiamo costruire, e perché?*

Prima di tutto, bisogna capire chi userà il software, quali problemi ha, e quali funzionalità si aspetta. Questa fase produce documenti come le **User Stories** (storie utente) nel formato: *"Come [tipo di utente], voglio [funzionalità], in modo da [beneficio]."*

**Per FridgeSavvy:**
- "Come utente, voglio scansionare il mio scontrino, così non devo inserire gli ingredienti a mano."
- "Come familiare, voglio votare la ricetta della sera, così decidiamo tutti insieme."

---

### Fase 2 — Progettazione di Sistema / High-Level Design
**Domanda centrale:** *Quali tecnologie usiamo e come parlano tra loro?*

È la fase in cui si scelgono le tecnologie (**tech stack**) e si disegna l'architettura generale del sistema: quanti server, quale database, come comunicano il frontend e il backend.

**Per FridgeSavvy — completata:**
- Frontend: **React Native** (app mobile iOS e Android)
- Backend: **Node.js** (API Gateway) + **Python** (worker AI)
- Database: **NoSQL** (MongoDB o Firebase)
- Storage immagini: **Object Storage** (tipo AWS S3)

*(Vedi il documento di architettura per i dettagli.)*

---

### Fase 3 — Progettazione di Dettaglio / Detailed Design ← Siamo qui
**Domanda centrale:** *Come sono fatti esattamente i dati? Come parlano esattamente i sistemi?*

Questo è il "disegno architettonico" della casa: dove va ogni cavo, ogni tubo, ogni presa. In questa fase si definiscono:
- La **struttura esatta dei dati** nel database (Data Modeling)
- Le **API**: gli URL e i messaggi scambiati tra client e server (API Design)
- L'**interfaccia utente** a grandi linee (UI Wireframing)

---

### Fase 4 — Implementazione (Coding)
**Domanda centrale:** *Ora scriviamo il codice.*

Solo dopo aver completato il Detailed Design si apre l'editor. I programmatori backend e frontend lavorano in parallelo perché sanno già esattamente cosa devono produrre — il contratto (API) è già scritto.

---

### Fase 5 — Testing (Collaudo)
**Domanda centrale:** *Funziona davvero come previsto?*

Il codice viene testato sistematicamente:
- **Unit Testing:** ogni singola funzione viene testata in isolamento
- **Integration Testing:** si verifica che i vari componenti (Node.js, Python, Database) funzionino correttamente insieme
- **End-to-End Testing:** si simula un utente reale che usa l'app dall'inizio alla fine

---

### Fase 6 — Deploy e Manutenzione
**Domanda centrale:** *Come mettiamo il software online e come lo teniamo aggiornato?*

Il software viene pubblicato su server cloud (Deploy) e si configurano sistemi automatizzati che controllano la qualità del codice ad ogni aggiornamento (CI/CD — Continuous Integration / Continuous Deployment).

---

## 2. Il Detailed Design in Dettaglio: Cosa Dobbiamo Fare

Siamo nella **Fase 3**. Questa è la fase più importante prima di scrivere codice, perché le decisioni prese qui impattano tutto ciò che verrà dopo. Si articola in tre sotto-fasi:

---

### 2.1 Data Modeling — Progettare i Dati

**Cos'è:** Decidere esattamente come i dati saranno organizzati nel database. Nel nostro caso, usiamo un database **NoSQL** — che non usa tabelle con righe e colonne come un foglio Excel, ma salva i dati come documenti **JSON** (oggetti JavaScript) flessibili.

**Perché è critico:** Se salvi i dati in modo sbagliato, poi cambiarli diventa un'operazione costosa. Un ingrediente mal strutturato nel database può rendere impossibile suggerire una ricetta in modo efficiente.

**Cosa si produce:** Lo schema JSON di ogni entità del sistema:

```json
// Esempio bozza di un documento "Scontrino" nel DB NoSQL
{
  "id": "scontrino_001",
  "data_acquisto": "2026-03-22",
  "supermercato": "SISA Partinico",
  "immagine_url": "https://storage.fridgesavvy.com/scontrini/001.jpg",
  "totale_eur": 61.64,
  "prodotti": [
    {
      "nome_raw": "SOLE MOZZARELLA",
      "nome_normalizzato": "Mozzarella Sole 125g",
      "quantita_grammi": 125,
      "iva_percentuale": 4,
      "prezzo_eur": 1.89
    }
  ]
}
```

**Le entità da modellare per FridgeSavvy:**
- `Utente` (profilo, famiglia di appartenenza)
- `Scontrino` (data, negozio, lista prodotti, foto)
- `Ingrediente` (nome, grammatura, categoria, scadenza stimata)
- `Ricetta` (nome, ingredienti necessari, procedimento)
- `Sondaggio` (ricette in votazione, voti dei familiari)

---

### 2.2 API Design — Il Contratto tra i Sistemi

**Cos'è:** Poiché il frontend (React Native) e il backend (Node.js) sono due programmi separati che girano su macchine diverse, devono comunicare attraverso una rete. Lo fanno attraverso le **API REST** — un sistema di messaggi standardizzato che viaggia su HTTP (lo stesso protocollo del web).

**Cos'è un endpoint:** È un URL preciso sul server su cui il client può fare richieste. Ogni endpoint ha:
- Un **metodo HTTP** che descrive l'operazione: `GET` (leggi), `POST` (crea), `PUT` (aggiorna), `DELETE` (cancella)
- Un **URL** che identifica la risorsa: `/api/ingredienti`, `/api/scontrini`
- Un **Request Body**: il messaggio che il client manda al server (in JSON)
- Un **Response Body**: la risposta che il server promette di restituire (in JSON)

**Esempi di API per FridgeSavvy:**

```
POST /api/scontrini/upload
  → Il client manda: { foto_base64: "...", utente_id: "123" }
  ← Il server risponde: { scontrino_id: "s001", stato: "in_elaborazione" }

GET /api/inventario/{utente_id}
  → Il client manda: [niente, è una richiesta di lettura]
  ← Il server risponde: { ingredienti: [ { nome: "Mozzarella", grammi: 125 }, ... ] }

POST /api/sondaggi
  → Il client manda: { ricette_ids: ["r1", "r2", "r3"], famiglia_id: "f001" }
  ← Il server risponde: { sondaggio_id: "p001", link_condivisibile: "..." }
```

Questo "contratto" viene documentato con strumenti come **Swagger / OpenAPI**, che generano automaticamente una pagina web interattiva dove chiunque nel team può testare le API.

---

### 2.3 UI Wireframing — L'Interfaccia a Grandi Linee

**Cos'è:** Prima di scrivere codice React Native, si disegna su carta (o con strumenti come Figma) uno **wireframe** — uno scheletro dell'interfaccia utente, in bianco e nero, senza colori o grafica definitiva.

**Perché si fa:** Per assicurarsi che il flusso dell'utente abbia senso prima di investire settimane a programmare schermate che poi vanno rifatte.

**Schermate principali di FridgeSavvy:**
1. Schermata Home / Inventario Frigo (cosa ho nel frigo adesso?)
2. Schermata Scansione Scontrino (foto + conferma prodotti)
3. Schermata Ricette Suggerite (cosa cucino con quello che ho?)
4. Schermata Sondaggio (vota la ricetta di stasera!)
5. Schermata Profilo / Famiglia (gestione account)

---

## 3. Riepilogo Operativo — I Prossimi Passi

| Ordine | Attività | Output atteso |
|---|---|---|
| 1 | **Data Modeling** | File JSON con gli schemi di `Scontrino`, `Ingrediente`, `Ricetta` |
| 2 | **API Design** | File con l'elenco di tutti gli endpoint Node.js commentati |
| 3 | **UI Wireframing** | Schizzi o wireframe digitali delle schermate principali |
| 4 | *(solo dopo)* **Coding** | Primo codice vero su Node.js e React Native |

---

*Solo dopo aver completato questi tre punti apriremo l'editor di codice in modo massivo. La pazienza in questa fase ripaga 10x durante lo sviluppo.*
