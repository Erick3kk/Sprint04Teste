export interface Medico {
  idMedico: number;
  nome: string;
  especialidade: string;
}

export interface AgendamentoPayload {
  dataHora: string;
  status: 'AGENDADA';
  areaMedica: string;
  idPaciente: number;
  idMedico: number;
}