// src/services/types/paciente.ts
export interface PacienteRequest {
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: {
    idEndereco: number;
  };
}

export interface PacienteResponse {
  idPaciente: number;
}