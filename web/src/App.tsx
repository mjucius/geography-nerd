import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { QuizContainer } from './components/QuizContainer';

type AppPage = 'home' | 'quiz';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
      <Navigation />

      <main>
        {currentPage === 'quiz' ? (
          <QuizContainer onComplete={() => setCurrentPage('home')} />
        ) : (
          <Home onStartQuiz={() => setCurrentPage('quiz')} />
        )}
      </main>
    </div>
  );
}

export default App;
