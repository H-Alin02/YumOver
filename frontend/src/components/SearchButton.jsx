const SearchButton = ({ onSearch }) => {
    return (
        <button
            type="button"
            onClick={onSearch}
            className="bg-mustard border-2 border-mustard rounded-xl p-3 font-semibold text-ink 
            shadow-press-mustard transition active:translate-y-1 active:shadow-none"
        >Trova le ricette
        </button>
    )
}

export default SearchButton