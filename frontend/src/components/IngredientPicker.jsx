const IngredientPicker = ({ inputText, onInputChange, vocabulary, onAdd, msg }) => {
    return (
        <section className="flex flex-col gap-2">
            <label htmlFor="ingredient-input" className="text-sm font-semibold">
                Cosa hai in casa?
            </label>

            <div className="flex gap-2">
                <input
                    id="ingredient-input"
                    type="text"
                    list="ingredient-options"
                    placeholder="Inserisci un ingrediente..."
                    value={inputText}
                    onChange={(e) => onInputChange(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border-2 border-line bg-card px-3 py-2 "
                />

                <button
                    type="button"
                    onClick={onAdd}
                    className="rounded-xl border-2 border-sage bg-card px-4 font-semibold
                    text-sage shadow-press-sage transition active:translate-y-1 active:shadow-none"
                >Aggiungi</button>
            </div>

            <datalist id="ingredient-options">
                {
                    vocabulary.map((item) => (
                        <option key={item.key} value={item.display} />
                    ))
                }
            </datalist>

            {msg && <p role="status" className="text-sm text-muted p-3">{msg}</p>}
        </section>
    )
}

export default IngredientPicker
