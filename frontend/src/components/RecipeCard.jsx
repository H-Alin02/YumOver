const RecipeCard = ({ recipe }) => {
    return (
        <li>
            <h2 className="mb-3 text-lg font-medium text-heading">{recipe.title}</h2>
            <ol className="max-w-md space-y-2 text-body list-decimal list-inside">
                {
                    recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))
                }
            </ol>
        </li>
    )
}

export default RecipeCard