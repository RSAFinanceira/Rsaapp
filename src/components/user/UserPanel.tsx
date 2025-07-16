import React, { useState } from 'react';
import { Lead, TeamStats, User } from '../../types';
import ClientManagement from './ClientManagement';
import RankingView from '../shared/RankingView';
import ScriptsView from '../shared/ScriptsView';

interface UserPanelProps {
  currentUser: User;
  userLeads: Lead[];
  teamStats: TeamStats;
  onUpdateStatus: (leadId: string, newStatus: Lead['status']) => void;
  onOpenStatusModal: (lead: Lead) => void;
}

export default function UserPanel({ 
  currentUser, 
  userLeads, 
  teamStats, 
  onUpdateStatus, 
  onOpenStatusModal 
}: UserPanelProps) {
  const [activeTab, setActiveTab] = useState('clients');

  const tabs = [
    { id: 'clients', label: 'Meus Clientes' },
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
      {activeTab === 'clients' && (
        <ClientManagement
          leads={userLeads}
          onUpdateStatus={onUpdateStatus}
          onOpenStatusModal={onOpenStatusModal}
        />
      )}

      {activeTab === 'ranking' && (
        <div className="bg-[#121212] rounded-lg p-6 mb-6">
          <RankingView teamStats={teamStats} currentUser={currentUser} />
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