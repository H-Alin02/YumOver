# Lezione 3: Data Modeling in ambiente NoSQL
*Progetto: FridgeSavvy*

Questa lezione risponde alla tua ottima domanda: *"Devo andare a ripassare come si crea uno schema relazionale?"*
La risposta breve è: **Assolutamente no!** Ed è qui che entra in gioco l'ingegneria e la scelta architetturale che hai fatto.

Nella Fase 1 hai scelto di utilizzare un Database **NoSQL** (es. MongoDB o Firebase Firestore). Questa scelta cambia radicalmente il modo in cui pensiamo ai dati.

---

## 1. Relazionale (SQL) vs Documentale (NoSQL)

A beneficio accademico, ricordiamo la differenza:

*   **Il mondo Relazionale (SQL):** I dati vivono in Tabelle (come fogli Excel rigidi). Per collegare i dati si usano i concetti di *Chiave Primaria* e *Chiave Esterna* (Foreign Key). Se aggiungi una colonna a una riga, devi aggiungerla a tutte le righe. Richiede la progettazione del famoso Schema E-R (Entità-Relazione).
*   **Il mondo Documentale (NoSQL):** I dati vivono in **Documenti indipendenti** strutturati in formato **JSON** (JavaScript Object Notation). Non ci sono tabelle, ma "Collezioni" (scatole che contengono documenti). Uno schema NoSQL è **flessibile** ("Schema-less"): un documento Ingrediente può avere la foto, un altro documento Ingrediente no, e il database non darà alcun errore.

Dato che useremo Node.js e React Native (che parlano nativamente in JavaScript), il formato JSON è la lingua madre dell'interno sistema.

---

## 2. Quali entità (dati) avremo in FridgeSavvy?
A livello logico di Business, il nostro dominio è composto dalle seguenti macro-entità concettuali:
1.  **User (L'Utente):** Dati di accesso, email, nome.
2.  **Family/Group:** L'aggregatore logico. Più Utenti fanno parte di un Gruppo che condivide lo stesso frigorifero.
3.  **Pantry (La Dispensa):** Una lista virtuale collegata a una Famiglia.
4.  **Ingredient (L'Ingrediente):** Il singolo elemento letto dallo scontrino o inserito a mano.
5.  **Recipe (La Ricetta):** Il risultato generato dall'AI, con titolo, passaggi e ingredienti richiesti.
6.  **Poll (Il Sondaggio):** L'istanza "Cosa mangiamo stasera" dove gli Utenti votano una variante di Ricetta.

---

## 3. L'Esercizio: Modellare l'oggetto "Ingrediente"
Come si definisce lo "schema" (la struttura) nel mondo NoSQL? Non si disegnano diagrammi complessi, ma si progetta la struttura dell'oggetto JSON.

Ecco la risposta all'esercizio sul Data Model dell'Ingrediente. Immaginiamo come il nostro Backend (Node.js) riceverà l'Ingrediente estratto dal Microservizio Python (AI_Worker), e come lo salverà nel Database:

```json
{
  "_id": "ing_123456789",
  "name": "Latte Parzialmente Scremato",
  "category": "Latticini",
  "quantity": 1.5,
  "unit_of_measure": "litri",
  "expiration_date": "2026-04-10T00:00:00.000Z",
  "scanned_from_receipt_id": "rec_987654",
  "added_at": "2026-04-01T10:00:00.000Z",
  "family_id": "fam_xyz123"
}
```

### Analisi del Modello (I campi essenziali):
*   `_id`: Ogni oggetto nel database deve avere un identificatore univoco (Spesso generato in automatico).
*   `name`: Obbligatorio. Stringa di testo.
*   `category`: Utile per raggruppare i dati nell'interfaccia (es. Frutta, Latticini, Carne).
*   `quantity` e `unit_of_measure`: Fondamentali per far calcolare all'AI se c'è abbastanza ingrediente per la ricetta. (Avere *1.5 litri* è diverso da avere *1 litri* testuale. Si separano Numero e Unità).
*   `expiration_date`: Una data formattata (ISO 8601). Essenziale per la funzione "Svuota Frigo" (Pellicano/Just in Time).
*   `family_id`: Fondamentale per la sicurezza. Questo ingrediente appartiene al frigo della famiglia X, non può essere visto dagli altri utenti.

Questo è un esempio concreto di Data Modeling "Moderno". Come vedi non devi ripassare SQL, devi solo abituarti a pensare in *"Oggetti JSON"*.
