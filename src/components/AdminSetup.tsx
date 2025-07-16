import React, { useState } from 'react'
import { createAdminUser } from '../utils/createAdmin'

export default function AdminSetup() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleCreateAdmin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const result = await createAdminUser()
      
      if (result.error) {
        setMessage(`Erro: ${(result.error as any).message || 'Erro desconhecido'}`)
      } else {
        setMessage('✅ Usuário admin criado com sucesso! Email: admin@rsa.com, Senha: Rsa10@')
      }
    } catch (err) {
      setMessage(`Erro inesperado: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-black border border-white p-8 rounded-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Configuração do Admin</h2>
          <p className="text-sm text-white opacity-80">Criar usuário administrador</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-5 mb-4">
          <div className="space-y-4">
            <div>
              <p className="text-white text-sm mb-2">
                <strong>Email:</strong> admin@rsa.com
              </p>
              <p className="text-white text-sm mb-4">
                <strong>Senha:</strong> Rsa10@
              </p>
            </div>
            
            <button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="w-full py-2 px-4 bg-[#6A0DAD] text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Usuário Admin'}
            </button>
            
            {message && (
              <div className={`text-sm text-center p-3 rounded ${
                message.includes('Erro') ? 'text-red-400 bg-red-900/20' : 'text-green-400 bg-green-900/20'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 