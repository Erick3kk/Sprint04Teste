// src/services/api.ts
import axios from 'axios';
import { Paciente } from '../services/types/login';
import { Consulta, Receita, Medico } from '../services/types/consulta';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiService {
  // === LOGIN ===
  public async login(dados: { email: string; cpf: string }): Promise<Paciente> {
    const res = await api.post<Paciente>('/login', dados);
    const paciente = res.data;
    localStorage.setItem('paciente', JSON.stringify(paciente));
    return paciente;
  }

  // === CADASTRO ===
  public async cadastrarEndereco(dados: {
    logradouro: string;
    numero: number;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  }): Promise<{ idEndereco: number }> {
    const res = await api.post('/enderecos/criar', dados);
    return res.data;
  }

  public async cadastrarPaciente(dados: {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    endereco: { idEndereco: number };
  }): Promise<Paciente> {
    const res = await api.post<Paciente>('/pacientes', dados);
    return res.data;
  }

  // === DADOS DO USUÁRIO LOGADO ===
  public getPacienteLogado(): Paciente | null {
    const data = localStorage.getItem('paciente');
    return data ? JSON.parse(data) : null;
  }

  public isLoggedIn(): boolean {
    return !!this.getPacienteLogado();
  }

  public logout(): void {
    localStorage.removeItem('paciente');
  }

  // === CONSULTAS ===
  public async getConsultas(idPaciente: number): Promise<Consulta[]> {
    const res = await api.get<Consulta[]>('/consultas/listar');
    return res.data;
  }

  // === MÉDICOS ===
  public async getMedicos(): Promise<Medico[]> {
    const res = await api.get<Medico[]>('/medicos/listar');
    return res.data;
  }

  // === RECEITAS ===
  public async getReceitas(): Promise<Receita[]> {
    const res = await api.get<Receita[]>('/receitas/listar');
    return res.data;
  }
}

// EXPORTA A INSTÂNCIA ÚNICA
export const apiService = new ApiService();