import type { PacienteForm } from '../services/types/paciente';

export const validarPaciente = (data: PacienteForm): string | null => {
  if (!data.nome?.trim() || data.nome.trim().length < 3) return 'Nome é obrigatório';
  if (!/^\d{11}$/.test(data.cpf.replace(/\D/g, ''))) return 'CPF: 11 dígitos';
  if (!data.dataNascimento) return 'Data de nascimento é obrigatória';
  if (!/^\d{10,11}$/.test(data.telefone.replace(/\D/g, ''))) return 'Telefone inválido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'E-mail inválido';
  if (!data.idEndereco || data.idEndereco <= 0) return 'Endereço não vinculado';
  return null;
};