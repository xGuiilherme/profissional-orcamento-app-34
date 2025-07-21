import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false
  });

  useEffect(() => {
    let isMounted = true;

    // Função para verificar usuário atual
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (isMounted) {
          setAuthState({
            user: error ? null : user,
            loading: false,
            initialized: true
          });
        }
      } catch (err) {
        console.error('Erro ao verificar usuário:', err);
        if (isMounted) {
          setAuthState({
            user: null,
            loading: false,
            initialized: true
          });
        }
      }
    };

    // Verificar usuário inicial
    checkUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            user: session?.user ?? null,
            loading: false
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return authState;
};
