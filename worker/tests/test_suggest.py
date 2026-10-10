import pytest
from fastapi.testclient import TestClient

from app import app as app_module
from app.gemini import AdaptedRecipe

client = TestClient(app_module.app)


def fake_adapt(recipe, pantry):
    return AdaptedRecipe(
        recipe_id=recipe["id"],
        feasible=True,
        title=recipe["title"],
        steps=recipe["instructions"],
        substitutions=[],
        unfeasible_reason=None,
    )


@pytest.fixture(autouse=True)
def no_llm(monkeypatch):
    monkeypatch.setattr(app_module, "adapt", fake_adapt)


def body(pantry, recipes, ingredients, **extra):
    """Build a request body from the real data files."""
    return {
        "pantry": pantry,
        "recipes": [
            {
                "id": r["id"],
                "title": r["title"],
                "instructions": r["instructions"],
                "ingredients": [
                    {
                        "key": m["key"],
                        "as_written": m["as_written"],
                        "quantity": m["quantity"],
                        "required_state": m["required_state"],
                    }
                    for m in r["ingredients"]
                ],
            }
            for r in recipes
        ],
        "ingredients": [
            {
                "key": i["key"],
                "is_staple": i["is_staple"],
                "derives_from": i["derives_from"],
            }
            for i in ingredients
        ],
        **extra,
    }


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_suggest_finds_carbonara(recipes, ingredients):
    payload = body(["spaghetti", "uova", "guanciale", "pecorino"], recipes, ingredients)
    response = client.post("/suggest", json=payload)
    assert response.status_code == 200
    results = response.json()["results"]
    assert results[0]["recipe_id"] == 3
    assert results[0]["missing"] == []
    assert results[0]["adapted"]["recipe_id"] == 3


def test_suggest_stays_silent(recipes, ingredients):
    payload = body(["cacao", "capperi"], recipes, ingredients)
    response = client.post("/suggest", json=payload)
    assert response.status_code == 200
    assert response.json()["results"] == []


def test_an_empty_pantry_is_rejected(recipes, ingredients):
    payload = body([], recipes, ingredients)
    assert client.post("/suggest", json=payload).status_code == 422


def test_k_is_capped(recipes, ingredients):
    payload = body(["uova"], recipes, ingredients, k=99)
    assert client.post("/suggest", json=payload).status_code == 422


def test_one_failed_recipe_does_not_lose_the_others(recipes, ingredients, monkeypatch):
    def fake_adapt_with_exception(recipe, pantry):
        if recipe["id"] == 3:
            raise RuntimeError("Gemini timed out")
        return fake_adapt(recipe, pantry)

    monkeypatch.setattr(app_module, "adapt", fake_adapt_with_exception)

    payload = body(["spaghetti", "uova", "guanciale", "pecorino"], recipes, ingredients)
    response = client.post("/suggest", json=payload)
    assert response.status_code == 200
    results = {result["recipe_id"]: result for result in response.json()["results"]}
    assert len(results) == 2
    assert results[3]["adapted"]["feasible"] is False
    assert results[18]["adapted"]["feasible"] is True


def test_a_replacement_outside_the_pantry_is_dropped(index, recorded_response):
    adapted_recipe = AdaptedRecipe.model_validate_json(recorded_response)
    result = app_module.drop_unavailable_replacements(
        adapted_recipe, index, ["spaghetti", "pancetta"]
    )
    assert result.feasible is False
    assert "parmigiano" in result.unfeasible_reason


def test_replacements_the_user_has_are_kept(index, recorded_response):
    adapted_recipe = AdaptedRecipe.model_validate_json(recorded_response)
    result = app_module.drop_unavailable_replacements(
        adapted_recipe, index, ["spaghetti", "pancetta", "parmigiano", "uova"]
    )
    assert result.feasible is True


def test_suggest_drops_a_recipe_with_a_missing_replacement(
    recipes, ingredients, monkeypatch, recorded_response
):
    def recorded_adapt(recipe, pantry):
        if recipe["id"] == 3:
            return AdaptedRecipe.model_validate_json(recorded_response)
        return fake_adapt(recipe, pantry)

    monkeypatch.setattr(app_module, "adapt", recorded_adapt)

    payload = body(["spaghetti", "pancetta", "uova"], recipes, ingredients)
    response = client.post("/suggest", json=payload)
    assert response.status_code == 200
    results = {result["recipe_id"]: result for result in response.json()["results"]}
    assert results[3]["adapted"]["feasible"] is False
    assert "parmigiano" in results[3]["adapted"]["unfeasible_reason"]
