from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app import gemini
from app.gemini import AdaptedRecipe


@pytest.fixture
def carbonara(recipes):
    return next(r for r in recipes if r["title"] == "Pasta alla Carbonara")


def fake_client(text):
    return SimpleNamespace(
        interactions=SimpleNamespace(
            create=lambda **kw: SimpleNamespace(output_text=text)
        )
    )


def test_adapt_parses_a_recorded_response(monkeypatch, carbonara, recorded_response):
    monkeypatch.setattr(gemini, "get_client", lambda: fake_client(recorded_response))
    result = gemini.adapt(carbonara, ["spaghetti", "pancetta"])
    assert result.feasible
    assert result.substitutions


def test_adapt_raises_on_invalid_response(monkeypatch, carbonara):
    monkeypatch.setattr(gemini, "get_client", lambda: fake_client('{"recipe_id": 3'))
    with pytest.raises(ValidationError):
        gemini.adapt(carbonara, ["spaghetti"])


def test_adapt_parses_a_recorded_refusal(monkeypatch, carbonara, recorded_refusal):
    monkeypatch.setattr(gemini, "get_client", lambda: fake_client(recorded_refusal))
    result = gemini.adapt(carbonara, ["spaghetti"])
    assert not result.feasible
    assert result.unfeasible_reason
    assert result.steps == []


@pytest.mark.parametrize(
    "changes",
    [
        {"steps": []},
        {"feasible": False, "title": None},
        {"feasible": None, "title": None, "unseasible_reason": "explanation..."},
    ],
)
def test_validator_rejects_incoherent_shapes(changes):
    valid = {
        "recipe_id": 1,
        "feasible": True,
        "title": "Pasta alla Carbonara",
        "steps": ["Cuocere la pasta."],
        "substitutions": [],
        "unfeasible_reason": None,
    }
    with pytest.raises(ValidationError):
        AdaptedRecipe.model_validate({**valid, **changes})
