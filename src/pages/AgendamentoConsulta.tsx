import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Stethoscope, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Medico {
  idMedico: number;
  nome: string;
  especialidade: string;
}

export default function AgendamentoConsulta() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState<number | null>(null);
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  // PEGA ID DO PACIENTE LOGADO
  const getPacienteId = (): number | null => {
    const user = localStorage.getItem('usuarioLogado');
    if (!user) return null;
    try {
      const parsed = JSON.parse(user);
      return parsed.idPaciente || null;
    } catch {
      return null;
    }
  };

  const idPaciente = getPacienteId();

  // REDIRECIONA SE NÃO ESTIVER LOGADO
  useEffect(() => {
    if (idPaciente === null) {
      navigate('/acesso-paciente');
    }
  }, [idPaciente, navigate]);

  // CARREGA MÉDICOS
  useEffect(() => {
    if (!idPaciente) return;

    axios.get('http://localhost:8080/medicos/listar')
      .then(res => setMedicos(res.data || []))
      .catch(() => setErro('Erro ao carregar médicos'));
  }, [idPaciente]);

  // AGENDAR CONSULTA
  const agendar = async () => {
    if (!medicoId || !data || !hora || !idPaciente) {
      setErro('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setErro('');

    const medicoSelecionado = medicos.find(m => m.idMedico === medicoId);
    const areaMedica = medicoSelecionado?.especialidade || 'Não informada';

    const dataHoraString = `${data}T${hora}:00.000`;

    const payload = {
      dataHora: dataHoraString,
      status: "AGENDADA",
      areaMedica: areaMedica,
      idPaciente: idPaciente,
      idMedico: medicoId
    };

    try {
      await axios.post('http://localhost:8080/consultas/criar', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert('Consulta agendada com sucesso!');
      navigate('/dashboard-paciente');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao agendar consulta';
      setErro(msg);
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
          className="mb-6 text-blue-700 hover:text-blue-900 flex items-center gap-2 font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Voltar ao Dashboard
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
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Médico
              </label>
              <select
                value={medicoId || ''}
                onChange={(e) => setMedicoId(Number(e.target.value))}
                className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um médico</option>
                {medicos.map(m => (
                  <option key={m.idMedico} value={m.idMedico}>
                    {m.nome} - {m.especialidade}
                  </option>
                ))}
              </select>
            </div>

            {/* DATA */}
            {medicoId && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Data
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* HORÁRIO */}
            {data && (
              <div>
                <label className="flex items-corner gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Horário
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(h => (
                    <button
                      key={h}
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

            {/* CONFIRMAR */}
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