// src/pages/DashboardConsultas.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Consulta, Receita, Medico } from '../services/types/consulta';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function DashboardConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const paciente = apiService.getPacienteLogado();

  useEffect(() => {
    if (!paciente) {
      navigate('/acesso-paciente');
      return;
    }

        const getPacienteId = (): number => {
      const user = localStorage.getItem('usuarioLogado');
      if (!user) return 1;
      try {
        const parsed = JSON.parse(user);
        return parsed.idPaciente || 1;
      } catch {
        return 1;
      }
    };

    const idPaciente = getPacienteId();

    const carregarConsultas = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/consultas/listar/${paciente}`);
      const consultas = res.data || [];

      // MAPEIA PARA FORMATO AMIGÁVEL
      const consultasMapeadas = consultas.map((c: any) => ({
        idConsulta: c.idConsulta,
        medico: {
          nome: c.medico?.nome || 'Médico não encontrado',
          especialidade: c.medico?.especialidade || c.areaMedica || 'Não informado'
        },
        data: c.datahora?.split('T')[0] || '',
        hora: c.datahora?.split('T')[1]?.substring(0, 5) || '',
        status: c.status || 'AGENDADA'
      }));

      setConsultas(consultasMapeadas);
    } catch (err) {
      console.error('Erro:', err);
      setConsultas([]);
    } finally {
      setLoading(false);
    }
  };

    const loadData = async () => {
      try {
        console.log('Carregando dados para paciente:', paciente.nome);

        const [consultasRes, medicosRes, receitasRes] = await Promise.all([
          apiService.getConsultas(paciente.idPaciente),        // Pass the patient ID
          apiService.getMedicos(),
          apiService.getReceitas(),
        ]);

        console.log('Consultas:', consultasRes);
        console.log('Médicos:', medicosRes);
        console.log('Receitas:', receitasRes);

        // FILTRA CONSULTAS DO PACIENTE LOGADO
        const consultasDoPaciente = consultasRes.filter(
          c => c.paciente.idPaciente === paciente.idPaciente
        );

        setConsultas(consultasDoPaciente);
        setMedicos(medicosRes);
        setReceitas(receitasRes);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados. Verifique o backend.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [paciente, navigate]);

  const handleLogout = () => {
    apiService.logout();
    navigate('/acesso-paciente');
  };

  const getMedico = (idMedico: number) => medicos.find(m => m.idMedico === idMedico);
  const getReceitasDaConsulta = (consultaId: number) => 
    receitas.filter(r => r.consulta?.idConsulta === consultaId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black">Minhas Consultas</h1>
              <p className="text-blue-100">Olá, {paciente?.nome}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-bold transition"
            >
              Sair
            </button>
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <p className="text-red-700 text-center font-medium">{error}</p>
          </div>
        )}

        {/* CONSULTAS */}
        <div className="p-6">
          {consultas.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg mb-4">Nenhuma consulta agendada.</p>
              <Link
                to="/agendamento"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
              >
                Agendar Consulta
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {consultas.map((consulta) => {
                const medico = getMedico(consulta.medico.idMedico);
                const receitasDaConsulta = getReceitasDaConsulta(consulta.idConsulta);

                return (
                  <div key={consulta.idConsulta} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            consulta.status === 'REALIZADA' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></span>
                          {consulta.areaMedica || 'Consulta Médica'}
                        </h3>
                        <p className="text-gray-600">
                          <strong>Médico:</strong> {medico?.nome || consulta.medico.nome}
                          {medico?.especialidade && ` (${medico.especialidade})`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          {new Date(consulta.dataHora).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-gray-600">
                          {new Date(consulta.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                          consulta.status === 'REALIZADA' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consulta.status || 'Pendente'}
                        </span>
                      </div>
                    </div>

                    {receitasDaConsulta.length > 0 && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Receita(s):</h4>
                        {receitasDaConsulta.map((r, i) => (
                          <p key={i} className="text-green-700">
                            • <strong>{r.medicamento}</strong> — {r.dosagem}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>


        <div className="flex justify-center my-12">
          <Link
            to="/agendamento-consulta"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl transform hover:scale-105 active:scale-95"
          >
            Agendamento Consulta
          </Link>
        </div>
        
        <div className="bg-gray-50 p-6 text-center border-t">
          <p className="text-gray-600">
            Precisa de ajuda? <Link to="/suporte" className="text-blue-600 hover:underline font-bold">Fale com o suporte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}