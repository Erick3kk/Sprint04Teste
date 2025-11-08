// src/pages/CadastroPaciente.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputForm } from '../components/InputForm';
import { Link, useNavigate } from 'react-router-dom';
import * as z from 'zod';

// === SCHEMAS ZOD ===
const enderecoSchema = z.object({
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado: 2 letras'),
  cep: z.string().regex(/^\d{8}$/, 'CEP: 8 dígitos (ex: 06083260)'),
});

const pacienteSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().length(11, 'CPF: 11 dígitos'),
  dataNascimento: z.string().min(1, 'Data é obrigatória'),
  telefone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  idEndereco: z.number().int().positive('Endereço inválido'), // ← VALIDADO
});

type EnderecoForm = z.infer<typeof enderecoSchema>;
type PacienteForm = z.infer<typeof pacienteSchema>;

export default function CadastroPaciente() {
  const [step, setStep] = useState<'endereco' | 'paciente'>('endereco');
  const [idEndereco, setIdEndereco] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8080';

  const enderecoForm = useForm<EnderecoForm>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: { complemento: '' },
  });

  const pacienteForm = useForm<PacienteForm>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: { idEndereco: 0 }, // ← Inicializa com 0
  });

  // === SALVAR ENDEREÇO ===
  const onEnderecoSubmit = async (data: EnderecoForm) => {
    setLoading(true);
    setError('');

    const payload = {
      logradouro: data.logradouro.trim(),
      numero: data.numero.trim(),
      complemento: data.complemento?.trim() || null,
      bairro: data.bairro.trim(),
      cidade: data.cidade.trim(),
      estado: data.estado.toUpperCase().trim(),
      cep: data.cep.replace(/\D/g, ''),
    };

    console.log('ENVIANDO ENDEREÇO:', payload);

    try {
      const res = await fetch(`${API_BASE}/enderecos/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erro = await res.text();
        throw new Error(erro || 'Erro ao salvar endereço');
      }

      const resultado = await res.json();
      const idRecebido = resultado.idEndereco;

      if (!idRecebido || typeof idRecebido !== 'number') {
        throw new Error('ID do endereço inválido');
      }

      console.log('ENDEREÇO SALVO! ID:', idRecebido);

      // SALVA NO ESTADO E NO FORMULÁRIO
      setIdEndereco(idRecebido);
      pacienteForm.setValue('idEndereco', idRecebido); // ← AQUI É OBRIGATÓRIO!

      setStep('paciente');
    } catch (err: any) {
      console.error('ERRO:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // === SALVAR PACIENTE ===
  const onPacienteSubmit = async (data: PacienteForm) => {
    console.log('DADOS COMPLETOS DO PACIENTE:', data); // ← idEndereco incluso!

    if (!data.idEndereco || data.idEndereco <= 0) {
      setError('Erro: Endereço não foi vinculado corretamente.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      nome: data.nome.trim(),
      cpf: data.cpf.replace(/\D/g, ''),
      dataNascimento: data.dataNascimento,
      telefone: data.telefone.replace(/\D/g, ''),
      email: data.email.toLowerCase().trim(),
      idEndereco: data.idEndereco
    };

    console.log('ENVIANDO PACIENTE:', payload);

    try {
      const res = await fetch(`${API_BASE}/pacientes/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const erro = await res.text();
        throw new Error(erro || 'Erro ao cadastrar paciente');
      }

      alert('Cadastro concluído com sucesso!');
      navigate('/acesso-paciente');
    } catch (err: any) {
      setError(err.message);
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

        {/* === ETAPA 1: ENDEREÇO === */}
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

        {/* === ETAPA 2: PACIENTE === */}
        {step === 'paciente' && (
          <form onSubmit={pacienteForm.handleSubmit(onPacienteSubmit)} className="space-y-5 text-gray-600">
            
            {/* CAMPO HIDDEN: ID DO ENDEREÇO */}
            <input
              type="hidden"
              {...pacienteForm.register('idEndereco', { valueAsNumber: true })}
            />

            {/* DEBUG VISUAL (REMOVA DEPOIS) */}
            {idEndereco && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm mb-4">
                Endereço vinculado: ID <strong>{idEndereco}</strong>
              </div>
            )}

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