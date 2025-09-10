
import React from 'react';
import { AccountSection } from '../MyAccountPage';

interface SidebarMenuProps {
    activeSection: AccountSection;
    setActiveSection: (section: AccountSection) => void;
}

const menuItems: { id: AccountSection; label: string }[] = [
    { id: 'dashboard', label: 'Painel Principal' },
    { id: 'profile', label: 'Meus Dados' },
    { id: 'transactions', label: 'Histórico de Transações' },
    { id: 'games', label: 'Histórico de Jogos' },
    { id: 'prizes', label: 'Meus Prêmios' },
    { id: 'referrals', label: 'Indique um Amigo' },
];

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeSection, setActiveSection }) => {
    return (
        <nav className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <ul className="space-y-2">
                {menuItems.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                                activeSection === item.id 
                                ? 'bg-brand-purple text-white shadow' 
                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SidebarMenu;
