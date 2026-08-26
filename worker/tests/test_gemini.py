import pathlib
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app import gemini

RECORDED_RESPONSE = (
    pathlib.Path(__file__).parent / "fixtures" / "gemini_adapt_carbonara.json"
).read_text(encoding="utf-8")


def fake_client(text):
    return SimpleNamespace(
        interactions=SimpleNamespace(
            create=lambda **kw: SimpleNamespace(output_text=text)
        )
    )


def test_adapt_parses_a_recorded_response(monkeypatch):
    monkeypatch.setattr(gemini, "get_client", lambda: fake_client(RECORDED_RESPONSE))
    result = gemini.adapt({"id": 3}, ["spaghetti", "pancetta"])
    assert result.recipe_id == 3
    assert result.substitutions


def test_adapt_raises_on_invalid_response(monkeypatch):
    monkeypatch.setattr(gemini, "get_client", lambda: fake_client('{"recipe_id": 3}'))
    with pytest.raises(ValidationError):
        gemini.adapt({"id": 3}, ["spaghetti"])
