from app.retrieval import reach, retrieve

MIN_RECALL = 0.97

def test_eggs_supply_yolks(index):
    assert reach(index, ["uova"]) == {"uova", "tuorli"}

def test_yolks_do_not_supply_eggs(index):
    assert reach(index, ["tuorli"]) == {"tuorli"}

def test_staples_are_dropped_from_the_pantry(index):
    assert reach(index, ["sale", "acqua"]) == frozenset()

def test_a_pantry_of_staples_returns_nothing(index):
    assert retrieve(index, ["sale", "olio-di-oliva", "pepe", "acqua"]) == []

def test_staples_are_dropped_from_the_recipe_too(index):
    top = retrieve(index, ["patate", "rosmarino", "timo", "aglio"])[0]
    assert (top.recipe_id, top.score) == (5, 1.0)
    
def test_whole_eggs_reach_carbonara(index):
    top = retrieve(index, ["spaghetti", "uova", "guanciale", "pecorino"])[0]
    assert top.recipe_id == 3
    
def test_recall_on_the_evaluation_set(index, queries):
    positives = [q for q in queries if q["expected"]]
    scores = []
    for query in positives:
        found = {m.recipe_id for m in retrieve(index, query["pantry"])}
        expected = set(query["expected"])
        scores.append(len(expected & found) / len(expected))
    recall = sum(scores) / len(scores)
    assert recall >= MIN_RECALL, f"recall@3 dropped to {recall:.3f}"


def test_silence_on_the_impossible_pantries(index, queries):
    negatives = [q for q in queries if not q["expected"]]
    assert negatives, "the evaluation set lost its negative queries"
    for query in negatives:
        assert retrieve(index, query["pantry"]) == [], query["id"]