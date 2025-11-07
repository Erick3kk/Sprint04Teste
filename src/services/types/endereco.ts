// src/services/types/endereco.ts
export interface EnderecoRequest {
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  estado: string;
  cidade: string;
  cep: string;
}

export interface EnderecoResponse {
  idEndereco: number;
}