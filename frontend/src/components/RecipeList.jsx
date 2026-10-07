import RecipeCard from "./RecipeCard"

const RecipeList = ({ recipes }) => {
    return (
        <div>
            <ul>
                {
                    recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))
                }
            </ul>
        </div>
    )
}

export default RecipeList