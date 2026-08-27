from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from app.config import get_settings
from app.gemini import adapt
from app.retrieval import build_index, retrieve
from app.schemas import MatchOut, SuggestRequest, SuggestResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings()
    yield


app = FastAPI(title="YumOver AI Worker", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/suggest", response_model=SuggestResponse)
def suggest(request: SuggestRequest) -> SuggestResponse:
    index = build_index(
        recipes=[r.model_dump() for r in request.recipes],
        ingredients=[i.model_dump() for i in request.ingredients],
    )
    matches = retrieve(index, request.pantry, k=request.k)
    by_id = {r.id: r for r in request.recipes}
    return SuggestResponse(
        results=[
            MatchOut(
                recipe_id=m.recipe_id,
                score=round(m.score, 3),
                matched=sorted(m.matched),
                missing=sorted(m.missing),
                adapted=adapt(by_id[m.recipe_id].model_dump(), request.pantry),
            )
            for m in matches
        ]
    )


def main() -> None:
    uvicorn.run(app, host="127.0.0.1", port=8001)
