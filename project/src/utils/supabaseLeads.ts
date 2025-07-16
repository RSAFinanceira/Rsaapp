import { supabase } from '../lib/supabase';
import { Lead } from '../types';

export async function saveLeadsToSupabase(leads: Lead[], assignedTo: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Preparar os dados para inserção
    const leadsToInsert = leads.map(lead => ({
      id: lead.id,
      name: lead.name,
      cpf: lead.cpf,
      phone: lead.phone,
      value: lead.value,
      status: lead.status,
      import_date: lead.importDate,
      days: lead.days,
      assigned_to: assignedTo,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('leads')
      .insert(leadsToInsert);

    if (error) {
      console.error('Erro ao salvar leads no Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erro inesperado ao salvar leads:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

export async function getUserLeadsFromSupabase(username: string): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', username)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar leads do usuário:', error);
      return [];
    }

    return data.map(lead => ({
      id: lead.id,
      name: lead.name,
      cpf: lead.cpf,
      phone: lead.phone,
      value: lead.value,
      status: lead.status,
      importDate: new Date(lead.import_date),
      days: lead.days || 0,
      assigned_to: lead.assigned_to
    }));
  } catch (err) {
    console.error('Erro inesperado ao buscar leads:', err);
    return [];
  }
}

export async function updateLeadStatus(leadId: string, newStatus: Lead['status']): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', leadId);

    if (error) {
      console.error('Erro ao atualizar status do lead:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Erro inesperado ao atualizar status:', err);
    return { success: false, error: 'Erro inesperado' };
  }
}

export async function getTeamStatsFromSupabase(): Promise<{ [username: string]: { received: number; completed: number; totalValue: number } }> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('assigned_to, status, value');

    if (error) {
      console.error('Erro ao buscar estatísticas da equipe:', error);
      return {};
    }

    const stats: { [username: string]: { received: number; completed: number; totalValue: number } } = {};

    data.forEach(lead => {
      const username = lead.assigned_to;
      if (!username) return;

      if (!stats[username]) {
        stats[username] = { received: 0, completed: 0, totalValue: 0 };
      }

      stats[username].received++;
      
      if (lead.status === 'completed') {
        stats[username].completed++;
      }

      // Calcular valor total
      const numValue = parseFloat(lead.value.replace(',', '.'));
      if (!isNaN(numValue)) {
        stats[username].totalValue += numValue;
      }
    });

    return stats;
  } catch (err) {
    console.error('Erro inesperado ao buscar estatísticas:', err);
    return {};
  }
} 