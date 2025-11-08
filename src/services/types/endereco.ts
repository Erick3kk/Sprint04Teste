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


export type EnderecoForm = {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};