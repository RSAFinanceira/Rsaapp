// Execute este código no console do navegador (F12) na página do seu aplicativo

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneXF0aHBocnZwYm1paGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTIwMjgsImV4cCI6MjA2ODE4ODAyOH0.YvrcYFcm3UzpQscBl5W_OgBaH9CdE_X6-qTWwXJmbto'

// Carregar o Supabase
const script = document.createElement('script')
script.src = 'https://unpkg.com/@supabase/supabase-js@2'
document.head.appendChild(script)

script.onload = async () => {
  const { createClient } = window.supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    console.log('🔄 Criando usuário admin...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@rsa.com',
      password: 'Rsa10@',
      options: {
        data: {
          name: 'Administrador RSA',
          role: 'admin'
        }
      }
    })

    if (error) {
      console.error('❌ Erro ao criar usuário admin:', error.message)
      return
    }

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email: admin@rsa.com')
    console.log('🔑 Senha: Rsa10@')
    console.log('👤 Dados:', data)
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
} 