# Lezione 3: Introduzione Accademica a JSON e Database NoSQL

Questo capitolo esplora le fondamenta del salvataggio dei dati sul web moderno. Prima di modellare le entità del progetto FridgeSavvy, è necessario comprendere rigorosamente il formato di trasmissione JSON e l'architettura dei database Non Relazionali (NoSQL).

---

## 1. Il Formato JSON (JavaScript Object Notation)

Il JSON è, a livello globale, lo standard *de facto* per la trasmissione dei dati su Internet grazie alle API REST. Non è un linguaggio di programmazione, ma un **formato di testo leggero**, indipendente dal linguaggio (Python, Node, Java, C++ sanno tutti leggerlo), facilmente comprensibile per un umano e decifrabile istantaneamente da una macchina.

### 1.1 La Sintassi del JSON
Un JSON è strutturato su due strutture universali:
*   Una collezione di coppie **Chiave/Valore** (Key-Value pairs), che in informatica prende il nome di Oggetto (`Object`), Dizionario o Hash Map. Si racchiude tra parentesi graffe `{ }`.
*   Una lista ordinata di valori, che prende il nome di **Array** o Vettore. Si racchiude tra parentesi quadre `[ ]`.

### 1.2 Esempio Accademico Fuori dal Progetto: "Lo Studente Universitario"
Immaginiamo di dover trasmettere o salvare le informazioni di uno studente.

```json
{
  "matricola": "100234B",
  "nome": "Mario",
  "cognome": "Rossi",
  "eta": 22,
  "is_in_corso": true,
  "voti": [28, 30, 24, 27],
  "indirizzo": {
    "via": "Via Roma",
    "civico": 15,
    "citta": "Milano",
    "cap": "20100"
  },
  "esami_futuri": null
}
```

**Analisi Accademica del file JSON:**
1.  Le *"Chiavi"* (i nomi dei campi, a sinistra dei due punti) devono **rigorosamente** essere stringhe delimitate da doppie virgolette `" "`.
2.  I *"Valori"* possono essere di diversi tipi (Tipi di dato primitivi):
    *   **Stringa** (`"Mario"`).
    *   **Numero** (`22`, senza virgolette).
    *   **Booleano** (`true` o `false`, senza virgolette).
    *   **Oggetto Annidato** (`indirizzo` è un JSON dentro a un JSON).
    *   **Array** (`voti` contiene una lista di numeri dentro le quadre).
    *   **Null** (`null`, indica l'assenza voluta di un valore).

---

## 2. Paradigmi di Database: SQL vs NoSQL

I database sono il livello di persistenza dove salviamo perennemente le informazioni dei nostri utenti. Esistono due grandi filosofie.

### 2.1 Database Relazionali (SQL - Structured Query Language)
I DB relazionali classici (MySQL, PostgreSQL) sono rigidamente basati su **Tabelle**, simili a fogli Excel.
*   Ogni Tabella ha delle **Colonne** rigide predefinite (es. Tabella Studenti: id, nome, cognome).
*   Ogni nuovo Studente è una **Riga**. 
*   *Vantaggio:* Garanzia di consistenza totale dei dati (se proverai a inserire una data di nascita in una colonna "voto", il DB si rifiuterà e andrà in crash per proteggere i dati).
*   *Svantaggio:* Sono rigidi (Schema-rigido). Se improvvisamente l'università decidesse di dover salvare un indirizzo extra per alcuni studenti, dovresti bloccare il DB, modificare fisicamente l'architettura della tabella aggiungendo la colonna e riavviare il tutto.

### 2.2 Database Non Relazionali (NoSQL) a Documenti
I database "Document-oriented" (come MongoDB o Firestore) non usano le tabelle, ma usano le **Collezioni**, che a loro volta contengono i **Documenti**.
*   **Un Documento** non è altro che un gigantesco oggetto in formato JSON (o tecnicamente BSON - Binary JSON, ma all'utente appare come un normalissimo `{...}`).
*   Risiedono nel regno dello **Schema-less** (senza schema fisso o con validazioni deboli/flessibili).

#### Esempio Architetturale NoSQL:
Immaginiamo una *Collezione* NoSQL chiamata `Automobili`. Questa collezione contiene 2 Documenti (JSON interi).

**Documento 1:**
```json
{
  "_id": "car_001",
  "marca": "Fiat",
  "modello": "Panda",
  "elettrica": false
}
```

**Documento 2:**
```json
{
  "_id": "car_002",
  "marca": "Tesla",
  "modello": "Model 3",
  "elettrica": true,
  "software_version": "v11.0",
  "radar_disponibili": ["frontale", "laterale"]
}
```

**Il superpotere del NoSQL:**
Hai notato cosa è appena successo? Nel Documento 2 abbiamo inserito chiavi (`software_version` e `radar_disponibili`) che nel Documento 1 **non esistono affatto**.
In un Database SQL (Relazionale), questo causerebbe un tragico errore di sistema a meno di aver previsto prima la creazione delle colonne.
In MongoDB/Firestore (NoSQL), possiamo ficcare pezzi di natura disomogenea nella stessa collezione. Questa **Flessibilità Estrema** è essenziale e ci salverà la vita su "FridgeSavvy", poiché non tutte le ricette o non tutti gli scontrini fotografati avranno mai esattamente la stessa struttura fissa di campi!
