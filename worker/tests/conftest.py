import json
from pathlib import Path
import pytest
from app.retrieval import build_index

REPO = Path(__file__).resolve().parents[2]
DATA = REPO / "data"

def load(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))

@pytest.fixture(scope="session")
def recipes():
    return load(DATA / "recipes-seed.json")

@pytest.fixture(scope="session")
def ingredients():
    return load(DATA / "ingredients.json")["ingredients"]

@pytest.fixture(scope="session")
def queries():
    return load(REPO / "notebooks" / "eval-queries.json")

@pytest.fixture(scope="session")
def index(recipes, ingredients):
    return build_index(recipes, ingredients)