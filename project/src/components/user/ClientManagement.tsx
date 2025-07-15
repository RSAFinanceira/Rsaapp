import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Lead } from '../../types';

interface ClientManagementProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
  onOpenStatusModal: (lead: Lead) => void;
}

export default function ClientManagement({ leads, onUpdateStatus, onOpenStatusModal }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter(lead => {
    const currentDate = new Date();
    const importDate = new Date(lead.importDate);
    const diffTime = Math.abs(currentDate.getTime() - importDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Filter out leads older than 6 days
    if (diffDays > 6) return false;
    
    // Update days for display
    lead.days = diffDays;
    
    // Filter by search term
    if (searchTerm) {
      return lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             lead.cpf.includes(searchTerm);
    }
    
    return true;
  });

  const completedSales = filteredLeads.filter(lead => lead.status === 'completed').length;

  const getStatusBadge = (status: Lead['status']) => {
    switch(status) {
      case 'completed':
        return 'bg-[#10B981] text-white';
      case 'invalid_phone':
      case 'no_answer':
        return 'bg-[#EF4444] text-white';
      default:
        return 'bg-[#F59E0B] text-black';
    }
  };

  const getStatusText = (status: Lead['status']) => {
    switch(status) {
      case 'completed':
        return 'Venda Concluída';
      case 'invalid_phone':
        return 'Telefone Inválido';
      case 'no_answer':
        return 'Não Atende';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="bg-[#121212] rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Meus Clientes</h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Vendas Concluídas</div>
          <div className="text-2xl font-bold text-white">{completedSales}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome ou CPF..."
          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
        />
      </div>
      
      {/* Important Notice */}
      <div className="bg-[#3b0764] border-l-4 border-[#a855f7] p-4 mb-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-[#a855f7]" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">
              <span className="font-bold">Aviso Importante:</span>
              Todos esses clientes estão com saldo via banco ICRED, e com saldo preso por 5 dias.
              Oportunidade de fechar!
            </p>
            <p className="mt-2 text-sm text-gray-300">
              Sempre indique se o telefone é ou não é do cliente, para ajudarmos na higienização dos contatos.
            </p>
          </div>
        </div>
      </div>
      
      {/* Clients Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Nome</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">CPF</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Telefone</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Valor Liberado</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Dias</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Status</th>
                <th className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="text-xs sm:text-sm">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                    Nenhum cliente atribuído
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white">{lead.name}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white">{lead.cpf}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white">{lead.phone || 'N/A'}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white">R${lead.value}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white">{lead.days || 0}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => onOpenStatusModal(lead)}
                        className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 text-xs sm:text-sm transition-colors"
                      >
                        Atualizar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}