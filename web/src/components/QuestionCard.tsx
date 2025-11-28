import type { Question, UserAnswer } from '../types';
import { MapView } from './MapView';

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
}: QuestionCardProps) {
  const getOptionConfig = (option: string) => {
    if (question.type === 'latitudinal') {
      // North/South
      if (option === 'North') {
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          icon: '⬆️',
        };
      } else {
        return {
          bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
          icon: '⬇️',
        };
      }
    } else {
      // East/West
      if (option === 'East') {
        return {
          bg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          icon: '➡️',
        };
      } else {
        return {
          bg: 'bg-gradient-to-br from-rose-500 to-red-600',
          icon: '⬅️',
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

  return (
    <div className="w-full flex items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 border border-cyan-100">
        {/* Header with progress */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Question {questionNumber} of {totalQuestions}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mt-1">{Math.round(((questionNumber - 1) / totalQuestions) * 100)}%</p>
            </div>
            <span className="text-sm font-bold text-gray-500">
              {questionNumber}/{totalQuestions}
            </span>
          </div>
          <div className="w-full bg-cyan-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Box */}
        <div className="mb-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border-2 border-cyan-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 text-center leading-relaxed">
            {question.questionText}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="mb-4 flex justify-center">
          <div className={isEastWest ? 'flex gap-4 w-full' : 'flex flex-col gap-3 w-full max-w-xs'}>
            {(isEastWest
              ? ['West', 'East'] // Reverse order for East/West: West on left, East on right
              : question.options // Keep normal order for North/South
            ).map((option) => {
              const config = getOptionConfig(option);
              return (
                <div
                  key={option}
                  onClick={() => !loading && !lastAnswer && onAnswer(option)}
                  className={`cursor-pointer group relative rounded-2xl overflow-hidden transition-all duration-300 transform shadow-lg ${!loading && !lastAnswer ? 'hover:scale-105 hover:shadow-2xl' : 'opacity-50'} ${isEastWest ? 'flex-1 h-36' : 'h-24 w-full'}`}
                >
                  {/* Background with gradient */}
                  <div className={`absolute inset-0 ${config.bg} transition-all duration-300 ${!loading && !lastAnswer ? 'group-hover:brightness-110' : ''}`}></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center gap-1 p-4">
                    <div className="text-4xl drop-shadow-lg">{config.icon}</div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white drop-shadow-md">
                        {option}
                      </div>
                    </div>
                  </div>

                  {/* Selection border for answered */}
                  {lastAnswer?.userAnswer === option && (
                    <div className={`absolute inset-0 border-[6px] rounded-2xl pointer-events-none ${lastAnswer.isCorrect ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        {lastAnswer && (
          <div className={`rounded-2xl p-4 border-2 shadow-lg ${lastAnswer.isCorrect ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300'}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`text-3xl flex-shrink-0 ${lastAnswer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {lastAnswer.isCorrect ? '✓' : '✕'}
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-bold mb-2 ${lastAnswer.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                  {lastAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Your answer:</span> <span className="font-bold text-gray-900">{lastAnswer.userAnswer}</span>
                  </p>
                  {!lastAnswer.isCorrect && (
                    <p>
                      <span className="font-medium">Correct answer:</span> <span className="font-bold text-green-700">{lastAnswer.correctAnswer}</span>
                    </p>
                  )}
                  <div className="mt-2 pt-2 border-t border-gray-300 space-y-0.5 text-xs">
                    <div className="font-bold text-gray-800">Distance between cities:</div>
                    {getDirectionInfo()}
                  </div>
                </div>
              </div>
            </div>

            {/* Map showing the two cities */}
            <div className="mt-3">
              <MapView city1={question.city1} city2={question.city2} />
            </div>

            {/* Next/Submit Button */}
            {!isLastQuestion && onNext && (
              <div className="mt-4">
                <button
                  onClick={onNext}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  Next Question →
                </button>
              </div>
            )}

            {isLastQuestion && onSubmit && (
              <div className="mt-4">
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none"
                >
                  {loading ? 'Submitting...' : 'Complete Quiz ✓'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
