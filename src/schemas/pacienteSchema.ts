import * as z from 'zod';

export const pacienteSchema = z.object({
  NM_NOME: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  CD_CPF: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
    .transform((val) => val.replace(/\D/g, '')),
  DT_NASCIMENTO: z.string().min(1, 'Data de nascimento é obrigatória'),
  NR_TELEFONE: z
    .string()
    .min(14, 'Telefone inválido')
    .transform((val) => val.replace(/\D/g, '')),
  DS_EMAIL: z.string().email('E-mail inválido'),
});

export type PacienteForm = z.infer<typeof pacienteSchema>;