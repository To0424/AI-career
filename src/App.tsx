import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { userService } from './services/userService';
import { OnboardingModal } from './components/OnboardingModal';
import { HomePage } from './pages/HomePage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DSECalculatorPage } from './pages/DSECalculatorPage';
import { ChatbotPage } from './pages/ChatbotPage';
import type { User, DSEScores } from './lib/types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        await signInAnonymously();
      } else {
        setAuthUser(authUser);
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Auth error:', error);
      setIsLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.error('Auth error:', error);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setAuthUser(data.user);
        await loadUserProfile();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userProfile = await userService.getCurrentUser();

      if (!userProfile) {
        setShowOnboarding(true);
      } else {
        setUser(userProfile);
      }
    } catch (error) {
      console.error('Load user error:', error);
      setShowOnboarding(true);
    }

    setIsLoading(false);
  };

  const handleOnboardingComplete = async (
    userType: 'high_school' | 'uni_postgrad',
    dseScores?: DSEScores,
    discipline?: string
  ) => {
    if (!authUser) return;

    const newUser = await userService.createUser(
      authUser.email || `user-${authUser.id}@example.com`,
      userType,
      dseScores,
      discipline
    );

    if (newUser) {
      setUser(newUser);
      setShowOnboarding(false);
    }
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding || !user) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/job/:id" element={<JobDetailsPage user={user} />} />
        <Route path="/dashboard" element={<DashboardPage user={user} onUserUpdate={handleUserUpdate} />} />
        <Route path="/dse-calculator" element={<DSECalculatorPage />} />
        <Route path="/chatbot" element={<ChatbotPage userId={user.id} userType={user.user_type} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
