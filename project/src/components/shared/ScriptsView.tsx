import React from 'react';

export default function ScriptsView() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
        Scripts de Vendas
      </h2>
      
      <div className="space-y-6">
        <div className="bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-3 text-[#a855f7]">Abordagem Inicial</h3>
          <p className="mb-3 text-white">
            Olá, [Nome do Cliente]. Tudo bem? Aqui é [Seu Nome] da RSA Promotora de Crédito.
          </p>
          <p className="mb-3 text-white">
            Estou entrando em contato porque identificamos que você possui um{' '}
            <strong className="text-[#a855f7]">saldo PRESO</strong> conosco no valor de R$ [Valor Liberado].
          </p>
          <p className="mb-3 text-white">
            Este valor já está pré-aprovado e disponível para liberação imediata na sua conta.
          </p>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-3 text-[#a855f7]">Dicas Importantes</h3>
          <ul className="list-disc pl-5 space-y-2 text-white">
            <li>
              <strong>Sempre use o telefone</strong> para o primeiro contato - evite WhatsApp para não perder oportunidades.
            </li>
            <li>Mencione que o valor está "preso" e precisa ser liberado com urgência.</li>
            <li>Enfatize que o processo é rápido e sem burocracia.</li>
            <li>Destaque que o valor já está aprovado, apenas aguardando confirmação.</li>
          </ul>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-5">
          <h3 className="text-lg font-semibold mb-3 text-[#a855f7]">Objeções Comuns</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-white">Cliente: "Não solicitei nenhum valor."</p>
              <p className="pl-4 text-gray-300">
                Resposta: "Entendo sua surpresa. Na verdade, este é um benefício que identificamos com base na sua análise de crédito. O valor já está reservado em seu nome e precisa ser liberado em até 48 horas."
              </p>
            </div>
            <div>
              <p className="font-medium text-white">Cliente: "Estou negativado."</p>
              <p className="pl-4 text-gray-300">
                Resposta: "Não se preocupe! Nossa análise já considerou sua situação atual e mesmo assim o crédito foi aprovado. É uma oportunidade para regularizar sua situação financeira."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}