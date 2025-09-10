
import React, { useState, useEffect } from 'react';
import LoginCard from './components/LoginCard';
import RegistrationPage from './components/RegistrationPage';
import HomePage from './components/HomePage';
import ScratchcardsPage from './components/ScratchcardsPage';
import AddCreditsPage from './components/AddCreditsPage';
import Header from './components/shared/Header';
import MyAccountPage from './components/MyAccountPage';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <main className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center p-4 selection:bg-brand-pink/30">
       <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple via-slate-900 to-brand-pink opacity-30"></div>
          <div className="absolute top-0 left-0 h-1/2 w-1/2 rounded-full bg-brand-yellow/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-1/2 w-1/2 rounded-full bg-brand-green/10 blur-3xl"></div>
       </div>
       <div className="relative z-10 w-full">
         {children}
       </div>
    </main>
);


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
    }
  }, []);


  const showHome = () => setCurrentPage('home');
  const showLogin = () => setCurrentPage('login');
  const showRegister = () => setCurrentPage('register');
  const showScratchcards = () => setCurrentPage('scratchcards');
  const showAddCredits = () => setCurrentPage('addCredits');
  const showMyAccount = () => setCurrentPage('myAccount');

  const handleLogin = (data: { token: string; user: { name: string; credits: number } }) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    setIsLoggedIn(true);
    setUserName(data.user.name);
    setCredits(data.user.credits);
    showHome();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserName('');
    setCredits(0);
    showHome();
  };

  const navProps = {
    isLoggedIn,
    userName,
    credits,
    onNavigateToHome: showHome,
    onNavigateToLogin: showLogin,
    onNavigateToRegister: showRegister,
    onNavigateToScratchcards: showScratchcards,
    onNavigateToMyAccount: showMyAccount,
    onNavigateToAddCredits: showAddCredits,
    onLogout: handleLogout,
  };

  switch (currentPage) {
    case 'login':
      return (
        <>
          <Header {...navProps} />
          <AuthLayout>
            <LoginCard onNavigateToRegister={showRegister} onLogin={handleLogin} />
          </AuthLayout>
        </>
      );
    case 'register':
      return (
        <>
          <Header {...navProps} />
          <AuthLayout>
            <RegistrationPage onNavigateToLogin={showLogin} onRegister={handleLogin} />
          </AuthLayout>
        </>
      );
    case 'scratchcards':
        return <ScratchcardsPage {...navProps} credits={credits} setCredits={setCredits} />;
    case 'addCredits':
        return <AddCreditsPage {...navProps} setCredits={setCredits} />;
    case 'myAccount':
        return <MyAccountPage {...navProps} />;
    case 'home':
    default:
      return <HomePage {...navProps} />;
  }
};

export default App;
