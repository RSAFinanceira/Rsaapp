# Configuração do Supabase para RSA Cred

## 1. Criar Tabela de Leads

Acesse o Supabase Dashboard e execute o seguinte SQL no SQL Editor:

```sql
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

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
```

## 2. Configurar Políticas de Segurança (RLS)

Execute o seguinte SQL para configurar as políticas de segurança:

```sql
-- Habilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios leads
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (assigned_to = current_user);

-- Política para admins verem todos os leads
CREATE POLICY "Admins can view all leads" ON leads
  FOR ALL USING (current_user IN ('admin@rsa.com', 'rafaeladdad@gmail.com'));

-- Política para inserir leads (apenas admins)
CREATE POLICY "Admins can insert leads" ON leads
  FOR INSERT WITH CHECK (current_user IN ('admin@rsa.com', 'rafaeladdad@gmail.com'));

-- Política para atualizar status (usuários podem atualizar seus próprios leads)
CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (assigned_to = current_user);
```

## 3. Testar a Configuração

Após configurar a tabela e as políticas, você pode:

1. **Importar leads via CSV** com o cabeçalho: `NOME,CPF,TELEFONE,VALOR LIBERADO`
2. **Distribuir leads** para os vendedores
3. **Ver estatísticas** no painel de desempenho da equipe
4. **Usuários podem acessar** apenas os leads que lhes foram atribuídos

## 4. Funcionalidades Implementadas

✅ **Importação de CSV**: Suporte para planilhas com NOME, CPF, TELEFONE, VALOR LIBERADO
✅ **Distribuição de leads**: Escolha quantidade e vendedor
✅ **Salvamento no Supabase**: Leads são salvos no banco de dados
✅ **Visualização individual**: Cada usuário vê apenas seus leads
✅ **Estatísticas da equipe**: Mostra quantidade de leads e valor total por usuário
✅ **Atualização de status**: Venda Concluída, Telefone não atende, Não é o cliente

## 5. Estrutura dos Dados

### Tabela `leads`:
- `id`: Identificador único do lead
- `name`: Nome do cliente
- `cpf`: CPF do cliente
- `phone`: Telefone do cliente
- `value`: Valor liberado (formato: "1.500,00")
- `status`: Status do lead (pending, completed, invalid_phone, no_answer)
- `import_date`: Data de importação
- `days`: Dias desde a importação
- `assigned_to`: Username do vendedor responsável
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 6. Como Usar

1. **Admin**: Faça login como admin
2. **Importe leads**: Selecione arquivo CSV e clique em "Importar"
3. **Distribua leads**: Escolha vendedor, quantidade e clique em "Distribuir Leads"
4. **Vendedores**: Façam login e vejam seus leads atribuídos
5. **Atualize status**: Clique no lead para marcar como "Venda Concluída", "Telefone não atende" ou "Não é o cliente"

## 7. Troubleshooting

Se houver problemas:

1. Verifique se a tabela `leads` foi criada corretamente
2. Confirme se as políticas RLS estão ativas
3. Verifique as chaves de API no arquivo `src/lib/supabase.ts`
4. Teste a conexão com o Supabase 