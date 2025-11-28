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
  const percentage = Math.round((score / totalQuestions) * 100);

  const getLevelName = (level: number) => {
    const names: { [key: number]: string } = {
      1: 'Capital Foundations',
      2: 'Capital Challenge',
      3: 'Capital Precision',
      4: 'Global Capitals',
      5: 'Capital Extremes',
      6: 'Major Cities WW',
      7: 'City Expert',
      8: 'Geographic Precision',
      9: 'The Challenge',
      10: 'Random Extreme'
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-cyan-100">
        {/* Header */}
        <h2 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
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
            <div className="text-7xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-4xl font-bold text-cyan-600">{percentage}%</div>
          </div>
          <p className="text-xl text-gray-700 font-medium">{getScoreMessage()}</p>

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
          <div className="w-full bg-cyan-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 h-3 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Answer Breakdown
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {answers.map((answer, index) => {
              const question = questions[index];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 shadow-md transition-all hover:shadow-lg ${
                    answer.isCorrect
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-br from-rose-50 to-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        Question {index + 1}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        {answer.questionText}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Your answer:</span> <span className="font-bold text-gray-900">{answer.userAnswer}</span>
                        {!answer.isCorrect && (
                          <span className="block mt-1">
                            <span className="font-medium">Correct:</span> <span className="font-bold text-green-700">{answer.correctAnswer}</span>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shadow-md ${
                          answer.isCorrect
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-br from-rose-500 to-red-600 text-white'
                        }`}
                      >
                        {answer.isCorrect ? '✓' : '✕'}
                      </span>
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
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 transform disabled:scale-100 disabled:shadow-none"
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
