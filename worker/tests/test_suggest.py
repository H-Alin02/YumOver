from fastapi.testclient import TestClient

from app.app import app

client = TestClient(app)


def body(pantry, recipes, ingredients, **extra):
    """Build a request body from the real data files."""
    return {
        "pantry": pantry,
        "recipes": [
            {
                "id": r["id"],
                "ingredients": [{"key": m["key"]} for m in r["ingredients"]],
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
