import type { AgendamentoPayload } from '../services/types/agendamento';

export const validarAgendamento = (data: AgendamentoPayload): string | null => {
  if (!data.idPaciente) return 'Paciente não autenticado';
  if (!data.idMedico) return 'Selecione um médico';
  if (!data.dataHora) return 'Selecione data e horário';
  if (!data.areaMedica) return 'Especialidade não informada';
  return null;
};