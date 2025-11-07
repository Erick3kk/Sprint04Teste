import { Paciente } from "./types/login";

class ApiService {

  public getPacienteLogado(): Paciente | null {
    const data = localStorage.getItem('paciente');
    return data ? JSON.parse(data) : null;
  }

  public isLoggedIn(): boolean {
    return !!this.getPacienteLogado();
  }

  public logout() {
    localStorage.removeItem('paciente');
  }
}

export const apiService = new ApiService();