"""Validation in Python (done with pydantic, like Zod in Node.js)"""

from pydantic import BaseModel, Field
from app.retrieval import K


class IngredientRef(BaseModel):
    key: str


class RecipeIn(BaseModel):
    id: int
    ingredients: list[IngredientRef]


class TaxonomyIn(BaseModel):
    key: str
    is_staple: bool = False
    derives_from: str | None = None


class SuggestRequest(BaseModel):
    pantry: list[str] = Field(min_length=1)
    recipes: list[RecipeIn] = Field(min_length=1)
    ingredients: list[TaxonomyIn] = Field(min_length=1)
    k: int = Field(default=K, ge=1, le=10)


class MatchOut(BaseModel):
    recipe_id: int
    score: float
    matched: list[str]
    missing: list[str]


class SuggestResponse(BaseModel):
    results: list[MatchOut]
