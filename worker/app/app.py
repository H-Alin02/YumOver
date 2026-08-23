from fastapi import FastAPI
import uvicorn
from app.retrieval import build_index, retrieve
from app.schemas import MatchOut, SuggestRequest, SuggestResponse

app = FastAPI(title="YumOver AI Worker")


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
    return SuggestResponse(
        results=[
            MatchOut(
                recipe_id=m.recipe_id,
                score=round(m.score, 3),
                matched=sorted(m.matched),
                missing=sorted(m.missing),
            )
            for m in matches
        ]
    )


def main() -> None:
    uvicorn.run(app, host="127.0.0.1", port=8001)
