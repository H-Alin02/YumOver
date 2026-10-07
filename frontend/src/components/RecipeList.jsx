import RecipeCard from "./RecipeCard"

const RecipeList = ({ recipes, displayByKey }) => {
    return (
        <ul className="flex flex-col gap-4">
            {
                recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} displayByKey={displayByKey} />
                ))
            }
        </ul>
    )
}

export default RecipeList