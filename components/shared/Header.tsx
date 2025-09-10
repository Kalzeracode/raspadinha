
import React, { useState, useEffect, useRef } from 'react';

// --- Icons ---
const MenuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


interface HeaderProps {
    isLoggedIn: boolean;
    userName: string;
    credits: number;
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToScratchcards: () => void;
    onNavigateToMyAccount: () => void;
    onNavigateToAddCredits: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userName, credits, onNavigateToHome, onNavigateToLogin, onNavigateToRegister, onNavigateToScratchcards, onNavigateToMyAccount, onNavigateToAddCredits, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleNav = (navFunc: () => void) => {
        navFunc();
        setIsMenuOpen(false);
    }
    
    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userMenuRef]);


    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/70 backdrop-blur-lg border-b border-slate-800">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <button onClick={() => handleNav(onNavigateToHome)} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink">
                            Raspadinhas
                        </button>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => handleNav(onNavigateToHome)} className="text-slate-300 hover:text-brand-yellow transition-colors duration-200">Início</button>
                        <button onClick={() => handleNav(onNavigateToScratchcards)} className="text-slate-300 hover:text-brand-yellow transition-colors duration-200">Raspadinhas</button>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                       {isLoggedIn ? (
                           <div className="flex items-center space-x-4">
                               <span className="text-slate-300">Olá, {userName}!</span>
                               <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-brand-yellow font-semibold">
                                  <CoinIcon className="w-5 h-5" />
                                  <span>{credits}</span>
                               </div>
                               <button onClick={() => handleNav(onNavigateToAddCredits)} className="text-slate-900 bg-brand-yellow font-bold px-3 py-1.5 rounded-lg shadow hover:opacity-90 transition-opacity duration-200 text-sm">
                                  + Adicionar Créditos
                               </button>
                               <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="text-slate-300 hover:text-white transition-colors duration-200">
                                       <UserIcon className="w-6 h-6" />
                                    </button>
                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1">
                                            <button 
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    handleNav(onNavigateToMyAccount);
                                                }}
                                                className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                                            >
                                                Minha Conta
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    onLogout();
                                                }} 
                                                className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
                                            >
                                                Sair
                                            </button>
                                        </div>
                                    )}
                               </div>
                           </div>
                       ) : (
                           <>
                                <button onClick={() => handleNav(onNavigateToLogin)} className="text-slate-300 hover:text-white px-4 py-2 rounded-md transition-colors duration-200">
                                    Entrar
                                </button>
                                <button onClick={() => handleNav(onNavigateToRegister)} className="bg-gradient-to-r from-brand-pink to-brand-yellow text-white font-bold px-4 py-2 rounded-lg shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-300">
                                    Registrar
                                </button>
                           </>
                       )}
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="text-white">
                           {isMenuOpen ? <XIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        <button onClick={() => handleNav(onNavigateToHome)} className="block w-full text-left text-slate-300 hover:text-brand-yellow transition-colors duration-200 px-2 py-1">Início</button>
                        <button onClick={() => handleNav(onNavigateToScratchcards)} className="block w-full text-left text-slate-300 hover:text-brand-yellow transition-colors duration-200 px-2 py-1">Raspadinhas</button>
                        <div className="border-t border-slate-700 pt-2">
                         {isLoggedIn ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-slate-300 px-2">
                                   <span>Olá, {userName}!</span>
                                   <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-brand-yellow font-semibold text-sm">
                                       <CoinIcon className="w-4 h-4" />
                                       <span>{credits} Créditos</span>
                                   </div>
                                </div>
                                <button onClick={() => handleNav(onNavigateToMyAccount)} className="block w-full text-left text-slate-300 hover:bg-slate-700 px-2 py-2 rounded-md">Minha Conta</button>
                                <button onClick={() => handleNav(onNavigateToAddCredits)} className="block w-full text-center text-slate-900 bg-brand-yellow font-bold px-3 py-2 rounded-lg shadow-lg">
                                   + Adicionar Créditos
                                </button>
                                 <button 
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        onLogout();
                                    }} 
                                    className="block w-full text-left text-slate-300 hover:bg-slate-700 px-2 py-2 rounded-md"
                                >
                                    Sair
                                </button>
                            </div>
                         ) : (
                             <div className="space-y-2">
                                 <button onClick={() => handleNav(onNavigateToLogin)} className="block w-full text-left text-slate-300 hover:text-white px-2 py-2 rounded-md transition-colors duration-200">
                                     Entrar
                                 </button>
                                 <button onClick={() => handleNav(onNavigateToRegister)} className="block w-full text-left bg-gradient-to-r from-brand-pink to-brand-yellow text-white font-bold px-3 py-2 rounded-lg shadow-lg">
                                     Registrar
                                 </button>
                             </div>
                         )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
