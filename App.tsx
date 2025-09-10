
import React, { useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import HomePage from './components/HomePage';
import ScratchcardsPage from './components/ScratchcardsPage';
import AddCreditsPage from './components/AddCreditsPage';
import MyAccountPage from './components/MyAccountPage';
import AdminDashboard from './components/AdminDashboard';
import InfluencerDashboard from './components/InfluencerDashboard';
import { useAuth } from './components/AuthContext';

type Page = 'home' | 'login' | 'register' | 'scratchcards' | 'addCredits' | 'myAccount' | 'admin' | 'influencer';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'register' | 'scratchcards' | 'addCredits' | 'myAccount'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [credits, setCredits] = useState(0);

  // Efeito para verificar o token no carregamento da página
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      const parsedUserData = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(parsedUserData.name);
      setCredits(parsedUserData.credits);
  const navigationProps = {
    currentPage,
    setCurrentPage,
    user,
    handleRoleBasedRedirect
  };

  switch (currentPage) {
    case 'admin':
      if (user?.role !== 'admin') {
        setCurrentPage('home');
        return null;
      }
      return <AdminDashboard {...navigationProps} />;
      
    case 'influencer':
      if (user?.role !== 'influencer') {
        setCurrentPage('home');
        return null;
      }
      return <InfluencerDashboard {...navigationProps} />;
      
    case 'login':
      return <LoginPage {...navigationProps} />;
      
    case 'register':
      return <RegistrationPage {...navigationProps} />;
      
    case 'scratchcards':
      return <ScratchcardsPage {...navigationProps} />;
      
    case 'addCredits':
      return <AddCreditsPage {...navigationProps} />;
      
    case 'myAccount':
      return <MyAccountPage {...navigationProps} />;
      
    case 'home':
    default:
      return <HomePage {...navigationProps} />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
