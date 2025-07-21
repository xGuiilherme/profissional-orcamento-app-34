import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface UserCredentials {
  email?: string;
  password?: string;
}

interface SignUpData extends UserCredentials {
  fullName?: string;
  profession?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Verificar usuário atual
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (isMounted) {
          if (error) {
            console.error('Error getting user:', error);
            setUser(null);
          } else {
            setUser(user);
          }
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Unexpected error getting user:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    getUser();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          // Só atualizar o estado se realmente mudou
          const newUser = session?.user ?? null;
          setUser(prevUser => {
            // Comparar IDs para evitar re-renders desnecessários
            if (prevUser?.id !== newUser?.id) {
              return newUser;
            }
            return prevUser;
          });

          if (initialized) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [initialized]);

  const signInUser = async ({ email, password }: UserCredentials) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUpUser = async ({ fullName, email, password, profession }: SignUpData) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          profession: profession,
        },
      },
    });

    // Se o cadastro foi bem-sucedido, atualizar o perfil com o email
    if (result.data.user && !result.error) {
      try {
        await supabase
          .from('profiles')
          .update({ email: email })
          .eq('id', result.data.user.id);
      } catch (error) {
        console.error('Erro ao atualizar email no perfil:', error);
      }
    }

    return result;
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signOutUser = async () => {
    return await supabase.auth.signOut();
  };

  return {
    user,
    loading,
    signInUser,
    signUpUser,
    signInWithGoogle,
    signOutUser,
  };
};