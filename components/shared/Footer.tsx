
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4">
            <div className="container mx-auto text-center text-slate-400">
                <div className="flex justify-center space-x-6 mb-6">
                    <a href="#" className="hover:text-white">Termos de Serviço</a>
                    <a href="#" className="hover:text-white">Política de Privacidade</a>
                </div>
                <div className="flex justify-center space-x-6 mb-8">
                    {/* Icons would go here */}
                    <a href="#" aria-label="Facebook" className="hover:text-brand-pink">Facebook</a>
                    <a href="#" aria-label="Instagram" className="hover:text-brand-pink">Instagram</a>
                    <a href="#" aria-label="Twitter" className="hover:text-brand-pink">Twitter</a>
                </div>
                <p>&copy; {new Date().getFullYear()} Raspadinhas Online. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
