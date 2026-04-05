# Architettura del Sistema: FridgeSavvy

> **Categoria:** System Design e Architettura (High-Level Design)  
> **Fase SDLC:** Fase 2 — completata  
> **A cosa serve:** Capire come sono divisi i "pezzi" del sistema, perché sono stati divisi così, e come scambiano informazioni tra loro.

---

## Cos'è l'Architettura di un Sistema Software?

Quando si costruisce un edificio complesso — un aeroporto, un ospedale — non lo si costruisce come un unico blocco monolitico. Si progettano sezioni separate con ruoli distinti: il terminal departures, il terminal arrivi, la torre di controllo, i magazzini. Ognuno ha una funzione precisa, e comunicano tra loro attraverso corridoi, telefoni e sistemi radio ben definiti.

Un sistema software funziona esattamente allo stesso modo. FridgeSavvy non è un unico programma gigante, ma è diviso in **componenti specializzati** che comunicano tra loro attraverso messaggi di rete standardizzati.

Questo approccio si chiama architettura a **Microservizi** ed è lo standard nell'industria per sistemi moderni e scalabili.

---

![Diagramma Architettura FridgeSavvy](../Gemini_Generated_Image_51hsmx51hsmx51hs.png)

---

## 1. I Tre Livelli del Sistema

L'architettura di FridgeSavvy è organizzata su tre livelli distinti, ognuno con responsabilità ben separate. Questa separazione si chiama in inglese **Separation of Concerns** — uno dei principi fondamentali dell'ingegneria del software.

---

### 📱 Livello 1 — Client (L'Interfaccia Utente)

**Tecnologia scelta: React Native**

**Cos'è React Native:** È un framework creato da Meta (Facebook) che permette di scrivere il codice dell'app una sola volta e pubblicarla sia su Android che su iOS. Senza React Native, dovresti scrivere due app separate: una in Swift (Apple) e una in Kotlin (Android).

**Cosa fa in FridgeSavvy:**
- Mostra le schermate all'utente (inventario, ricette, sondaggi)
- Raccoglie gli input: scatta la foto dello scontrino, registra i voti
- Manda richieste HTTP al backend e mostra le risposte

**Cosa NON fa (importante!):**
Non fa nessuna operazione pesante — nessun algoritmo di AI, nessuna analisi di immagini, nessuna scrittura diretta nel database. È un **thin client** (client snello): riceve dati pronti e li mostra. Questo preserva la batteria dello smartphone e mantiene l'app veloce.

---

### ⚙️ Livello 2 — Backend (Il Cervello Operativo)

Il backend è diviso in due microservizi con competenze diverse. Separarli è una scelta strategica: se il servizio AI è lento, non rallenta il login degli utenti. Se il Gateway ha un bug, il worker AI continua a girare.

#### ⚙️ Microservizio 1: Gateway API (Node.js)

**Cos'è Node.js:** È un ambiente di esecuzione per JavaScript lato server (cioè non nel browser, ma su una macchina remota). È famoso per essere estremamente efficiente nella gestione di molte connessioni simultanee.

**Perché è efficiente:** Node.js usa un modello **asincrono non-bloccante**. Immagina un cameriere che invece di portare al tavolo 1 il cibo e aspettare che finiscano prima di occuparsi del tavolo 2, gestisce tutti i tavoli in contemporanea portando i piatti man mano che sono pronti. Node.js fa la stessa cosa con le richieste di rete.

**Cosa fa in FridgeSavvy:**
- Espone tutte le **API pubbliche** che l'app chiama (es. `POST /api/scontrini`)
- Gestisce **autenticazione e autorizzazione** (chi sei? hai il permesso di farlo?)
- **Legge e scrive sul database** (recupera l'inventario, salva nuovi ingredienti)
- **Delega il lavoro pesante** al microservizio Python quando necessario
- Funziona da "vigile urbano" o **orchestratore** che coordina tutti gli altri componenti

#### 🐍 Microservizio 2: AI Worker (Python)

**Perché Python separato:** Python è il linguaggio dominante nell'ecosistema di Machine Learning e Data Science. Ha librerie come TensorFlow, PyTorch, e HuggingFace che non hanno equivalenti in Node.js. Invece di "tradurre" queste librerie, si usa il linguaggio migliore per ogni lavoro.

**Cosa fa in FridgeSavvy:**
- Riceve dal Gateway l'URL dell'immagine dello scontrino
- Usa modelli LLM (Large Language Models) per analizzare l'immagine ed estrarre il testo
- Normalizza i nomi dei prodotti (es. `"SOLE MOZZARELLA"` → `"Mozzarella Sole 125g"`)
- Restituisce al Gateway una lista strutturata di ingredienti in formato JSON

**Viene chiamato solo quando serve** — non resta in ascolto per ogni richiesta, ma viene attivato dal Gateway esclusivamente durante la fase di elaborazione dello scontrino.

---

### 🗄️ Livello 3 — Archiviazione (La Memoria Permanente)

Anche lo strato dati è diviso in due componenti separati, ognuno ottimizzato per un tipo di dato diverso.

#### 📦 Object Storage (per i file pesanti)

**Cos'è:** Un contenitore cloud per file di grandi dimensioni (immagini, video, documenti). Esempi comuni: Amazon S3, Google Cloud Storage, Cloudflare R2.

**Perché non salvare le immagini nel database:** Un database è ottimizzato per cercare e filtrare testi e numeri, non per archiviare milioni di megabyte di immagini. Salvare immagini nel DB lo renderebbe lento, costoso e difficile da scalare. L'Object Storage è invece ottimizzato esattamente per questo scopo e offre una **CDN** (rete di distribuzione globale) che serve le immagini velocissimamente agli utenti di tutto il mondo.

**Come funziona in FridgeSavvy:**
- L'app carica la foto dello scontrino → va nell'Object Storage
- Lo Storage restituisce un URL pubblico (es. `https://cdn.fridgesavvy.com/scontrini/abc123.jpg`)
- Questo URL (una stringa di testo leggerissima) viene salvato nel database
- Quando serve rivedere lo scontrino, l'app scarica l'immagine direttamente dalla CDN, bypassando il nostro server

#### 🧠 Database NoSQL (per i dati strutturati)

**Cos'è NoSQL:** A differenza dei database tradizionali (SQL) che organizzano i dati in tabelle rigide con colonne predefinite, un database NoSQL salva i dati come documenti JSON flessibili. Ogni documento può avere una struttura diversa.

**Perché NoSQL per FridgeSavvy:** Le ricette possono avere strutture molto diverse tra loro (ingredienti diversi, procedimenti diversi, tag diversi). Con un database SQL dovresti definire a priori tutte le possibili colonne — impossibile per dati così variabili. Con NoSQL, ogni ricetta è semplicemente un documento JSON con i campi che servono.

**Cosa salva in FridgeSavvy:**
- Profili utente e famiglie
- Inventario ingredienti per ogni utente
- Scontrini (testo strutturato + URL immagine)
- Ricette suggerite e votazioni

---

## 2. Il Flusso Completo: Cosa Succede Quando Scansioni uno Scontrino

Seguiamo il percorso di un dato dalla fotocamera dell'utente fino al database, passo per passo:

```
[📱 APP]                [⚙️ NODE.JS]           [🐍 PYTHON]        [☁️ STORAGE]    [🗄️ DATABASE]

   │                        │                       │                   │               │
   │─── 1. Invia foto ─────→│                       │                   │               │
   │                        │─── 2. Carica foto ────────────────────→  │               │
   │                        │←── 3. Riceve URL ─────────────────────── │               │
   │                        │─── 4. "Analizza questa immagine" ────────→│               │
   │                        │←── 5. Ingredienti JSON ──────────────────│               │
   │                        │─── 6. Salva dati ──────────────────────────────────────→ │
   │←─── 7. Conferma ───────│                       │                   │               │
```

**Spiegazione passo per passo:**

1. **Upload Foto:** L'utente scatta la foto → l'app React Native la manda al Gateway Node.js via HTTP `POST`
2. **Caricamento su Storage:** Node.js spedisce immediatamente il file immagine (pesante) sull'Object Storage, senza toccarlo
3. **URL dell'immagine:** Lo Storage risponde con l'URL pubblico dove ha messo il file
4. **Richiesta AI:** Node.js manda quell'URL al worker Python dicendo "analizza questa immagine e dimmi cosa c'è scritto"
5. **Elaborazione e risposta:** Python scarica l'immagine, usa l'AI per leggere lo scontrino, e rimanda a Node.js la lista degli ingredienti in JSON
6. **Salvataggio nel DB:** Node.js prende la lista ingredienti + l'URL dell'immagine e crea un documento nel database NoSQL
7. **Conferma all'utente:** Node.js risponde all'app con il risultato → l'utente vede gli ingredienti riconosciuti

**Perché questo flusso è efficiente:**
- Le immagini non transitano mai nel database (risparmio enorme)
- Il lavoro AI è isolato: se Python è lento, Node.js può rispondere all'utente con "elaborazione in corso" senza bloccarsi
- Ogni componente può essere scalato indipendentemente (es. aggiungere più istanze Python durante i picchi di utilizzo)

---

## 3. Glossario dei Termini Tecnici in questo Documento

| Termine | Significato |
|---|---|
| **Microservizio** | Un componente software autonomo con una responsabilità specifica, eseguito indipendentemente |
| **API** | Application Programming Interface — un sistema di regole per far comunicare due programmi |
| **HTTP** | Il protocollo di comunicazione del web (lo stesso usato dai browser) |
| **JSON** | JavaScript Object Notation — formato testuale leggero per scambiare dati strutturati |
| **LLM** | Large Language Model — un modello AI addestrato su grandi quantità di testo (es. GPT, Gemini) |
| **CDN** | Content Delivery Network — rete di server distribuiti globalmente per servire file rapidamente |
| **Scalabilità** | La capacità di un sistema di gestire più utenti/traffico senza perdere performance |
| **Thin Client** | Un'interfaccia utente che non esegue logica di business, ma solo visualizzazione |

---

*Documento completato — questa fase dell'SDLC (High-Level Design) è conclusa. Il prossimo passo è il Detailed Design (Data Modeling + API Design).*
