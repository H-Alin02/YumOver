const Header = () => {
  return (
    <header className="flex flex-col gap-1 rounded-2xl bg-sage p-4">
      <h1 className="font-display text-6xl">
        <span className="text-card">Yum</span><span className="text-mustard">Over</span>
      </h1>

      <p className="text-lg font-semibold text-card">
        L'app contro lo spreco di cibo 😉
      </p>
    </header>
  )
}

export default Header
