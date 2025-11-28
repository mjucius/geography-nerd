import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useQuiz } from '../hooks/useQuiz';
import { QuestionCard } from './QuestionCard';
import { ScoreScreen } from './ScoreScreen';

interface QuizContainerProps {
  onComplete?: () => void;
  onSavePrompt?: () => void;
}

export function QuizContainer({ onComplete, onSavePrompt }: QuizContainerProps) {
  const { user } = useAuth();
  const {
    questions,
    currentQuestionIndex,
    answers,
    difficultyLevel,
    nextLevelAvailable,
    loading,
    error,
    quizCompleted,
    startQuiz,
    answerQuestion,
    nextQuestion,
    submitQuiz,
    getScore,
  } = useQuiz();

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-300 border-t-yellow-50 mx-auto mb-4"></div>
          <p className="text-yellow-50 text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
        <div className="bg-red-900 border-2 border-red-500 text-red-100 px-6 py-4 rounded-xl shadow-lg max-w-md">
          <p className="font-bold text-lg mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <ScoreScreen
        score={getScore()}
        totalQuestions={questions.length}
        answers={answers}
        questions={questions}
        difficultyLevel={difficultyLevel}
        nextLevelAvailable={nextLevelAvailable}
        onStartLevel={(level) => startQuiz(level)}
        onRetakeHome={() => {
          startQuiz();
          onComplete?.();
        }}
        loading={loading}
        onSaveProgress={onSavePrompt}
        isLoggedIn={!!user}
      />
    );
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
        <div className="text-center">
          <p className="text-yellow-50 text-lg font-medium">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const lastAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
  const hasAnsweredCurrent = lastAnswer !== undefined;

  return (
    <div className="bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600 min-h-screen">
      {/* Question Panel at Top */}
      <div className="flex justify-center px-4 pt-6 pb-6">
        <div className="w-full max-w-2xl">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            lastAnswer={lastAnswer}
            onAnswer={(answer) => {
              answerQuestion(answer);
            }}
            loading={loading}
            onNext={hasAnsweredCurrent && !isLastQuestion ? () => nextQuestion() : undefined}
            onSubmit={hasAnsweredCurrent && isLastQuestion ? () => submitQuiz() : undefined}
            isLastQuestion={isLastQuestion}
            userDifficultyLevel={difficultyLevel}
          />
        </div>
      </div>
    </div>
  );
}
