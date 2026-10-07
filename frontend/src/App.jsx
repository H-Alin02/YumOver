import { useState, useEffect } from "react"
import Header from "./components/Header";
import IngredientPicker from "./components/IngredientPicker";
import PantryChips from "./components/PantryChips";
import SearchButton from "./components/SearchButton";
import RecipeList from "./components/RecipeList";
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function App() {

  const [inputText, setInputText] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [msg, setMsg] = useState("");
  const vocabularyMap = new Map(vocabulary.map((x) => [x.display, x.key]));

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/api/ingredients`);

        if (!res.ok) {
          throw new Error(`Il server ha risposto ${res.status}`);
        }

        const data = await res.json();
        setVocabulary(data.ingredients);
      } catch (error) {
        console.error("Error fetching ingredients: ", error);
      }
    };

    fetchIngredients();
  }, []);

  async function handleSend() {
    if (pantry.length === 0) return;

    try {
      const response = await fetch(`${VITE_API_URL}/api/recipes/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantry: pantry.map((item) => item.key),
        })
      });

      if (!response.ok) {
        throw new Error(`Il server ha risposto ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data.results);
    } catch (error) {
      console.error("Errore durante la chiamata del server: ", error);
    }
  }

  async function addToPantry() {
    const display = inputText.trim().toLowerCase();
    if (display === "") return;

    const key = vocabularyMap.get(display);
    if (key === undefined) {
      setMsg(`Non conosco ancora "${display}"`);
      try {
        const response = await fetch(`${VITE_API_URL}/api/ingredients/unknown`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term: display,
          })
        });

        if (!response.ok) {
          throw new Error(`Il server ha risposto ${response.status}`);
        }
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
    <div>
      <Header />
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
      <SearchButton onSearch={handleSend} />
      <RecipeList recipes={recipes} />
    </div>
  )
}