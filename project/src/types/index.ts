export interface User {
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
}

export interface Lead {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  value: string;
  status: 'pending' | 'completed' | 'invalid_phone' | 'no_answer';
  importDate: Date;
  days: number;
}

export interface TeamStats {
  [username: string]: {
    received: number;
    completed: number;
  };
}

export interface UserLeads {
  [username: string]: Lead[];
}