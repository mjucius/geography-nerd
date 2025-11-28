import type { UserAnswer, Question, DifficultyLevel } from '../types';
import { MapView } from './MapView';
import { AdSense } from './AdSense';

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

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect score! You're a geography expert! 🏆";
    if (percentage >= 80) return 'Excellent! You know your geography! 🎯';
    if (percentage >= 60) return 'Good job! Keep practicing! 👍';
    if (percentage >= 40) return 'Not bad! Try again to improve! 💪';
    return 'Keep learning! You\'ll do better next time! 📚';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl p-10 border border-teal-500">
        {/* Header */}
        <h2 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-100 to-yellow-50 bg-clip-text text-transparent">
          Quiz Complete!
        </h2>

        {/* Difficulty Level Badge */}
        <div className="mb-6 text-center">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white ${
            difficultyLevel! <= 3 ? 'bg-green-500' :
            difficultyLevel! <= 5 ? 'bg-blue-500' :
            difficultyLevel! <= 7 ? 'bg-orange-500' :
            'bg-red-500'
          }`}>
            Level {difficultyLevel}: {getLevelName(difficultyLevel!)}
          </span>
        </div>

        {/* Score Display */}
        <div className="mb-10 text-center">
          <div className="mb-6">
            <div className="text-7xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 bg-clip-text text-transparent mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-4xl font-bold text-cyan-400">{percentage}%</div>
          </div>
          <p className="text-xl text-yellow-100 font-medium">{getScoreMessage()}</p>

          {/* Level Progression Message */}
          {nextLevelAvailable && difficultyLevel! < 10 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-400 rounded-xl">
              <p className="text-lg font-bold text-cyan-700">🎉 Level Up! 🎉</p>
              <p className="text-sm text-cyan-600 mt-1">
                You've unlocked Level {difficultyLevel! + 1}: {getLevelName(difficultyLevel! + 1)}!
              </p>
              <p className="text-xs text-cyan-600 mt-2">Choose what to play next:</p>

              {/* Level Selection Buttons */}
              <div className="mt-4 space-y-2">
                {/* Current Level Button */}
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                >
                  {loading ? 'Starting...' : `📌 Stay at Level ${difficultyLevel}`}
                </button>

                {/* Next Level Button */}
                <button
                  onClick={() => onStartLevel?.((difficultyLevel! + 1) as DifficultyLevel)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                >
                  {loading ? 'Starting...' : `⬆️ Try Level ${difficultyLevel! + 1}: ${getLevelName(difficultyLevel! + 1)}`}
                </button>
              </div>
            </div>
          )}
          {!nextLevelAvailable && score < 8 && difficultyLevel! < 10 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-400 rounded-xl">
              <p className="text-sm text-blue-700 font-bold mb-3">Get 8 or more correct to unlock the next level. Choose your next level:</p>

              {/* Level Selection Buttons */}
              <div className="space-y-2">
                {/* Previous Level Button (if available) */}
                {difficultyLevel! > 1 && (
                  <button
                    onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                  >
                    {loading ? 'Starting...' : `⬇️ Go to Level ${difficultyLevel! - 1}: ${getLevelName(difficultyLevel! - 1)}`}
                  </button>
                )}

                {/* Current Level Button */}
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                >
                  {loading ? 'Starting...' : `🔄 Try Again at Level ${difficultyLevel}`}
                </button>
              </div>
            </div>
          )}
          {difficultyLevel === 10 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-400 rounded-xl">
              <p className="text-lg font-bold text-red-700">🏆 You've Reached the Peak! 🏆</p>
              <p className="text-sm text-red-600 mt-1">
                You're at Level 10: Random Extreme - the ultimate challenge!
              </p>
              <p className="text-xs text-red-600 mt-2">Choose your next move:</p>

              {/* Level Selection Buttons */}
              <div className="mt-4 space-y-2">
                {/* Go Back Button */}
                <button
                  onClick={() => onStartLevel?.((difficultyLevel! - 1) as DifficultyLevel)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                >
                  {loading ? 'Starting...' : `⬇️ Go to Level 9: ${getLevelName(9)}`}
                </button>

                {/* Retry Button */}
                <button
                  onClick={() => onStartLevel?.(difficultyLevel!)}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none text-sm"
                >
                  {loading ? 'Starting...' : `🔄 Try Again at Level 10`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-cyan-400 h-3 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-yellow-50 mb-6">
            Answer Breakdown
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
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
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 shadow-md transition-all hover:shadow-lg ${
                    answer.isCorrect
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`text-3xl flex-shrink-0 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {answer.isCorrect ? '✓' : '✕'}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-lg font-bold mb-2 ${answer.isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                          Question {index + 1}: {answer.isCorrect ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="text-gray-800 font-medium mb-2">
                            {answer.questionText}
                          </p>
                          <p>
                            <span className="font-medium">Your answer:</span> <span className="font-bold text-gray-900">{answer.userAnswer}</span>
                          </p>
                          {!answer.isCorrect && (
                            <p>
                              <span className="font-medium">Correct answer:</span> <span className="font-bold text-green-700">{answer.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-700 flex-shrink-0 whitespace-nowrap pt-1">
                      <div className="font-bold text-gray-800 mb-1">Distance:</div>
                      {calculateDistance()}
                    </div>
                  </div>

                  {/* Map showing the two cities */}
                  {question && (
                    <div className="mt-3">
                      <MapView city1={question.city1} city2={question.city2} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ad Space */}
        <div className="my-10">
          <AdSense slot="1234567890" format="auto" responsive={true} />
        </div>

        {/* Retake Home Button */}
        {onRetakeHome && (
          <button
            onClick={onRetakeHome}
            disabled={loading}
            className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none"
          >
            {loading ? 'Going to home...' : '← Back to Home'}
          </button>
        )}
        {!onRetakeHome && onRetake && (
          <button
            onClick={onRetake}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg py-4 px-6 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105 transform disabled:scale-100 disabled:shadow-none"
          >
            {loading ? 'Starting new quiz...' : 'Take Another Quiz 🚀'}
          </button>
        )}
      </div>
    </div>
  );
}
