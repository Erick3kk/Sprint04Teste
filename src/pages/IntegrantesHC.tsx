import React from 'react';
import { IntegranteCard } from '../components/IntegranteCard'; 

const IntegrantesHC: React.FC = () => {
    const equipe = [
        {
            nome: "Matheus N.",
            rm: "563765",
            turma: "1TDSPV",
            githubUrl: "https://github.com/MATHEUSN06", 
            fotoUrl: "https://media.discordapp.net/attachments/593926799373631528/1436834885108105326/MatheusFoto.jpg?ex=69110c43&is=690fbac3&hm=e14c785c82466da029af9d3941752ba4e5f27b4cf0e07e4d6a1d8b7af2549441&=&format=webp&width=512&height=910" 
        },
        {
            nome: "Erick Gama",
            rm: "561951",
            turma: "1TDSPV",
            githubUrl: "https://github.com/Erick3kk",
            fotoUrl: "https://media.discordapp.net/attachments/593926799373631528/1436834480689250495/ErickFoto.jpg?ex=69110be3&is=690fba63&hm=7bcaf7726e25e4efda3406f474fabec0d8ba4ca049b1b1b7d3d058787c421bf8&=&format=webp&width=683&height=911"
        },
        {
            nome: "Bruno Jacob", 
            rm: "565249",
            turma: "1TDSPV",
            githubUrl: "https://github.com/brunopfnm",
            fotoUrl: "https://media.discordapp.net/attachments/593926799373631528/1436834896503902268/BrunoFoto.jpg?ex=69110c46&is=690fbac6&hm=00aad287351f8cfba74b3aa5bd6bd484f87bdbc0c175a506d655a2040b0640ca&=&format=webp&width=683&height=911"
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