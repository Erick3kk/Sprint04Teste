// src/pages/AgendamentoConsulta.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { IconArrowLeft, IconCalendar, IconClock, IconStethoscope } from '../components/Icons';
import type { Medico, AgendamentoPayload } from '../services/types/agendamento';
import { validarAgendamento } from '../schemas/agendamentoSchema';

export default function AgendamentoConsulta() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregandoMedicos, setCarregandoMedicos] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const idPaciente = apiService.getPacienteId();

  useEffect(() => {
    if (idPaciente === null) {
      navigate('/acesso-paciente');
    }
  }, [idPaciente, navigate]);

  // === CARREGA MÉDICOS ===
  useEffect(() => {
    if (!idPaciente) return;

    const carregar = async () => {
      setCarregandoMedicos(true);
      setErro('');
      try {
        const lista = await apiService.getMedicos();
        setMedicos(lista);
      } catch (err: any) {
        setErro(err.message || 'Não foi possível carregar os médicos');
      } finally {
        setCarregandoMedicos(false);
      }
    };

    carregar();
  }, [idPaciente]);

  // === AGENDAR ===
  const agendar = async () => {
    if (!idPaciente || !medicoId || !data || !hora) {
      setErro('Preencha todos os campos');
      return;
    }

    const medico = medicos.find(m => m.idMedico === medicoId);
    const payload: AgendamentoPayload = {
      dataHora: `${data}T${hora}:00.000`,
      status: 'AGENDADA',
      areaMedica: medico?.especialidade || 'Não informada',
      idPaciente,
      idMedico: medicoId,
    };

    const erroValidacao = validarAgendamento(payload);
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await apiService.criarConsulta(payload);
      alert('Consulta agendada com sucesso!');
      navigate('/dashboard-paciente');
    } catch (err: any) {
      setErro(err.message || 'Erro ao agendar');
    } finally {
      setLoading(false);
    }
  };

  if (idPaciente === null) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard-paciente')}
          className="mb-6 text-blue-700 hover:text-blue-900 flex items-center gap-2 font-medium transition-colors"
        >
          <IconArrowLeft />
          Voltar ao Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Agendar Consulta
          </h1>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
              {erro}
            </div>
          )}

          <div className="space-y-7">

            {/* MÉDICO */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <IconStethoscope className="w-5 h-5 text-blue-600" />
                Médico
              </label>

              {carregandoMedicos ? (
                <div className="w-full p-4 border border-gray-300 rounded-xl text-gray-500 text-center">
                  Carregando médicos...
                </div>
              ) : medicos.length === 0 ? (
                <div className="w-full p-4 border border-gray-300 rounded-xl text-gray-500 text-center">
                  Nenhum médico disponível
                </div>
              ) : (
                <select
                  value={medicoId || ''}
                  onChange={(e) => setMedicoId(Number(e.target.value))}
                  className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map(m => (
                    <option key={m.idMedico} value={m.idMedico}>
                      {m.nome} - {m.especialidade}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* DATA */}
            {medicoId && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <IconCalendar className="w-5 h-5 text-blue-600" />
                  Data
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
            )}

            {/* HORÁRIO */}
            {data && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <IconClock className="w-5 h-5 text-blue-600" />
                  Horário
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHora(h)}
                      className={`p-3 rounded-xl font-medium text-sm transition-all ${
                        hora === h
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={agendar}
              disabled={loading || !medicoId || !data || !hora}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg mt-8"
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}