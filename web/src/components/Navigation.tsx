export function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-600 border-b-2 border-cyan-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/GeographyNerd-Logo_200.png"
            alt="Geography Nerd"
            className="h-12 w-12 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 bg-clip-text text-transparent">
            Geography Nerd
          </h1>
        </div>
      </div>
    </nav>
  );
}
