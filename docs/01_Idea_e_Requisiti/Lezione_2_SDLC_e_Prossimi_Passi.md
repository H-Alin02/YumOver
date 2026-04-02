# Lezione 2: Il Ciclo di Vita del Software (SDLC) e il Detailed Design
*Progetto: FridgeSavvy*

Questa lezione approfondisce le fasi professionali della creazione di un software. Sapere programmare è solo una parte del lavoro di un ingegnere; capire "in quale fase" del progetto ci si trova è ciò che distingue uno sviluppatore amatoriale da un Software Engineer professionista.

---

## 1. Il Software Development Life Cycle (SDLC)
L'SDLC è il processo standardizzato utilizzato dalle aziende per sviluppare, progettare e testare software di alta qualità. L'obiettivo è minimizzare i rischi e i costi, massimizzando il ritorno sugli investimenti.
Le fasi classiche (adattate oggi alle metodologie *Agile*) sono:

1.  **Analisi dei Requisiti (Requirements Gathering):** Capire cosa vuole il cliente (o il mercato). *Nel nostro caso: un'app per gestire la dispensa tramite foto scontrini e votare in famiglia.*
2.  **Progettazione di Sistema (System Design / High-Level Design):** Definire "lo stack" (le tecnologie) e come i blocchi macroscopici comunicano tra loro (Client-Server, Database). *Questa è la fase che abbiamo appena completato scegliendo React Native, Node.js, Python e un DB NoSQL.*
3.  **Progettazione di Dettaglio (Detailed Design):** Definire in modo microscopico le strutture dati, le interfacce (API) e i flussi (Logica di Business).
4.  **Implementazione (Coding):** La scrittura vera e propria del codice sorgente.
5.  **Testing (Collaudo):** Verificare che il codice faccia esattamente quello che i requisiti iniziali impongono, senza introdurre bug (Testing Unitario, Testing di Integrazione).
6.  **Deployment (Rilascio) e Manutenzione:** Mettere il software su un server di produzione e sul Play Store, correggendo bug segnalati dagli utenti nel tempo.

---

## 2. Cosa si fa dopo aver scelto l'Architettura?
Siamo appena entrati nella Fase 3 dell'SDLC: la **Progettazione di Dettaglio (Detailed Design)**. 
In azienda, prima di scrivere la prima riga di logica in React o in Python, i team Backend e Frontend devono mettersi d'accordo su due grandissimi pilastri. I team si "siedono a un tavolo" e definiscono:

### 2.1 Fase A: Data Modeling (Progettazione dei Dati)
I dati sono il cuore vitale di qualsiasi applicazione. Se si progetta male la struttura dei dati, il codice diventerà ingestibile in futuro.
Occorre mappare la realtà (il "Dominio di Business") in astrazioni informatiche:
*   Si identificano le **Entità** (Es. `Utente`, `Ingrediente`, `Ricetta`, `Famiglia`, `Sondaggio`).
*   Si decide la **Struttura (Schema)** per il database: quali campi / proprietà possiede ciascuna entità? Di che "tipo" informatico sono (Testo, Numero, Booleano, Data)?
*   Si gestiscono le **Relazioni**: un Utente "appartiene" a una Famiglia? Una Ricetta "contiene" molti Ingredienti?

*Poiché abbiamo scelto un Database NoSQL, questa fase si traduce nel disegnare la struttura dei documenti JSON che salveremo.*

### 2.2 Fase B: API Design (Il "Contratto" tra i Sistemi)
Dato che abbiamo un'architettura **Client-Server**, i due sistemi sono separati. Per farli parlare si utilizza un'API (Application Programming Interface), solitamente di tipo REST (Representational State Transfer).
L'API Design comporta definire un vero e proprio "Contratto Legale" formale tra i due sistemi. Questo contratto stabilisce:
*   **Gli Endpoint (Le Porte):** Quale URL chiamare (es. `POST /api/ingredients`).
*   **Il Richiesto (Request Body):** Cosa il Client (React Native) deve mandare al Server (es. un JSON con la foto dello scontrino).
*   **La Risposta (Response Body):** Cosa il Server promette di restituire (es. una lista di Ingredienti estratta con Python).

Solo dopo che "Data Model" e "API Design" sono stabiliti e documentati (spesso usando standard come *Swagger / OpenAPI*), i programmatori backend possono isolarsi a scrivere le API e i programmatori frontend possono isolarsi a scrivere le schermate.

---

## 3. Riepilogo Operativo per FridgeSavvy
Seguendo le *Best Practices* industriali, i nostri prossimi tre step (prima di aprire l'editor di codice in modo massiccio) saranno:
1.  **Data Modeling:** Disegnare la forma JSON degli `Ingredienti` e delle `Ricette`.
2.  **API Design:** Scrivere su carta (o su file) l'elenco delle rotte del nostro server Node.js.
3.  **UI Wireframing:** Buttare giù uno schizzo logico (o vero e proprio) di cosa vede l'utente sul telefono (Schermata Frigo, Schermata Voto).
