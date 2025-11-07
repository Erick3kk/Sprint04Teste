// src/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  DS_EMAIL: z.string().email('E-mail inválido'),
  CD_CPF: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
});

export type LoginForm = z.infer<typeof loginSchema>;