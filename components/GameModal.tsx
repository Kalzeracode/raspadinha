
import React, { useState } from 'react';
import ScratchableCard from './ScratchableCard';

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ScratchcardData {
    id: number;
    name: string;
    cost: number;
}

interface GameModalProps {
    card: ScratchcardData;
    onClose: () => void;
}

const prizePool = ['R$ 50,00', 'R$ 10,00', 'R$ 5,00', 'Tente de Novo', 'Tente de Novo', 'Tente de Novo', 'R$ 100,00', '1 Jogo Grátis'];
const getRandomPrize = () => prizePool[Math.floor(Math.random() * prizePool.length)];

const GameModal: React.FC<GameModalProps> = ({ card, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink">
                        {card.name}
                    </h2>
                    <button onClick={onClose} aria-label="Fechar modal" className="text-slate-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 flex flex-col items-center justify-center">
                    <p className="text-slate-300 mb-4 text-center">Boa sorte! Raspe a área abaixo para revelar seu prêmio.</p>
                     <ScratchableCard key={card.id} prize={getRandomPrize()} />
                </div>

                <div className="p-4 border-t border-slate-700 text-center">
                    <button 
                        onClick={onClose}
                        className="text-sm text-brand-yellow hover:underline"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameModal;
