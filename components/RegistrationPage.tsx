import React, { useState } from 'react';
import { register } from './apiService';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface RegistrationPageProps {
    onNavigateToLogin: () => void;
    onRegister: (data: { token: string, user: { name: string, credits: number } }) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onNavigateToLogin, onRegister }) => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.substring(0, 11);
        
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 5) {
            value = value.replace(/^(\d{2})(\d{4,5}).*/, '($1) $2');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2}).*/, '($1)');
        }
        setPhone(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Nota: O backend precisa ser ajustado para salvar fullName e phone.
            // A chamada atual envia apenas o que a API de registro espera.
            const data = await register({ fullName, phone, email, password });
            setSuccess(data.message || 'Usuário registrado com sucesso! Faça o login para continuar.');
        } catch (err: any) {
             setError(err.message || 'Falha ao tentar registrar.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-700">
            <div className="flex flex-col md:flex-row">
                {/* Left Column: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
                        Crie sua conta
                    </h1>

                    {success ? (
                        <div className="text-center">
                            <CheckIcon className="w-16 h-16 text-brand-green mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">Cadastro Realizado!</h2>
                            <p className="text-slate-300 mb-6">{success}</p>
                            <button
                                onClick={onNavigateToLogin}
                                className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg"
                            >
                                Ir para Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                            <div>
                                <label htmlFor="fullName" className="sr-only">Nome Completo</label>
                                <input id="fullName" name="fullName" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300" placeholder="Nome Completo" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="sr-only">Telefone</label>
                                <input id="phone" name="phone" type="tel" required value={phone} onChange={handlePhoneChange} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300" placeholder="Telefone (DDD)" />
                            </div>
                            <div>
                                <label htmlFor="reg-email" className="sr-only">Email</label>
                                <input id="reg-email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300" placeholder="Email" />
                            </div>
                            <div>
                                <label htmlFor="reg-password" className="sr-only">Senha</label>
                                <input id="reg-password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-brand-pink transition-all duration-300" placeholder="Senha" />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-yellow/50 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                                </button>
                            </div>
                        </form>
                    )}
                     <div className="mt-6 text-center text-sm">
                        <p className="text-slate-400">
                           Já tem conta?{' '}
                            <button onClick={onNavigateToLogin} className="font-medium text-brand-yellow hover:text-brand-pink underline transition-colors duration-300 bg-transparent border-none cursor-pointer p-0">
                                Faça Login
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Column: Benefits */}
                <div className="w-full md:w-1/2 p-8 md:p-10 bg-slate-900/50 flex flex-col justify-center">
                     <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-6">
                        Comece a ganhar ainda hoje!
                    </h2>
                     <div className="mt-4 space-y-4 text-slate-200 text-lg">
                        <p className="flex items-center gap-3">
                            <CheckIcon className="w-6 h-6 text-brand-green flex-shrink-0" />
                            <span>Cadastro rápido e fácil</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <CheckIcon className="w-6 h-6 text-brand-green flex-shrink-0" />
                            <span>Prêmios em dinheiro e produtos</span>
                        </p>
                         <p className="flex items-center gap-3">
                            <CheckIcon className="w-6 h-6 text-brand-green flex-shrink-0" />
                            <span>Ambiente 100% seguro e confiável</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;