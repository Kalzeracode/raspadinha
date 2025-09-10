
import React, { useState } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';

// --- Icons ---
const PixIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.53,2.62a1,1,0,0,1,1,0l9.1,5.25a1,1,0,0,1,.5,1.24,1,1,0,0,1-1.24.5l-2.6-1.5V17a1,1,0,0,1-.5,1.24,1,1,0,0,1-1.24-.5L7.4,8.32,4.8,9.82V19.4a1,1,0,0,1-2,0V9.13a1,1,0,0,1,.5-1.24A1,1,0,0,1,4.54,8.4L11.53,2.62Zm-1.2,7.49,6.71,3.87a1,1,0,0,1,.5,1.24,1,1,0,0,1-1.24.5L8.58,11.85a1,1,0,0,1-.5-1.24A1,1,0,0,1,10.33,10.11Z" fill="currentColor"/></svg>;
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

interface AddCreditsPageProps {
    setCredits: React.Dispatch<React.SetStateAction<number>>;
    onNavigateToHome: () => void;
    isLoggedIn: boolean;
    userName: string;
    credits: number;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToScratchcards: () => void;
    onNavigateToMyAccount: () => void;
    onNavigateToAddCredits: () => void;
    onLogout: () => void;
}

const AddCreditsPage: React.FC<AddCreditsPageProps> = ({ setCredits, onNavigateToHome, ...headerProps }) => {
    const [amount, setAmount] = useState<number | string>(20);

    const quickAddValues = [10, 20, 50, 100];

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value === '' ? '' : parseInt(value, 10));
    };
    
    const handleQuickAdd = (value: number) => {
        const currentAmount = typeof amount === 'number' ? amount : 0;
        setAmount(currentAmount + value);
    };

    const handleDeposit = () => {
        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < 5) {
            alert('O depósito mínimo é de R$ 5,00.');
            return;
        }
        // Simulate adding credits
        setCredits(prev => prev + numericAmount);
        alert(`${numericAmount} créditos foram adicionados com sucesso!`);
        onNavigateToHome();
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <Header {...headerProps} onNavigateToHome={onNavigateToHome} />
            <main className="pt-16">
                 <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
                     <div className="w-full max-w-lg mx-auto bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-700 p-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-2">
                             Abasteça seus Créditos
                        </h1>
                        <p className="text-center text-slate-300 mb-8">
                            Cada R$ 1,00 depositado vale 1 Crédito para usar em qualquer raspadinha do site.
                        </p>

                        <div className="space-y-6">
                            {/* Amount Section */}
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-slate-400 mb-2">Valor do Depósito (R$)</label>
                                <div className="relative">
                                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">R$</span>
                                    <input 
                                        type="number" 
                                        id="amount" 
                                        value={amount}
                                        onChange={handleAmountChange}
                                        min="5"
                                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-3 text-white text-2xl font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="flex justify-center gap-2 mt-3">
                                    {quickAddValues.map(value => (
                                        <button key={value} onClick={() => handleQuickAdd(value)} className="bg-slate-700 hover:bg-slate-600 text-brand-yellow text-sm font-bold py-1 px-3 rounded-full transition-colors">
                                            + R$ {value}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-xs text-slate-500 mt-2">Depósito mínimo: R$ 5,00</p>
                            </div>
                            
                            {/* Payment Method Section */}
                             <div>
                                <h2 className="text-lg font-semibold text-center text-slate-200 mb-4">Escolha o Método de Pagamento</h2>
                                <div className="flex justify-center gap-4">
                                     <button className="flex flex-col items-center gap-2 p-4 w-32 border-2 border-brand-yellow rounded-lg bg-slate-900/50 text-brand-yellow">
                                        <PixIcon />
                                        <span>PIX</span>
                                     </button>
                                     <button className="flex flex-col items-center gap-2 p-4 w-32 border-2 border-slate-600 rounded-lg bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                                        <CardIcon />
                                        <span>Cartão</span>
                                     </button>
                                </div>
                             </div>

                             <div>
                                 <button
                                     onClick={handleDeposit}
                                     className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-yellow/50"
                                 >
                                     Continuar para o Pagamento
                                 </button>
                             </div>
                        </div>
                     </div>
                 </div>
            </main>
            <Footer />
        </div>
    );
};

export default AddCreditsPage;
