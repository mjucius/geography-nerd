import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { QuizContainer } from './components/QuizContainer';

type AppPage = 'home' | 'quiz';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  return (
    <div className="min-h-screen bg-[#f5efe2] text-[#17202a]">
      <Navigation onHomeClick={() => setCurrentPage('home')} />

      <main>
        {currentPage === 'quiz' ? (
          <QuizContainer
            onComplete={() => setCurrentPage('home')}
          />
        ) : (
          <Home onStartQuiz={() => setCurrentPage('quiz')} />
        )}
      </main>
    </div>
  );
}

export default App;
