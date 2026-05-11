import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { QuizContainer } from './components/QuizContainer';

type AppPage = 'home' | 'quiz';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  return (
    <div className="flex min-h-screen flex-col bg-[#f5efe2] text-[#17202a]">
      <Navigation onHomeClick={() => setCurrentPage('home')} />

      <main className="flex-1">
        {currentPage === 'quiz' ? (
          <QuizContainer
            onComplete={() => setCurrentPage('home')}
          />
        ) : (
          <Home onStartQuiz={() => setCurrentPage('quiz')} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
