import { useState, useEffect } from "react"
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

    setPantry([...pantry, {key, display}]);
    setInputText("");
    setMsg("");
  }

  function removeFromPantry(key) {
    setPantry(pantry.filter((item) => item.key !== key));
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-brand p-8">
        YumOver
      </h1>

      <p className="text-2xl font-bold text-brand p-8">
        The app against food waste ;)
      </p>

      <div className="p-8">
        <input
          type="text"
          list="ingredient-options"
          placeholder="Inserisci un ingrediente..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="border border-gray-700 p-2 rounded mr-2 w-full max-w-md"
        />

        <datalist id="ingredient-options">
          {
            vocabulary.map((item) => (
              <option key={item.key} value={item.display} />
            ))
          }
        </datalist>

        <button
          type="button"
          onClick={handleSend}
          className="bg-green-600 text-white p-2 rounded"
        >Send!
        </button>

        <button
          type="button"
          onClick={addToPantry}
          className="bg-green-600 text-white p-2 rounded"
        >Aggiungi</button>

        <ul className="flex flex-wrap gap-2 mt-4">
          {pantry.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-1 rounded-full border border-gray-400 py-1 pl-3 pr-1 text-sm"
            >
              {item.display}
              <button
                type="button"
                onClick={() => removeFromPantry(item.key)}
                className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-200"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {msg && <p role="status" className="mt-2 text-sm text-gray-600">{msg}</p>}

      </div>

      <ul className="p-8">
        {
          recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2 className="mb-3 text-lg font-medium text-heading">{recipe.title}</h2>
              <ol className="max-w-md space-y-2 text-body list-decimal list-inside">
                {
                  recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))
                }
              </ol>
            </li>
          ))
        }
      </ul>
    </div>
  )
}