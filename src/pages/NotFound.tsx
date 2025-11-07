import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-hc-fundo text-center">
            
            {}
            <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-gray-300/50 mb-8">
                {}
                <div className="text-[14rem] font-black mb-0 leading-none">
                    {}
                    <span className="bg-clip-text text-gray-700 bg-gradient-to-r from-hc-principal to-hc-secundaria">
                        404
                    </span>
                </div>
            </div>
            
            {}
            <h1 className="text-5xl font-extrabold text-hc-principal mb-4">
                Página Não Encontrada
            </h1>
            
            <p className="text-xl text-gray-700 max-w-xl mx-auto mb-10">
                Desculpe, o endereço que você tentou acessar não existe no Hospital das Clínicas.
            </p>

            {}
            <button
                onClick={() => navigate('/')} 
                className="bg-hc-principal text-white font-bold px-12 py-4 rounded-full shadow-xl hover:bg-hc-secundaria hover:text-hc-principal transition duration-300 focus:outline-none focus:ring-4 focus:ring-hc-principal/50 transform hover:scale-[1.05]"
            >
                Voltar para a Página Inicial
            </button>
        </div>
    );
};

export default NotFound;