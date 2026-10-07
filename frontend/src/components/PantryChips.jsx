const PantryChips = ({ pantry, onRemove }) => {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">La tua dispensa ({pantry.length})</h2>
            <ul className="flex flex-wrap gap-2">
                {pantry.map((item) => (
                    <li
                        key={item.key}
                        className="flex items-center gap-1 rounded-full border-2 border-line 
                        bg-card py-1 pl-3 pr-1 text-sm font-semibold shadow-press-line"
                    >
                        {item.display}
                        <button
                            type="button"
                            onClick={() => onRemove(item.key)}
                            className="flex h-6 w-6 items-center justify-center rounded-full bg-ground hover:bg-line"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default PantryChips
