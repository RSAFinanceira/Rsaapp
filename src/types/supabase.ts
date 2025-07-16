export interface User {
  id: string
  email: string
  name?: string
  role?: 'admin' | 'user'
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted'
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  performance_score?: number
  created_at: string
}

export interface Script {
  id: string
  title: string
  content: string
  category: string
  created_at: string
} 