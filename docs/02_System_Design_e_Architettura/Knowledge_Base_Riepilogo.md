# Knowledge Base: FridgeSavvy Riepilogo
**Status del Progetto:** Fase di Progettazione di Dettaglio (Detailed Design)

Questo documento sintetizza tutte le decisioni ingegneristiche e architetturali prese finora per il progetto **FridgeSavvy**, e serve come punto di verità centrale prima di procedere con lo sviluppo pratico.

---

## 1. Ingegneria del Software (Metodologia)
Stiamo seguendo fedelmente il **Software Development Life Cycle (SDLC)**.
Abbiamo superato la Fase 1 (Requisiti) e la Fase 2 (System Design / Architettura di alto livello).

Attualmente siamo nella **Fase 3: Detailed Design**.
I prossimi step operativi obbligatori prima del *Coding* (Fase 4) sono:
*   **Data Modeling:** Definire lo schema JSON dei nostri dati nel DB.
*   **API Design:** Definire come parleranno tra loro le varie parti del sistema.
*   **UI Wireframing:** Disegnare l'interfaccia utente a grandi linee.

---

## 2. Architettura e Tech Stack

Il sistema utilizza il pattern **Client-Server** con un Backend suddiviso in **Microservizi**.

### Frontend (Client)
*   **Tecnologia:** **React Native** (Cross-Platform)
*   **Compito:** Interfaccia utente per smartphone Android e iOS.
*   **Responsabilità:** Reagire agli input dell'utente, scattare le foto agli scontrini e mostrare i dati forniti dal server. È privo di logica di business pesante.

### Backend a Microservizi (Server)
Il lavoro "pesante" è delegato al cloud, suddiviso per specializzazione:
1.  **Core Gateway (Node.js):** 
    *   È il "vigile urbano". Gestisce login, registrazione, lettura e scrittura dal Database. Gestisce con efficienza altissimi carichi di I/O (Input/Output).
2.  **AI & Computer Vision Worker (Python):** 
    *   Le operazioni gravose di calcolo e le chiamate di AI (Data Science) sono isolate qui. Node.js invia a Python la foto dello scontrino, e Python utilizza modelli LLM per estrarre il testo strutturato degli alimenti e rimandarlo a Node.

### Database e Archiviazione (Persistenza)
*   **Database Principale (NoSQL):** Salvataggio flessibile senza righe o colonne rigide, utilizzando oggetti JSON. Perfetto per documenti disomogenei come diverse ricette.
*   **Object Storage (es. Bucket S3 o simili):** Per salvare foto o file multimediali pesanti (es. gli scontrini fotografati). Restituisce un rapido URL che viene poi salvato nel DB NoSQL, evitando l'errore catastrofico di salvare milioni di bytes (Blob/Base64) direttamente nel DB e saturare la memoria.
