// src/pages/AcessoPaciente.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

const formatarCPF = (v: string) =>
  v.replace(/\D/g, '')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d{1,2})/, '$1-$2')
   .replace(/(-\d{2})\d+?$/, '$1')
   .slice(0, 14);

export default function AcessoPaciente() {
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return setErro('CPF deve ter 11 dígitos');
    if (!email.includes('@')) return setErro('Email inválido');

    setLoading(true);
    setErro('');

    try {
      await apiService.login({ cpf: cpfLimpo, email: email.trim().toLowerCase() });
      navigate('/dashboard-paciente');
    } catch (err: any) {
      setErro(err.message); // AGORA MOSTRA MENSAGEM CLARA
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Portal do Paciente</h1>
          <p className="text-gray-600">Acesse com CPF e Email</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {erro}
          </div>
        )}

        <div className="space-y-6 text-gray-600">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              maxLength={14}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 transition shadow-lg"
          >
            {loading ? 'Entrando...' : 'Acessar Portal'}
          </button>
        </div>

        <div className="flex justify-center my-12">
          <Link
            to="/cadastro"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl"
          >
            Cadastre-se
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Problemas com acesso?</p>
          <a href="tel:+5511999999999" className="text-blue-600 hover:underline font-medium">
            Suporte: (11) 99999-9999
          </a>
        </div>
      </div>
    </div>
  );
}