''' Recipie retrieval for YumOver: 

Recipes and the ingredient taxonomy come in as arguments, a ranked list goes out.
The strategy is the overlap scored with Jaccard.
'''

from dataclasses import dataclass

K = 3
MIN_MATCH = 2

@dataclass(frozen=True)
class Index:
    """Everithing retrieval needs."""
    
    staples: frozenset[str]
    derived_of: dict[str, frozenset[str]]
    recipe_keys: dict[int, frozenset[str]]
    
@dataclass(frozen=True)
class Match: 
    """One recipe the pantry can reach"""
    
    recipe_id: int
    score: float
    matched: frozenset[str]
    missing: frozenset[str]
    
def build_index(recipes: list[dict], ingredients: list[dict]) -> Index:
    staples = frozenset(i["key"] for i in ingredients if i["is_staple"])
    
    derived: dict[str, set[str]] = {}
    for i in ingredients: 
        if i["derives_from"]:
            derived.setdefault(i["derives_from"], set()).add(i["key"])
            
    recipe_keys = {
        r["id"]: frozenset(m["key"] for m in r["ingredients"]) - staples
        for r in recipes
    }
    
    return Index(
        staples=staples,
        derived_of={base: frozenset(d) for base, d in derived.items()},
        recipe_keys=recipe_keys,
    )

def written(index: Index, pantry: list[str]) -> frozenset[str]:
    """Non-staple keys the user actually put in the pantry."""
    return frozenset(k for k in pantry if k not in index.staples)


def reach(index: Index, pantry: list[str]) -> frozenset[str]:
    """Everything the pantry can supply, including what it turns into."""
    have = written(index, pantry)
    out = set(have)
    for key in have:
        out |= index.derived_of.get(key, frozenset())
    return frozenset(out)

def score_jaccard(matched: frozenset, needed: frozenset, have: frozenset) -> float:
    union = needed | have
    return len(matched) / len(union) if union else 0.0

def retrieve(index: Index, pantry: list[str], k: int = K, min_match: int = MIN_MATCH) -> list[Match]:
    """Up to k recipes, best first."""
    have = written(index, pantry)
    available = reach(index, pantry)
    
    rows = []
    for recipe_id, needed in index.recipe_keys.items():
        matched = needed & available
        if len(matched) < min_match:
            continue
        rows.append(
            Match(
                recipe_id=recipe_id,
                score=score_jaccard(matched, needed, have),
                matched=matched,
                missing=needed - available,
            )
        )
        
    rows.sort(key=lambda m: (-m.score, len(m.missing), m.recipe_id))
    return rows[:k]