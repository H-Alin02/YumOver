# Feature: Riconoscimento Intelligente dei Prodotti dallo Scontrino

> **Stato:** Brainstorming / Ricerca preliminare  
> **Data creazione:** 2026-04-05  
> **Autori:** Alin + Antigravity (AI)  
> **Contesto:** Questa feature nasce da un problema reale osservato su uno scontrino SISA Superstore di Partinico (PA), dove nomi come `POLPA MAGRA DI` o `VOTA E SVOTA DI` risultavano incomprensibili anche a un umano.

---

## 1. Il Problema: Perché i Nomi sugli Scontrini Sono Strani?

Quando vai al supermercato e paghi, il registratore di cassa (chiamato **POS — Point Of Sale**) stampa uno scontrino. I nomi dei prodotti su quello scontrino **non vengono dal barcode del prodotto**, ma da un database interno del supermercato chiamato **anagrafica prodotti**.

Funziona così:

```
[Cassiera scansiona barcode] 
        │
        ▼
[POS cerca il barcode nel database interno del negozio]
        │
        ▼
[Trova: EAN 8000057004028 → "MOZZARELLA SOLE GR.125"]
        │
        ▼
[Stampa sullo scontrino: "*SOLE MOZZARELLA" ← TRONCATO a ~20 caratteri]
```

Ogni catena di supermercati (SISA, Esselunga, Coop, Lidl...) usa un software POS diverso, con regole di troncamento diverse e nomi scelti arbitrariamente dai loro operatori. Non c'è uno standard. Questo significa che:

- `MOLLICA FRESCA P` potrebbe essere `Mollica di pane fresca` oppure `Mollica fresca al pepe`
- `POLPA MAGRA DI` è quasi certamente troncato e manca la parola finale (maiale? vitello?)
- `VOTA E SVOTA DI` è **letteralmente incomprensibile** (probabilmente un brand/promozione)

### Il Problema Pratico per FridgeSavvy

FridgeSavvy vuole leggere lo scontrino e capire cosa hai comprato per aggiornare l'inventario del frigo. Se i nomi sono ambigui, ci sono due scelte:

1. **Chiedere all'utente di specificare** → crea attrito, l'utente si stufa e abbandona l'app
2. **Indovinare intelligentemente** → l'utente conferma solo nei casi dubbi

La seconda opzione è quella da perseguire. Questo documento descrive come farlo.

---

## 2. Le Due Idee Originali (Proposte dall'Utente)

### Idea A — Reverse Lookup: da nome abbreviato → barcode

L'intuizione è: *"se dal barcode il supermercato ricava il nome, non si può fare il contrario?"*

**Analisi onesta:**  
In teoria sì, ma in pratica ogni supermercato ha il suo sistema. Non esiste un database pubblico che mappa `"SOLE MOZZARELLA"` al barcode `8000057004028` perché quella stringa l'ha decisa SISA internamente. Tuttavia, l'idea **non è sbagliata**, è semplicemente incompleta. Con dati sufficienti (molti scontrini di molti utenti) si può costruire questa mappa nel tempo — è il cosiddetto **effetto flywheel** (vedi Sezione 5).

### Idea B — Dataset pubblici + Modello AI per riconoscere i prodotti

L'intuizione è: *"esistono già database pubblici di prodotti alimentari con i nomi completi — usiamoli per allenare un modello che capisca le abbreviazioni."*

**Analisi:** Questa è l'idea più solida. Esistono davvero dataset open source ricchissimi (vedi Sezione 3). Non si tratta di "allenare un modello da zero" (che richiede mesi e migliaia di euro), ma di **usare questi dati esistenti come base di conoscenza** su cui appoggiarci intelligentemente.

---

## 3. Le Risorse Open Source Disponibili

### 3.1 Open Food Facts ⭐ (La Risorsa Principale)

**Cos'è:** Un Wikipedia del cibo. Un progetto no-profit collaborativo dove volontari di tutto il mondo scansionano i prodotti alimentari e inseriscono le informazioni nel database.

**Link:** https://world.openfoodfacts.org / https://it.openfoodfacts.org

