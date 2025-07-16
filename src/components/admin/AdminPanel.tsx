import React, { useState, useEffect } from 'react';
import { Lead, TeamStats, UserLeads } from '../../types';
import { getTeamStatsFromSupabase } from '../../utils/supabaseLeads';
import LeadDistribution from './LeadDistribution';
import LeadsPreview from './LeadsPreview';
import TeamPerformance from './TeamPerformance';
import RankingView from '../shared/RankingView';
import ScriptsView from '../shared/ScriptsView';
import UserRegister from './UserRegister';

interface AdminPanelProps {
  allLeads: Lead[];
  setAllLeads: (leads: Lead[]) => void;
  userLeads: UserLeads;
  setUserLeads: (userLeads: UserLeads) => void;
  teamStats: TeamStats;
  setTeamStats: (teamStats: TeamStats) => void;
}

export default function AdminPanel({ 
  allLeads, 
  setAllLeads, 
  userLeads, 
  setUserLeads, 
  teamStats, 
  setTeamStats 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('leads');

  // Carregar estatísticas do Supabase quando o componente montar
  useEffect(() => {
    const loadTeamStats = async () => {
      try {
        const statsFromSupabase = await getTeamStatsFromSupabase();
        setTeamStats(statsFromSupabase);
      } catch (error) {
        console.error('Erro ao carregar estatísticas da equipe:', error);
      }
    };

    loadTeamStats();
  }, [setTeamStats]);

  const handleDistributeLeads = (vendor: string, quantity: number) => {
    const availableLeads = Math.min(quantity, allLeads.length);
    const leadsToDistribute = allLeads.slice(0, availableLeads);
    
    // Remove distributed leads from the main pool
    setAllLeads(allLeads.slice(availableLeads));
    
    // Add leads to the selected vendor
    const updatedUserLeads = { ...userLeads };
    if (!updatedUserLeads[vendor]) {
      updatedUserLeads[vendor] = [];
    }
    updatedUserLeads[vendor] = [...updatedUserLeads[vendor], ...leadsToDistribute];
    setUserLeads(updatedUserLeads);
    
    // Update team stats
    const updatedTeamStats = { ...teamStats };
    if (!updatedTeamStats[vendor]) {
      updatedTeamStats[vendor] = { received: 0, completed: 0, totalValue: 0 };
    }
    updatedTeamStats[vendor].received += leadsToDistribute.length;
    
    // Calculate total value
    const totalValue = leadsToDistribute.reduce((sum, lead) => {
      const numValue = parseFloat(lead.value.replace(',', '.'));
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);
    
    updatedTeamStats[vendor].totalValue += totalValue;
    setTeamStats(updatedTeamStats);
    
    // Show success notification
    const vendorName = require('../../data/users').users.find((u: any) => u.username === vendor)?.name || vendor;
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[#22c55e] text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
      <div class="font-bold">✅ Leads distribuídos com sucesso!</div>
      <div class="mt-1">Foram distribuídos ${leadsToDistribute.length} leads para ${vendorName}</div>
      <div class="mt-1">💰 Valor total liberado: R$${totalValue.toFixed(2).replace('.', ',')}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  const tabs = [
    { id: 'leads', label: 'Gestão de Leads' },
    { id: 'ranking', label: 'Ranking de Vendas' },
    { id: 'scripts', label: 'Scripts de Vendas' },
    { id: 'register', label: 'Cadastrar Usuários' } // Nova aba
  ];

  return (
    <div className="container mx-auto p-4">
      {/* Tab Navigation */}
      <div className="mb-4 border-b border-gray-800">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <li key={tab.id} className="mr-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`inline-block p-4 border-b-2 rounded-t-lg transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-black border-[#a855f7]'
                    : 'bg-black text-white border-transparent'}
                `}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      {activeTab === 'leads' && (
        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <LeadDistribution
                allLeads={allLeads}
                setAllLeads={setAllLeads}
                onDistributeLeads={handleDistributeLeads}
              />
              <div className="mt-6">
                <LeadsPreview leads={allLeads} />
              </div>
            </div>
            <div>
              <TeamPerformance teamStats={teamStats} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <RankingView teamStats={teamStats} />
        </div>
      )}

      {activeTab === 'scripts' && (
        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <ScriptsView />
        </div>
      )}

      {activeTab === 'register' && (
        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">
            Cadastro de Usuários
          </h2>
          <UserRegister />
        </div>
      )}
    </div>
  );
}