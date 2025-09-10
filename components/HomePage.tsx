
import React, { useState } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import PrizeModal from './PrizeModal';

// --- Reusable Components ---
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left py-4 px-2"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-medium text-slate-200">{question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <p className="p-2 pb-4 text-slate-400">
                    {answer}
                </p>
            </div>
        </div>
    );
};


// --- Main HomePage Component ---
interface HomePageProps {
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

const HomePage: React.FC<HomePageProps> = (props) => {
    const faqs = [
        { q: "Como funciona o site?", a: "É simples! Cadastre-se, escolha uma raspadinha, raspe a área indicada e descubra na hora se você ganhou. Os prêmios são creditados instantaneamente na sua conta." },
        { q: "É seguro jogar?", a: "Sim! Utilizamos tecnologia de ponta para garantir a segurança dos seus dados e a aleatoriedade dos resultados. Nosso sistema é auditado e 100% confiável." },
        { q: "Como resgato meus prêmios?", a: "Você pode solicitar o resgate dos seus prêmios em dinheiro diretamente para sua conta bancária. Para prêmios físicos, nossa equipe entrará em contato para combinar a entrega." },
        { q: "Existem bônus para novos jogadores?", a: "Com certeza! Novos jogadores recebem um bônus de boas-vindas no primeiro depósito para começar com o pé direito. Fique de olho em nossas promoções!" }
    ];

    const winners = [
        { name: 'Maria S.', prize: 'R$ 250,00', time: 'há 2 minutos', avatar: 'https://placehold.co/50x50/ec4899/ffffff?text=MS' },
        { name: 'João P.', prize: 'um iPhone', time: 'há 5 minutos', avatar: 'https://placehold.co/50x50/f59e0b/000000?text=JP' },
        { name: 'Carla F.', prize: 'R$ 1.500,00', time: 'há 8 minutos', avatar: 'https://placehold.co/50x50/6d28d9/ffffff?text=CF' },
        { name: 'Roberto A.', prize: 'R$ 100,00', time: 'há 12 minutos', avatar: 'https://placehold.co/50x50/10b981/ffffff?text=RA' },
        { name: 'Fernanda L.', prize: 'uma Viagem', time: 'há 15 minutos', avatar: 'https://placehold.co/50x50/3b82f6/ffffff?text=FL' },
        { name: 'Lucas M.', prize: 'R$ 750,00', time: 'há 21 minutos', avatar: 'https://placehold.co/50x50/ef4444/ffffff?text=LM' },
        { name: 'Beatriz C.', prize: 'um Notebook', time: 'há 25 minutos', avatar: 'https://placehold.co/50x50/f97316/ffffff?text=BC' },
        { name: 'Thiago B.', prize: 'R$ 300,00', time: 'há 30 minutos', avatar: 'https://placehold.co/50x50/8b5cf6/ffffff?text=TB' },
        { name: 'Juliana R.', prize: 'R$ 5.000,00', time: 'há 33 minutos', avatar: 'https://placehold.co/50x50/d946ef/ffffff?text=JR' },
        { name: 'Marcos V.', prize: 'R$ 50,00', time: 'há 40 minutos', avatar: 'https://placehold.co/50x50/14b8a6/ffffff?text=MV' },
    ];
    
    const prizes = [
        {
            imgSrc: "https://placehold.co/400x300/1e293b/ffffff?text=Carro+0km",
            alt: "Prêmio Carro 0km",
            title: "Carro 0km na sua garagem",
            image: "https://placehold.co/800x600/1e293b/ffffff?text=Carro+0km",
            details: "<strong>Modelo:</strong> Fiat Mobi Like 1.0<br><strong>Ano:</strong> 2025<br><strong>Cor:</strong> Branco Banchisa<br><strong>Itens de série:</strong> Ar-condicionado, direção hidráulica, vidros elétricos.",
            faq: JSON.stringify([
                { "q": "Posso escolher outra cor ou modelo?", "a": "O prêmio padrão é o modelo descrito. Mudanças podem ser negociadas diretamente com a concessionária parceira, sujeito a custos adicionais." },
                { "q": "O prêmio inclui documentação e frete?", "a": "Sim! O prêmio inclui IPVA e licenciamento do primeiro ano pagos. O frete é gratuito para capitais brasileiras." }
            ])
        },
        {
            imgSrc: "https://placehold.co/400x300/1e293b/ffffff?text=iPhone+15",
            alt: "Prêmio iPhone 15 Pro Max",
            title: "iPhone 15 Pro Max",
            image: "https://placehold.co/800x600/1e293b/ffffff?text=iPhone+15",
            details: "<strong>Modelo:</strong> iPhone 15 Pro Max<br><strong>Armazenamento:</strong> 256GB<br><strong>Cor:</strong> Titânio Natural<br><strong>Tela:</strong> Super Retina XDR de 6,7 polegadas.",
            faq: JSON.stringify([
                { "q": "O aparelho é original e vem lacrado?", "a": "Sim, o prêmio é um aparelho 100% original, nacional, lacrado na caixa e com 1 ano de garantia Apple." },
                { "q": "Posso trocar o prêmio por dinheiro?", "a": "Não, este prêmio específico não pode ser convertido em dinheiro." }
            ])
        },
        {
            imgSrc: "https://placehold.co/400x300/1e293b/ffffff?text=Viagem",
            alt: "Prêmio Viagem Internacional",
            title: "Viagem dos Sonhos",
            image: "https://placehold.co/800x600/1e293b/ffffff?text=Viagem",
            details: "<strong>Destino:</strong> Cancún, México<br><strong>Duração:</strong> 7 dias / 6 noites<br><strong>Inclui:</strong> Passagens aéreas ida e volta, hospedagem em resort all-inclusive, traslados.",
            faq: JSON.stringify([
                { "q": "Posso escolher outro destino?", "a": "O pacote é para Cancún, mas podemos analisar trocas mediante ajuste de valores." },
                { "q": "Qual o período para realizar a viagem?", "a": "A viagem pode ser marcada em até 12 meses após o sorteio, exceto em períodos de alta temporada e feriados." }
            ])
        },
        {
            imgSrc: "https://placehold.co/400x300/1e293b/ffffff?text=PIX+R$10.000",
            alt: "Prêmio PIX de R$ 10.000",
            title: "PIX de R$ 10.000",
            image: "https://placehold.co/800x600/1e293b/ffffff?text=PIX+R$10.000",
            details: "<strong>Valor:</strong> R$ 10.000,00 (dez mil reais)<br><strong>Forma de pagamento:</strong> Transferência via PIX<br><strong>Prazo:</strong> Em até 24 horas após a validação dos dados.",
            faq: JSON.stringify([
                { "q": "O valor é líquido ou bruto?", "a": "O valor é líquido, livre de impostos. Você receberá R$ 10.000 na sua conta." },
                { "q": "Preciso ter conta em algum banco específico?", "a": "Não, o PIX pode ser feito para qualquer conta bancária no seu nome." }
            ])
        }
    ];

    const [isPrizeModalOpen, setIsPrizeModalOpen] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState<{
        title: string;
        image: string;
        details: string;
        faq: { q: string; a: string }[];
    } | null>(null);

    /**
     * Lida com a lógica de clique em um card de prêmio.
     * Ele lê os dados do prêmio, processa (incluindo a análise do JSON do FAQ),
     * e define o estado para abrir o modal com os detalhes corretos.
     */
    const handleOpenPrizeModal = (prize: {
        title: string;
        image: string;
        details: string;
        faq: string;
    }) => {
        try {
            // Analisa a string JSON do FAQ para um array de objetos
            const faqArray = JSON.parse(prize.faq);
            // Atualiza o estado com os dados do prêmio selecionado
            setSelectedPrize({
                title: prize.title,
                image: prize.image,
                details: prize.details,
                faq: faqArray
            });
            // Define o estado para exibir o modal
            setIsPrizeModalOpen(true);
        } catch (error) {
            console.error("Failed to parse prize FAQ JSON:", error);
        }
    };
    
    /**
     * Lida com o fechamento do modal, redefinindo o estado.
     */
    const handleClosePrizeModal = () => {
        setIsPrizeModalOpen(false);
        setSelectedPrize(null);
    };

    return (
        <div className="bg-slate-900 text-white selection:bg-brand-pink/30 scroll-smooth">
            <Header {...props} />
            <main className="pt-16">
                {/* Hero Section */}
                <section className="relative min-h-[60vh] flex items-center justify-center text-center px-4 py-20">
                     <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 via-slate-900 to-brand-pink/20 opacity-50"></div>
                     <div className="absolute top-1/4 left-10 h-64 w-64 rounded-full bg-brand-yellow/10 blur-3xl animate-pulse"></div>
                     <div className="absolute bottom-1/4 right-10 h-64 w-64 rounded-full bg-brand-green/10 blur-3xl animate-pulse delay-1000"></div>
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink mb-4">
                            A Sorte está a um Clique!
                        </h1>
                        <p className="max-w-2xl mx-auto text-slate-300 text-lg md:text-xl mb-8">
                            Descubra prêmios incríveis com nossas raspadinhas online. Diversão e emoção a cada raspada!
                        </p>
                        <a href="#raspadinhas" className="inline-block bg-gradient-to-r from-brand-pink to-brand-yellow text-white font-bold text-lg py-3 px-8 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                            Ver Raspadinhas
                        </a>
                    </div>
                </section>

                {/* Featured Scratchcards */}
                <section id="raspadinhas" className="py-20 px-4 bg-slate-900/50">
                    <div className="container mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-12 text-slate-100">Nossas Raspadinhas</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Card 1 */}
                            <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
                                <img src="https://placehold.co/400x400/6d28d9/f59e0b?text=Sorte+Rápida" alt="Raspadinha Sorte Rápida" className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-bold text-brand-yellow">Sorte Rápida</h3>
                                <p className="text-slate-300 mt-2">Prêmio de até R$ 1.000</p>
                                <p className="text-2xl font-bold text-white mt-4">R$ 1,00</p>
                            </div>
                             {/* Card 2 */}
                             <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
                                <img src="https://placehold.co/400x400/ec4899/ffffff?text=Tesouro+Dourado" alt="Raspadinha Tesouro Dourado" className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-bold text-brand-yellow">Tesouro Dourado</h3>
                                <p className="text-slate-300 mt-2">Prêmio de até R$ 10.000</p>
                                <p className="text-2xl font-bold text-white mt-4">R$ 5,00</p>
                            </div>
                             {/* Card 3 */}
                             <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
                                <img src="https://placehold.co/400x400/10b981/0f172a?text=Fortuna+Máxima" alt="Raspadinha Fortuna Máxima" className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-bold text-brand-yellow">Fortuna Máxima</h3>
                                <p className="text-slate-300 mt-2">Prêmio de até R$ 50.000</p>
                                <p className="text-2xl font-bold text-white mt-4">R$ 10,00</p>
                            </div>
                             {/* Card 4 */}
                             <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300">
                                <img src="https://placehold.co/400x400/f59e0b/1e293b?text=Mega+Prêmio" alt="Raspadinha Mega Prêmio" className="w-full h-48 object-cover rounded-lg mb-4" />
                                <h3 className="text-xl font-bold text-brand-yellow">Mega Prêmio</h3>
                                <p className="text-slate-300 mt-2">Ganhe um Carro 0km!</p>
                                <p className="text-2xl font-bold text-white mt-4">R$ 20,00</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Latest Winners Marquee */}
                <section className="py-12">
                    <div className="container mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-8 text-slate-100">Últimos Ganhadores</h2>
                    </div>
                    <div className="relative w-full overflow-hidden group">
                        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
                            {[...winners, ...winners].map((winner, index) => (
                                <div key={index} className="flex-shrink-0 w-80 mx-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center space-x-4">
                                    <img src={winner.avatar} alt={`Avatar de ${winner.name}`} className="w-12 h-12 rounded-full border-2 border-brand-pink" />
                                    <div>
                                        <p className="text-white"><strong className="font-bold">{winner.name}</strong> <span className="font-normal text-slate-300">ganhou {winner.prize}</span></p>
                                        <p className="text-sm text-slate-400">{winner.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* Prizes Section */}
                 <section className="py-20 px-4 bg-slate-900/50">
                    <div className="container mx-auto text-center">
                         <h2 className="text-4xl font-bold mb-12 text-slate-100">Prêmios Incríveis Esperam por Você</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {prizes.map((prize, index) => (
                                // Cada card de prêmio é um botão com um event listener de clique
                                <button
                                    key={index}
                                    onClick={() => handleOpenPrizeModal(prize)} // Aciona a abertura do modal
                                    className="block rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-yellow/20 text-left cursor-pointer"
                                >
                                    <img src={prize.imgSrc} alt={prize.alt} className="w-full h-full object-cover" />
                                </button>
                            ))}
                         </div>
                    </div>
                </section>
                
                {/* Social Proof */}
                <section className="py-20 px-4 text-center">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold mb-8 text-slate-100">O que nossos ganhadores dizem</h2>
                        <div className="max-w-3xl mx-auto aspect-video bg-slate-800 rounded-lg shadow-lg border border-slate-700 flex items-center justify-center">
                            <p className="text-slate-400">Placeholder para vídeo do YouTube</p>
                        </div>
                    </div>
                </section>
                
                {/* FAQ Section */}
                <section className="py-20 px-4 bg-slate-900/50">
                    <div className="container mx-auto max-w-3xl">
                        <h2 className="text-4xl font-bold mb-8 text-center text-slate-100">Perguntas Frequentes</h2>
                        <div className="space-y-2">
                           {faqs.map((faq, index) => (
                               <FAQItem key={index} question={faq.q} answer={faq.a} />
                           ))}
                        </div>
                    </div>
                </section>

            </main>
            <Footer />

            {/* O modal é renderizado condicionalmente com base no estado isPrizeModalOpen.
                É assim que o modal é exibido ou ocultado. */}
            {isPrizeModalOpen && selectedPrize && (
                <PrizeModal 
                    prize={selectedPrize} 
                    onClose={handleClosePrizeModal} 
                    onNavigateToScratchcards={props.onNavigateToScratchcards}
                />
            )}
        </div>
    );
};

export default HomePage;
