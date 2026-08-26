"""Gemini Client"""

from functools import lru_cache

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.config import get_settings

MODEL = "gemini-3.1-flash-lite"
TIMEOUT_MS = 10_000


# How the Gemini response should look like
class Substitution(BaseModel):
    original_key: str
    replacement_key: str
    reason: str


class AdaptedRecipe(BaseModel):
    recipe_id: int
    title: str
    steps: list[str]
    substitutions: list[Substitution]


@lru_cache
def get_client() -> genai.Client:
    """Creates the Gemini Client and stores it in the cache"""
    settings = get_settings()
    return genai.Client(
        api_key=settings.gemini_api_key,
        http_options=types.HttpOptions(timeout=TIMEOUT_MS),
    )


def build_prompt(recipe: dict, pantry: list[str]) -> str:
    """Minimal prompt"""
    return (
        f"Original Recipe: {recipe}\n"
        f"Available ingredients in the pantry : {pantry}\n"
        f"Rewrite the recipe using only the pantry. In substitutions use "
        "exactly the canonical keys: original_key of the recipe, "
        f"replacement_key of the pantry. Italian. recipe_id remains {recipe['id']}."
    )


def adapt(recipe: dict, pantry: list[str]) -> AdaptedRecipe:
    interaction = get_client().interactions.create(
        model=MODEL,
        input=build_prompt(recipe, pantry),
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": AdaptedRecipe.model_json_schema(),
        },
    )
    return AdaptedRecipe.model_validate_json(interaction.output_text)
