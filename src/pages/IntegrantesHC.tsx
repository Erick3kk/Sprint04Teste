import React from 'react';
import { IntegranteCard } from '../components/IntegranteCard'; 

const IntegrantesHC: React.FC = () => {
    const equipe = [
        {
            nome: "Matheus N.",
            rm: "563765",
            turma: "1TDSPV",
            githubUrl: "https://github.com/MATHEUSN06", 
            fotoUrl: "blob:https://web.whatsapp.com/3abc051b-9b67-4429-907c-2a04750e7f15" 
        },
        {
            nome: "Erick Gama",
            rm: "561951",
            turma: "1TDSPV",
            githubUrl: "https://github.com/Erick3kk",
            fotoUrl: "URL_DA_FOTO_ALPHA"
        },
        {
            nome: "Bruno Jacob", 
            rm: "565249",
            turma: "1TDSPV",
            githubUrl: "https://github.com/brunopfnm",
            fotoUrl: "URL_DA_FOTO_BETA"
        },
    ];

    return (
        <div className="text-gray-700 p-4 sm:p-8 bg-hc-fundo min-h-screen">
            <div className="container mx-auto max-w-6xl">
                
                {}
                <h1 className="text-4xl font-extrabold text-hc-principal mb-10 border-b-4 border-hc-secundaria pb-3 text-center">
                    Nossa Equipe de Desenvolvimento
                </h1>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"> 
                    
                    {}
                    {equipe.map((integrante, index) => (
                        <IntegranteCard 
                            key={index}
                            nome={integrante.nome}
                            rm={integrante.rm}
                            turma={integrante.turma}
                            githubUrl={integrante.githubUrl}
                            fotoUrl={integrante.fotoUrl}
                        />
                    ))}

                </div>
                
                {}
                <p className="mt-12 text-center text-gray-500 text-sm p-4 bg-white rounded-lg shadow-inner"> 
                    Este projeto segue os padrões de componentização e versionamento no GitHub.
                </p>
            </div>
        </div>
    );
};
export default IntegrantesHC;