import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro na autenticação:', error);
          toast.error('Erro na autenticação', {
            description: 'Houve um problema ao fazer login com Google.'
          });
          navigate('/login');
          return;
        }

        if (data.session && data.session.user) {
          const user = data.session.user;

          // Verificar se o usuário já tem um perfil
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('phone, profession, full_name, email')
            .eq('id', user.id)
            .single();

          let currentProfile = profile;

          // Se perfil não existe, criar um básico
          if (profileError && profileError.code === 'PGRST116') {
            try {
              const newProfile = {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                phone: null,
                profession: null,
                updated_at: new Date().toISOString()
              };

              const { data: createdProfile, error: createError } = await supabase
                .from('profiles')
                .insert(newProfile)
                .select('phone, profession, full_name, email')
                .single();

              if (!createError) {
                currentProfile = createdProfile;
              }
            } catch (createErr) {
              console.error('Erro ao criar perfil:', createErr);
            }
          }

          // Se não tem perfil ou perfil incompleto, redirecionar para completar cadastro
          if (!currentProfile || !currentProfile.phone || !currentProfile.profession) {
            toast.success('Login realizado com sucesso!', {
              description: 'Complete seu cadastro para continuar.'
            });
            navigate('/complete-registration');
          } else {
            // Perfil completo, ir para dashboard
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast.error('Erro inesperado', {
          description: 'Tente fazer login novamente.'
        });
        navigate('/login');
      } finally {
        setIsChecking(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isChecking ? 'Verificando dados...' : 'Finalizando login...'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
