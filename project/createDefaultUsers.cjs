const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ymmdgxqthphrvpbmihiu.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbWRneHF0aHBocnZwYm1paGl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjYxMjAyOCwiZXhwIjoyMDY4MTg4MDI4fQ.yv26a1LkGb1g3EO9D_585o3OOBu1y4Cg-oLHWUC5vo0';

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