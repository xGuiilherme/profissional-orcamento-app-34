import { supabase } from '@/lib/supabaseClient';

interface UserCredentials {
  email?: string;
  password?: string;
}

interface SignUpData extends UserCredentials {
  fullName?: string;
  profession?: string;
}

export const useAuth = () => {
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
    });
  };

  const signOutUser = async () => {
    return await supabase.auth.signOut();
  };

  return {
    signInUser,
    signUpUser,
    signInWithGoogle,
    signOutUser,
  };
};