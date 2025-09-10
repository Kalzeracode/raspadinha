
import React from 'react';

const prizes = [
    { name: 'R$ 50,00', date: '25/07/2024', status: 'Creditado', statusColor: 'bg-green-500/20 text-green-400', image: 'https://placehold.co/400x300/10b981/ffffff?text=R$+50' },
    { name: 'iPhone 15', date: '12/07/2024', status: 'Aguardando Resgate', statusColor: 'bg-yellow-500/20 text-yellow-400', image: 'https://placehold.co/400x300/f59e0b/ffffff?text=iPhone' },
    { name: 'R$ 10,00', date: '05/07/2024', status: 'Creditado', statusColor: 'bg-green-500/20 text-green-400', image: 'https://placehold.co/400x300/10b981/ffffff?text=R$+10' },
    { name: '1 Jogo Grátis', date: '01/07/2024', status: 'Utilizado', statusColor: 'bg-slate-600/50 text-slate-400', image: 'https://placehold.co/400x300/64748b/ffffff?text=Jogo+Grátis' },
];

const PrizesContent: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-8">Meus Prêmios</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prizes.map((prize, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg">
                        <img src={prize.image} alt={prize.name} className="w-full h-40 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-white mb-2">{prize.name}</h3>
                            <p className="text-sm text-slate-400 mb-3">Ganho em: {prize.date}</p>
                            <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${prize.statusColor}`}>
                                {prize.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PrizesContent;
