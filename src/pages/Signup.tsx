import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconInput } from '@/components/ui/IconInput';
import { Calculator, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { signupSchema, type SignupFormData } from '@/lib/validations';
import { toast } from 'sonner';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    phone: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUpUser } = useAuth();

  const professions = [
    "Eletricista",
    "Encanador",
    "Pintor",
    "Pedreiro",
    "Marceneiro",
    "Gesseiro",
    "Serralheiro",
    "Jardineiro",
    "Chaveiro",
    "Vidraceiro",
    "Outros"
  ];

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isValidEmail(formData.email)) {
      toast.error("Erro no cadastro", {
        description: "Por favor, insira um endereço de e-mail válido.",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Erro no cadastro", {
        description: "As senhas não coincidem.",
        });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Erro no cadastro", {
        description: "A senha deve ter pelo menos 8 caracteres."
      });
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Erro no cadastro", {
        description: "Você deve aceitar os termos de uso.",
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          profession: formData.profession,
        }
      }
    });

    if (error) {
      toast.error("Erro no cadastro", {
        description: error.message});
    } else if (data.user) {
      toast.success("Conta criada com sucesso!", {
        description: "Enviamos um link de confirmação para o seu e-mail.",
      });
      navigate('/login');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrçaFácil</span>
          </Link>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Crie sua conta grátis
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Comece seu teste de 7 dias hoje mesmo
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <IconInput icon={User} id="fullName" name="fullName" type="text" placeholder="Digite seu nome completo" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <IconInput icon={Mail} id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profissão</Label>
                <Select value={formData.profession} onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua profissão" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map((profession) => (
                      <SelectItem key={profession} value={profession}>
                        {profession}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <IconInput icon={Phone} id="phone" name="phone" type="tel" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                  required
                />
                <Label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                  Aceito os{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                    termos de uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                    política de privacidade
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta e começar teste"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem conta?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;