export interface LoginCpfRequest {
  DS_EMAIL: string;
  CD_CPF: string;
}

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nmNome: string;
    dsEmail: string;
  };
}