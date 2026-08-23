import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
recipes = json.loads((ROOT / "data/recipes-seed.json").read_text(encoding="utf-8"))
ingredients = json.loads((ROOT / "data/ingredients.json").read_text(encoding="utf-8"))[
    "ingredients"
]

print(
    json.dumps(
        {
            "pantry": sys.argv[1:] or ["spaghetti", "uova", "guanciale", "pecorino"],
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
        }
    )
)
