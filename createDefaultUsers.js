const { createClient } = require('@supabase/supabase-js');

// Use sua service role key (NUNCA coloque no frontend)
const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co';
const serviceRoleKey = 'COLE_AQUI_SUA_SERVICE_ROLE_KEY'; // Pegue no painel do Supabase > Project Settings > API

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createUsers() {
  // Admin
  const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
    email: 'rafaeladdad@gmail.com',
    password: 'Rsa10@',
    user_metadata: { name: 'Admin', role: 'admin' },
    email_confirm: true
  });
  if (adminError) {
    console.error('Erro ao criar admin:', adminError.message);
  } else {
    console.log('Admin criado:', admin.user.email);
  }

  // Usuário teste
  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email: 'rsacreditos@gmail.com',
    password: 'Rsa10@',
    user_metadata: { name: 'Rafateste', role: 'user' },
    email_confirm: true
  });
  if (userError) {
    console.error('Erro ao criar usuário teste:', userError.message);
  } else {
    console.log('Usuário teste criado:', user.user.email);
  }
}

createUsers(); 