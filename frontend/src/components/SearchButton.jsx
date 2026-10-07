const SearchButton = ({onSearch}) => {
    return (
        <div>
            <button
                type="button"
                onClick={onSearch}
                className="bg-green-600 text-white p-2 rounded"
            >Send!
            </button>
        </div>
    )
}

export default SearchButton