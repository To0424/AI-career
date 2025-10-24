import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { storage } from './lib/demoData';
import { LandingPage } from './pages/LandingPage';
import { HighSchoolHomePage } from './pages/HighSchoolHomePage';
import { UniversityHomePage } from './pages/UniversityHomePage';
import { AvailablePositionsPage } from './pages/AvailablePositionsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DSECalculatorPage } from './pages/DSECalculatorPage';
import { ChatbotPage } from './pages/ChatbotPage';
import type { User } from './lib/types';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  // Re-check auth when location changes (to pick up newly created users)
  useEffect(() => {
    if (location.pathname === '/home') {
      // Small delay to ensure storage operations are complete
      setTimeout(() => {
        checkAuth();
      }, 150);
    }
  }, [location.pathname]);

  const checkAuth = () => {
    try {
      const users = storage.getUsers();
      const currentUser = users.length > 0 ? users[0] : null; // Get the first (and should be only) user
      console.log('All users:', users);
      console.log('Selected user:', currentUser);
      console.log('User type:', currentUser?.user_type);
      setUser(currentUser);
    } catch (error) {
      console.error('Auth error:', error);
    }
    
    setIsLoading(false);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    const users = storage.getUsers();
    const index = users.findIndex((u: User) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storage.saveUsers(users);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dse-calculator" element={<DSECalculatorPage />} />
          <Route 
            path="/home" 
            element={
              user ? (
                (() => {
                  console.log('Routing user:', user);
                  console.log('User type for routing:', user.user_type);
                  if (user.user_type === 'high_school') {
                    console.log('Routing to HighSchoolHomePage');
                    return <HighSchoolHomePage user={user} />;
                  } else {
                    console.log('Routing to UniversityHomePage');
                    return <UniversityHomePage user={user} />;
                  }
                })()
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/available-positions" 
            element={
              user ? (
                <AvailablePositionsPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/job/:id" 
            element={
              user ? (
                <JobDetailsPage user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <DashboardPage user={user} onUserUpdate={handleUserUpdate} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              user ? (
                <ChatbotPage userId={user.id} userType={user.user_type} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
