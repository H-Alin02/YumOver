const RecipeCard = ({ recipe, displayByKey }) => {
    // Falls back to the key when the vocabulary hasn't loaded.
    const toDisplay = (key) => displayByKey.get(key) ?? key;
    const usedNames = recipe.matched.map(toDisplay).join(", ");
    const hasChanges = recipe.substitutions.length > 0;

    return (
        <li className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-press-line">
            <h2 className="font-display text-xl">{recipe.title}</h2>

            <p className="text-sm">
                <span className="font-semibold text-sage">✓ Hai:</span> {usedNames}
            </p>

            {hasChanges && (
                <section className="rounded-xl bg-ground p-3">
                    <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted">
                        Cosa è cambiato
                    </h3>
                    <ul className="flex flex-col gap-3">
                        {recipe.substitutions.map((sub) => {
                            const from = toDisplay(sub.original_key);
                            const to = sub.replacement_key === null ? "tolto" : toDisplay(sub.replacement_key);

                            return (
                                <li key={sub.original_key}>
                                    <p className="font-semibold text-sm">{from} → {to}</p>
                                    <p className="text-sm text-muted">{sub.reason}</p>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}

            <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-1 font-semibold
                    text-sage [&::-webkit-details-marker]:hidden">
                    Mostra procedimento
                    <span className="transition group-open:rotate-180">▾</span>
                </summary>
                <ol className="mt-3 list-inside list-decimal space-y-2 text-muted">
                    {recipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </details>
        </li>
    )
}

export default RecipeCard