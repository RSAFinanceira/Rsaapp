import { supabase } from '../lib/supabase'

export async function createAdminUser() {
  try {
    // Criar usuário admin
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
      console.error('Erro ao criar usuário admin:', error)
      return { error }
    }

    console.log('Usuário admin criado com sucesso:', data)
    return { data }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { error: err }
  }
}

// Função para verificar se o usuário admin existe
export async function checkAdminUser() {
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('Erro ao listar usuários:', error)
      return { error }
    }

    const adminUser = users?.find(user => user.email === 'admin@rsa.com')
    return { exists: !!adminUser, user: adminUser }
  } catch (err) {
    console.error('Erro inesperado:', err)
    return { error: err }
  }
} 