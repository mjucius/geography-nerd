interface NavigationProps {
  onHomeClick?: () => void;
}

export function Navigation({ onHomeClick }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-20 border-b border-[#d8cdb9] bg-[#f5efe2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={onHomeClick}
          className="group flex items-center gap-3 text-left"
          aria-label="Go to Geography Nerd home"
        >
          <img
            src="/GeographyNerd-Logo_200.png"
            alt="Geography Nerd"
            className="h-11 w-11 rounded-xl border border-[#d8cdb9] bg-[#fffaf0] p-1 shadow-sm transition group-hover:-rotate-2"
          />
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#17202a] sm:text-2xl">
              Geography Nerd
            </h1>
            <p className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-[#55706f] sm:block">
              Direction quiz
            </p>
          </div>
        </button>
        <div className="hidden items-center gap-2 rounded-full border border-[#d8cdb9] bg-[#fffaf0] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#55706f] sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#c97938]"></span>
          Atlas mode
        </div>
      </div>
    </nav>
  );
}
