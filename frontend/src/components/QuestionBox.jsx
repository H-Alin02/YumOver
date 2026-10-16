import { useState } from "react";

const QuestionBox = ({ question, displayByKey, onConfirm, onSkip }) => {
    const [picked, setPicked] = useState([]);

    function togglePick(key) {
        setPicked((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
    }

    return (
        <section className="flex flex-col gap-3.5 rounded-2xl border-t-4 border-mustard bg-card px-4.5 py-5 shadow-press-line">
            <h2 className="font-display text-[22px] leading-tight">Hai anche uno di questi?</h2>
            <p className="text-sm text-muted">Con questi ingredienti trovo poco. Spunta quelli che hai.</p>
            <ul className="flex flex-wrap gap-2">
                {question.map((item) => {
                    const on = picked.includes(item);
                    return (
                        <li key={item}>
                            <button
                                type="button"
                                onClick={() => togglePick(item)}
                                aria-pressed={on}
                                className={`flex h-11 items-center gap-2 rounded-full border-2 px-4 font-medium
                                ${on ? "border-sage bg-sage text-white" : "border-line bg-card text-ink"}`}
                            >
                                {on && <span aria-hidden="true">✓</span>}
                                {displayByKey.get(item) ?? item}
                            </button>
                        </li>
                    );
                })}
            </ul>
            <div className="mt-1 flex flex-col gap-1">
                <button
                    type="button"
                    onClick={() => onConfirm(picked)}
                    disabled={picked.length === 0}
                    className="h-12 rounded-xl bg-mustard font-bold text-ink shadow-press-mustard
                    transition active:translate-y-1 active:shadow-none
                    disabled:bg-disabled disabled:text-muted disabled:shadow-none
                    disabled:translate-y-0 disabled:cursor-not-allowed"
                >
                    Cerca con questi{picked.length > 0 && ` (${picked.length})`}
                </button>
                <button
                    type="button"
                    onClick={onSkip}
                    className="h-11 self-center px-1.5 font-semibold text-sage underline underline-offset-3"
                >
                    Non li ho, cerca senza
                </button>
            </div>
        </section>
    )
}

export default QuestionBox
