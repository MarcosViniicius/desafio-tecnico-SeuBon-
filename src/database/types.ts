export interface Funcionario {
  funcionario_id: number;
  nome: string;
  email: string;
}

export interface Tarefa {
  tarefa_id: number;
  nomeTarefa: string;
  descricaoTarefa: string;
  prazoTarefa: string;
  prioridadeTarefa?: number;
  funcionario_id: number | null;
}
