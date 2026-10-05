interface NavigationProps {
  onHomeClick?: () => void;
}

export function Navigation({ onHomeClick }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3 sm:px-6">
        <button
          onClick={onHomeClick}
          className="group flex min-h-11 items-center gap-3 rounded-control text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
          aria-label="Go to Geography Nerd home"
        >
          <img
            src="/GeographyNerd-Logo_200.png"
            alt="Geography Nerd"
            className="h-11 w-11 rounded-control border border-line bg-surface p-1"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Geography Nerd
            </h1>
            <p className="hidden text-sm text-ink-soft sm:block">Direction quiz</p>
          </div>
        </button>
      </div>
    </nav>
  );
}
