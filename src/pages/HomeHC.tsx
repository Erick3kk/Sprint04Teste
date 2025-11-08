import React from 'react';
import { ServiceCard } from '../components/ServiceCard';

const HomeHC: React.FC = () => {
    return (
        <div className="space-y-12 p-4 bg-gray-50 text-gray-800"> 
            
            {}
            {}
            <section className="bg-blue-600 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-24 px-8 rounded-3xl shadow-2xl shadow-blue-600/50">
                <div className="max-w-4xl mx-auto text-center">
                    {}
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
                        Excelência e Humanização em Saúde
                    </h1>
                    <p className="text-xl md:text-2xl font-light opacity-90 mb-10">
                        O Hospital das Clínicas é referência no Brasil em tratamento de alta complexidade, ensino e pesquisa.
                    </p>
                    {}
                    <a 
                        href="/acesso-paciente" 
                        className="inline-block bg-white text-blue-600 font-extrabold text-lg px-12 py-4 rounded-full shadow-xl border-2 border-transparent hover:bg-blue-100 hover:text-blue-800 transition duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-white/90"
                    >
                        Agende Sua Consulta
                    </a>
                </div>
            </section>

            {}
            <section className="px-4">
                {}
                {}
                <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center border-b-4 border-blue-600 pb-3">
                    Nossos Principais Serviços
                </h2>
                
                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {}
                    <ServiceCard
                        icone="🩺"
                        titulo="Atendimento Especializado"
                        descricao="Mais de 50 especialidades médicas disponíveis para um cuidado completo e personalizado."
                    />
                    <ServiceCard
                        icone="📅"
                        titulo="Agendamento Fácil"
                        descricao="Marque suas consultas e exames de forma rápida e segura através da nossa plataforma online."
                    />
                    <ServiceCard
                        icone="👨‍⚕️"
                        titulo="Equipe de Referência"
                        descricao="Conte com os melhores profissionais do país, envolvidos ativamente em pesquisa e inovação."
                    />
                </div>
            </section>
            
            {}
            {}
            <section className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-blue-600"> 
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Inovação e Pesquisa</h2>
                <p className="text-gray-600 text-lg">O HC está na vanguarda da medicina, investindo continuamente em tecnologias e estudos clínicos para avançar o futuro da saúde.</p>
            </section>
        </div>
    );
};

export default HomeHC;