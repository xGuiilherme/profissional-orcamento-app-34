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
      async (_, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
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
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          profession: profession,
        },
      },
    });
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