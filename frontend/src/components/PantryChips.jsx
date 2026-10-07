const PantryChips = ({pantry, onRemove }) => {
    return (
        <div >
            <ul className="flex flex-wrap gap-2 mt-4">
                {pantry.map((item) => (
                    <li
                        key={item.key}
                        className="flex items-center gap-1 rounded-full border border-gray-400 py-1 pl-3 pr-1 text-sm"
                    >
                        {item.display}
                        <button
                            type="button"
                            onClick={() => onRemove(item.key)}
                            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-200"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PantryChips