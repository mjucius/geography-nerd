import type { Question, UserAnswer, DifficultyLevel } from '../types';
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
    <div className="w-full bg-white rounded-3xl shadow-2xl border border-cyan-100">
      <div className="p-6">
        {/* Header with progress */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Question {questionNumber} of {totalQuestions}</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mt-1">{Math.round(((questionNumber - 1) / totalQuestions) * 100)}%</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                userDifficultyLevel! <= 3 ? 'bg-green-500' :
                userDifficultyLevel! <= 5 ? 'bg-blue-500' :
                userDifficultyLevel! <= 7 ? 'bg-orange-500' :
                'bg-red-500'
              }`}>
                Level {userDifficultyLevel}
              </span>
              {question.difficultyLevel > userDifficultyLevel && (
                <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-amber-500">
                  Challenge
                </span>
              )}
              <span className="text-sm font-bold text-gray-500">
                {questionNumber}/{totalQuestions}
              </span>
            </div>
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
          <div className={isEastWest ? 'flex gap-3 w-full' : 'flex flex-col gap-2 w-full max-w-xs'}>
            {(isEastWest
              ? ['West', 'East'] // Reverse order for East/West: West on left, East on right
              : question.options // Keep normal order for North/South
            ).map((option) => {
              const config = getOptionConfig(option);
              return (
                <div
                  key={option}
                  onClick={() => !loading && !lastAnswer && onAnswer(option)}
                  className={`cursor-pointer group relative rounded-xl overflow-hidden transition-all duration-300 transform shadow-md ${!loading && !lastAnswer ? 'hover:scale-105 hover:shadow-lg' : 'opacity-50'} ${isEastWest ? 'flex-1 h-20' : 'h-16 w-full'}`}
                >
                  {/* Background with gradient */}
                  <div className={`absolute inset-0 ${config.bg} transition-all duration-300 ${!loading && !lastAnswer ? 'group-hover:brightness-110' : ''}`}></div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center gap-0 p-2">
                    <div className="text-2xl drop-shadow-lg">{config.icon}</div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-white drop-shadow-md">
                        {option}
                      </div>
                    </div>
                  </div>

                  {/* Selection border for answered */}
                  {lastAnswer?.userAnswer === option && (
                    <div className={`absolute inset-0 border-[4px] rounded-xl pointer-events-none ${lastAnswer.isCorrect ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.6)]' : 'border-white shadow-[0_0_20px_rgba(255,255,255,0.6)]'}`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback Section */}
        {lastAnswer && (
          <div
            onClick={() => isLastQuestion ? (onSubmit && onSubmit()) : (!isLastQuestion && onNext && onNext())}
            className={`rounded-2xl p-4 border-2 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${lastAnswer.isCorrect ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100' : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300 hover:bg-gradient-to-br hover:from-rose-100 hover:to-red-100'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3 flex-1">
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
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-gray-700 flex-shrink-0 whitespace-nowrap pt-1">
                <div className="font-bold text-gray-800 mb-1">Distance:</div>
                {getDirectionInfo()}
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
