import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { QuizContainer } from './components/QuizContainer';

type AppPage = 'home' | 'quiz';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
