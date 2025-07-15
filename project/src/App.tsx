import React, { useState, useEffect } from 'react';
import { Lead, TeamStats, UserLeads } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { showNotification } from './utils/notifications';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import AdminPanel from './components/admin/AdminPanel';
import UserPanel from './components/user/UserPanel';
import StatusModal from './components/StatusModal';

function App() {
  const { user, loading, signOut } = useAuth();
  const [allLeads, setAllLeads] = useLocalStorage<Lead[]>('rsaLeads', []);
  const [userLeads, setUserLeads] = useLocalStorage<UserLeads>('rsaUserLeads', {});
  const [teamStats, setTeamStats] = useLocalStorage<TeamStats>('rsaTeamStats', {
    'barbarafolhari': { received: 0, completed: 0 },
    'vanessasagioratto': { received: 0, completed: 0 },
    'franreis': { received: 0, completed: 0 },
    'monicathais': { received: 0, completed: 0 },
    'jessicanolasco': { received: 0, completed: 0 },
    'karinabaptista': { received: 0, completed: 0 },
    'lucysilva': { received: 0, completed: 0 },
    'rogeraugusto': { received: 0, completed: 0 },
    'beatrizribeiro': { received: 0, completed: 0 }
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

  const handleLogin = (user: any) => {
    // Login será tratado pelo hook useAuth
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleUpdateStatus = (leadId: string, newStatus: Lead['status']) => {
    if (!user) return;

    const username = user.email || 'unknown';
    const updatedUserLeads = { ...userLeads };
    
    if (updatedUserLeads[username]) {
      const leadIndex = updatedUserLeads[username].findIndex(l => l.id === leadId);
      
      if (leadIndex !== -1) {
        const oldStatus = updatedUserLeads[username][leadIndex].status;
        updatedUserLeads[username][leadIndex].status = newStatus;
        
        // Update team stats
        const updatedTeamStats = { ...teamStats };
        if (oldStatus !== 'completed' && newStatus === 'completed') {
          updatedTeamStats[username].completed++;
        } else if (oldStatus === 'completed' && newStatus !== 'completed') {
          updatedTeamStats[username].completed--;
        }
        
        setUserLeads(updatedUserLeads);
        setTeamStats(updatedTeamStats);
        
        showNotification('Status atualizado com sucesso!');
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

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>;
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const currentUserLeads = userLeads[user.email || 'unknown'] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header currentUser={user} onLogout={handleLogout} />
      
      {user.user_metadata?.role === 'admin' ? (
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
          currentUser={user}
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