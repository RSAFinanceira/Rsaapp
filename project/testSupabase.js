// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneXF0aHBocnZwYm1paGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTIwMjgsImV4cCI6MjA2ODE4ODAyOH0.YvrcYFcm3UzpQscBl5W_OgBaH9CdE_X6-qTWwXJmbto'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...')
    
    // Teste básico de conexão
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message)
    } else {
      console.log('✅ Conexão com Supabase funcionando!')
      console.log('📊 Dados da sessão:', data)
    }
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
}

testConnection() 