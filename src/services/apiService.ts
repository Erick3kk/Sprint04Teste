// src/services/apiService.ts
import { LoginRequest, Paciente } from './types/login';
import { Consulta, Medico, Receita } from './types/consulta';
import { AgendamentoPayload } from './types/agendamento';

const API_BASE = 'https://challengejavasprint04-1.onrender.com';

class ApiService {
  private readonly KEY = 'usuarioLogado';

  // === LOGIN ===
  public async login(dados: LoginRequest): Promise<Paciente> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro || 'Erro no login');
    }

    const paciente: Paciente = await res.json();
    localStorage.setItem(this.KEY, JSON.stringify(paciente));
    return paciente;
  }

  public getPacienteLogado(): Paciente | null {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  public isLoggedIn(): boolean {
    return !!this.getPacienteLogado();
  }

  public logout(): void {
    localStorage.removeItem(this.KEY);
  }

  // === CONSULTAS ===
  public async getConsultasDoPaciente(idPaciente: number): Promise<Consulta[]> {
    const res = await fetch(`${API_BASE}/consultas/consultaPaciente/${idPaciente}`);
    if (!res.ok) throw new Error('Erro ao carregar consultas');
    return await res.json();
  }

  public async getConsulta(idConsulta: number): Promise<Consulta> {
    const user = this.getPacienteLogado();
    if (!user) throw new Error('Usuário não logado');

    const consultas = await this.getConsultasDoPaciente(user.idPaciente);
    const consulta = consultas.find(c => c.idConsulta === idConsulta);
    if (!consulta) throw new Error('Consulta não encontrada');
    return consulta;
  }

  public async atualizarConsulta(dados: { idConsulta: number; status: string }): Promise<void> {
    const res = await fetch(`${API_BASE}/consultas/atualizar`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro || 'Erro ao atualizar consulta');
    }
  }

  // === RECEITAS ===
  public async criarReceita(dados: {
    idConsulta: number;
    medicamento: string;
    dosagem: string;
  }): Promise<Receita> {
    const res = await fetch(`${API_BASE}/receitas/criar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro || 'Erro ao criar receita');
    }

    return await res.json();
  }

  public async getReceitasDaConsulta(idConsulta: number): Promise<Receita[]> {
    const res = await fetch(`${API_BASE}/receitas/receitaConsulta/${idConsulta}`);
    if (!res.ok) return [];
    return await res.json();
  }

  // === MÉDICOS ===
  public async getMedicos(): Promise<Medico[]> {
    try {
      const res = await fetch(`${API_BASE}/medicos/listar`);
      if (!res.ok) {
        const erro = await res.text();
        throw new Error(erro || 'Erro ao carregar médicos');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Erro na API de médicos:', err);
      throw new Error('Falha na conexão com o servidor');
    }
  }

  // === AGENDAMENTO ===
  public async criarConsulta(payload: AgendamentoPayload): Promise<void> {
    const res = await fetch(`${API_BASE}/consultas/criar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const erro = await res.text();
      throw new Error(erro || 'Erro ao agendar consulta');
    }
  }

  public getPacienteId(): number | null {
    const user = localStorage.getItem('usuarioLogado');
    if (!user) return null;
    try {
      const parsed = JSON.parse(user);
      return parsed.idPaciente ?? null;
    } catch {
      return null;
    }
  }
}

export const apiService = new ApiService();