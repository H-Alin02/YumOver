# Architettura del Sistema: FridgeSavvy

![Diagramma Architettura FridgeSavvy](Gemini_Generated_Image_51hsmx51hsmx51hs.png)


Questo documento descrive dettagliatamente e dal punto di vista ingegneristico l'architettura macroscopica e i flussi di comunicazione tra i vari microservizi che compongono il sistema **FridgeSavvy**.

L'architettura è stata progettata seguendo il paradigma Client-Server a **Microservizi**, suddividendo le responsabilità su tre livelli macroscopici: Client, Backend e Livello di Dati (Archiviazione).

---

## 1. I Componenti Principali

### 📱 Livello Client
*   **App Mobile - React Native:** È il punto di ingresso dell'utente (Interfaccia e UI). 
    *   *Responsabilità:* Raccogliere gli input dell'utente (come lo scatto di una foto dello scontrino o i voti in famiglia) e inviare richieste HTTP al backend. È un client snello (thin-client), che non esegue operazioni gravose né analisi locali, preservando batteria e performance dello smartphone.

### ⚙️ Livello Backend (Microservizi)
Il cuore pulsante dell'applicativo è diviso in due nodi per garantire alta scalabilità e separazione delle competenze (Separation of Concerns).
*   **Gateway (Node.js):** Agisce come un "vigile urbano" o API Gateway.
    *   *Responsabilità:* Espone le API pubbliche che il Client chiama. Gestisce l'autenticazione, orchestra le operazioni e legge/scrive sul database. Node.js è perfetto per questo compito grazie alla sua altissima capacità di gestire I/O concorrenti in tempo reale senza bloccarsi.
*   **AI_Worker (Python):** È il servizio specializzato in algoritmi e dati ("AI & Vision Service").
    *   *Responsabilità:* Viene interpellato dal Gateway solo quando serve. Utilizza modelli LLM avanzati per processare l'immagine o l'URL dello scontrino, estrarre in modo intelligente il testo e convertirlo in una lista strutturata (JSON) di ingredienti puliti.

### 🗄️ Livello Archiviazione (Dati e Storage)
*   **Storage (Object Storage / Bucket Cloud):** È il contenitore fisico per file pesanti (es. AWS S3).
    *   *Responsabilità:* Riceve le immagini scattate dal Client. Le immagini vengono sganciate immediatamente qui per evitare di appesantire il Database o saturare la banda del Gateway.
*   **DB (Database Principale NoSQL):** È il "cervello a lungo termine" (es. MongoDB o Firebase Firestore).
    *   *Responsabilità:* Salva tutti i documenti organizzati e le "entità" di sistema (Utenti, Ingredienti, Ricette) sotto forma di alberi JSON flessibili. Salverà rigorosamente solo testo (ed es. il *link/URL* dell'immagine scaricato dallo Storage).

---

## 2. Flussi di Comunicazione (Il Percorso del Dato)

Il diagramma evidenzia un flusso cronologico esatto quando l'utente scansiona uno scontrino. Ecco cosa accade e perché:

1.  **Upload Foto Scontrino:** L'App React Native chiama l'API del nostro Node.js, inviando via protocollo HTTP il file della fotocamera.
2.  **Caricamento file immagine:** Node.js (Gateway) interviene e, prima di toccare il database, deposita l'intero pacchetto binario dell'immagine sull'Object Storage. Questa operazione è asincrona e rapida.
3.  **URL dell'Immagine:** Lo Storage risponde istantaneamente inviando indietro un semplicissimo link HTTP (URL) dove si trova l'immagine.
4.  **Richiesta Elaborazione AI:** Node.js, avendo ottenuto l'URL leggero e sicuro dell'immagine pulita, chiama a sua volta il microservizio Python. Python scarica segretamente quell'immagine o passa l'URL direttamente al suo modello di Machine Learning / LLM integrato.
5.  **Restituzione Ingredienti estratti:** L'Intelligenza Artificiale fa il suo lavoro, interpreta i pixel e restituisce al Node.js il risultato puro in formato JSON. Ora il Gateway sa perfettamente cosa abbiamo comprato.
6.  **Lettura/Scrittura Dati (JSON):** Il Node.js a questo punto organizza i dati utente, il link dell'immagine e la lista ingredienti, scrivendo un pacchetto JSON elegante e compatto all'interno del Database NoSQL.
7.  **Download asincrono (Flusso Utente):** Quando un domani l'utente aprirà la sua app React Native e vorrà rivedere il suo scontrino, l'App "salta" Node.js per il file e scarica l'immagine in modo passivo ma direttissimo dai server CDN dell'Object Storage (molto più veloce della lettura in un database).
