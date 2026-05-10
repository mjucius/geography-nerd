import type { UserAnswer, Question, DifficultyLevel } from '../types';
import { MapView } from './MapView';

interface ScoreScreenProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
  onStartLevel?: (level: DifficultyLevel) => void;
  onRetakeHome?: () => void;
  onRetake?: () => void;
  loading?: boolean;
  difficultyLevel?: DifficultyLevel;
  nextLevelAvailable?: boolean;
}

export function ScoreScreen({
  score,
  totalQuestions,
  answers,
  questions,
  onStartLevel,
  onRetakeHome,
  onRetake,
  loading = false,
  difficultyLevel = 1,
  nextLevelAvailable = false,
}: ScoreScreenProps) {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getLevelName = (level: number) => {
    const names: { [key: number]: string } = {
      1: 'Novice',
      2: 'Student',
      3: 'Traveler',
      4: 'Scholar',
      5: 'Professor',
      6: 'Expert',
      7: 'Navigator',
      8: 'Explorer',
      9: 'Geographer',
      10: 'Cartographer'
    };
    return names[level] || 'Unknown Level';
  };
  const levelName = getLevelName(difficultyLevel);

  const getScoreMessage = () => {
    if (percentage === 100) return 'Perfect route. Your mental map is locked in.';
    if (percentage >= 80) return 'Strong read. You earned a harder route.';
    if (percentage >= 60) return 'Solid instincts. A few routes need another look.';
    if (percentage >= 40) return 'You found some bearings. Try another pass.';
    return 'The map is still opening up. Start with the easier routes.';
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[#f5efe2] px-3 py-4 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-4xl">
        <section className="rounded-[1.25rem] border border-[#d8cdb9] bg-[#fffaf0] p-4 shadow-[0_16px_42px_rgba(23,32,42,0.10)] sm:rounded-[1.75rem] sm:p-8 sm:shadow-[0_24px_70px_rgba(23,32,42,0.12)]">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="rounded-2xl border border-[#d8cdb9] bg-[#17202a] p-5 text-[#fffaf0] sm:rounded-3xl sm:p-6">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#d8cdb9] sm:text-xs sm:tracking-[0.24em]">Route complete</p>
              <div className="mt-5 flex items-end gap-3 sm:mt-6">
                <span className="text-6xl font-black leading-none tracking-tight sm:text-7xl">{score}</span>
                <span className="pb-2 text-xl font-black text-[#d8cdb9] sm:text-2xl">/ {totalQuestions}</span>
              </div>
              <p className="mt-2 text-2xl font-black text-[#d7a05f] sm:text-3xl">{percentage}%</p>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#34424a]">
                <div
                  className="h-full rounded-full bg-[#d7a05f] transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d8cdb9] bg-[#f5efe2] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#55706f] sm:mb-4 sm:text-xs sm:tracking-[0.18em]">
                Level {difficultyLevel}: {levelName}
              </div>
              <h2 className="text-3xl font-black leading-tight tracking-tight text-[#17202a] sm:text-5xl">
                {getScoreMessage()}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66726d] sm:mt-4 sm:text-base sm:leading-7">
                Review each route below, then choose whether to stay with this level or push into the next set of questions.
              </p>
            </div>
          </div>

          {nextLevelAvailable && difficultyLevel! < 10 && (
            <div className="mt-6 rounded-2xl border border-[#a8c8b4] bg-[#eef7ef] p-4">
              <p className="text-lg font-black text-[#17202a]">Next level unlocked</p>
              <p className="mt-1 text-sm font-medium text-[#53625d]">
                Level {difficultyLevel! + 1}: {getLevelName(difficultyLevel! + 1)} is available.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="min-h-12 rounded-xl border border-[#d8cdb9] bg-white px-4 text-sm font-black text-[#17202a] transition hover:border-[#1e6964] disabled:text-[#9b9f98]"
                >
                  {loading ? 'Starting...' : `Stay at Level ${difficultyLevel}`}
                </button>
                <button
                  onClick={() => onStartLevel?.((difficultyLevel! + 1) as DifficultyLevel)}
                  disabled={loading}
                  className="min-h-12 rounded-xl bg-[#1e6964] px-4 text-sm font-black text-white transition hover:bg-[#244a52] disabled:bg-[#9b9f98]"
                >
                  {loading ? 'Starting...' : `Try Level ${difficultyLevel! + 1}`}
                </button>
              </div>
            </div>
          )}
          {!nextLevelAvailable && score < 8 && difficultyLevel! < 10 && (
            <div className="mt-6 rounded-2xl border border-[#d8cdb9] bg-[#f5efe2] p-4">
              <p className="mb-3 text-sm font-bold text-[#53625d]">Get 8 or more correct to unlock the next level.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {difficultyLevel! > 1 && (
                  <button
                    onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)}
                    disabled={loading}
                    className="min-h-12 rounded-xl border border-[#d8cdb9] bg-white px-4 text-sm font-black text-[#17202a] transition hover:border-[#1e6964] disabled:text-[#9b9f98]"
                  >
                    {loading ? 'Starting...' : `Go to Level ${difficultyLevel! - 1}`}
                  </button>
                )}
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="min-h-12 rounded-xl bg-[#17202a] px-4 text-sm font-black text-[#fffaf0] transition hover:bg-[#244a52] disabled:bg-[#9b9f98]"
                >
                  {loading ? 'Starting...' : `Try Level ${difficultyLevel} Again`}
                </button>
              </div>
            </div>
          )}
          {difficultyLevel === 10 && (
            <div className="mt-6 rounded-2xl border border-[#d7a05f] bg-[#fff5de] p-4">
              <p className="text-lg font-black text-[#17202a]">Top route reached</p>
              <p className="mt-1 text-sm font-medium text-[#53625d]">Level 10 is the full mixed-city challenge.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)}
                  disabled={loading}
                  className="min-h-12 rounded-xl border border-[#d8cdb9] bg-white px-4 text-sm font-black text-[#17202a] transition hover:border-[#1e6964] disabled:text-[#9b9f98]"
                >
                  {loading ? 'Starting...' : `Go to Level 9`}
                </button>
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="min-h-12 rounded-xl bg-[#17202a] px-4 text-sm font-black text-[#fffaf0] transition hover:bg-[#244a52] disabled:bg-[#9b9f98]"
                >
                  {loading ? 'Starting...' : `Try Level 10 Again`}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[1.25rem] border border-[#d8cdb9] bg-[#fffaf0] p-3.5 shadow-[0_14px_36px_rgba(23,32,42,0.07)] sm:mt-6 sm:rounded-[1.75rem] sm:p-6 sm:shadow-[0_18px_50px_rgba(23,32,42,0.08)]">
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-[#17202a]">
                Route Review
              </h3>
              <p className="mt-1 text-sm text-[#66726d]">Tap a route to show or hide its map.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center sm:w-48">
              <div className="rounded-xl border border-[#a8c8b4] bg-[#f7fbf4] px-3 py-2">
                <p className="text-xl font-black text-[#1e6964]">{score}</p>
                <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#53625d]">Correct</p>
              </div>
              <div className="rounded-xl border border-[#d9afa3] bg-[#fff6f1] px-3 py-2">
                <p className="text-xl font-black text-[#b95f4a]">{totalQuestions - score}</p>
                <p className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#53625d]">Missed</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {answers.map((answer, index) => {
              const question = questions[index];

              const calculateDistance = () => {
                if (!question) return null;
                const latDiff = Math.abs(question.city1.latitude - question.city2.latitude);
                const lonDiff = Math.abs(question.city1.longitude - question.city2.longitude);
                const latDiffKm = latDiff * 111.32;
                const lonDiffKm = lonDiff * 111.32;
                const latDiffMiles = latDiffKm * 0.621371;
                const lonDiffMiles = lonDiffKm * 0.621371;

                const nsDirection = question.city1.latitude > question.city2.latitude ? 'North' : 'South';
                const ewDirection = question.city1.longitude > question.city2.longitude ? 'East' : 'West';

                return (
                  <>
                    <div>
                      {latDiff.toFixed(2)}° ({latDiffKm.toFixed(1)} km / {latDiffMiles.toFixed(1)} mi) {nsDirection}
                    </div>
                    <div>
                      {lonDiff.toFixed(2)}° ({lonDiffKm.toFixed(1)} km / {lonDiffMiles.toFixed(1)} mi) {ewDirection}
                    </div>
                  </>
                );
              };

              return (
                <details
                  key={index}
                  className={`group rounded-2xl border p-3 transition open:shadow-md sm:p-4 ${
                    answer.isCorrect
                      ? 'border-[#a8c8b4] bg-[#f7fbf4]'
                      : 'border-[#d9afa3] bg-[#fff6f1]'
                  }`}
                >
                  <summary className="list-none cursor-pointer [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-xl font-black text-white ${answer.isCorrect ? 'bg-[#1e6964]' : 'bg-[#b95f4a]'}`}>
                        {answer.isCorrect ? '✓' : '✕'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 text-base font-black text-[#17202a] sm:mb-2 sm:text-lg">
                          Question {index + 1}: {answer.isCorrect ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <div className="space-y-1 text-sm leading-6 text-[#53625d]">
                          <p className="mb-1 font-semibold text-[#17202a] sm:mb-2">
                            {answer.questionText}
                          </p>
                          <p>
                            <span className="font-medium">Your answer:</span> <span className="font-black text-[#17202a]">{answer.userAnswer}</span>
                          </p>
                          {!answer.isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span> <span className="font-black text-[#1e6964]">{answer.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 rounded-xl border border-[#d8cdb9] bg-white/75 p-2.5 text-left text-xs leading-5 text-[#53625d] lg:text-right">
                      <div className="mb-1 font-black uppercase tracking-[0.14em] text-[#17202a]">Distance</div>
                      {calculateDistance()}
                    </div>
                  </div>
                    <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#55706f]">
                      <span className="group-open:hidden">Show map</span>
                      <span className="hidden group-open:inline">Hide map</span>
                    </div>
                  </summary>

                  {question && (
                    <div className="mt-3">
                      <MapView city1={question.city1} city2={question.city2} />
                    </div>
                  )}
                </details>
              );
            })}
          </div>
        </section>

        {onRetakeHome && (
          <button
            onClick={onRetakeHome}
            disabled={loading}
            className="mt-6 min-h-12 w-full rounded-xl bg-[#17202a] px-6 font-black text-[#fffaf0] transition hover:bg-[#244a52] disabled:bg-[#9b9f98]"
          >
            {loading ? 'Going home...' : 'Back to Home'}
          </button>
        )}
        {!onRetakeHome && onRetake && (
          <button
            onClick={onRetake}
            disabled={loading}
            className="mt-6 min-h-14 w-full rounded-xl bg-[#1e6964] px-6 text-lg font-black text-white transition hover:bg-[#244a52] disabled:bg-[#9b9f98]"
          >
            {loading ? 'Starting new quiz...' : 'Take Another Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
