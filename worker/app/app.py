import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from app.config import get_settings
from app.gemini import AdaptedRecipe, adapt
from app.retrieval import Index, build_index, reach, retrieve
from app.schemas import MatchOut, SuggestRequest, SuggestResponse

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings()
    yield


app = FastAPI(title="YumOver AI Worker", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "OK"}


def unfeasible(recipe_id: int, reason: str) -> AdaptedRecipe:
    return AdaptedRecipe(
        recipe_id=recipe_id,
        feasible=False,
        title=None,
        steps=[],
        substitutions=[],
        unfeasible_reason=reason,
    )


def safe_adapt(recipe: dict, pantry: list[str]) -> AdaptedRecipe:
    try:
        return adapt(recipe, pantry)
    except Exception:
        logger.exception("adapt failed for recipe_id=%s", recipe["id"])
        return unfeasible(recipe["id"], "Gemini non ha risposto correttamente")


def drop_unavailable_replacements(
    adapted: AdaptedRecipe, index: Index, pantry: list[str]
) -> AdaptedRecipe:
    if not adapted.feasible:
        return adapted
    available = reach(index, pantry) | index.staples
    for substitution in adapted.substitutions:
        if substitution.replacement_key is None:
            continue
        if substitution.replacement_key not in available:
            return unfeasible(
                adapted.recipe_id,
                f"{substitution.replacement_key} non è in dispensa",
            )
    return adapted


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
                adapted=drop_unavailable_replacements(
                    safe_adapt(by_id[m.recipe_id].model_dump(), request.pantry),
                    index,
                    request.pantry,
                ),
            )
            for m in matches
        ]
    )


def main() -> None:
    uvicorn.run(app, host="127.0.0.1", port=8001)
