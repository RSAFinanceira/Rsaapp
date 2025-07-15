import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { User } from '../types';
import { users } from '../data/users';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Rsa10@');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      onLogin(user);
      setError('');
    } else {
      setError('Usuário ou senha incorretos!');
    }
  };

  const copyPassword = () => {
    const passwordText = "Rsa10@";
    setPassword(passwordText);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(passwordText);
    }
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[#22c55e] text-white px-4 py-2 rounded-lg shadow-lg';
    notification.textContent = 'Senha copiada para a área de transferência!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-black border border-white p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="https://i.ibb.co/nNzNZZ6g/NOVA-LOGOTIPO.png" 
            alt="RSA PROMOTORA DE CRÉDITO" 
            className="h-24 mx-auto mb-2"
          />
          <p className="text-sm text-white opacity-80">Sistema de Gestão de Leads</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-5 mb-4">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
            <div>
              <label htmlFor="username" className="block text-white text-sm mb-1">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="(seu_usuario)"
                className="w-full px-3 py-1.5 text-sm rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-600"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-white text-sm mb-1">
                Senha
              </label>
              <div className="flex items-center">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm rounded-l bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-purple-600"
                  required
                />
                <div className="flex items-center bg-gray-700 px-2 rounded-r border-t border-r border-b border-gray-700">
                  <span className="text-xs text-gray-300 mr-1">Rsa10@</span>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="hover:text-gray-300"
                    title="Copiar senha"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full py-1.5 px-3 bg-[#6A0DAD] text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none text-sm"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}