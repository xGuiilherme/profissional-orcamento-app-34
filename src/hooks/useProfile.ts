import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './useAuth';

export interface ProfileData {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  profession: string | null;
  specialties: string | null;
  company_name: string | null;
  cnpj: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  cep: string | null;
  updated_at: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  // Atualizar dados do perfil
  const updateProfile = async (updates: Partial<Omit<ProfileData, 'id' | 'updated_at'>>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        throw new Error(updateError.message);
      }

      // Atualizar estado local
      setProfile(prev => prev ? { ...prev, ...data } : data);
      return { success: true, data };
    } catch (err) {
      console.error('Erro inesperado ao atualizar perfil:', err);
      throw err;
    }
  };

  // Criar perfil se não existir
  const createProfile = async (profileData: Partial<Omit<ProfileData, 'id' | 'updated_at'>>) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const { data, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar perfil:', createError);
        throw new Error(createError.message);
      }

      setProfile(data);
      return { success: true, data };
    } catch (err) {
      console.error('Erro inesperado ao criar perfil:', err);
      throw err;
    }
  };

  // Buscar perfil quando o usuário mudar
  useEffect(() => {
    let isMounted = true;

    if (user?.id) {
      const loadProfile = async () => {
        try {
          setLoading(true);
          setError(null);

          const { data, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!isMounted) return;

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              // Perfil não encontrado - isso é normal para novos usuários
              setProfile(null);
              setError(null);
            } else {
              console.error('Erro ao buscar perfil:', fetchError);
              setError(fetchError.message);
              setProfile(null);
            }
          } else {
            // Se não tem email no perfil, usar o email do auth
            const profileData = {
              ...data,
              email: data.email || user.email || null
            };
            setProfile(profileData);
          }
        } catch (err) {
          if (!isMounted) return;
          console.error('Erro inesperado ao buscar perfil:', err);
          setError('Erro inesperado ao buscar perfil');
          setProfile(null);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const refetchProfile = async () => {
    if (user?.id) {
      // Trigger re-fetch by updating a dependency
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setProfile(null);
            setError(null);
          } else {
            console.error('Erro ao buscar perfil:', fetchError);
            setError(fetchError.message);
            setProfile(null);
          }
        } else {
          const profileData = {
            ...data,
            email: data.email || user.email || null
          };
          setProfile(profileData);
        }
      } catch (err) {
        console.error('Erro inesperado ao buscar perfil:', err);
        setError('Erro inesperado ao buscar perfil');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetchProfile
  };
};
