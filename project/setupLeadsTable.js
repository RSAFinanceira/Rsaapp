import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneXF0aHBocnZwYm1paGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTIwMjgsImV4cCI6MjA2ODE4ODAyOH0.YvrcYFcm3UzpQscBl5W_OgBaH9CdE_X6-qTWwXJmbto'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupLeadsTable() {
  try {
    console.log('🔄 Configurando tabela de leads...')
    
    // SQL para criar a tabela de leads
    const createTableSQL = `
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
      
      -- Criar índice para melhorar performance
      CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
    `
    
    // Executar o SQL usando a função rpc do Supabase
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (error) {
      console.error('❌ Erro ao criar tabela:', error.message)
      
      // Se não conseguir executar via RPC, vamos tentar inserir alguns dados de teste
      console.log('ℹ️ Tentando inserir dados de teste...')
      
      const testLeads = [
        {
          id: 'test_lead_1',
          name: 'João Silva',
          cpf: '123.456.789-00',
          phone: '(11) 99999-9999',
          value: '1.500,00',
          status: 'pending',
          assigned_to: 'barbarafolhari',
          created_at: new Date().toISOString()
        },
        {
          id: 'test_lead_2',
          name: 'Maria Santos',
          cpf: '987.654.321-00',
          phone: '(11) 88888-8888',
          value: '2.300,00',
          status: 'pending',
          assigned_to: 'vanessasagioratto',
          created_at: new Date().toISOString()
        }
      ]
      
      const { data: insertData, error: insertError } = await supabase
        .from('leads')
        .insert(testLeads)
      
      if (insertError) {
        console.error('❌ Erro ao inserir dados de teste:', insertError.message)
        console.log('ℹ️ Você pode precisar criar a tabela manualmente no Supabase Dashboard')
        console.log('ℹ️ SQL para criar a tabela:')
        console.log(createTableSQL)
      } else {
        console.log('✅ Dados de teste inseridos com sucesso!')
      }
    } else {
      console.log('✅ Tabela de leads criada com sucesso!')
    }
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
}

setupLeadsTable() 