import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

export default function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-[#6A0DAD] p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col items-center md:items-start">
          <img 
            src="https://i.ibb.co/nNzNZZ6g/NOVA-LOGOTIPO.png" 
            alt="RSA PROMOTORA DE CRÉDITO" 
            className="h-16 mb-1"
          />
          <p className="text-sm text-white opacity-80">Sistema de Gestão de Leads</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline-block">
            Olá, <span>{currentUser.name}</span>
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}