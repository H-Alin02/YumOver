import { useState } from "react"
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function App() {

  const [pantryIngredients, setPantryIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);


  async function handleSend() {
    const ingredients = pantryIngredients.trim().split(",").map((s) => s.trim()).filter((s) => s !== "");
    console.log("Ingredienti: ", ingredients);

    try {
      const response = await fetch(`${VITE_API_URL}/api/recipes/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pantry: ingredients,
        })
      });

      if (!response.ok) {
        throw new Error(`Il server ha risposto ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data.results);

      console.log("Risposta del server:", data)
    } catch (error) {
      console.error("Errore durante la chiamata del server: ", error);
    }
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
          placeholder="Inserisci un ingrediente..."
          value={pantryIngredients}
          onChange={(e) => setPantryIngredients(e.target.value)}
          className="border border-gray-700 p-2 rounded mr-2 w-full max-w-md"
        />

        <button
          type="button"
          onClick={handleSend}
          className="bg-green-600 text-white p-2 rounded"
        >Send!
        </button>
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