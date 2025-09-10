import React from 'react';

interface DashboardContentProps {
    onNavigateToAddCredits: () => void;
    // Adicionando props para dados dinâmicos
    userName: string;
    credits: number;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ onNavigateToAddCredits, userName, credits }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-4">Painel Principal</h1>
            <p className="text-slate-400 mb-8">Olá, {userName}! Aqui está um resumo da sua atividade recente.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Saldo Atual */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-sm font-medium text-slate-400 mb-2">Saldo Atual</h2>
                    <p className="text-4xl font-bold text-brand-yellow">{credits} <span className="text-2xl">Créditos</span></p>
                </div>
                {/* Total Gasto no Mês */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-sm font-medium text-slate-400 mb-2">Total Gasto (Mês)</h2>
                    <p className="text-4xl font-bold text-slate-100">-- <span className="text-2xl">Créditos</span></p>
                </div>
                {/* Total de Prêmios Ganhos */}
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <h2 className="text-sm font-medium text-slate-400 mb-2">Total de Prêmios Ganhos</h2>
                    <p className="text-4xl font-bold text-slate-100">R$ --,--</p>
                </div>
            </div>

            <div>
                <button
                    onClick={onNavigateToAddCredits}
                    className="w-full md:w-auto bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-yellow/50"
                >
                    + Adicionar Créditos
                </button>
            </div>
        </div>
    );
};

export default DashboardContent;