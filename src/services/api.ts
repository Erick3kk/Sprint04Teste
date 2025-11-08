// src/services/apiService.ts
import { LoginRequest, Paciente } from './types/login';
import { Consulta, Receita } from './types/consulta';

const API_BASE = 'http://localhost:8080';

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
    if (!res.ok) return []; // Silencioso se não tiver
    return await res.json();
  }
}

export const apiService = new ApiService();