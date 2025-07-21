import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconInput } from '@/components/ui/IconInput';
import { Calculator, Phone } from 'lucide-react';
import { toast } from 'sonner';
import InputMask from 'react-input-mask';
import { isValidPhone } from '@/lib/validations';

const CompleteRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    profession: '',
    businessName: ''
  });
  const [phoneError, setPhoneError] = useState('');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, createProfile } = useProfile();

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Se já tem perfil completo, redirecionar para dashboard
    if (profile && profile.phone && profile.profession) {
      navigate('/dashboard');
      return;
    }
  }, [user, profile, navigate]);

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

  const validatePhone = (phone: string) => {
    if (!phone || phone.trim() === '') {
      setPhoneError('Telefone é obrigatório');
      return false;
    }
    
    if (!isValidPhone(phone)) {
      setPhoneError('Telefone inválido');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (phone: string) => {
    setFormData(prev => ({ ...prev, phone }));
    validatePhone(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(formData.phone)) {
      return;
    }

    if (!formData.profession) {
      toast.error('Erro', { description: 'Por favor, selecione uma profissão.' });
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        phone: formData.phone,
        profession: formData.profession,
        company_name: formData.businessName || null,
        full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
        email: user?.email || null
      };

      if (profile) {
        // Atualizar perfil existente
        await updateProfile(profileData);
      } else {
        // Criar novo perfil
        await createProfile(profileData);
      }

      toast.success('Cadastro completado!', {
        description: 'Bem-vindo ao OrçaFácil!'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
      toast.error('Erro', {
        description: 'Erro ao salvar informações. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">OrçaFácil</span>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Complete seu cadastro
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Precisamos de algumas informações adicionais
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePhoneChange(e.target.value)}
                >
                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        {...inputProps}
                        className={`pl-10 ${phoneError ? 'border-red-500' : ''}`}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  )}
                </InputMask>
                {phoneError && (
                  <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Tipo de negócio *</Label>
                <Select
                  value={formData.profession}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo do seu negócio" />
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
                <Label htmlFor="businessName">Nome do negócio</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Ex: Barbearia do João"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600" 
                disabled={isLoading || !!phoneError || !formData.profession}
              >
                {isLoading ? "Completando cadastro..." : "Completar cadastro"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteRegistration;
