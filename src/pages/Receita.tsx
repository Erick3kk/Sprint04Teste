// src/pages/Receita.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Receita } from '../services/types/receita';

// === ÍCONES CENTRALIZADOS (SEM LUCIDE) ===
import { IconArrowLeft, IconPill, IconCalendar, IconUser } from '../components/Icons';

export default function ReceitaPage() {
  const [searchParams] = useSearchParams();
  const idConsulta = Number(searchParams.get('id'));
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!idConsulta) {
      setErro('Consulta não informada');
      setLoading(false);
      return;
    }

    const carregarReceitas = async () => {
      try {
        const data = await apiService.getReceitasDaConsulta(idConsulta);
        setReceitas(data);
      } catch (err) {
        let mensagem = 'Receita não encontrada';

        if (err instanceof Error) {
          mensagem = err.message;
        } else if (typeof err === 'string') {
          mensagem = err;
        } else {
          console.error('Erro inesperado:', err);
        }

        setErro(mensagem);
      } finally {
        setLoading(false);
      }
    };

    carregarReceitas();
  }, [idConsulta]);

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  // === ESTADO: CARREGANDO ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Carregando receita...</p>
      </div>
    );
  }

  // === ESTADO: ERRO ===
  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <p className="text-red-600 font-bold mb-4">{erro}</p>
          <button
            onClick={() => navigate('/dashboard-paciente')}
            className="text-blue-600 hover:underline font-medium"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // === ESTADO: SEM RECEITA ===
  if (receitas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <IconPill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Nenhuma receita encontrada para esta consulta.</p>
          <button
            onClick={() => navigate('/dashboard-paciente')}
            className="mt-6 text-blue-600 hover:underline font-medium"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // === ESTADO: SUCESSO ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* BOTÃO VOLTAR */}
        <button
          onClick={() => navigate('/dashboard-paciente')}
          className="mb-6 text-emerald-700 hover:text-emerald-900 flex items-center gap-2 font-medium transition-colors"
        >
          <IconArrowLeft />
          Voltar ao Dashboard
        </button>

        <div className="space-y-6">
          {receitas.map((receita) => (
            <div
              key={receita.idReceita}
              className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-200"
            >
              {/* TÍTULO + ID */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-green-800 flex items-center gap-3">
                  <IconPill className="w-8 h-8" />
                  Receita Médica
                </h1>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                  ID: {receita.idReceita}
                </span>
              </div>

              {/* INFORMAÇÕES DA CONSULTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-green-50 rounded-2xl">
                <div>
                  <p className="text-sm text-green-700 font-semibold">Consulta</p>
                  <p className="font-bold text-gray-800">ID #{receita.consulta.idConsulta}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-semibold">Data</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    <IconCalendar className="w-4 h-4" />
                    {formatarData(receita.consulta.dataHora)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-semibold">Médico</p>
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    <IconUser className="w-4 h-4" />
                    Dr(a). {receita.consulta.medico.nome}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 font-semibold">Especialidade</p>
                  <p className="font-bold text-gray-800">{receita.consulta.areaMedica}</p>
                </div>
              </div>

              {/* PRESCRIÇÃO */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-300">
                <h2 className="text-xl font-bold text-green-800 mb-4">Prescrição</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-green-700 font-semibold">Medicamento</p>
                    <p className="text-2xl font-bold text-gray-800">{receita.medicamento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-semibold">Dosagem</p>
                    <p className="text-lg font-bold text-gray-700">{receita.dosagem}</p>
                  </div>
                </div>
              </div>

              {/* RODAPÉ */}
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Esta receita é válida por 30 dias a partir da data da consulta.</p>
                <p className="mt-1">Emitida pelo sistema Hospital Clínicas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}