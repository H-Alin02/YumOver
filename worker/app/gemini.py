"""Gemini Client"""

from functools import lru_cache

from google import genai
from google.genai import types
from pydantic import BaseModel, Field, model_validator

from app.config import get_settings

MODEL = "gemini-3.5-flash-lite"
TIMEOUT_MS = 15_000
SYSTEM_INSTRUCTION = """Sei un cuoco italiano e il tuo obiettivo è far evitare gli sprechi
alimentari: adatti una ricetta a quello che una persona ha davvero in casa, e dici
onestamente quando non si può fare.

La ricetta che ricevi è uno scheletro, non un vincolo: ogni suo ingrediente ci occupa un
ruolo — la parte grassa e saporita, quella acida, quella che lega, quella che profuma.
Non chiederti «cosa sostituisce il guanciale» ma «chi riempie il ruolo della parte grassa
e saporita». Se quello che esce è un altro piatto va benissimo, purché sia un piatto che
si cucina davvero e abbia un nome suo.

# Procedura

1. Confronta gli ingredienti della ricetta con la dispensa. Considera sempre presenti
   `sale`, `pepe`, `olio-di-oliva` e `acqua`, e chi ha un ingrediente ha anche quello che
   se ne ricava (le uova danno i tuorli).
2. Per ogni ingrediente della ricetta che manca, di' prima che ruolo svolge, poi scegli
   uno dei tre esiti:
   - **Sostituito**: qualcosa in dispensa occupa quel ruolo. `replacement_key` è la sua
     chiave.
   - **Omesso**: il piatto si cucina lo stesso, un po' più semplice — erbe, spezie,
     profumi, guarnizioni. `replacement_key` è `null`.
   - **Bloccante**: il ruolo resta vuoto, in dispensa non c'è nessuno che possa occuparlo,
     e senza quel ruolo il piatto non si fa proprio: non lega, non rassoda, non lievita,
     non cuoce. Che il piatto cambi nome non è mai un motivo per bloccare.
3. Con anche un solo ingrediente bloccante fermati qui: `feasible` = false, e
   `unfeasible_reason` dice quale ingrediente, quale ruolo lascia vuoto e perché in
   dispensa non lo copre nessuno. `steps` e `substitutions` restano vuoti.
4. Altrimenti `feasible` = true: metti in `substitutions` ogni ingrediente mancante, sia
   sostituito sia omesso; riscrivi il procedimento come si cucina davvero il piatto che
   esce; compila `title`.

# Regole

- Scrivi in italiano. `original_key` è una chiave della ricetta, `replacement_key` una
  chiave della dispensa copiata identica — mai una parola inventata, e per l'ingrediente
  omesso `null`, non la stringa "nessuno".
- Tieni le quantità della ricetta originale: della dispensa sai cosa c'è, non quanto.
- `reason`: una frase sul ruolo che l'ingrediente svolgeva e su come viene coperto. Chi
  legge sa già che l'originale mancava.
- `title`: se le sostituzioni portano a un altro piatto, dagli il nome di quel piatto. Se
  invece il piatto resta lo stesso — nessuna sostituzione, solo omissioni, o scambi che
  non lo spostano — riporta il titolo originale identico. Non descrivere mai l'adattamento.

# Esempi

- `reason` di una sostituzione: "Il sedano portava la parte croccante e amarognola del
  soffritto, e le carote la tengono."
- `reason` di un'omissione: "Il rosmarino profumava la carne in padella, senza si cucina
  lo stesso."
- `title` che resta: "Insalata Pantesca" senza origano → "Insalata Pantesca"
- `title` che cambia: "Saltimbocca alla Romana" col pollo al posto del vitello →
  "Saltimbocca di pollo"
- `unfeasible_reason`: "Senza lievito di birra l'impasto della focaccia non cresce, e in
  dispensa non c'è niente che lo faccia lievitare."
"""


# How the Gemini response should look like
class Substitution(BaseModel):
    # Field descriptions improve Gemini's understanding of field usage.
    original_key: str = Field(
        description="Chiave canonica dell'ingrediente della ricetta che manca."
    )
    replacement_key: str | None = Field(
        description="Chiave canonica della dispensa che lo sostituisce, oppure null se l'ingrediente viene omesso."
    )
    reason: str = Field(
        description="Una frase: il ruolo che l'ingrediente svolge nel piatto."
    )


class AdaptedRecipe(BaseModel):
    recipe_id: int = Field(description="Lo stesso recipe_id ricevuto nell'input.")
    feasible: bool = Field(
        description="False se manca un ingrediente essenziale e niente in dispensa ne svolge il ruolo."
    )
    title: str | None = Field(
        description="Obbligatorio se feasible è true. Identico all'originale se substitutions è vuoto."
    )
    steps: list[str] = Field(
        description="Procedimento con le sostituzioni applicate. Vuoto se feasible è false",
    )
    substitutions: list[Substitution] = Field(
        description="Una voce per ingrediente sostituito- Vuota se feasible è false.",
    )
    unfeasible_reason: str | None = Field(
        description="Obbligatorio se feasible è false: quale ingrediente e perché.",
    )

    @model_validator(mode="after")
    def coherent(self) -> AdaptedRecipe:
        if self.feasible and not (self.title and self.steps):
            raise ValueError("feasible=True but title or steps are empty")
        if not self.feasible and not self.unfeasible_reason:
            raise ValueError("feasible=False without unfeasible_reason")
        if not self.feasible and self.steps:
            raise ValueError("feasible=False but contains steps")
        return self


@lru_cache
def get_client() -> genai.Client:
    """Creates the Gemini Client and stores it in the cache"""
    settings = get_settings()
    return genai.Client(
        api_key=settings.gemini_api_key,
        http_options=types.HttpOptions(timeout=TIMEOUT_MS),
    )


def format_recipe(recipe: dict) -> str:
    lines = [f"Titolo: {recipe['title']}", "", "Ingredienti:"]
    for i in recipe["ingredients"]:
        state = f", {i['required_state']}" if i["required_state"] else ""
        lines.append(f"- {i['key']} ({i['as_written']}, {i['quantity']}{state})")
    lines += ["", "Procedimento:"]
    lines += [f"{n}. {s}" for n, s in enumerate(recipe["instructions"], 1)]
    return "\n".join(lines)


def build_input(recipe: dict, pantry: list[str]) -> str:
    return (
        f"-----Ricetta Originale (recipe_id: {recipe['id']})-----\n"
        f"{format_recipe(recipe)}\n\n"
        f"-----Dispensa-----\n{", ".join(pantry)}\n"
    )


def adapt(recipe: dict, pantry: list[str]) -> AdaptedRecipe:
    interaction = get_client().interactions.create(
        model=MODEL,
        system_instruction=SYSTEM_INSTRUCTION,
        input=build_input(recipe, pantry),
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": AdaptedRecipe.model_json_schema(),
        },
        generation_config={"thinking_level": "high"},
    )
    return AdaptedRecipe.model_validate_json(interaction.output_text)
