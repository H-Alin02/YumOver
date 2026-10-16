"""Validation in Python (done with pydantic, like Zod in Node.js)"""

from pydantic import BaseModel, Field

from app.gemini import AdaptedRecipe
from app.retrieval import K


class IngredientRef(BaseModel):
    key: str
    as_written: str
    quantity: str
    required_state: str | None = None


class RecipeIn(BaseModel):
    id: int
    title: str
    instructions: list[str]
    ingredients: list[IngredientRef]


class TaxonomyIn(BaseModel):
    key: str
    is_staple: bool = False
    derives_from: str | None = None


class SuggestRequest(BaseModel):
    pantry: list[str] = Field(min_length=1, max_length=10)
    also_have: list[str] = Field(min_length=0, max_length=10, default_factory=list)
    ask: bool = True
    recipes: list[RecipeIn] = Field(min_length=1)
    ingredients: list[TaxonomyIn] = Field(min_length=1)
    k: int = Field(default=K, ge=1, le=10)


class MatchOut(BaseModel):
    recipe_id: int
    score: float
    matched: list[str]
    missing: list[str]
    adapted: AdaptedRecipe


class SuggestResponse(BaseModel):
    results: list[MatchOut]
    question: list[str] | None = None
