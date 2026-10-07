const StatusMessage = ({ status, count }) => {
    const state = status === "success" && count === 0 ? "empty" : status;
    const messages = {
        idle: "",
        loading: "Ci vorrà solo qualche secondo...",
        success: `${count === 1 ? `${count} ricetta trovata` : `${count} ricette trovate`}`,
        empty: "Con questi ingredienti non trovo nulla. Prova ad aggiungere qualche altro ingrediente",
        error: "Qualcosa non ha funzionato. Riprova tra qualche secondo."
    }
    const text = messages[state];

    return (
        <div role="status">
            {text && (
                <p className="rounded-2xl border-2 border-line bg-card p-4 text-sm font-semibold">
                    {text}
                </p>
            )}
        </div>
    )
}

export default StatusMessage