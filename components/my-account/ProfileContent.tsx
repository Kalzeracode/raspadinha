
import React from 'react';

const ProfileContent: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-8">Meus Dados</h1>
            
            {/* Personal Data Form */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-8">
                <h2 className="text-xl font-semibold text-slate-200 mb-6">Informações Pessoais</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-400 mb-1">Nome Completo</label>
                        <input type="text" id="fullName" value="Maria da Silva" disabled className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-300 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">E-mail</label>
                        <input type="email" id="email" value="maria.silva@email.com" disabled className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-300 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-400 mb-1">Telefone</label>
                        <input type="tel" id="phone" value="(11) 98765-4321" disabled className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-slate-300 cursor-not-allowed" />
                    </div>
                    <div className="pt-2">
                        <button type="button" className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Editar Dados
                        </button>
                    </div>
                </form>
            </div>

            {/* Password Change Form */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h2 className="text-xl font-semibold text-slate-200 mb-6">Alterar Senha</h2>
                 <form className="space-y-4">
                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-400 mb-1">Nova Senha</label>
                        <input type="password" id="newPassword" placeholder="********" className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-400 mb-1">Confirmar Nova Senha</label>
                        <input type="password" id="confirmPassword" placeholder="********" className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink" />
                    </div>
                     <div className="pt-2">
                        <button type="submit" className="bg-brand-pink hover:bg-brand-pink/90 text-white font-bold py-2 px-4 rounded-md transition-colors">
                            Alterar Senha
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileContent;
