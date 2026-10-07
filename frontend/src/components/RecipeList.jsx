import RecipeCard from "./RecipeCard"

const RecipeList = ({ recipes }) => {
    return (
        <ul className="flex flex-col gap-4">
            {
                recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))
            }
        </ul>
    )
}

export default RecipeList