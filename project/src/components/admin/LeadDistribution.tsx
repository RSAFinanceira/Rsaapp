import React, { useState } from 'react';
import { Plus, Minus, Upload } from 'lucide-react';
import { Lead } from '../../types';
import { users } from '../../data/users';
import { parseCSV } from '../../utils/csvParser';
import { showNotification } from '../../utils/notifications';
import { saveLeadsToSupabase } from '../../utils/supabaseLeads';

interface LeadDistributionProps {
  allLeads: Lead[];
  setAllLeads: (leads: Lead[]) => void;
  onDistributeLeads: (vendor: string, quantity: number) => void;
}

export default function LeadDistribution({ allLeads, setAllLeads, onDistributeLeads }: LeadDistributionProps) {
  const [selectedVendor, setSelectedVendor] = useState('');
  const [leadQuantity, setLeadQuantity] = useState(10);
  const [fileName, setFileName] = useState('Nenhum arquivo selecionado');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    
    try {
      const newLeads = await parseCSV(file);
      const existingCPFs = new Set(allLeads.map(lead => lead.cpf));
      const uniqueLeads = newLeads.filter(lead => !existingCPFs.has(lead.cpf));
      const duplicateCount = newLeads.length - uniqueLeads.length;
      
      setAllLeads([...allLeads, ...uniqueLeads]);
      
      if (duplicateCount > 0) {
        showNotification(`${uniqueLeads.length} leads importados. ${duplicateCount} CPFs duplicados foram ignorados.`, 'warning');
      } else {
        showNotification(`${uniqueLeads.length} leads importados com sucesso!`);
      }
    } catch (error) {
      showNotification('Erro ao importar arquivo. Verifique o formato.', 'error');
    }
  };

  const handleDistribute = async () => {
    if (!selectedVendor) {
      showNotification('Selecione um vendedor!', 'error');
      return;
    }
    
    if (allLeads.length === 0) {
      showNotification('Importe leads antes de distribuir!', 'error');
      return;
    }
    
    // Pegar os leads a serem distribuídos
    const leadsToDistribute = allLeads.slice(0, leadQuantity);
    
    // Adicionar o campo assigned_to aos leads
    const leadsWithAssignment = leadsToDistribute.map(lead => ({
      ...lead,
      assigned_to: selectedVendor
    }));
    
    // Salvar no Supabase
    const result = await saveLeadsToSupabase(leadsWithAssignment, selectedVendor);
    
    if (result.success) {
      // Chamar a função de distribuição local
      onDistributeLeads(selectedVendor, leadQuantity);
      showNotification('Leads distribuídos e salvos no banco de dados!', 'success');
    } else {
      showNotification(`Erro ao salvar leads: ${result.error}`, 'error');
    }
  };

  const vendorOptions = users.filter(user => user.role === 'user');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">
        Distribuição de Leads
      </h2>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white">
          Importar Leads (Excel)
        </label>
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition">
            <span className="text-gray-400 text-sm truncate">{fileName}</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <button className="px-4 py-2 bg-[#a855f7] text-white rounded-lg hover:bg-[#9333ea] transition flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importar
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white">
          Selecione um vendedor
        </label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#a855f7]"
        >
          <option value="">Selecione um vendedor</option>
          {vendorOptions.map(user => (
            <option key={user.username} value={user.username}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white">
          Quantidade de leads
        </label>
        <div className="flex items-center">
          <button
            onClick={() => setLeadQuantity(Math.max(1, leadQuantity - 1))}
            className="px-3 py-1 bg-gray-800 text-white rounded-l-lg hover:bg-gray-700 transition"
          >
            <Minus className="h-5 w-5" />
          </button>
          <input
            type="number"
            value={leadQuantity}
            onChange={(e) => setLeadQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            min="1"
            max="100"
            className="w-16 text-center py-1 bg-gray-900 border-t border-b border-gray-700 text-white focus:outline-none"
          />
          <button
            onClick={() => setLeadQuantity(Math.min(100, leadQuantity + 1))}
            className="px-3 py-1 bg-gray-800 text-white rounded-r-lg hover:bg-gray-700 transition"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <button
        onClick={handleDistribute}
        className="w-full py-3 bg-[#a855f7] text-white font-semibold rounded-lg shadow-md hover:bg-[#9333ea] transition"
      >
        Distribuir Leads
      </button>
    </div>
  );
}