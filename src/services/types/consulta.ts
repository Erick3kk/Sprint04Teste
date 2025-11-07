// src/services/types/consulta.ts
export interface Consulta {
  idConsulta: number;
  dataHora: string;
  status: 'REALIZADA' | 'AGENDADA' | 'CANCELADA' | null;
  areaMedica: string | null;
  paciente: {
    idPaciente: number;
    nome: string;
  };
  medico: {
    idMedico: number;
    nome: string;
  };
}

export interface Receita {
  idReceita: number;
  medicamento: string;
  dosagem: string;
  dataEmissao: string;
  consulta?: {
    idConsulta: number;
  };
}

export interface Medico {
  idMedico: number;
  nome: string;
  crm: string;
  especialidade: string;
  email: string;
  telefone: string;
}