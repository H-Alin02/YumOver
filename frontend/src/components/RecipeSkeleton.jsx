const RecipeSkeleton = () => {
    return (
        <ul className="flex flex-col gap-4">
            {
                [1, 2, 3].map((n) => (
                    <li key={n} className="rounded-2xl bg-card p-4 shadow-press-line motion-safe:animate-pulse">
                        <div className="mb-3 h-6 w-2/3 rounded-md bg-line"></div>
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-full rounded-md bg-ground"></div>
                            <div className="h-4 w-5/6 rounded-md bg-ground"></div>
                            <div className="h-4 w-3/4 rounded-md bg-ground"></div>
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}

export default RecipeSkeleton