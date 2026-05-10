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
    if (question.type === 'latitudinal') {
      if (option === 'North') {
        return {
          label: 'North',
          marker: 'N',
          direction: 'Top of the map',
          accent: 'border-[#244a52] text-[#244a52]',
        };
      } else {
        return {
          label: 'South',
          marker: 'S',
          direction: 'Bottom of the map',
          accent: 'border-[#8a4f2b] text-[#8a4f2b]',
        };
      }
    } else {
      if (option === 'East') {
        return {
          label: 'East',
          marker: 'E',
          direction: 'Right on the map',
          accent: 'border-[#1e6964] text-[#1e6964]',
        };
      } else {
        return {
          label: 'West',
          marker: 'W',
          direction: 'Left on the map',
          accent: 'border-[#7a5a8a] text-[#7a5a8a]',
        };
      }
    }
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
  const progress = Math.round(((questionNumber - 1) / totalQuestions) * 100);

  return (
    <div className="w-full rounded-[1.25rem] border border-[#d8cdb9] bg-[#fffaf0] shadow-[0_16px_42px_rgba(23,32,42,0.10)] sm:rounded-[1.75rem] sm:shadow-[0_24px_70px_rgba(23,32,42,0.12)]">
      <div className="p-3.5 sm:p-7">
        <div className="mb-4">
          <div className="mb-3 flex items-start justify-between gap-3 sm:items-end sm:gap-4">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#55706f] sm:text-xs sm:tracking-[0.22em]">Question {questionNumber} of {totalQuestions}</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-[#17202a] sm:text-3xl">{progress}%</p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <span className="rounded-full border border-[#d8cdb9] bg-[#f5efe2] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#55706f] sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                Level {userDifficultyLevel}
              </span>
              {question.difficultyLevel > userDifficultyLevel && (
                <span className="rounded-full bg-[#c97938] px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-white sm:px-3 sm:text-xs sm:tracking-[0.16em]">
                  Challenge
                </span>
              )}
              <span className="rounded-full border border-[#d8cdb9] px-2.5 py-1 font-mono text-[0.68rem] font-bold text-[#55706f] sm:px-3 sm:text-xs">
                {questionNumber}/{totalQuestions}
              </span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e2d6c2]">
            <div
              className="h-2 rounded-full bg-[#1e6964] transition-all duration-500"
              style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4 rounded-2xl border border-[#d8cdb9] bg-[#f5efe2] p-3.5 sm:mb-6 sm:p-5">
          <div className="text-center text-lg font-bold leading-relaxed text-[#17202a] min-[390px]:text-xl sm:text-2xl">
            <QuestionText parts={question.questionTextParts} />
          </div>
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
                  className={`group min-h-[4.5rem] rounded-2xl border bg-white p-3 text-left transition sm:min-h-24 sm:p-4 ${
                    selected
                      ? lastAnswer?.isCorrect
                        ? 'border-[#1e6964] ring-4 ring-[#1e6964]/15'
                        : 'border-[#b95f4a] ring-4 ring-[#b95f4a]/15'
                      : 'border-[#d8cdb9] hover:-translate-y-0.5 hover:border-[#1e6964] hover:shadow-md'
                  } disabled:cursor-default`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 bg-[#f5efe2] font-mono text-lg font-black sm:h-12 sm:w-12 sm:text-xl ${config.accent}`}>
                      {config.marker}
                    </span>
                    <span>
                      <span className="block text-base font-black text-[#17202a] sm:text-lg">{config.label}</span>
                      <span className="mt-0.5 block text-xs font-medium text-[#66726d] sm:text-sm">{config.direction}</span>
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
