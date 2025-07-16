import React, { useState, useEffect } from 'react';
import { Lead, User, TeamStats, UserLeads } from './types';
import { users } from './data/users';
import { useLocalStorage } from './hooks/useLocalStorage';
import { showNotification } from './utils/notifications';
import { getUserLeadsFromSupabase, updateLeadStatus, getTeamStatsFromSupabase } from './utils/supabaseLeads';
import { ensureDefaultUsers } from './utils/ensureDefaultUsers';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import AdminPanel from './components/admin/AdminPanel';
import UserPanel from './components/user/UserPanel';
import StatusModal from './components/StatusModal';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allLeads, setAllLeads] = useLocalStorage<Lead[]>('rsaLeads', []);
  const [userLeads, setUserLeads] = useLocalStorage<UserLeads>('rsaUserLeads', {});
  const [teamStats, setTeamStats] = useLocalStorage<TeamStats>('rsaTeamStats', {
    'barbarafolhari': { received: 0, completed: 0, totalValue: 0 },
    'vanessasagioratto': { received: 0, completed: 0, totalValue: 0 },
    'franreis': { received: 0, completed: 0, totalValue: 0 },
    'monicathais': { received: 0, completed: 0, totalValue: 0 },
    'jessicanolasco': { received: 0, completed: 0, totalValue: 0 },
    'karinabaptista': { received: 0, completed: 0, totalValue: 0 },
    'lucysilva': { received: 0, completed: 0, totalValue: 0 },
    'rogeraugusto': { received: 0, completed: 0, totalValue: 0 },
    'beatrizribeiro': { received: 0, completed: 0, totalValue: 0 }
  });

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Update lead days counter and remove expired leads
  useEffect(() => {
    const updateLeadDays = () => {
      const currentDate = new Date();
      let needsUpdate = false;

      const updatedUserLeads = { ...userLeads };
      
      Object.keys(updatedUserLeads).forEach(username => {
        if (!updatedUserLeads[username]) return;

        const filteredLeads = updatedUserLeads[username].filter(lead => {
          if (!lead.importDate) return true;

          const importDate = new Date(lead.importDate);
          const diffTime = Math.abs(currentDate.getTime() - importDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          lead.days = diffDays;

          // Keep leads that are 6 days old or less
          return diffDays <= 6;
        });

        if (filteredLeads.length !== updatedUserLeads[username].length) {
          updatedUserLeads[username] = filteredLeads;
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        setUserLeads(updatedUserLeads);
      }
    };

    // Check every hour
    const interval = setInterval(updateLeadDays, 1000 * 60 * 60);
    
    // Run immediately
    updateLeadDays();

    return () => clearInterval(interval);
  }, [userLeads, setUserLeads]);

  useEffect(() => {
    ensureDefaultUsers();
  }, []);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    
    // Se for um usuário comum (não admin), carregar seus leads do Supabase
    if (user.role === 'user') {
      try {
        const userLeadsFromSupabase = await getUserLeadsFromSupabase(user.username);
        
        // Atualizar o estado local com os leads do Supabase
        const updatedUserLeads = { ...userLeads };
        updatedUserLeads[user.username] = userLeadsFromSupabase;
        setUserLeads(updatedUserLeads);
        
        // Carregar estatísticas da equipe do Supabase
        const teamStatsFromSupabase = await getTeamStatsFromSupabase();
        setTeamStats(teamStatsFromSupabase);
        
      } catch (error) {
        console.error('Erro ao carregar leads do usuário:', error);
        showNotification('Erro ao carregar dados do usuário', 'error');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    if (!currentUser) return;

    const username = currentUser.username;
    const updatedUserLeads = { ...userLeads };
    
    if (updatedUserLeads[username]) {
      const leadIndex = updatedUserLeads[username].findIndex((l: Lead) => l.id === leadId);
      
      if (leadIndex !== -1) {
        const oldStatus = updatedUserLeads[username][leadIndex].status;
        updatedUserLeads[username][leadIndex].status = newStatus;
        
        // Update team stats
        const updatedTeamStats = { ...teamStats };
        if (oldStatus !== 'completed' && newStatus === 'completed') {
          if (updatedTeamStats[username]) {
            updatedTeamStats[username].completed++;
          }
        } else if (oldStatus === 'completed' && newStatus !== 'completed') {
          if (updatedTeamStats[username]) {
            updatedTeamStats[username].completed--;
          }
        }
        
        setUserLeads(updatedUserLeads);
        setTeamStats(updatedTeamStats);
        
        // Salvar no Supabase
        const result = await updateLeadStatus(leadId, newStatus);
        if (result.success) {
          showNotification('Status atualizado com sucesso!');
        } else {
          showNotification(`Erro ao atualizar status: ${result.error}`, 'error');
        }
      }
    }
  };

  const handleOpenStatusModal = (lead: Lead) => {
    setSelectedLead(lead);
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedLead(null);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const currentUserLeads = userLeads[currentUser.username] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      {currentUser.role === 'admin' ? (
        <AdminPanel
          allLeads={allLeads}
          setAllLeads={setAllLeads}
          userLeads={userLeads}
          setUserLeads={setUserLeads}
          teamStats={teamStats}
          setTeamStats={setTeamStats}
        />
      ) : (
        <UserPanel
          currentUser={currentUser}
          userLeads={currentUserLeads}
          teamStats={teamStats}
          onUpdateStatus={handleUpdateStatus}
          onOpenStatusModal={handleOpenStatusModal}
        />
      )}

      <StatusModal
        isOpen={statusModalOpen}
        lead={selectedLead}
        onClose={handleCloseStatusModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

export default App;