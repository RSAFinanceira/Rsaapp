import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Rsa10@');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      if (error) {
        setMessage(`Erro: ${error.message}`);
      } else {
        setMessage('Usuário cadastrado com sucesso!');
        setName('');
        setEmail('');
        setPassword('Rsa10@');
        setRole('user');
      }
    } catch (err) {
      setMessage('Erro inesperado ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 max-w-md">
      <div>
        <label className="block text-white mb-1">Nome</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700" />
      </div>
      <div>
        <label className="block text-white mb-1">E-mail</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700" />
      </div>
      <div>
        <label className="block text-white mb-1">Senha</label>
        <input type="text" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700" />
      </div>
      <div>
        <label className="block text-white mb-1">Tipo</label>
        <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700">
          <option value="user">Usuário</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={loading} className="w-full py-2 bg-[#a855f7] text-white rounded-lg font-semibold hover:bg-[#9333ea] transition">
        {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
      </button>
      {message && <div className="mt-2 text-center text-sm text-yellow-400">{message}</div>}
    </form>
  );
} 