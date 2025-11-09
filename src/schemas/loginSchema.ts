import type { LoginRequest } from '../services/types/login';

export const validarLogin = (data: LoginRequest): string | null => {
  const cpfLimpo = data.cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return 'CPF deve ter 11 dígitos';

  const email = data.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'E-mail inválido';

  return null;
};