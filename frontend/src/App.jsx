import { useState, useEffect } from "react"
import Header from "./components/Header";
import IngredientPicker from "./components/IngredientPicker";
import PantryChips from "./components/PantryChips";
import SearchButton from "./components/SearchButton";
import RecipeList from "./components/RecipeList";
import StatusMessage from "./components/StatusMessage";
import RecipeSkeleton from "./components/RecipeSkeleton";
import { callAPI } from "./api";

const MIN_INGREDIENTS = 2;

export default function App() {

  const [inputText, setInputText] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  // TEST: pre-filled pantry.
  const [pantry, setPantry] = useState([
    { key: "pomodori", display: "pomodori" },
    { key: "basilico", display: "basilico" },
    { key: "aglio", display: "aglio" },
    { key: "mozzarella", display: "mozzarella" },
    { key: "pane", display: "pane" },
  ]);
  const [msg, setMsg] = useState("");
  const vocabularyMap = new Map(vocabulary.map((x) => [x.display, x.key]));
  const displayByKey = new Map(vocabulary.map((x) => [x.key, x.display]));
  const [status, setStatus] = useState("idle"); //idle, loading, success, error

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await callAPI("api/ingredients");
        setVocabulary(data.ingredients);
      } catch (error) {
        console.error("Error fetching ingredients: ", error);
        setMsg("Non riesco a caricare gli ingredienti, ricarica la pagina");
      }
    };

    fetchIngredients();
  }, []);

  async function handleSend() {
    if (pantry.length < MIN_INGREDIENTS) return;
    setRecipes([]);
    setStatus("loading");
    try {
      const data = await callAPI("api/recipes/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantry: pantry.map((item) => item.key),
        })
      })
      setRecipes(data.results);
      setStatus("success");
    } catch (error) {
      console.error("Errore durante la chiamata del server: ", error);
      setStatus("error");
    }
  }

  async function addToPantry() {
    const display = inputText.trim().toLowerCase();
    if (display === "") return;

    const key = vocabularyMap.get(display);
    if (key === undefined) {
      setMsg(`Non conosco ancora "${display}"`);
      try {
        await callAPI("api/ingredients/unknown", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term: display,
          })
        })
      } catch (error) {
        console.error("Errore durante la chiamata del server: ", error);
      }
      return;
    }
    if (pantry.some((item) => item.key === key)) return;

    setPantry([...pantry, { key, display }]);
    setInputText("");
    setMsg("");
  }

  function removeFromPantry(key) {
    setPantry(pantry.filter((item) => item.key !== key));
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 flex flex-col gap-6">
      <Header />
      <main className="flex flex-col gap-6">
        <IngredientPicker
          inputText={inputText}
          onInputChange={setInputText}
          vocabulary={vocabulary}
          onAdd={addToPantry}
          msg={msg}
        />
        <PantryChips
          pantry={pantry}
          onRemove={removeFromPantry}
        />
        <SearchButton
          onSearch={handleSend}
          disabled={pantry.length < MIN_INGREDIENTS || status === "loading"}
          loading={status === "loading"}
          hint={pantry.length < MIN_INGREDIENTS ? `Inserisci almeno ${MIN_INGREDIENTS} ingredienti` : ""}
        />
        <StatusMessage
          status={status}
          count={recipes.length}
        />
        {status === "loading" && <RecipeSkeleton />}
        <RecipeList
          recipes={recipes}
          displayByKey={displayByKey}
        />
      </main>
    </div>
  )
}