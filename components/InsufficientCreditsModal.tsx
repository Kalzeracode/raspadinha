
import React from 'react';

const SadFaceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface InsufficientCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToAddCredits: () => void;
}

const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({ isOpen, onClose, onNavigateToAddCredits }) => {
    if (!isOpen) return null;

    const handleAddCredits = () => {
        onClose(); // Close this modal before navigating
        onNavigateToAddCredits();
    };

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md max-h-[90vh] flex flex-col text-center p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-center mb-4">
                    <SadFaceIcon />
                </div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-4">
                    Seus Créditos Acabaram!
                </h2>
                <p className="text-slate-300 mb-6">
                    Não desanime! Mesmo que a sorte não sorria agora, parte do valor de cada raspadinha é destinada a instituições de caridade. Você está sempre ajudando alguém a ganhar.
                </p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleAddCredits}
                        className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out"
                    >
                        Adicionar Créditos
                    </button>
                    <button 
                        onClick={onClose}
                        className="text-sm text-slate-400 hover:text-white"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InsufficientCreditsModal;
