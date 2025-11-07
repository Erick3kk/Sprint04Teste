import React from 'react';

interface CardProps {
  titulo: string;
  descricao: string;
  icone: string; 
}

export const ServiceCard: React.FC<CardProps> = ({ titulo, descricao, icone }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer border-t-4 border-hc-secundaria/0 hover:border-hc-secundaria">
        
        {}
        <div className="text-5xl mb-4 text-hc-secundaria">
            {icone}
        </div>
        
        {}
        <h3 className="text-xl font-bold text-hc-principal mb-3">
            {titulo}
        </h3>
        
        {}
        <p className="text-gray-600 text-base">{descricao}</p>
        
        {}
        <a href="/agendamento" className="text-gray-700 mt-4 inline-block text-hc-secundaria font-bold hover:text-hc-principal hover:underline transition duration-150">
            Saiba Mais →
        </a>
    </div>
);