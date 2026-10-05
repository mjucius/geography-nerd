import type { UserAnswer, Question, DifficultyLevel } from '../types';
import { useState } from 'react';
import { MapView } from './MapView';
import { formatOffset, getDistanceInfo } from '../services/distance';

const primaryButton =
  'min-h-12 w-full rounded-control bg-teal px-4 text-sm font-bold text-surface transition hover:bg-teal-deep disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';
const secondaryButton =
  'min-h-12 w-full rounded-control border border-line bg-surface px-4 text-sm font-bold text-ink transition hover:border-teal disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal';

interface RouteRowProps {
  index: number;
  answer: UserAnswer;
  question?: Question;
}

function RouteRow({ index, answer, question }: RouteRowProps) {
  const [open, setOpen] = useState(false);
  const distance = question && getDistanceInfo(question.city1, question.city2);

  return (
    <li>
      <details onToggle={(event) => setOpen(event.currentTarget.open)} className="group">
        <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal [&::-webkit-details-marker]:hidden">
          <span
            role="img"
            aria-label={answer.isCorrect ? 'Correct' : 'Incorrect'}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-base font-bold text-surface ${answer.isCorrect ? 'bg-teal' : 'bg-clay'}`}
          >
            {answer.isCorrect ? '✓' : '✕'}
          </span>
          <span className="min-w-0 flex-1 text-sm leading-6">
            <span className="block font-semibold text-ink">
              {index + 1}. {answer.questionText}
            </span>
            <span className="block text-ink-soft">
              Your answer: <span className="font-bold text-ink">{answer.userAnswer}</span>
              {!answer.isCorrect && (
                <>
                  {' · '}Correct: <span className="font-bold text-teal">{answer.correctAnswer}</span>
                </>
              )}
            </span>
          </span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-soft transition group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>

        {open && question && distance && (
          <div className="pb-4 pl-11 text-sm text-ink-soft">
            <p>{formatOffset(distance.ns, 'Same latitude')}</p>
            <p>{formatOffset(distance.ew, 'Same longitude')}</p>
            <div className="mt-3">
              <MapView city1={question.city1} city2={question.city2} />
            </div>
          </div>
        )}
      </details>
    </li>
  );
}

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
    <div className="px-3 py-4 sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-3xl space-y-4 sm:space-y-6">
        <section className="rounded-card border border-line bg-surface p-4 sm:p-8">
          <p className="text-sm font-semibold text-ink-soft">
            Level {difficultyLevel}: {levelName}
          </p>
          <div className="mt-2 flex items-baseline gap-2 font-display">
            <span className="text-6xl font-bold leading-none text-ink sm:text-7xl">{score}</span>
            <span className="text-2xl text-ink-soft">/ {totalQuestions}</span>
          </div>
          <div
            role="progressbar"
            aria-label="Score"
            aria-valuemin={0}
            aria-valuemax={totalQuestions}
            aria-valuenow={score}
            className="mt-4 h-2 overflow-hidden rounded-full bg-line"
          >
            <div className="h-full rounded-full bg-teal" style={{ width: `${percentage}%` }}></div>
          </div>
          <h2 className="mt-5 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            {getScoreMessage()}
          </h2>

          {nextLevelAvailable && difficultyLevel! < 10 && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-lg font-bold text-ink">Next level unlocked</p>
              <p className="mt-1 text-sm text-ink-soft">
                Level {difficultyLevel! + 1}: {getLevelName(difficultyLevel! + 1)} is available.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button onClick={() => onStartLevel?.(difficultyLevel!)} disabled={loading} className={secondaryButton}>
                  {loading ? 'Starting...' : `Stay at Level ${difficultyLevel}`}
                </button>
                <button onClick={() => onStartLevel?.((difficultyLevel! + 1) as DifficultyLevel)} disabled={loading} className={primaryButton}>
                  {loading ? 'Starting...' : `Try Level ${difficultyLevel! + 1}`}
                </button>
              </div>
            </div>
          )}
          {!nextLevelAvailable && score < 8 && difficultyLevel! < 10 && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="mb-3 text-sm font-semibold text-ink-soft">Get 8 or more correct to unlock the next level.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {difficultyLevel! > 1 && (
                  <button onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)} disabled={loading} className={secondaryButton}>
                    {loading ? 'Starting...' : `Go to Level ${difficultyLevel! - 1}`}
                  </button>
                )}
                <button onClick={() => onStartLevel?.(difficultyLevel!)} disabled={loading} className={primaryButton}>
                  {loading ? 'Starting...' : `Try Level ${difficultyLevel} Again`}
                </button>
              </div>
            </div>
          )}
          {difficultyLevel === 10 && (
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-lg font-bold text-ink">Top route reached</p>
              <p className="mt-1 text-sm text-ink-soft">Level 10 is the full mixed-city challenge.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)} disabled={loading} className={secondaryButton}>
                  {loading ? 'Starting...' : `Go to Level 9`}
                </button>
                <button onClick={() => onStartLevel?.(difficultyLevel!)} disabled={loading} className={primaryButton}>
                  {loading ? 'Starting...' : `Try Level 10 Again`}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-card border border-line bg-surface p-4 sm:p-6">
          <h3 className="text-2xl font-bold tracking-tight text-ink">Route Review</h3>
          <p className="mt-1 text-sm text-ink-soft">Tap a question to show its distance and map.</p>
          <ul className="mt-2 divide-y divide-line">
            {answers.map((answer, index) => (
              <RouteRow key={index} index={index} answer={answer} question={questions[index]} />
            ))}
          </ul>
        </section>

        {onRetakeHome && (
          <button onClick={onRetakeHome} disabled={loading} className={primaryButton}>
            {loading ? 'Going home...' : 'Back to Home'}
          </button>
        )}
        {!onRetakeHome && onRetake && (
          <button onClick={onRetake} disabled={loading} className={`${primaryButton} min-h-14 text-lg`}>
            {loading ? 'Starting new quiz...' : 'Take Another Quiz'}
          </button>
        )}
      </div>
    </div>
  );
}
