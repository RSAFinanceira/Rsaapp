import React from 'react';
import { Lead } from '../../types';

interface LeadsPreviewProps {
  leads: Lead[];
}

export default function LeadsPreview({ leads }: LeadsPreviewProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">
        Visualização de Leads
      </h2>
      
      <div className="overflow-x-auto bg-gray-900 rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nome
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                CPF
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Telefone
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Valor Liberado
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 px-4 text-center text-gray-500">
                  Nenhum lead importado
                </td>
              </tr>
            ) : (
              <>
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-sm text-white">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-white">{lead.cpf}</td>
                    <td className="py-3 px-4 text-sm text-white">{lead.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-white">R${lead.value}</td>
                  </tr>
                ))}
                {leads.length > 5 && (
                  <tr>
                    <td colSpan={4} className="py-2 px-4 text-center text-gray-500 text-sm">
                      + {leads.length - 5} leads adicionais
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}