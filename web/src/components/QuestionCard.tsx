import type { Question, UserAnswer, DifficultyLevel } from '../types';
import { MapView } from './MapView';
import { QuestionText } from './QuestionText';

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

  const calculateDistance = () => {
    const latDiff = Math.abs(question.city1.latitude - question.city2.latitude);
    const lonDiff = Math.abs(question.city1.longitude - question.city2.longitude);

    // Convert degrees to kilometers (1 degree ≈ 111.32 km)
    const latDiffKm = latDiff * 111.32;
    const lonDiffKm = lonDiff * 111.32;

    // Convert to miles (1 km ≈ 0.621371 miles)
    const latDiffMiles = latDiffKm * 0.621371;
    const lonDiffMiles = lonDiffKm * 0.621371;

    return {
      latDiff,
      lonDiff,
      latDiffKm,
      lonDiffKm,
      latDiffMiles,
      lonDiffMiles
    };
  };

  const getDirectionInfo = () => {
    const { latDiff, lonDiff, latDiffKm, lonDiffKm, latDiffMiles, lonDiffMiles } = calculateDistance();

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
          <div
            onClick={() => isLastQuestion ? (onSubmit && onSubmit()) : (!isLastQuestion && onNext && onNext())}
            className={`cursor-pointer rounded-2xl border p-3 transition hover:shadow-md sm:p-4 ${
              lastAnswer.isCorrect
                ? 'border-[#a8c8b4] bg-[#eef7ef]'
                : 'border-[#d9afa3] bg-[#fff1ec]'
            }`}
          >
            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-1 items-start gap-3">
                <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-xl font-black ${lastAnswer.isCorrect ? 'bg-[#1e6964] text-white' : 'bg-[#b95f4a] text-white'}`}>
                  {lastAnswer.isCorrect ? '✓' : '✕'}
                </div>
                <div className="flex-1">
                  <h4 className="mb-2 text-lg font-black text-[#17202a]">
                    {lastAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  <div className="space-y-1 text-sm text-[#53625d]">
                    <p>
                      <span className="font-semibold">Your answer:</span> <span className="font-black text-[#17202a]">{lastAnswer.userAnswer}</span>
                    </p>
                    {!lastAnswer.isCorrect && (
                      <p>
                        <span className="font-semibold">Correct answer:</span> <span className="font-black text-[#1e6964]">{lastAnswer.correctAnswer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-[#d8cdb9] bg-white/70 p-2.5 text-left text-xs leading-5 text-[#53625d] md:text-right">
                <div className="mb-1 font-black uppercase tracking-[0.14em] text-[#17202a]">Distance</div>
                {getDirectionInfo()}
              </div>
            </div>

            <div className="mt-3">
              <MapView city1={question.city1} city2={question.city2} />
            </div>

            {!isLastQuestion && onNext && (
              <div className="mt-4">
                <button
                  onClick={onNext}
                  className="min-h-12 w-full rounded-xl bg-[#17202a] px-6 font-black text-[#fffaf0] transition hover:bg-[#244a52] focus:outline-none focus:ring-4 focus:ring-[#1e6964]/25"
                >
                  Next Question
                </button>
              </div>
            )}

            {isLastQuestion && onSubmit && (
              <div className="mt-4">
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="min-h-12 w-full rounded-xl bg-[#1e6964] px-6 font-black text-white transition hover:bg-[#244a52] disabled:bg-[#9b9f98] focus:outline-none focus:ring-4 focus:ring-[#1e6964]/25"
                >
                  {loading ? 'Finishing...' : 'Complete Quiz'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
