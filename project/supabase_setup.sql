-- Configuração do Supabase para RSA Cred
-- Copie e cole este SQL no SQL Editor do Supabase Dashboard

-- 1. Criar tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  phone TEXT NOT NULL,
  value TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'invalid_phone', 'no_answer')),
  import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  days INTEGER DEFAULT 0,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- 3. Configurar Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança
-- Permitir que admins vejam todos os leads
CREATE POLICY "Admins can view all leads" ON leads
  FOR ALL USING (true);

-- Permitir que admins insiram leads
CREATE POLICY "Admins can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Permitir que usuários atualizem seus próprios leads
CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (assigned_to = current_user);

-- 5. Inserir dados de exemplo para teste
INSERT INTO leads (id, name, cpf, phone, value, status, assigned_to) VALUES
  ('test_1', 'João Silva', '123.456.789-00', '(11) 99999-9999', '1.500,00', 'pending', 'barbarafolhari'),
  ('test_2', 'Maria Santos', '987.654.321-00', '(11) 88888-8888', '2.300,00', 'pending', 'vanessasagioratto'),
  ('test_3', 'Pedro Costa', '456.789.123-00', '(11) 77777-7777', '3.100,00', 'completed', 'franreis'),
  ('test_4', 'Ana Oliveira', '789.123.456-00', '(11) 66666-6666', '2.800,00', 'pending', 'monicathais'),
  ('test_5', 'Carlos Lima', '321.654.987-00', '(11) 55555-5555', '1.900,00', 'invalid_phone', 'jessicanolasco');

-- 6. Verificar se tudo foi criado corretamente
SELECT 
  'Tabela criada com sucesso!' as status,
  COUNT(*) as total_leads,
  COUNT(DISTINCT assigned_to) as usuarios_com_leads
FROM leads; 