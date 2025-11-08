// src/pages/CadastroPaciente.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputForm } from '../components/InputForm';
import { Link, useNavigate } from 'react-router-dom';

// TYPES
import type { EnderecoForm } from '../services/types/endereco';
import type { PacienteForm } from '../services/types/paciente';

// VALIDAÇÕES
import { validarEndereco } from '../schemas/enderecoSchema';
import { validarPaciente } from '../schemas/pacienteSchema';

export default function CadastroPaciente() {
  const [step, setStep] = useState<'endereco' | 'paciente'>('endereco');
  const [idEndereco, setIdEndereco] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = 'https://challengejavasprint04-1.onrender.com';

  const enderecoForm = useForm<EnderecoForm>({ defaultValues: { complemento: '' } });
  const pacienteForm = useForm<PacienteForm>({ defaultValues: { idEndereco: 0 } });

  const onEnderecoSubmit = async (data: EnderecoForm) => {
    setLoading(true);
    setError('');

    const erro = validarEndereco(data);
    if (erro) {
      setError(erro);
      setLoading(false);
      return;
    }

    const payload = {
      logradouro: data.logradouro.trim(),
      numero: data.numero.trim(),
      complemento: data.complemento?.trim() || null,
      bairro: data.bairro.trim(),
      cidade: data.cidade.trim(),
      estado: data.estado.toUpperCase().trim(),
      cep: data.cep.replace(/\D/g, ''),
    };

    try {
      const res = await fetch(`${API_BASE}/enderecos/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      const resultado = await res.json();
      const idRecebido = resultado.idEndereco;

      if (!idRecebido) throw new Error('ID do endereço não retornado');

      setIdEndereco(idRecebido);
      pacienteForm.setValue('idEndereco', idRecebido);
      setStep('paciente');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onPacienteSubmit = async (data: PacienteForm) => {
    setLoading(true);
    setError('');

    const erro = validarPaciente(data);
    if (erro) {
      setError(erro);
      setLoading(false);
      return;
    }

    const payload = {
      nome: data.nome.trim(),
      cpf: data.cpf.replace(/\D/g, ''),
      dataNascimento: data.dataNascimento,
      telefone: data.telefone.replace(/\D/g, ''),
      email: data.email.toLowerCase().trim(),
      idEndereco: data.idEndereco
    };

    try {
      const res = await fetch(`${API_BASE}/pacientes/criar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

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

        {/* ETAPA 1: ENDEREÇO */}
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

        {/* ETAPA 2: PACIENTE */}
        {step === 'paciente' && (
          <form onSubmit={pacienteForm.handleSubmit(onPacienteSubmit)} className="space-y-5 text-gray-600">
            <input type="hidden" {...pacienteForm.register('idEndereco', { valueAsNumber: true })} />

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
              <button type="button" onClick={() => setStep('endereco')} className="flex-1 bg-gray-300 py-3 rounded-lg font-bold hover:bg-gray-400 transition">
                Voltar
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-70 transition">
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