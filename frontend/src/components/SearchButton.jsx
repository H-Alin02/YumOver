const SearchButton = ({ onSearch, disabled, loading, hint }) => {
    return (
        <div className="flex flex-col gap-2">
            {hint && <p id='search-hint' className="text-sm text-muted">{hint}</p>}
            <button
                type="button"
                onClick={onSearch}
                disabled={disabled}
                className="bg-mustard border-2 border-mustard rounded-xl p-3 font-semibold text-ink 
            shadow-press-mustard transition active:translate-y-1 active:shadow-none
            disabled:bg-disabled disabled:border-disabled disabled:text-muted
            disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >{loading ? "Sto cercando delle ricette per te..." : "Trova le ricette"}

            </button>


        </div>
    )
}

export default SearchButton