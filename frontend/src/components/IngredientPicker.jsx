const IngredientPicker = ({inputText, onInputChange, vocabulary, onAdd, msg }) => {
    return (
        <div >
            <input
                type="text"
                list="ingredient-options"
                placeholder="Inserisci un ingrediente..."
                value={inputText}
                onChange={(e) => onInputChange(e.target.value)}
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
                onClick={onAdd}
                className="bg-green-600 text-white p-2 rounded"
            >Aggiungi</button>

            {msg && <p role="status" className="mt-2 text-sm text-gray-600">{msg}</p>}
        </div>
    )
}

export default IngredientPicker