**Cosa contiene per ogni prodotto:**
- Barcode (codice EAN-13, lo stesso stampato sulle confezioni)
- Nome completo del prodotto (es. "Mozzarella di bufala campana DOP 125g")
- Marca (es. "Sole", "Granarolo", "Galbani")
- Categoria (es. "Latticini > Formaggi freschi > Mozzarella")
- Ingredienti completi
- Valori nutrizionali (calorie, proteine, grassi, carboidrati)
- **Peso/grammatura** (es. 125g, 500g, 1kg) ← utilissimo per FridgeSavvy
- Paese di vendita (quindi c'è una sezione italiana!)
- Foto del prodotto

**Dati disponibili:**
- ~4.3 milioni di prodotti globali (aprile 2026)
- Copertura italiana significativa (qualche centinaio di migliaia di prodotti)
- **Dataset scaricabile gratuitamente** in formato CSV o JSON
- **API live gratuita**: basta fare una richiesta HTTP con il barcode
- **Licenza:** Open Database License (ODbL) — liberamente usabile anche in prodotti commerciali

**Esempio di chiamata API:**
```
GET https://world.openfoodfacts.org/api/v2/product/8000057004028.json
```
Risposta (semplificata):
```json
{
  "product": {
    "product_name": "Mozzarella",
    "brands": "Sole",
    "quantity": "125 g",
    "categories": "Mozzarellas",
    "nutriments": {
      "energy-kcal_100g": 242,
      "proteins_100g": 18.5
    }
  }
}
```

**Limitazione principale:** La copertura non è del 100%. Prodotti di piccoli produttori locali o di discount potrebbero non esserci. Ma per le catene nazionali (SISA, Coop, Esselunga, ecc.) la copertura è buona.

---

### 3.2 CORD Dataset (per il riconoscimento del testo sullo scontrino)

**Cos'è:** Un dataset accademico open source di scontrini già annotati manualmente. "Annotati" significa che a ogni riga del testo dello scontrino è stata associata un'etichetta che dice cosa rappresenta: nome prodotto, prezzo, totale, data, ecc.

**Cosa serve a noi:** Addestrare (o valutare) il modello che **legge l'immagine dello scontrino** e capisce *dove* sono i nomi dei prodotti e *dove* sono i prezzi. È il primo step della pipeline.

**Limitazione:** I dati sono principalmente in inglese e indonesiano, non in italiano. Ma la struttura degli scontrini è universale, quindi è comunque utile come punto di partenza.

---

### 3.3 WDC PAVE (Product Attribute Value Extraction)

**Cos'è:** Un dataset di ricerca accademica per estrarre attributi da nomi di prodotti. Per esempio, da `"Mozzarella Sole 125g"` estrae:
- `brand` = "Sole"
- `type` = "Mozzarella"
- `weight` = "125g"

**Uso per noi:** Potrebbe essere utile nella fase di normalizzazione (Livello 2 della pipeline), ma è meno direttamente applicabile rispetto a Open Food Facts.

---

## 4. La Pipeline Completa: Come Funziona il Sistema

La pipeline è una sequenza di passi che prendiamo per passare dall'immagine dello scontrino all'inventario del frigo aggiornato. È progettata in **livelli progressivi**: ogni livello tenta di risolvere il problema con maggiore precisione, e solo se fallisce si passa al livello successivo.

### Livello 0 — OCR: dall'immagine al testo

**Cos'è l'OCR:** OCR significa *Optical Character Recognition* — la tecnologia che converte un'immagine di testo in testo vero e proprio.

**Input:** Foto dello scontrino scattata dall'utente con il telefono  
**Output:** Lista di righe di testo grezze:
```
*BIRRA MORETTI 3        22%    1,99
MOLLICA FRESCA P         4%    1,99
*SOLE MOZZARELLA         4%    1,89
-- INIZIO SCT BILANCIA
VOTA E SVOTA DI          4%    4,00
-- FINE SCT BILANCIA
*PETTO DI POLLO         10%   18,64
```

**Tecnologie esistenti:** Google ML Kit (gratuito, gira sul telefono), Google Cloud Vision API, Tesseract (open source). Per un MVP si può usare Google ML Kit direttamente sull'app mobile, senza server.

---

### Livello 1 — Pre-processing e Parsing: strutturare il testo grezzo

**Cosa fa:** Prende il testo grezzo dell'OCR e lo trasforma in una struttura dati organizzata. Usa regole semplici (chiamate **regex** — espressioni regolari) e **euristiche** (regole basate sulla conoscenza del dominio).

**Esempio di regole:**
- `-- INIZIO SCT BILANCIA` e `-- FINE SCT BILANCIA` identificano prodotti venduti a peso
- L'aliquota IVA dà informazioni sul tipo di prodotto:
  - 4% → alimentari di base (pane, mozzarella, latte)
  - 10% → altri alimentari (carne, pesce, salumi)
  - 22% → alcolici, beni non essenziali
- Il `*` prima del nome identifica prodotti in promozione in molti POS
- Il prezzo al kg è calcolabile per i prodotti a bilancia

**Output strutturato:**
```json
[
  { "raw_name": "SOLE MOZZARELLA", "price": 1.89, "iva": "4%", "is_weight_based": false },
  { "raw_name": "PETTO DI POLLO", "price": 18.64, "iva": "10%", "is_weight_based": true }
]
```

---

### Livello 2 — Lookup su Open Food Facts: matching fuzzy

**Cos'è il matching fuzzy:** Invece di cercare una corrispondenza esatta (che non troverebbe mai `"SOLE MOZZARELLA"` cercando `"Mozzarella Sole 125g"`), il matching fuzzy calcola quanto sono *simili* due stringhe di testo, trovando il risultato più vicino anche se non identico.

**Strumenti:**
- **RapidFuzz:** libreria Python open source per il matching fuzzy testuale (distanza di Levenshtein, token_sort_ratio, ecc.)
- **Sentence Transformers + FAISS:** tecnica più avanzata. Converte le parole in vettori numerici (chiamati *embeddings*) che rappresentano il significato. Prodotti simili hanno vettori simili. FAISS è una libreria di Facebook per cercare velocemente tra milioni di vettori.

**Esempio pratico:**
- Input: `"SOLE MOZZARELLA"`, IVA 4%
- Si cerca nel database Open Food Facts (filtrato per categoria "latticini" grazie all'IVA)
- Top 3 risultati: 
  1. "Mozzarella Sole 125g" (score: 0.94) ✅
  2. "Mozzarella Sole 250g" (score: 0.91)
  3. "Mozzarella Santa Lucia 125g" (score: 0.72)
- Si prende il risultato con score più alto → **"Mozzarella Sole 125g"**

---

### Livello 3 — Raffinamento LLM: il giudizio finale

**Cos'è un LLM:** Un *Large Language Model* come GPT, Claude, o Gemini — un modello di intelligenza artificiale addestrato su enormi quantità di testo che è in grado di ragionare e rispondere a domande.

**Quando si usa:** Quando il Livello 2 non è sufficiente — per esempio quando ci sono più candidati con score simile, o quando il nome è così troncato che il matching testuale non basta.

**Come funziona:** Si manda all'LLM un prompt (messaggio) con tutto il contesto disponibile:

```
Contesto: Supermercato SISA, Partinico (PA), zona Sicilia.
Riga scontrino: "POLPA MAGRA DI"
IVA: 10% (quindi è carne o pesce)
Prezzo: €10,23
I seguenti prodotti sono stati trovati nel database come possibili corrispondenze:
1. "Polpa magra di maiale" - €8,99/kg
2. "Polpa magra di vitello" - €14,50/kg
3. "Polpa magra di agnello" - €16,00/kg

Quale prodotto è più probabile? Considera il prezzo pagato.
```

L'LLM risponde: `"Polpa magra di maiale"` — perché il prezzo di €10,23 è più coerente con il prezzo/kg del maiale che del vitello o dell'agnello.

**Importante:** L'LLM non si usa per tutto, perché ogni chiamata ha un costo (in denaro o in tempo di computazione). Lo si usa solo quando i livelli precedenti non sono abbastanza sicuri.

---

### Livello 4 — Human-in-the-Loop: l'utente decide solo quando necessario

**Cos'è:** L'ultimo livello di difesa. Se anche l'LLM non riesce a dare una risposta con sufficiente certezza, si mostra all'utente una schermata semplice di conferma.

**Differenza chiave rispetto all'approccio attuale:** Invece di chiedere all'utente di digitare il nome del prodotto, gli si mostrano **opzioni già pre-compilate**:

```
┌─────────────────────────────────────────────┐
│  Non siamo sicuri di questo prodotto:       │
│                                             │
│  "VOTA E SVOTA DI" — €4,00                  │
│                                             │
│  Seleziona quello corretto:                 │
│  ○ Offerta "Vota e Svota" (carne mista)     │
│  ○ Promozione punti fedeltà                 │
│  ○ Non è un alimento (ignoralo)             │
│  ○ Altro: [____________________]            │
│                                             │
│               [ Conferma ]                  │
└─────────────────────────────────────────────┘
```

Questo riduce enormemente il carico cognitivo sull'utente. La differenza è tra "scrivi cosa hai comprato" (attrito alto) e "scegli tra queste opzioni" (attrito basso).

---

### Schema Riassuntivo della Pipeline

```
📷 FOTO SCONTRINO
        │
        ▼
┌───────────────────┐
│  LIVELLO 0: OCR   │  Tecnologia: Google ML Kit / Tesseract
│  Immagine → Testo │  Risultato: righe di testo grezzo
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  LIVELLO 1:       │  Tecnologia: Regex, algoritmi semplici
│  Pre-processing   │  Risultato: dati strutturati (nome, prezzo, IVA, peso)
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐    Trovato con alta confidenza?
│  LIVELLO 2:       │ ──────────────────────────────── YES ──→ ✅ INVENTARIO
│  Lookup Open FF   │  Tecnologia: RapidFuzz, FAISS
└─────────┬─────────┘
          │ NO (confidenza bassa o ambiguità)
          ▼
┌───────────────────┐    Trovato con alta confidenza?
│  LIVELLO 3:       │ ──────────────────────────────── YES ──→ ✅ INVENTARIO
│  LLM Refinement   │  Tecnologia: Gemini/GPT-4o API
└─────────┬─────────┘
          │ NO (ancora ambiguo)
          ▼
┌───────────────────┐
│  LIVELLO 4:       │ ──────────────────────────────────────→ ✅ INVENTARIO
│  Chiedi all'utente│  UX: selezione tra opzioni pre-compilate
└───────────────────┘
          │
          ▼ (ogni risposta utente viene salvata)
┌───────────────────┐
│  FLYWHEEL: il DB  │  Il sistema impara da ogni correzione
│  interno cresce   │  
└───────────────────┘
```

---

## 5. Il Problema dei Grammi

Sapere *cosa* hai comprato non basta — FridgeSavvy deve sapere anche *quanto* hai comprato per evitare sprechi e suggerire ricette accurate.

### 5.1 Prodotti Venduti a Peso (Bilancia)

Questi sono i più facili da gestire. Lo scontrino SISA mostra già tutto:

```
-- INIZIO SCT BILANCIA
*PETTO DI POLLO     10%   18,64
-- FINE SCT BILANCIA
```

Se conosciamo il **prezzo al kg** del petto di pollo (che possiamo trovare nel sito del supermercato o da Open Food Facts), possiamo calcolare:

```
grammi = (prezzo_pagato / prezzo_al_kg) × 1000
       = (18,64 / 9,80) × 1000
       ≈ 1902 grammi ≈ 1,9 kg
```

**Sfida:** Dobbiamo conoscere il prezzo/kg. Strategie:
- Chiedere all'utente solo una volta per tipo di prodotto (e memorizzare)
- Stimare dall'LLM basandosi sul mercato locale
- In futuro: integrazione con listini prezzi dei supermercati

### 5.2 Prodotti Confezionati

Per prodotti come mozzarella, pasta, biscotti — la grammatura è **fissa e standard**. Open Food Facts ce l'ha già:
- Mozzarella Sole → 125g
- Birra Moretti 33cl → 330ml
- Kinder Merendero → 28g (singola confezione) × numero pezzi

### 5.3 Prodotti Ambigui

Se compro 3 birre Moretti, lo scontrino dice `BIRRA MORETTI 3` — il `3` indica 3 bottiglie. Dobbiamo estrarre anche questa informazione numerica nel Parser (Livello 1).

---

## 6. L'Effetto Flywheel: Come il Sistema Migliora nel Tempo

**Cos'è il flywheel effect:** Un volano è un disco pesante che, una volta avviato a ruotare, acquista inerzia e continua a girare sempre più facilmente. In startup e prodotti tech, l'effetto flywheel descrive un ciclo virtuoso in cui ogni nuovo utente migliora il prodotto per tutti gli altri.

**Come funziona per FridgeSavvy:**

```
Più utenti usano l'app
        │
        ▼
Più scontrini vengono scansionati
        │
        ▼
Ogni correzione dell'utente al Livello 4 viene salvata:
"SOLE MOZZARELLA" → "Mozzarella Sole 125g"  (SISA, Partinico)
        │
        ▼
Il database interno di mappature cresce
        │
        ▼
Il Livello 2 diventa più preciso (trova mappature già note)
L'LLM viene usato sempre meno (risparmiando costi)
L'utente riceve sempre meno domande (meno attrito)
        │
        ▼
L'app diventa sempre più utile → attrae più utenti → ricomincia
```

Questo è esattamente quello che ha fatto **Google Maps** con le segnalazioni degli utenti. Nel tempo, il database di FridgeSavvy diventa un asset competitivo unico e difficile da replicare.

---

## 7. Rischi e Limitazioni da Tenere a Mente

| Rischio | Causa | Mitigazione |
|---|---|---|
| Open Food Facts non ha il prodotto | Prodotto locale/artigianale | Fallback su Livello 3 e 4 |
| OCR legge male la foto | Foto sfocata, luce scarsa | Guida utente per foto migliori, retry |
| LLM sbaglia l'identificazione | Nome troppo ambiguo | Confidenza ≥ 80% per accettare, altrimenti Livello 4 |
| Costi API LLM troppo alti | Uso massiccio del Livello 3 | Il Flywheel riduce il numero di chiamate nel tempo |
| Privacy dei dati scontrino | Dati personali sensibili | Anonimizzazione prima di invio, policy GDPR |

---

## 8. Piano di Sviluppo (Roadmap per Fasi)

### Fase 1 — MVP (Minimum Viable Product): validare l'idea
**Obiettivo:** Capire se funziona, prima di investire tempo nello sviluppo vero.

1. Scaricare il dump di Open Food Facts (sezione Italia)
2. Costruire un semplice script Python che prende una riga di scontrino e cerca il prodotto più simile
3. Testarlo su 10-20 righe di scontrini reali (come il SISA che hai)
4. Misurare: quante volte indovina correttamente?

**Tecnologie:** Python, RapidFuzz, Open Food Facts CSV

---

### Fase 2 — Pipeline Base: integrare nell'app
1. Implementare il Livello 0 (OCR) con Google ML Kit nell'app mobile
2. Implementare il Livello 1 (Parser) come microservizio backend Node.js
3. Integrare Open Food Facts come knowledge base (Livello 2)
4. Implementare la UI del Livello 4 (la schermata di conferma con opzioni)

---

### Fase 3 — AI Avanzata: aggiungere l'LLM
1. Integrare il Livello 3 (LLM) — partire con Gemini API (gratuita fino a una certa soglia)
2. Implementare il sistema di gestione della confidenza (quanto è sicuro il sistema?)
3. Iniziare a raccogliere le correzioni degli utenti per il Flywheel

---

### Fase 4 — Ottimizzazione e Grammi
1. Implementare il calcolo automatico dei grammi per prodotti a bilancia
2. Aggiungere i valori nutrizionali (calorie, proteine) presi da Open Food Facts
3. Fine-tuning del modello interno basato sui dati del Flywheel

---

## 9. Domande Aperte da Discutere

- [ ] Come gestiamo la privacy? I dati degli scontrini sono personali.
- [ ] Usiamo Open Food Facts solo come knowledge base o contribuiamo anche noi?
- [ ] Quale soglia di confidenza usiamo per decidere quando chiedere all'utente?
- [ ] Per i prodotti sfusi/locali (es. frutta dal mercato), che strategia usiamo?
- [ ] In che lingua vogliamo sviluppare il backend della pipeline? (Python è il più naturale per ML)

---

*Documento vivo — da aggiornare man mano che approfondiamo ogni sezione.*
