import React, { useState } from 'react';
import Header from './shared/Header';
import Footer from './shared/Footer';
import SidebarMenu from './my-account/SidebarMenu';
import DashboardContent from './my-account/DashboardContent';
import ProfileContent from './my-account/ProfileContent';
import TransactionsContent from './my-account/TransactionsContent';
import PrizesContent from './my-account/PrizesContent';

interface MyAccountPageProps {
    isLoggedIn: boolean;
    userName: string;
    credits: number;
    onNavigateToHome: () => void;
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
    onNavigateToScratchcards: () => void;
    onNavigateToAddCredits: () => void;
    onNavigateToMyAccount: () => void;
    onLogout: () => void;
}

export type AccountSection = 'dashboard' | 'profile' | 'transactions' | 'games' | 'prizes' | 'referrals';

const MyAccountPage: React.FC<MyAccountPageProps> = (props) => {
    const [activeSection, setActiveSection] = useState<AccountSection>('dashboard');

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardContent 
                            onNavigateToAddCredits={props.onNavigateToAddCredits} 
                            userName={props.userName}
                            credits={props.credits}
                        />;
            case 'profile':
                return <ProfileContent />;
            case 'transactions':
                return <TransactionsContent />;
            case 'prizes':
                return <PrizesContent />;
            case 'games':
                return <div className="bg-slate-800 p-6 rounded-lg border border-slate-700"><h1 className="text-3xl font-bold text-slate-100 mb-4">Histórico de Jogos</h1><p className="text-slate-400">O conteúdo para esta seção estará disponível em breve.</p></div>;
            case 'referrals':
                return <div className="bg-slate-800 p-6 rounded-lg border border-slate-700"><h1 className="text-3xl font-bold text-slate-100 mb-4">Indique um Amigo</h1><p className="text-slate-400">O conteúdo para esta seção estará disponível em breve.</p></div>;
            default:
                 return <DashboardContent 
                            onNavigateToAddCredits={props.onNavigateToAddCredits} 
                            userName={props.userName}
                            credits={props.credits}
                        />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen">
            <Header {...props} />
            <main className="pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column (Sidebar) */}
                        <aside className="w-full md:w-64 flex-shrink-0">
                            <SidebarMenu activeSection={activeSection} setActiveSection={setActiveSection} />
                        </aside>

                        {/* Right Column (Content) */}
                        <section className="flex-grow">
                            {renderContent()}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyAccountPage;