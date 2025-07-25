console.log('🔄 Configuração Manual do Supabase para RSA Cred')
console.log('')
console.log('📋 Siga estas instruções para configurar o Supabase:')
console.log('')
console.log('1️⃣ Acesse o Supabase Dashboard:')
console.log('   https://supabase.com/dashboard/project/ymmdgxqthphrvpbmihiu')
console.log('')
console.log('2️⃣ Vá em "SQL Editor" (no menu lateral)')
console.log('')
console.log('3️⃣ Execute o seguinte SQL:')
console.log('')
console.log('-- Criar tabela de leads')
console.log('CREATE TABLE IF NOT EXISTS leads (')
console.log('  id TEXT PRIMARY KEY,')
console.log('  name TEXT NOT NULL,')
console.log('  cpf TEXT NOT NULL,')
console.log('  phone TEXT NOT NULL,')
console.log('  value TEXT NOT NULL,')
console.log('  status TEXT DEFAULT \'pending\' CHECK (status IN (\'pending\', \'completed\', \'invalid_phone\', \'no_answer\')),')
console.log('  import_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),')
console.log('  days INTEGER DEFAULT 0,')
console.log('  assigned_to TEXT,')
console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),')
console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()')
console.log(');')
console.log('')
console.log('-- Criar índices para performance')
console.log('CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);')
console.log('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);')
console.log('CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);')
console.log('')
console.log('-- Configurar Row Level Security (RLS)')
console.log('ALTER TABLE leads ENABLE ROW LEVEL SECURITY;')
console.log('')
console.log('-- Políticas de segurança')
console.log('-- Permitir que admins vejam todos os leads')
console.log('CREATE POLICY "Admins can view all leads" ON leads')
console.log('  FOR ALL USING (true);')
console.log('')
console.log('-- Permitir que admins insiram leads')
console.log('CREATE POLICY "Admins can insert leads" ON leads')
console.log('  FOR INSERT WITH CHECK (true);')
console.log('')
console.log('-- Permitir que usuários atualizem seus próprios leads')
console.log('CREATE POLICY "Users can update their own leads" ON leads')
console.log('  FOR UPDATE USING (assigned_to = current_user);')
console.log('')
console.log('4️⃣ Após executar o SQL, clique em "Run"')
console.log('')
console.log('5️⃣ Vá em "Table Editor" e verifique se a tabela "leads" foi criada')
console.log('')
console.log('6️⃣ Teste inserindo alguns dados de exemplo:')
console.log('')
console.log('INSERT INTO leads (id, name, cpf, phone, value, status, assigned_to) VALUES')
console.log('  (\'test_1\', \'João Silva\', \'123.456.789-00\', \'(11) 99999-9999\', \'1.500,00\', \'pending\', \'barbarafolhari\'),')
console.log('  (\'test_2\', \'Maria Santos\', \'987.654.321-00\', \'(11) 88888-8888\', \'2.300,00\', \'pending\', \'vanessasagioratto\'),')
console.log('  (\'test_3\', \'Pedro Costa\', \'456.789.123-00\', \'(11) 77777-7777\', \'3.100,00\', \'completed\', \'franreis\');')
console.log('')
console.log('7️⃣ Verifique se os dados foram inseridos corretamente')
console.log('')
console.log('✅ Após completar estes passos, seu Supabase estará configurado!')
console.log('')
console.log('🌐 Acesse seu app: https://rsaapp-lqh64farl-rafael-addads-projects.vercel.app')
console.log('')
console.log('📝 Funcionalidades que estarão disponíveis:')
console.log('   ✅ Importação de leads via CSV')
console.log('   ✅ Distribuição de leads para vendedores')
console.log('   ✅ Visualização individual de leads por usuário')
console.log('   ✅ Atualização de status (Venda Concluída, Telefone não atende, etc.)')
console.log('   ✅ Estatísticas de quantidade e valor total por usuário')
console.log('')
console.log('🎉 Configuração concluída! Seu sistema está pronto para uso.') 