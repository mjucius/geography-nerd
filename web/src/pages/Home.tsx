interface HomeProps {
  onStartQuiz: () => void;
}

export function Home({ onStartQuiz }: HomeProps) {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f5efe2]">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="order-2 lg:order-1">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8cdb9] bg-[#fffaf0] px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#55706f] sm:mb-5 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-[#c97938]"></span>
            World direction challenge
          </div>

          <h2 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-[#17202a] min-[390px]:text-5xl sm:text-6xl lg:text-7xl">
            Read the map without seeing the map.
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#53625d] sm:mt-5 sm:text-xl sm:leading-8">
            Compare two cities, choose the direction, then reveal the route. Ten quick questions, no accounts, just geography instinct.
          </p>

          <button
            onClick={onStartQuiz}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[#17202a] px-7 text-base font-black text-[#fffaf0] shadow-[0_8px_0_#d8cdb9] transition hover:-translate-y-0.5 hover:bg-[#244a52] focus:outline-none focus:ring-4 focus:ring-[#c97938]/30 sm:mt-8 sm:w-auto sm:shadow-[0_10px_0_#d8cdb9]"
          >
            Start Quiz
          </button>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
            <div className="rounded-xl border border-[#d8cdb9] bg-[#fffaf0] p-4">
              <p className="text-sm font-black text-[#17202a]">Compare</p>
              <p className="mt-1 text-sm leading-6 text-[#66726d]">Two cities, one directional call.</p>
            </div>
            <div className="rounded-xl border border-[#d8cdb9] bg-[#fffaf0] p-4">
              <p className="text-sm font-black text-[#17202a]">Choose</p>
              <p className="mt-1 text-sm leading-6 text-[#66726d]">North, south, east, or west.</p>
            </div>
            <div className="rounded-xl border border-[#d8cdb9] bg-[#fffaf0] p-4">
              <p className="text-sm font-black text-[#17202a]">Reveal</p>
              <p className="mt-1 text-sm leading-6 text-[#66726d]">See the route and distance after each answer.</p>
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-md">
            <div className="rounded-[1.5rem] border border-[#d8cdb9] bg-[#fffaf0] p-3 shadow-[0_18px_46px_rgba(23,32,42,0.12)] sm:rounded-[2rem] sm:p-5 sm:shadow-[0_24px_70px_rgba(23,32,42,0.13)]">
              <div className="relative overflow-hidden rounded-[1.2rem] border border-[#d8cdb9] bg-[#e9dfca] p-4 sm:rounded-[1.5rem] sm:p-6">
                <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(#244a5220_1px,transparent_1px),linear-gradient(90deg,#244a5220_1px,transparent_1px)] [background-size:24px_24px]"></div>
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between sm:mb-8">
                    <span className="rounded-full bg-[#17202a] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#fffaf0]">
                      Level 1
                    </span>
                    <span className="font-mono text-sm font-bold text-[#55706f]">03 / 10</span>
                  </div>
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-[#d8cdb9] bg-[#fffaf0] shadow-inner sm:mb-8 sm:h-40 sm:w-40">
                    <img
                      src="/GeographyNerd-Logo_200.png"
                      alt="Geography Nerd"
                      className="h-24 w-24 sm:h-32 sm:w-32"
                    />
                  </div>
                  <div className="rounded-2xl border border-[#d8cdb9] bg-[#fffaf0]/90 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#55706f]">Sample route</p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full bg-[#c97938]"></span>
                      <div className="h-px flex-1 border-t border-dashed border-[#55706f]"></div>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1e6964] text-sm font-black text-white">N</span>
                      <div className="h-px flex-1 border-t border-dashed border-[#55706f]"></div>
                      <span className="h-3 w-3 rounded-full bg-[#244a52]"></span>
                    </div>
                    <p className="mt-4 text-lg font-black text-[#17202a]">Is Tokyo north or south of Sydney?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
