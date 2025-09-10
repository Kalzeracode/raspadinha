
import React, { useState, useMemo } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import GameModal from './GameModal';
import InsufficientCreditsModal from './InsufficientCreditsModal';

interface Scratchcard {
    id: number;
    name: string;
    prize: string;
    cost: number;
    image: string;
    category: 'dinheiro' | 'fisico';
}

const scratchcards: Scratchcard[] = [
    { id: 1, name: 'Sorte Rápida', prize: 'Prêmio de R$ 1.000', cost: 1, image: 'https://placehold.co/400x400/6d28d9/f59e0b?text=Sorte+Rápida', category: 'dinheiro' },
    { id: 2, name: 'Tesouro Dourado', prize: 'Prêmio de R$ 10.000', cost: 5, image: 'https://placehold.co/400x400/ec4899/ffffff?text=Tesouro+Dourado', category: 'dinheiro' },
    { id: 3, name: 'Fortuna Máxima', prize: 'Prêmio de R$ 50.000', cost: 10, image: 'https://placehold.co/400x400/10b981/0f172a?text=Fortuna+Máxima', category: 'dinheiro' },
    { id: 4, name: 'Mega Prêmio', prize: 'Ganhe um Carro 0km', cost: 20, image: 'https://placehold.co/400x400/f59e0b/1e293b?text=Mega+Prêmio', category: 'fisico' },
    { id: 5, name: 'Brilho de Diamante', prize: 'Prêmio de R$ 100.000', cost: 20, image: 'https://placehold.co/400x400/38bdf8/ffffff?text=Brilho+de+Diamante', category: 'dinheiro' },
    { id: 6, name: 'Roda da Sorte', prize: 'Ganhe uma Moto', cost: 15, image: 'https://placehold.co/400x400/ef4444/ffffff?text=Roda+da+Sorte', category: 'fisico' },
    { id: 7, name: 'Dinheiro na Mão', prize: 'Prêmio de R$ 500', cost: 2, image: 'https://placehold.co/400x400/22c55e/ffffff?text=Dinheiro+na+Mão', category: 'dinheiro' },
    { id: 8, name: 'Passaporte Premiado', prize: 'Viagem dos Sonhos', cost: 25, image: 'https://placehold.co/400x400/a855f7/ffffff?text=Passaporte+Premiado', category: 'fisico' },
    { id: 9, name: 'Chuva de Prêmios', prize: 'Prêmio de R$ 2.500', cost: 3, image: 'https://placehold.co/400x400/8b5cf6/ffffff?text=Chuva+de+Prêmios', category: 'dinheiro' },
    { id: 10, name: 'Combo da Fortuna', prize: 'iPhone + R$ 5.000', cost: 10, image: 'https://placehold.co/400x400/f97316/ffffff?text=Combo+Fortuna', category: 'fisico' },
    { id: 11, name: 'Raspou, Ganhou!', prize: 'Prêmio de R$ 5.000', cost: 5, image: 'https://placehold.co/400x400/d946ef/ffffff?text=Raspou+Ganhou', category: 'dinheiro' },
    { id: 12, name: 'Milionário Instantâneo', prize: 'Prêmio de R$ 1.000.000', cost: 50, image: 'https://placehold.co/400x400/facc15/000000?text=Milionário', category: 'dinheiro' },
];

type FilterType = 'todas' | 'dinheiro' | 'fisico' | 'baratas';

const FilterButton: React.FC<{
    label: string;
    filter: FilterType;
    activeFilter: FilterType;
    onClick: (filter: FilterType) => void;
}> = ({ label, filter, activeFilter, onClick }) => {
    const isActive = filter === activeFilter;
    const baseClasses = "px-5 py-2 text-sm font-medium rounded-full transition-all duration-300";
    const activeClasses = "bg-brand-yellow text-slate-900 shadow-md shadow-brand-yellow/30";
    const inactiveClasses = "bg-slate-800 text-slate-300 hover:bg-slate-700";

    return (
        <button onClick={() => onClick(filter)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
    );
};


interface ScratchcardsPageProps {
    isLoggedIn: boolean;
    userName: string;
    credits: number;
    setCredits: React.Dispatch<React.SetStateAction<number>>;
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToScratchcards: () => void;
    onNavigateToMyAccount: () => void;
    onNavigateToAddCredits: () => void;
    onLogout: () => void;
}

const ScratchcardsPage: React.FC<ScratchcardsPageProps> = ({ credits, setCredits, ...props }) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedScratchcard, setSelectedScratchcard] = useState<Scratchcard | null>(null);
    const [isInsufficientCreditsModalOpen, setIsInsufficientCreditsModalOpen] = useState(false);


    const handleAttemptScratch = (card: Scratchcard) => {
        if (credits >= card.cost) {
            setCredits(prev => prev - card.cost);
            setSelectedScratchcard(card);
            setIsModalOpen(true);
        } else {
            setIsInsufficientCreditsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedScratchcard(null);
    };
    
    const filteredScratchcards = useMemo(() => {
        switch (activeFilter) {
            case 'dinheiro':
                return scratchcards.filter(card => card.category === 'dinheiro');
            case 'fisico':
                return scratchcards.filter(card => card.category === 'fisico');
            case 'baratas':
                return [...scratchcards].sort((a, b) => a.cost - b.cost);
            case 'todas':
            default:
                return scratchcards;
        }
    }, [activeFilter]);

    return (
        <div className="bg-slate-900 text-white selection:bg-brand-pink/30">
            <Header {...props} credits={credits} />
            <main className="pt-16">
                <section className="py-20 px-4">
                    <div className="container mx-auto">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-8">
                            Escolha sua Sorte
                        </h1>
                        
                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                            <FilterButton label="Todas" filter="todas" activeFilter={activeFilter} onClick={setActiveFilter} />
                            <FilterButton label="Prêmios em Dinheiro" filter="dinheiro" activeFilter={activeFilter} onClick={setActiveFilter} />
                            <FilterButton label="Prêmios Físicos" filter="fisico" activeFilter={activeFilter} onClick={setActiveFilter} />
                            <FilterButton label="Mais Baratas" filter="baratas" activeFilter={activeFilter} onClick={setActiveFilter} />
                        </div>
                        
                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredScratchcards.map(card => (
                                <div key={card.id} className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col group">
                                    <div className="overflow-hidden">
                                        <img src={card.image} alt={`Raspadinha ${card.name}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-bold text-brand-yellow">{card.name}</h3>
                                        <p className="text-slate-300 mt-2 flex-grow">{card.prize}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <p className="text-2xl font-bold text-white">{card.cost} Crédito{card.cost > 1 ? 's' : ''}</p>
                                            <button 
                                                onClick={() => handleAttemptScratch(card)}
                                                className="bg-gradient-to-r from-brand-pink to-brand-yellow text-white font-bold px-5 py-2 rounded-lg shadow-lg hover:opacity-90 transform hover:-translate-y-0.5 transition-all duration-300">
                                                Raspar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            {isModalOpen && selectedScratchcard && (
                <GameModal card={selectedScratchcard} onClose={handleCloseModal} />
            )}
            <InsufficientCreditsModal
                isOpen={isInsufficientCreditsModalOpen}
                onClose={() => setIsInsufficientCreditsModalOpen(false)}
                onNavigateToAddCredits={props.onNavigateToAddCredits}
            />
        </div>
    );
};

export default ScratchcardsPage;
