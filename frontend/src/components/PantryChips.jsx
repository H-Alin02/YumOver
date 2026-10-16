const PantryChips = ({ pantry, extras, displayByKey, onRemove, onRemoveExtras }) => {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold">La tua dispensa ({pantry.length + extras.length})</h2>
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
                {extras.map((item) => (
                    <li
                        key={item}
                        className="flex items-center gap-1 rounded-full border-2 border-dashed 
                        border-[#8C9772] bg-[#FBFBF6] py-1 pl-3 pr-1 text-sm font-semibold shadow-press-line"
                    >
                        {displayByKey.get(item) ?? item}
                        <button
                            type="button"
                            onClick={() => onRemoveExtras(item)}
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
