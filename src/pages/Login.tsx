import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { TextInput } from '@/components/forms/FormFields';
import { useFormValidation } from '@/hooks/useFormValidation';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { values, errors, setValue, validateAll } = useFormValidation({
    schema: {
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      password: { 
        required: true, 
        minLength: 6 
      }
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    // Simular login
    setTimeout(() => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao OrçaFácil.",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Acesse sua conta"
      subtitle="Entre para gerenciar seus orçamentos"
      footerText="Não tem conta?"
      footerLink="/signup"
      footerLinkText="Crie sua conta grátis"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(value) => setValue('email', value)}
          placeholder="seu@email.com"
          icon={Mail}
          error={errors.email}
          required
        />

        <TextInput
          label="Senha"
          name="password"
          type="password"
          value={values.password}
          onChange={(value) => setValue('password', value)}
          placeholder="Sua senha"
          icon={Lock}
          error={errors.password}
          showPasswordToggle
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={values.rememberMe}
              onCheckedChange={(checked) => setValue('rememberMe', checked)}
            />
            <Label htmlFor="rememberMe" className="text-sm text-gray-600">
              Lembrar de mim
            </Label>
          </div>
          <a 
            href="/forgot-password" 
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Esqueci minha senha
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;