import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Header from './shared/Header';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface LoginPageProps {
    currentPage: string;
    setCurrentPage: (page: any) => void;
    user: any;
    handleRoleBasedRedirect: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentPage, handleRoleBasedRedirect }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(email, password);
            handleRoleBasedRedirect();
        } catch (err: any) {
            setError(err.message || 'Falha ao tentar fazer login.');
        } finally {
            setIsLoading(false);
        }
    };

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

    return (
        <>
            <Header currentPage="login" setCurrentPage={setCurrentPage} user={null} />
            <AuthLayout>
                <div className="w-full max-w-md mx-auto bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-700">
                    <div className="p-8 md:p-10">
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-2">
                                Bem-vindo(a) de volta!
                            </h1>
                            <div className="mt-4 space-y-2 text-slate-300">
                                <p className="flex items-center justify-center gap-2">
                                    <CheckIcon className="w-5 h-5 text-brand-green" />
                                    <span>Prêmios instantâneos</span>
                                </p>
                                <p className="flex items-center justify-center gap-2">
                                    <CheckIcon className="w-5 h-5 text-brand-green" />
                                    <span>Diversão garantida</span>
                                </p>
                                 <p className="flex items-center justify-center gap-2">
                                    <CheckIcon className="w-5 h-5 text-brand-green" />
                                    <span>Novos jogos toda semana</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-center text-slate-200">Acesse sua conta</h2>
                            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                                {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                                <div>
                                    <label htmlFor="email" className="sr-only">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300"
                                        placeholder="Email"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="sr-only">Senha</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300"
                                        placeholder="Senha"
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Entrando...' : 'Entrar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 px-8 py-4 text-center text-sm">
                        <p className="text-slate-400">
                            Ainda não tem conta?{' '}
                            <button onClick={() => setCurrentPage('register')} className="font-medium text-brand-yellow hover:text-brand-pink underline transition-colors duration-300 bg-transparent border-none cursor-pointer p-0">
                                Cadastre-se
                            </button>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export default LoginPage;