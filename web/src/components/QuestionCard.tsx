import type { Question, UserAnswer, DifficultyLevel } from '../types';
import { MapView } from './MapView';
import { QuestionText } from './QuestionText';
import { formatOffset, getDistanceInfo } from '../services/distance';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  loading?: boolean;
  lastAnswer?: UserAnswer;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastQuestion?: boolean;
  userDifficultyLevel?: DifficultyLevel;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  loading = false,
  lastAnswer,
  onNext,
  onSubmit,
  isLastQuestion = false,
  userDifficultyLevel = 1,
}: QuestionCardProps) {
  const getOptionConfig = (option: string) => {
    const configs: Record<string, { marker: string; direction: string }> = {
      North: { marker: 'N', direction: 'Top of the map' },
      South: { marker: 'S', direction: 'Bottom of the map' },
      East: { marker: 'E', direction: 'Right on the map' },
      West: { marker: 'W', direction: 'Left on the map' },
    };
    return { label: option, ...configs[option] };
  };

  const { ns, ew } = getDistanceInfo(question.city1, question.city2);
  const isEastWest = question.type === 'longitudinal';

  return (
    <div className="w-full rounded-card border border-line bg-surface">
      <div className="p-4 sm:p-7">
        <div className="mb-5">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-ink">Question {questionNumber} of {totalQuestions}</p>
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              Level {userDifficultyLevel}
              {question.difficultyLevel > userDifficultyLevel && (
                <span className="rounded-full bg-amber px-2.5 py-0.5 text-xs font-semibold text-ink">
                  Challenge
                </span>
              )}
            </p>
          </div>
          <div
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin={0}
            aria-valuemax={totalQuestions}
            aria-valuenow={questionNumber}
            className="h-2 w-full overflow-hidden rounded-full bg-line"
          >
            <div
              className="h-2 rounded-full bg-teal transition-all duration-500"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-5 text-center font-display text-xl font-semibold leading-relaxed text-ink sm:mb-6 sm:text-2xl">
          <QuestionText parts={question.questionTextParts} />
        </div>

        <div className="mb-4 flex justify-center">
          <div className={isEastWest ? 'grid w-full grid-cols-1 gap-2 min-[390px]:grid-cols-2 sm:gap-3' : 'grid w-full max-w-sm grid-cols-1 gap-2 sm:gap-3'}>
            {(isEastWest
              ? ['West', 'East']
              : question.options
            ).map((option) => {
              const config = getOptionConfig(option);
              const selected = lastAnswer?.userAnswer === option;
              return (
                <button
                  key={option}
                  onClick={() => !loading && !lastAnswer && onAnswer(option)}
                  disabled={loading || !!lastAnswer}
                  className={`min-h-[4.5rem] rounded-card border-2 bg-paper p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal sm:min-h-24 sm:p-4 ${
                    selected
                      ? lastAnswer?.isCorrect
                        ? 'border-teal'
                        : 'border-clay'
                      : 'border-line enabled:hover:border-teal'
                  } disabled:cursor-default`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface font-mono text-lg font-bold text-teal-deep">
                      {config.marker}
                    </span>
                    <span>
                      <span className="block text-base font-bold text-ink sm:text-lg">{config.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{config.direction}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {lastAnswer && (
          <section aria-live="polite" className="border-t border-line pt-4">
            <div className="flex items-start gap-3">
              <div
                aria-hidden="true"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xl font-bold text-surface ${lastAnswer.isCorrect ? 'bg-teal' : 'bg-clay'}`}
              >
                {lastAnswer.isCorrect ? '✓' : '✕'}
              </div>
              <div className="flex-1 space-y-1 text-sm text-ink-soft">
                <h4 className="text-lg font-bold text-ink">
                  {lastAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <p>
                  Your answer: <span className="font-bold text-ink">{lastAnswer.userAnswer}</span>
                </p>
                {!lastAnswer.isCorrect && (
                  <p>
                    Correct answer: <span className="font-bold text-teal">{lastAnswer.correctAnswer}</span>
                  </p>
                )}
                <p>{formatOffset(ns, 'Same latitude')}</p>
                <p>{formatOffset(ew, 'Same longitude')}</p>
              </div>
            </div>

            <div className="mt-4">
              <MapView city1={question.city1} city2={question.city2} />
            </div>

            {!isLastQuestion && onNext && (
              <button
                type="button"
                onClick={onNext}
                className="mt-4 min-h-12 w-full rounded-control bg-teal px-6 font-bold text-surface transition hover:bg-teal-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Next Question
              </button>
            )}

            {isLastQuestion && onSubmit && (
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className="mt-4 min-h-12 w-full rounded-control bg-teal px-6 font-bold text-surface transition hover:bg-teal-deep disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                {loading ? 'Finishing...' : 'Complete Quiz'}
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
