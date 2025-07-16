import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneXF0aHBocnZwYm1paGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTIwMjgsImV4cCI6MjA2ODE4ODAyOH0.YvrcYFcm3UzpQscBl5W_OgBaH9CdE_X6-qTWwXJmbto'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createUserAdmin() {
  try {
    console.log('🔄 Criando usuário admin...')
    console.log('📧 Email: rafaeladdad@gmail.com')
    console.log('🔑 Senha: Rsa10@')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'rafaeladdad@gmail.com',
      password: 'Rsa10@',
      options: {
        data: {
          name: 'Rafael Addad',
          role: 'admin'
        }
      }
    })

    if (error) {
      console.error('❌ Erro:', error.message)
      console.error('❌ Detalhes:', error)
      
      // Se o erro for de usuário já existir, vamos tentar fazer login
      if (error.message.includes('already registered')) {
        console.log('ℹ️ Usuário já existe. Tentando fazer login...')
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: 'rafaeladdad@gmail.com',
          password: 'Rsa10@'
        })
        
        if (loginError) {
          console.error('❌ Erro no login:', loginError.message)
        } else {
          console.log('✅ Login bem-sucedido!')
          console.log('👤 Dados do usuário:', loginData)
        }
      }
    } else {
      console.log('✅ Usuário admin criado com sucesso!')
      console.log('📧 Email: rafaeladdad@gmail.com')
      console.log('🔑 Senha: Rsa10@')
      console.log('👤 Dados:', data)
    }
    
  } catch (err) {
    console.error('❌ Erro inesperado:', err)
  }
}

createUserAdmin() 