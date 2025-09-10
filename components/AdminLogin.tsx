import React, { useState } from 'react';
import { AdminService } from '../services/adminService';

interface AdminLoginProps {
  onLogin: (adminData: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const adminData = await AdminService.adminSignIn(email, password);
      onLogin(adminData);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink">
            Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Acesso restrito a administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink"
              placeholder="admin@raspadinhas.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-pink to-brand-yellow hover:from-brand-pink/90 hover:to-brand-yellow/90 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-brand-yellow/30 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar no Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Credenciais padrão: admin@raspadinhas.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;