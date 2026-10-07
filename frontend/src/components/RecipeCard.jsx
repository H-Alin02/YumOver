const RecipeCard = ({ recipe }) => {
    return (
        <li className="rounded-2xl bg-card p-4 shadow-press-line">
            <h2 className="mb-2 font-display text-xl">{recipe.title}</h2>
            <ol className="list-inside list-decimal space-y-2 text-muted">
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