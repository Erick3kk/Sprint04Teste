import * as z from 'zod';

export const enderecoSchema = z.object({
  DS_LOGRADOURO: z.string().min(3, 'Logradouro é obrigatório'),
  NR_NUMERO: z.string().min(1, 'Número é obrigatório'),
  DS_COMPLEMENTO: z.string().optional().nullable(),
  NM_BAIRRO: z.string().min(2, 'Bairro é obrigatório'),
  NM_CIDADE: z.string().min(2, 'Cidade é obrigatória'),
  SG_ESTADO: z
    .string()
    .length(2, 'Estado deve ter 2 letras (ex: SP)')
    .toUpperCase(),
  NR_CEP: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (use 00000-000)')
    .transform((val) => val.replace(/\D/g, '')),
});

export type EnderecoForm = z.infer<typeof enderecoSchema>;