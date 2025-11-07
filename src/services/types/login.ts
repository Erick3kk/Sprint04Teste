export interface LoginRequest {
  cpf: string;
  email: string;
}

export interface Paciente {
  idPaciente: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: {
    idEndereco: number;
    logradouro: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    estado: string;
    cidade: string;
    cep: string;
  };
}