import React, { useState } from 'react';
import { Lead } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
}

export default function StatusModal({ isOpen, lead, onClose, onUpdateStatus }: StatusModalProps) {
  const [status, setStatus] = useState<Lead['status']>('pending');

  React.useEffect(() => {
    if (lead) {
      setStatus(lead.status);
    }
  }, [lead]);

  const handleSave = () => {
    if (lead) {
      onUpdateStatus(lead.id, status);
      onClose();
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4 text-white">Atualizar Status do Lead</h3>
        
        <div className="mb-4 text-white">
          <p><strong>Cliente:</strong> {lead.name}</p>
          <p><strong>CPF:</strong> {lead.cpf}</p>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-white">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Lead['status'])}
            className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
          >
            <option value="pending">Pendente</option>
            <option value="completed">Venda Concluída</option>
            <option value="invalid_phone">Telefone Inválido</option>
            <option value="no_answer">Não Atende</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#6A0DAD] text-white rounded hover:bg-purple-800"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}