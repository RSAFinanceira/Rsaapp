import React, { useState } from 'react';
import { Lead, TeamStats, UserLeads } from '../../types';
import LeadDistribution from './LeadDistribution';
import LeadsPreview from './LeadsPreview';
import TeamPerformance from './TeamPerformance';
import RankingView from '../shared/RankingView';
import ScriptsView from '../shared/ScriptsView';

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
    updatedTeamStats[vendor].received += leadsToDistribute.length;
    setTeamStats(updatedTeamStats);
    
    // Calculate total value
    const totalValue = leadsToDistribute.reduce((sum, lead) => {
      const numValue = parseFloat(lead.value.replace(',', '.'));
      return sum + (isNaN(numValue) ? 0 : numValue);
    }, 0);
    
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
    { id: 'scripts', label: 'Scripts de Vendas' }
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
                className={`inline-block p-4 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-[#a855f7]'
                    : 'text-gray-400 hover:text-white border-transparent hover:border-gray-600'
                }`}
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
    </div>
  );
}