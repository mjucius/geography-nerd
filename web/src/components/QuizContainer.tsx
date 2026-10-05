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

  // Open at the top, and reset after a long reveal when the next question appears.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  if (loading && questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-line border-t-teal"></div>
          <p className="text-lg font-bold text-ink">Plotting your route...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="max-w-md rounded-card border border-clay bg-surface px-6 py-4 text-ink">
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
      />
    );
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-ink">No questions available</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const lastAnswer = answers.find(a => a.questionIndex === currentQuestionIndex);
  const hasAnsweredCurrent = lastAnswer !== undefined;

  return (
    <div>
      <div className="flex justify-center px-3 py-4 sm:px-4 sm:py-10">
        <div className="w-full max-w-3xl">
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
