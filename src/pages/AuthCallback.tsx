import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

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

        if (data.session) {
          toast.success('Login realizado com sucesso!');
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast.error('Erro inesperado', { 
          description: 'Tente fazer login novamente.' 
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizando login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
