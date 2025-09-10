
import React from 'react';

const transactions = [
    { date: '25/07/2024 10:05', description: 'Prêmio - Sorte Rápida', value: '+ 5 Créditos', balance: '30 Créditos', type: 'gain' },
    { date: '25/07/2024 10:04', description: 'Jogo - Sorte Rápida', value: '- 1 Crédito', balance: '25 Créditos', type: 'loss' },
    { date: '25/07/2024 10:02', description: 'Jogo - Tesouro Dourado', value: '- 5 Créditos', balance: '26 Créditos', type: 'loss' },
    { date: '24/07/2024 18:30', description: 'Depósito via PIX', value: '+ 11 Créditos', balance: '31 Créditos', type: 'gain' },
    { date: '23/07/2024 09:15', description: 'Bônus de Cadastro', value: '+ 20 Créditos', balance: '20 Créditos', type: 'gain' },
];

const TransactionsContent: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-8">Histórico de Transações</h1>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3 text-right">Valor</th>
                                <th scope="col" className="px-6 py-3 text-right">Saldo Resultante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, index) => (
                                <tr key={index} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">{tx.date}</td>
                                    <td className="px-6 py-4">{tx.description}</td>
                                    <td className={`px-6 py-4 text-right font-medium ${tx.type === 'gain' ? 'text-green-400' : 'text-red-400'}`}>{tx.value}</td>
                                    <td className="px-6 py-4 text-right font-bold text-white">{tx.balance}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsContent;
