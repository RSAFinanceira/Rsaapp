import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneXF0aHBocnZwYm1paGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTIwMjgsImV4cCI6MjA2ODE4ODAyOH0.YvrcYFcm3UzpQscBl5W_OgBaH9CdE_X6-qTWwXJmbto'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupSupabase() {
  try {
    console.log('🔄 Configurando Supabase para RSA Cred...')
    
    // 1. Testar conexão
    console.log('📡 Testando conexão com Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('leads')
      .select('count')
      .limit(1)
    
    if (testError && testError.code === 'PGRST116') {
      console.log('ℹ️ Tabela leads não existe ainda. Vamos criar...')
    } else if (testError) {
      console.error('❌ Erro de conexão:', testError.message)
      return
    } else {
      console.log('✅ Conexão com Supabase estabelecida!')
    }
    
    // 2. Tentar inserir dados de teste para criar a tabela automaticamente
    console.log('📝 Inserindo dados de teste...')
    
    const testLeads = [
      {
        id: 'setup_test_1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        phone: '(11) 99999-9999',
        value: '1.500,00',
        status: 'pending',
        assigned_to: 'barbarafolhari',
        import_date: new Date().toISOString(),
        days: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'setup_test_2',
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        phone: '(11) 88888-8888',
        value: '2.300,00',
        status: 'pending',
        assigned_to: 'vanessasagioratto',
        import_date: new Date().toISOString(),
        days: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'setup_test_3',
        name: 'Pedro Costa',
        cpf: '456.789.123-00',
        phone: '(11) 77777-7777',
        value: '3.100,00',
        status: 'completed',
        assigned_to: 'franreis',
        import_date: new Date().toISOString(),
        days: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]
    
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert(testLeads)
    
    if (insertError) {
      console.error('❌ Erro ao inserir dados de teste:', insertError.message)
      console.log('')
      console.log('📋 INSTRUÇÕES MANUAIS:')
      console.log('1. Acesse: https://supabase.com/dashboard/project/ymmdgxqthphrvpbmihiu')
      console.log('2. Vá em "SQL Editor"')
      console.log('3. Execute o seguinte SQL:')
      console.log('')
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
      console.log('-- Criar índices')
      console.log('CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);')
      console.log('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);')
      console.log('CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);')
      console.log('')
      console.log('-- Configurar RLS')
      console.log('ALTER TABLE leads ENABLE ROW LEVEL SECURITY;')
      console.log('')
      console.log('-- Políticas de segurança')
      console.log('CREATE POLICY "Users can view their own leads" ON leads')
      console.log('  FOR SELECT USING (assigned_to = current_user);')
      console.log('')
      console.log('CREATE POLICY "Admins can view all leads" ON leads')
      console.log('  FOR ALL USING (true);')
      console.log('')
      console.log('CREATE POLICY "Admins can insert leads" ON leads')
      console.log('  FOR INSERT WITH CHECK (true);')
      console.log('')
      console.log('CREATE POLICY "Users can update their own leads" ON leads')
      console.log('  FOR UPDATE USING (assigned_to = current_user);')
      console.log('')
      console.log('4. Após executar o SQL, rode este script novamente.')
      return
    }
    
    console.log('✅ Dados de teste inseridos com sucesso!')
    
    // 3. Verificar se os dados foram inseridos
    console.log('🔍 Verificando dados inseridos...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('leads')
      .select('*')
      .limit(5)
    
    if (verifyError) {
      console.error('❌ Erro ao verificar dados:', verifyError.message)
    } else {
      console.log('✅ Dados verificados com sucesso!')
      console.log(`📊 Total de leads no banco: ${verifyData.length}`)
      
      // Mostrar estatísticas
      const stats = {}
      verifyData.forEach(lead => {
        if (!stats[lead.assigned_to]) {
          stats[lead.assigned_to] = { count: 0, totalValue: 0 }
        }
        stats[lead.assigned_to].count++
        const value = parseFloat(lead.value.replace(',', '.'))
        if (!isNaN(value)) {
          stats[lead.assigned_to].totalValue += value
        }
      })
      
      console.log('📈 Estatísticas:')
      Object.entries(stats).forEach(([user, data]) => {
        console.log(`  ${user}: ${data.count} leads, R$ ${data.totalValue.toFixed(2)}`)
      })
    }
    
    console.log('')
    console.log('🎉 Configuração do Supabase concluída!')
    console.log('🌐 Seu app está pronto em: https://rsaapp-lqh64farl-rafael-addads-projects.vercel.app')
    console.log('')
    console.log('📝 Próximos passos:')
    console.log('1. Acesse o app')
    console.log('2. Faça login como admin')
    console.log('3. Importe leads via CSV')
    console.log('4. Distribua para os vendedores')
    console.log('5. Teste as funcionalidades!')
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
}

setupSupabase() 