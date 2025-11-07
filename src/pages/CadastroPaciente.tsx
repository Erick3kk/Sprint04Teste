// src/pages/CadastroPaciente.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputForm } from '../components/InputForm';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

const enderecoSchema = z.object({
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado: 2 letras'),
  cep: z.string()
    .regex(/^\d{8}$/, 'CEP: 8 dígitos (ex: 06083260)')
    .min(8, 'CEP deve ter 8 dígitos'),
});

const pacienteSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().length(11, 'CPF: 11 dígitos'),
  dataNascimento: z.string().min(1, 'Data é obrigatória'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
});

type EnderecoForm = z.infer<typeof enderecoSchema>;
type PacienteForm = z.infer<typeof pacienteSchema>;

export default function CadastroPaciente() {
  const [step, setStep] = useState<'endereco' | 'paciente'>('endereco');
  const [idEndereco, setIdEndereco] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const enderecoForm = useForm<EnderecoForm>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: { complemento: '' },
  });

  const pacienteForm = useForm<PacienteForm>({
    resolver: zodResolver(pacienteSchema),
  });

  const onEnderecoSubmit = async (data: EnderecoForm) => {
  setLoading(true);
  setError('');
  try {
    const payload = {
  logradouro: data.logradouro.trim(),
  numero: parseInt(data.numero, 10), // ← GARANTE NÚMERO
  complemento: data.complemento?.trim() || null,
  bairro: data.bairro.trim(),
  cidade: data.cidade.trim(),
  estado: data.estado.toUpperCase().trim(),
  cep: data.cep.replace(/\D/g, '').trim(), // ← 8 DÍGITOS
};

    console.log('ENVIANDO ENDEREÇO:', payload);

    const res = await apiService.cadastrarEndereco(payload);
    console.log('ENDEREÇO CADASTRADO:', res);

    setIdEndereco(res.idEndereco);
    setStep('paciente');
  } catch (err: any) {
    const msg = err.response?.data?.message || 'Erro ao salvar endereço';
    setError(msg);
  } finally {
    setLoading(false);
  }
};

const onPacienteSubmit = async (data: PacienteForm) => {
  console.log('BOTÃO FINALIZAR CLICADO'); // DEBUG
  console.log('idEndereco atual:', idEndereco); // VERIFICA SE TEM ID

  if (!idEndereco) {
    setError('Erro: Endereço não foi salvo. Tente novamente.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const [dia, mes, ano] = data.dataNascimento.split('/');
    const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

    const payload = {
      nome: data.nome.trim(),
      cpf: data.cpf.replace(/\D/g, ''),
      dataNascimento: dataFormatada,
      telefone: data.telefone.replace(/\D/g, ''),
      email: data.email.toLowerCase().trim(),
      endereco: { idEndereco },
    };

    console.log('ENVIANDO PACIENTE PARA API:', payload);

    const response = await apiService.cadastrarPaciente(payload);
    console.log('PACIENTE CADASTRADO:', response);

    alert('Paciente cadastrado com sucesso!');
    navigate('/acesso-paciente');
  } catch (err: any) {
    console.error('ERRO NO CADASTRO DO PACIENTE:', err);
    const msg = err.response?.data?.message || err.message || 'Erro ao cadastrar paciente';
    setError(`Erro: ${msg}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h1 className="text-4xl font-black text-center text-blue-700 mb-2">Cadastro</h1>
        <p className="text-center text-gray-600 mb-8">Preencha em duas etapas</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${step === 'endereco' ? 'bg-blue-600' : 'bg-green-500'}`}>
              1
            </div>
            <div className="w-24 h-1 bg-gray-300"></div>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${step === 'paciente' ? 'bg-blue-600' : 'bg-gray-300'}`}>
              2
            </div>
          </div>
        </div>

        {step === 'endereco' && (
          <form onSubmit={enderecoForm.handleSubmit(onEnderecoSubmit)} className="space-y-5 text-gray-600">
            <InputForm label="Logradouro" name="logradouro" register={enderecoForm.register} errors={enderecoForm.formState.errors} />
            <InputForm label="Número" name="numero" register={enderecoForm.register} errors={enderecoForm.formState.errors} placeholder="16" />
            <InputForm label="Complemento (opcional)" name="complemento" register={enderecoForm.register} errors={enderecoForm.formState.errors} />
            <InputForm label="Bairro" name="bairro" register={enderecoForm.register} errors={enderecoForm.formState.errors} />
            <InputForm label="Cidade" name="cidade" register={enderecoForm.register} errors={enderecoForm.formState.errors} placeholder="Osasco" />
            <InputForm label="Estado" name="estado" register={enderecoForm.register} errors={enderecoForm.formState.errors} placeholder="SP" />
            <InputForm label="CEP (8 dígitos)" name="cep" register={enderecoForm.register} errors={enderecoForm.formState.errors} placeholder="06083260" />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 transition"
            >
              {loading ? 'Salvando...' : 'Próximo'}
            </button>
          </form>
        )}

        {step === 'paciente' && (
          <form onSubmit={pacienteForm.handleSubmit(onPacienteSubmit)} className="space-y-5 text-gray-600">
            <InputForm label="Nome Completo" name="nome" register={pacienteForm.register} errors={pacienteForm.formState.errors} />
            <InputForm label="CPF (11 dígitos)" name="cpf" register={pacienteForm.register} errors={pacienteForm.formState.errors} placeholder="12345678910" />
            <InputForm label="Data de Nascimento" name="dataNascimento" type="date" register={pacienteForm.register} errors={pacienteForm.formState.errors} />
            <InputForm label="Telefone" name="telefone" register={pacienteForm.register} errors={pacienteForm.formState.errors} placeholder="11987654321" />
            <InputForm label="E-mail" name="email" type="email" register={pacienteForm.register} errors={pacienteForm.formState.errors} />

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => setStep('endereco')}
                className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 transition"
              >
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/acesso-paciente" className="text-blue-600 font-bold hover:underline">
            Já tem conta? Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}