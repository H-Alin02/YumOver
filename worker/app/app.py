import logging
import secrets
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Header, HTTPException

from app.config import get_settings
from app.gemini import AdaptedRecipe, adapt, get_client
from app.retrieval import (
    MAX_MISSING,
    Index,
    build_index,
    reach,
    retrieve,
    suggest_extras,
)
from app.schemas import MatchOut, SuggestRequest, SuggestResponse

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings()
    get_client()
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
def suggest(
    request: SuggestRequest, x_worker_secret: str = Header(default="")
) -> SuggestResponse:
    if not secrets.compare_digest(x_worker_secret, get_settings().worker_secret):
        raise HTTPException(status_code=401, detail="Unauthorized")

    index = build_index(
        recipes=[r.model_dump() for r in request.recipes],
        ingredients=[i.model_dump() for i in request.ingredients],
    )
    matches = retrieve(index, request.pantry, request.also_have, k=request.k)
    nearly_complete = [m for m in matches if len(m.missing) <= MAX_MISSING]
    if request.ask and not nearly_complete:
        extras = suggest_extras(index, request.pantry, request.also_have)
        if extras:
            return SuggestResponse(
                results=[],
                question=extras
            )
    
    by_id = {r.id: r for r in request.recipes}
    with ThreadPoolExecutor(max_workers=max(len(matches), 1)) as pool:
        adapted = list(
            pool.map(
                lambda m: safe_adapt(by_id[m.recipe_id].model_dump(), request.pantry),
                matches,
            )
        )
    return SuggestResponse(
        results=[
            MatchOut(
                recipe_id=m.recipe_id,
                score=round(m.score, 3),
                matched=sorted(m.matched),
                missing=sorted(m.missing),
                adapted=drop_unavailable_replacements(
                    a,
                    index,
                    request.pantry,
                ),
            )
            for m, a in zip(matches, adapted, strict=True)
        ]
    )


def main() -> None:
    settings = get_settings()
    uvicorn.run(app, host=settings.host, port=settings.port)
