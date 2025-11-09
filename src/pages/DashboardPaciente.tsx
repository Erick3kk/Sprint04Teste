import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Consulta, Receita } from '../services/types/consulta';
import { Paciente } from '../services/types/login';

import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconUser,
  IconPill,
} from '../components/Icons';

export default function DashboardPaciente() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = apiService.getPacienteLogado();
    if (!user) {
      navigate('/acesso-paciente');
      return;
    }

    setPaciente(user);
    setLoading(true);
    setErro('');

    apiService
      .getConsultasDoPaciente(user.idPaciente)
      .then(async (consultasList) => {
        setConsultas(consultasList);

        const receitasPromises = consultasList
          .filter((c) => c.status === 'REALIZADA')
          .map((c) => apiService.getReceitasDaConsulta(c.idConsulta));

        const receitasArrays = await Promise.all(receitasPromises);
        const todasReceitas = receitasArrays.flat();
        setReceitas(todasReceitas);
      })
      .catch((err) => {
        console.error('Erro ao carregar dados:', err);
        setErro(err.message || 'Erro ao carregar consultas ou receitas.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  const formatarData = (data: string) =>
    new Date(data).toLocaleDateString('pt-BR');
  const formatarHora = (data: string) =>
    new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status?: string | null) => {
    const s = status ?? '';
    switch (s) {
      case 'AGENDADA':
        return 'bg-yellow-100 text-yellow-800';
      case 'REALIZADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">
            Carregando consultas e receitas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                apiService.logout();
                navigate('/acesso-paciente');
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition-colors"
            >
              <IconArrowLeft />
              Sair
            </button>
            <button
              onClick={() => navigate('/agendamento-consulta')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
            >
              + Agendar Consulta
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-4">
              <IconUser className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Olá, {paciente?.nome}!
              </h1>
              <p className="text-gray-600">
                CPF:{' '}
                {paciente?.cpf.replace(
                  /(\d{3})(\d{3})(\d{3})(\d{2})/,
                  '$1.$2.$3-$4'
                )}
              </p>
            </div>
          </div>
        </div>

        {}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {erro}
          </div>
        )}

        {}
        <div className="space-y-6 text-gray-800">
          {consultas.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <IconCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                Nenhuma consulta encontrada.
              </p>
            </div>
          ) : (
            consultas.map((consulta) => {
              const receitaDaConsulta = receitas.find(
                (r) => r.consulta?.idConsulta === consulta.idConsulta
              );

              return (
                <div
                  key={consulta.idConsulta}
                  className="bg-white rounded-3xl shadow-xl p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {consulta.areaMedica}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <IconUser className="w-4 h-4" />
                        Dr(a). {consulta.medico.nome}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(
                        consulta.status
                      )}`}
                    >
                      {consulta.status ?? '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-2">
                      <IconCalendar className="w-4 h-4" />
                      {formatarData(consulta.dataHora)}
                    </p>
                    <p className="flex items-center gap-2">
                      <IconClock className="w-4 h-4" />
                      {formatarHora(consulta.dataHora)}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {(consulta.status === 'AGENDADA' ||
                      consulta.status === 'REALIZADA') && (
                      <button
                        onClick={() =>
                          navigate(`/editar-consulta?id=${consulta.idConsulta}`)
                        }
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                      >
                        Editar
                      </button>
                    )}
                    {receitaDaConsulta && (
                      <button
                        onClick={() =>
                          navigate(`/receita?id=${consulta.idConsulta}`)
                        }
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <IconPill className="w-5 h-5" />
                        Ver Receita
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}