import { supabase } from '../lib/supabase';

export async function ensureDefaultUsers() {
  // Admin
  await supabase.auth.admin.createUser({
    email: 'rafaeladdad@gmail.com',
    password: 'Rsa10@',
    user_metadata: { name: 'Admin', role: 'admin' },
    email_confirm: true
  });

  // Usuário padrão
  await supabase.auth.admin.createUser({
    email: 'rsacreditos@gmail.com',
    password: 'Rsa10@',
    user_metadata: { name: 'Rafateste', role: 'user' },
    email_confirm: true
  });
} 