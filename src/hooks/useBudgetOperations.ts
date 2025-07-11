import { supabase } from '@/lib/supabaseClient';
import { FormDataState } from '@/reducers/orcamentoFormReducer';
import { BudgetData } from './useBudgetData';

export interface SaveBudgetData {
  client_name: string;
  client_phone?: string;
  client_email?: string;
  client_address?: string;
  items: any; // JSONB field
  total: number;
  discount?: number;
  deadline?: string;
  payment?: string;
  warranty?: string;
  validity?: string;
  general_observations?: string;
  status?: string;
  profession?: string;
}

export const useBudgetOperations = () => {
  const saveBudget = async (formData: FormDataState): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // Preparar dados para salvar no Supabase
      const budgetData: SaveBudgetData = {
        client_name: formData.clientName,
        client_phone: formData.clientPhone || null,
        client_email: formData.clientEmail || null,
        client_address: formData.clientAddress || null,
        items: formData.items, // Será salvo como JSONB
        total: formData.total,
        discount: formData.discount || 0,
        deadline: formData.deadline || null,
        payment: formData.payment || null,
        warranty: formData.warranty || null,
        validity: formData.validity || '30',
        general_observations: formData.generalObservations || null,
        status: 'draft',
        profession: formData.profession || null,
      };

      // Salvar no Supabase
      const { data, error } = await supabase
        .from('orcamentos')
        .insert([{
          ...budgetData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar orçamento:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro inesperado ao salvar orçamento:', error);
      return { success: false, error: 'Erro inesperado ao salvar orçamento' };
    }
  };

  const getBudgets = async (): Promise<{ success: boolean; data?: any[]; error?: string }> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar orçamentos:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erro inesperado ao buscar orçamentos:', error);
      return { success: false, error: 'Erro inesperado ao buscar orçamentos' };
    }
  };

  const getBudgetById = async (id: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('orcamentos')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar orçamento:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erro inesperado ao buscar orçamento:', error);
      return { success: false, error: 'Erro inesperado ao buscar orçamento' };
    }
  };

  const deleteBudget = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('orcamentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar orçamento:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado ao deletar orçamento:', error);
      return { success: false, error: 'Erro inesperado ao deletar orçamento' };
    }
  };

  const updateBudgetStatus = async (id: string, status: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { error } = await supabase
        .from('orcamentos')
        .update({ status })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar status do orçamento:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro inesperado ao atualizar status:', error);
      return { success: false, error: 'Erro inesperado ao atualizar status' };
    }
  };

  const convertFormDataToBudgetData = (formData: FormDataState, budgetId?: string): BudgetData => {
    return {
      id: budgetId || Date.now().toString(),
      category: formData.profession,
      title: formData.template || 'Serviço Personalizado',
      description: formData.generalObservations || 'Serviços e materiais conforme listado abaixo.',
      value: `R$ ${formData.total.toFixed(2).replace('.', ',')}`,
      items: formData.items,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      terms: formData.payment,
      validity: `${formData.validity} dias`,
      warranty: formData.warranty,
      subtotalMaterials: formData.subtotalMaterials,
      subtotalLabor: formData.subtotalLabor,
      discount: formData.discount,
      total: formData.total,
      generalObservations: formData.generalObservations,
      deadline: formData.deadline,
    };
  };

  return {
    saveBudget,
    getBudgets,
    getBudgetById,
    deleteBudget,
    updateBudgetStatus,
    convertFormDataToBudgetData,
  };
};
