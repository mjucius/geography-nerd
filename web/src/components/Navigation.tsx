import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface NavigationProps {
  onLogout?: () => void;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
}

const LEVEL_NAMES: { [key: number]: string } = {
  1: 'Novice',
  2: 'Student',
  3: 'Traveler',
  4: 'Scholar',
  5: 'Professor',
  6: 'Expert',
  7: 'Navigator',
  8: 'Explorer',
  9: 'Geographer',
  10: 'Cartographer'
};

const LEVEL_COLORS: { [key: number]: string } = {
  1: 'bg-green-500',
  2: 'bg-green-500',
  3: 'bg-green-500',
  4: 'bg-blue-500',
  5: 'bg-blue-500',
  6: 'bg-orange-500',
  7: 'bg-orange-500',
  8: 'bg-red-500',
  9: 'bg-red-500',
  10: 'bg-purple-600'
};

export function Navigation({ onLogout, onLoginClick, onProfileClick }: NavigationProps) {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setCurrentLevel(null);
      return;
    }

    // Fetch initial level
    const fetchLevel = async () => {
      try {
        const { data } = await supabase
          .from('user_progress')
          .select('current_difficulty_level')
          .eq('user_id', user.id)
          .single();

        if (data) {
          setCurrentLevel(data.current_difficulty_level);
        } else {
          setCurrentLevel(1);
        }
      } catch {
        // User might not have completed a quiz yet
        setCurrentLevel(1);
      }
    };

    fetchLevel();

    // Subscribe to real-time changes to user_progress
    const subscription = supabase
      .channel(`user_progress:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new) {
            setCurrentLevel((payload.new as any).current_difficulty_level);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    setShowMenu(false);
    onLogout?.();
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-teal-700 to-cyan-600 border-b-2 border-cyan-500 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/GeographyNerd-Logo_200.png"
            alt="Geography Nerd"
            className="h-12 w-12 drop-shadow-lg"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-100 to-yellow-50 bg-clip-text text-transparent">
            Geography Nerd
          </h1>
        </div>

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Level Badge */}
            {currentLevel && (
              <div className={`${LEVEL_COLORS[currentLevel]} text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-md`}>
                <span>Level {currentLevel}</span>
                <span className="text-xs">({LEVEL_NAMES[currentLevel]})</span>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:text-yellow-200 font-medium flex items-center gap-2"
              >
                <span>{user.email}</span>
                <span className="text-lg">▼</span>
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onProfileClick?.();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="text-white hover:text-yellow-200 font-medium transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
