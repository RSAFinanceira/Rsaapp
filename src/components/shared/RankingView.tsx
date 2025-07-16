import React from 'react';
import { TeamStats, User } from '../../types';
import { users } from '../../data/users';

interface RankingViewProps {
  teamStats: TeamStats;
  currentUser?: User;
}

export default function RankingView({ teamStats, currentUser }: RankingViewProps) {
  const sortedUsers = Object.entries(teamStats)
    .map(([username, stats]) => ({
      username,
      name: users.find(u => u.username === username)?.name || username,
      completed: stats.completed,
      received: stats.received
    }))
    .sort((a, b) => b.completed - a.completed);

  const isUserView = !!currentUser && currentUser.role === 'user';

  if (isUserView) {
    const currentUserRank = sortedUsers.findIndex(u => u.username === currentUser.username) + 1;
    const topPerformers = sortedUsers.slice(0, 3);
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
          Ranking de Vendas
        </h2>
        
        <div className="space-y-6">
          {topPerformers.map((user, index) => {
            const isCurrentUser = user.username === currentUser.username;
            const bgColor = index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700';
            
            return (
              <div
                key={user.username}
                className={`p-4 ${isCurrentUser ? 'bg-[#3b0764]' : 'bg-gray-900'} rounded-lg flex items-center`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bgColor} flex items-center justify-center text-xl font-bold mr-4`}>
                  {index + 1}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{user.name}</span>
                    <span className="text-[#22c55e] font-semibold">{user.completed} vendas</span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {currentUserRank > 3 && (
            <div className="mt-6 p-4 bg-[#3b0764] rounded-lg flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a855f7] flex items-center justify-center text-xl font-bold mr-4">
                {currentUserRank}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">{currentUser.name} (Você)</span>
                  <span className="text-[#22c55e] font-semibold">
                    {sortedUsers.find(u => u.username === currentUser.username)?.completed || 0} vendas
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
        Ranking de Vendas
      </h2>
      
      <div className="space-y-6">
        {sortedUsers.map((user, index) => {
          const percentage = user.received > 0 ? Math.round((user.completed / user.received) * 100) : 0;
          
          return (
            <div key={user.username} className="p-4 bg-gray-900 rounded-lg flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a855f7] flex items-center justify-center text-xl font-bold mr-4">
                {index + 1}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{user.name}</span>
                  <span className="text-[#22c55e] font-semibold">{user.completed} vendas</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {user.username} | Taxa de conversão: {percentage}%
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div 
                    className="bg-[#22c55e] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}