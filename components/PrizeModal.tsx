
import React, { useState } from 'react';

// --- Icons ---
const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

// --- Reusable Components ---
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-600">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-3 px-1"
                aria-expanded={isOpen}
            >
                <span className="text-base font-medium text-slate-200">{question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-1 pb-3 text-slate-400">
                    {answer}
                </p>
            </div>
        </div>
    );
};

// --- Main PrizeModal Component ---
interface Prize {
    title: string;
    image: string;
    details: string;
    faq: { q: string; a: string }[];
}

interface PrizeModalProps {
    prize: Prize;
    onClose: () => void;
    onNavigateToScratchcards: () => void;
}

// Este componente fornece a estrutura HTML e CSS para o modal de detalhes do prêmio genérico.
// É estilizado com Tailwind CSS e é exibido ou oculto por seu componente pai.
const PrizeModal: React.FC<PrizeModalProps> = ({ prize, onClose, onNavigateToScratchcards }) => {
    return (
        // O fundo semi-transparente que cobre a tela
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose} // O modal fecha se o usuário clicar fora da caixa de conteúdo
        >
            {/* A caixa de conteúdo principal do modal com uma sombra para se destacar */}
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Impede que o modal feche ao clicar dentro do conteúdo
            >
                {/* Cabeçalho com Título e Botão de Fechar */}
                <div className="flex-shrink-0 flex items-start justify-between p-4 border-b border-slate-700">
                    <h2 id="modal-prize-title" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink">
                        {prize.title}
                    </h2>
                    {/* O botão 'Fechar' ('X') no canto */}
                    <button onClick={onClose} aria-label="Fechar modal" className="text-slate-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                {/* Corpo com conteúdo rolável */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div>
                        {/* Área para a imagem do prêmio */}
                        <img id="modal-prize-image" src={prize.image} alt={`Imagem do prêmio ${prize.title}`} className="w-full aspect-video object-cover rounded-lg shadow-lg" />
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">Detalhes do Prêmio</h3>
                        {/* Seção para detalhes/modelo do prêmio */}
                        <div id="modal-prize-details" className="text-slate-300 space-y-1" dangerouslySetInnerHTML={{ __html: prize.details }} />
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">Dúvidas Frequentes</h3>
                        {/* Seção onde a lista de FAQ é renderizada dinamicamente */}
                        <div id="modal-prize-faq" className="space-y-1">
                            {prize.faq.map((item, index) => (
                                <FAQItem key={index} question={item.q} answer={item.a} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rodapé com o botão de ação principal */}
                <div className="flex-shrink-0 p-4 bg-slate-900/50 border-t border-slate-700">
                    <button 
                        onClick={onNavigateToScratchcards}
                        className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-brand-yellow/50"
                    >
                        Quero Ganhar! Ir para a Raspadinha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrizeModal;
