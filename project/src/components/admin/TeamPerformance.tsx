import React from 'react';
import { TeamStats } from '../../types';
import { users } from '../../data/users';

interface TeamPerformanceProps {
  teamStats: TeamStats;
}

export default function TeamPerformance({ teamStats }: TeamPerformanceProps) {
  const maxSales = Math.max(...Object.values(teamStats).map(stats => stats.completed), 1);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-800 pb-2">
        Desempenho da Equipe
      </h2>
      
      <div className="space-y-4">
        {Object.entries(teamStats).map(([username, stats]) => {
          const percentage = (stats.completed / maxSales) * 100;
          const displayName = users.find(u => u.username === username)?.name || username;
          
          return (
            <div key={username} className="p-4 bg-gray-900 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">{displayName}</span>
                <span className="text-[#22c55e] font-semibold">{stats.completed} vendas</span>
              </div>
              <div className="text-xs text-gray-400 mb-2">{username}</div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div 
                  className="bg-[#22c55e] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}