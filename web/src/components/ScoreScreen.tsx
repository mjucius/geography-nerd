import type { UserAnswer, Question } from '../types';
import { MapView } from './MapView';

interface ScoreScreenProps {
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  questions: Question[];
  onRetake: () => void;
  loading?: boolean;
}

export function ScoreScreen({
  score,
  totalQuestions,
  answers,
  questions,
  onRetake,
  loading = false,
}: ScoreScreenProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

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

        {/* Score Display */}
        <div className="mb-10 text-center">
          <div className="mb-6">
            <div className="text-7xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-4xl font-bold text-cyan-600">{percentage}%</div>
          </div>
          <p className="text-xl text-gray-700 font-medium">{getScoreMessage()}</p>
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

        {/* Retake Button */}
        <button
          onClick={onRetake}
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold text-lg py-4 px-6 rounded-full transition-all duration-300 hover:shadow-2xl hover:scale-105 transform disabled:scale-100 disabled:shadow-none"
        >
          {loading ? 'Starting new quiz...' : 'Take Another Quiz 🚀'}
        </button>
      </div>
    </div>
  );
}
