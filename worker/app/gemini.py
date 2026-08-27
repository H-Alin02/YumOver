"""Gemini Client"""

from functools import lru_cache

from google import genai
from google.genai import types
from pydantic import BaseModel, Field, model_validator

from app.config import get_settings

MODEL = "gemini-3.5-flash-lite"
TIMEOUT_MS = 10_000
SYSTEM_INSTRUCTION = """Sei un cuoco italiano e il tuo obiettivo è far evitare il più 
possibile gli sprechi alimentari. Adatti una ricetta a quello che una persona
ha davvero in casa, e dici onestamente quando non si può fare.

# Procedura

1. Confronta gli ingredienti della ricetta con la dispensa.
   Sale, pepe, olio e acqua considerali sempre disponibili.
2. Per ogni ingrediente della ricetta che non è in dispensa, decidi quale dei due casi è:
   - **Sostituibile**: qualcosa in dispensa ne svolge il ruolo — il grasso, l'acidità,
     la struttura, la dolcezza, la capacità di legare. Registralo in `substitutions`.
   - **Essenziale**: senza di lui il piatto cambia nome, e in dispensa non c'è niente
     che ne svolga il ruolo. La mozzarella in una parmigiana è essenziale.
3. Se anche un solo ingrediente è essenziale, fermati qui: `feasible` = false,
   `unfeasible_reason` dice quale ingrediente e perché, `steps` e `substitutions` vuoti.
4. Altrimenti `feasible` = true: riscrivi il procedimento applicando le sostituzioni,
   e compila `title`.

# Regole

- Scrivi in italiano.
- Usa le chiavi canoniche esatte: `original_key` viene dalla ricetta, `replacement_key`
  dalla dispensa.
- Tieni le quantità della ricetta originale. Della dispensa sai cosa c'è, non quanto.
- In `reason` scrivi una frase, e dice il ruolo che l'ingrediente svolge nel piatto.
  Chi legge sa già che l'originale non c'era.
- `title`: compilalo sempre quando `feasible` è true. Se `substitutions` è vuoto riporta
  il titolo originale identico. Altrimenti aggiungi al titolo originale il solo
  ingrediente sostituito che cambia di più il piatto. Non descrivere mai l'adattamento.

# Esempi di `reason`

- "Il miele porta la dolcezza dello zucchero e un po' più di umidità all'impasto."
- "Le zucchine tengono la parte acquosa e dolce che la melanzana dà in padella."
- "Il limone rimette l'acidità che l'aceto dava alla salsa."

# Esempi di `title`

- Nessuna sostituzione: "Pasta alla Carbonara" → "Pasta alla Carbonara"
- Guanciale sostituito con pancetta: "Pasta alla Carbonara" → "Carbonara con la pancetta"
- Vitello sostituito con pollo: "Saltimbocca alla Romana" → "Saltimbocca di pollo"

# Esempio di `unfeasible_reason`

- "Senza mozzarella la parmigiana non fila, e in dispensa non c'è un formaggio a pasta filata."
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
    )
    return AdaptedRecipe.model_validate_json(interaction.output_text)
