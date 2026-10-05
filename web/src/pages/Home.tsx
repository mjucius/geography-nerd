interface HomeProps {
  onStartQuiz: () => void;
}

const steps = [
  { title: 'Compare', body: 'Two cities, one directional call.' },
  { title: 'Choose', body: 'North, south, east, or west.' },
  { title: 'Reveal', body: 'See the route and distance after each answer.' },
];

export function Home({ onStartQuiz }: HomeProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <section>
        <h2 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Read the map without seeing the map.
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
          Ten quick questions, no accounts. Trust your instinct.
        </p>

        <button
          onClick={onStartQuiz}
          className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-control bg-teal px-7 text-base font-bold text-surface transition hover:bg-teal-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal sm:w-auto"
        >
          Start Quiz
        </button>

        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.title} className="rounded-card border border-line bg-surface p-4">
              <p className="text-sm font-bold text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="hidden justify-center lg:flex">
        <img
          src="/GeographyNerd-Logo_200.png"
          alt="Geography Nerd"
          className="h-56 w-56 rounded-card border border-line bg-surface p-4"
        />
      </div>
    </div>
  );
}
