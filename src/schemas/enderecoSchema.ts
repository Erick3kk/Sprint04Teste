import type { EnderecoForm } from '../services/types/endereco';

export const validarEndereco = (data: EnderecoForm): string | null => {
  if (!data.logradouro?.trim()) return 'Logradouro é obrigatório';
  if (!data.numero?.trim()) return 'Número é obrigatório';
  if (!data.bairro?.trim()) return 'Bairro é obrigatório';
  if (!data.cidade?.trim()) return 'Cidade é obrigatória';
  if (!data.estado?.trim() || data.estado.trim().length !== 2) return 'Estado: 2 letras';
  if (!/^\d{8}$/.test(data.cep.replace(/\D/g, ''))) return 'CEP: 8 dígitos';
  return null;
};