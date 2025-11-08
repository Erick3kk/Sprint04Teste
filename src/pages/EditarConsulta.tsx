// src/pages/EditarConsulta.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Consulta } from '../services/types/consulta';
import { CheckCircle2, Pill } from 'lucide-react';

export default function EditarConsulta() {
  const [searchParams] = useSearchParams();
  const idConsulta = Number(searchParams.get('id'));
  const [consulta, setConsulta] = useState<Consulta | null>(null);
  const [status, setStatus] = useState<string>('');
  const [medicamento, setMedicamento] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [loading, setLoading] = useState(true); // ← COMEÇA COM TRUE
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro('');

      try {
        const data = await apiService.getConsulta(idConsulta);
        setConsulta(data);
        setStatus(data.status || 'AGENDADA');
      } catch (err: any) {
        setErro(err.message || 'Consulta não encontrada.');
        console.error('Erro ao carregar consulta:', err);
      } finally {
        setLoading(false);
      }
    };

    if (idConsulta) carregar();
  }, [idConsulta]); // ← SEM navigate

    const salvar = async () => {
  if (!consulta) return;
  setLoading(true);
  setErro('');

  try {
    // 1. ATUALIZA CONSULTA
    await apiService.atualizarConsulta({
      idConsulta: consulta.idConsulta,
      status: status,
    });

    // 2. CRIA RECEITA SE FOR REALIZADA
    if (status === 'REALIZADA' && medicamento.trim() && dosagem.trim()) {
      await apiService.criarReceita({
        idConsulta: consulta.idConsulta,
        medicamento: medicamento.trim(),
        dosagem: dosagem.trim(),
      });
    }

    navigate('/dashboard-paciente');
  } catch (err: any) {
    setErro(err.message || 'Erro ao salvar');
  } finally {
    setLoading(false);
  }
};

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-lg">Carregando consulta...</p>
      </div>
    );
  }

  // ERRO
  if (erro && !consulta) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-red-600 font-bold">{erro}</p>
          <button
            onClick={() => navigate('/dashboard-paciente')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!consulta) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Editar Consulta
          </h1>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
              {erro}
            </div>
          )}

          {/* ... resto do formulário (igual antes) */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-gray-800">
            <div>
              <p className="text-sm text-gray-600">Paciente</p>
              <p className="font-semibold">{consulta.paciente.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Médico</p>
              <p className="font-semibold">
                {consulta.medico.nome} ({consulta.areaMedica})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data</p>
              <p className="font-semibold">
                {new Date(consulta.dataHora).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Horário</p>
              <p className="font-semibold">
                {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="mb-8 text-gray-700">
            <label className="flex items-center gap-2 text-green-700 font-semibold mb-3">
              <CheckCircle2 className="w-5 h-5" />
              Status da Consulta
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <option value="AGENDADA">Agendada</option>
              <option value="REALIZADA">Realizada</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          {status === 'REALIZADA' && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <label className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                <Pill className="w-5 h-5 " />
                Emitir Receita
              </label>
              <input
                type="text"
                placeholder="Medicamento"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                className="w-full p-4 border text-gray-700 border-green-300 rounded-xl mb-3 focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Dosagem"
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                className="w-full p-4 border text-gray-700 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <button
            onClick={salvar}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-70 transition shadow-lg"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}