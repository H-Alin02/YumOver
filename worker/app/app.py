import logging
from contextlib import asynccontextmanager

import httpx
import uvicorn
from fastapi import FastAPI
from google.genai import errors
from pydantic import ValidationError

from app.config import get_settings
from app.gemini import AdaptedRecipe, adapt
from app.retrieval import build_index, retrieve
from app.schemas import MatchOut, SuggestRequest, SuggestResponse, TaxonomyIn

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_settings()
    yield


app = FastAPI(title="YumOver AI Worker", lifespan=lifespan)


@app.get("/health")
def health():
    return {"status": "OK"}


def safe_adapt(recipe: dict, pantry: list[str]) -> AdaptedRecipe:
    try:
        return adapt(recipe, pantry)
    except (httpx.HTTPError, errors.APIError, ValidationError) as exc:
        logger.warning("adapt failed for recipe_id=%s: %r", recipe["id"], exc)
        return AdaptedRecipe(
            recipe_id=recipe["id"],
            feasible=False,
            title=None,
            steps=[],
            substitutions=[],
            unfeasible_reason="Gemini responded incorrectly",
        )


def check_if_feasible(
    adapted: AdaptedRecipe, pantry: list[str], taxonomy: list[TaxonomyIn]
) -> AdaptedRecipe:
    if not adapted.feasible:
        return adapted
    available = set(pantry)
    available.update(
        [ingredient.key for ingredient in taxonomy if ingredient.is_staple]
    )
    available.update(
        [ingredient.key for ingredient in taxonomy if ingredient.derives_from in pantry]
    )

    for substitution in adapted.substitutions:
        if substitution.replacement_key is None:
            continue
        if substitution.replacement_key not in available:
            return AdaptedRecipe(
                recipe_id=adapted.recipe_id,
                feasible=False,
                title=None,
                steps=[],
                substitutions=[],
                unfeasible_reason=f"{substitution.replacement_key} is not an ingredient in the pantry",
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
                adapted=check_if_feasible(
                    safe_adapt(by_id[m.recipe_id].model_dump(), request.pantry),
                    request.pantry,
                    request.ingredients,
                ),
            )
            for m in matches
        ]
    )


def main() -> None:
    uvicorn.run(app, host="127.0.0.1", port=8001)
