# YumOver AI Worker

Python service for the RAG pipeline: recipe retrieval and LLM refinement.
Runs on port 8001 and is called over HTTP by the Node.js gateway.

Managed with [uv](https://docs.astral.sh/uv/). Requires Python 3.14.

## Setup

```bash
uv sync
```

## Run

```bash
uv run worker                                          # http://127.0.0.1:8001
uv run uvicorn app.app:app --port 8001 --reload        # with auto-reload
```

## Check

```bash
curl localhost:8001/health     # {"status":"OK"}
```
