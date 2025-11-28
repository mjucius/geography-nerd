import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { QuizContainer } from './components/QuizContainer';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';

type AppPage = 'home' | 'quiz' | 'profile';
type AuthPage = 'login' | 'signup' | null;

function App() {
  const { loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [authPage, setAuthPage] = useState<AuthPage>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show auth modal if auth page is active
  if (authPage) {
    return authPage === 'login' ? (
      <Login
        onSwitchToSignUp={() => setAuthPage('signup')}
        onLoginSuccess={() => {
          setAuthPage(null);
          setCurrentPage('home');
        }}
        onClose={() => setAuthPage(null)}
      />
    ) : (
      <SignUp
        onSwitchToLogin={() => setAuthPage('login')}
        onSignUpSuccess={() => setAuthPage(null)}
        onClose={() => setAuthPage(null)}
      />
    );
  }

  // Main app - always accessible, auth optional
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-teal-700 to-cyan-600">
      <Navigation
        onLogout={() => setCurrentPage('home')}
        onLoginClick={() => setAuthPage('login')}
        onProfileClick={() => setCurrentPage('profile')}
      />

      <main>
        {currentPage === 'quiz' ? (
          <QuizContainer
            onComplete={() => setCurrentPage('home')}
            onSavePrompt={() => setAuthPage('signup')}
          />
        ) : currentPage === 'profile' ? (
          <Profile onBack={() => setCurrentPage('home')} />
        ) : (
          <Home onStartQuiz={() => setCurrentPage('quiz')} />
        )}
      </main>
    </div>
  );
}

export default App;
