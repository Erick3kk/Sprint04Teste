import { Consulta } from "./consulta";

export interface Receita {
  idReceita: number;
  medicamento: string;
  dosagem: string;
  consulta: Consulta;
}