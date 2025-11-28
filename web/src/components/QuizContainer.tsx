import { useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { QuestionCard } from './QuestionCard';
import { ScoreScreen } from './ScoreScreen';

interface QuizContainerProps {
  onComplete?: () => void;
}

export function QuizContainer({ onComplete }: QuizContainerProps) {
  const {
    questions,
    currentQuestionIndex,
    answers,
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl shadow-lg max-w-md">
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
        onRetake={() => {
          startQuiz();
          onComplete?.();
        }}
        loading={loading}
      />
    );
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-700 text-lg font-medium">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const lastAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
  const hasAnsweredCurrent = lastAnswer !== undefined;

  return (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 min-h-screen">
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
      />
    </div>
  );
}
