import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
}

const Assinatura = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: Plan[] = [
    {
      id: 'gratuito',
      name: 'Gratuito',
      price: 0,
      period: 'para sempre',
      description: 'Ideal para testar a plataforma',
      icon: <Star className="w-6 h-6" />,
      buttonText: 'Plano Atual',
      buttonVariant: 'outline',
      features: [
        { text: 'Até 10 orçamentos por mês', included: true },
        { text: 'Templates básicos', included: true },
        { text: 'Exportação em PDF', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Orçamentos ilimitados', included: false },
        { text: 'Templates premium', included: false },
        { text: 'Marca personalizada', included: false },
        { text: 'Suporte prioritário', included: false },
      ]
    },
    {
      id: 'profissional',
      name: 'Profissional',
      price: 29.90,
      period: 'por mês',
      description: 'Para profissionais que querem crescer',
      icon: <Zap className="w-6 h-6" />,
      buttonText: 'Assinar Agora',
      buttonVariant: 'default',
      popular: true,
      features: [
        { text: 'Orçamentos ilimitados', included: true },
        { text: 'Todos os templates', included: true },
        { text: 'Exportação em PDF', included: true },
        { text: 'Marca personalizada', included: true },
        { text: 'Relatórios avançados', included: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Backup automático', included: true },
        { text: 'Integração com WhatsApp', included: true },
      ]
    },
    {
      id: 'empresarial',
      name: 'Empresarial',
      price: 79.90,
      period: 'por mês',
      description: 'Para empresas e equipes',
      icon: <Crown className="w-6 h-6" />,
      buttonText: 'Assinar Agora',
      buttonVariant: 'secondary',
      features: [
        { text: 'Tudo do plano Profissional', included: true },
        { text: 'Até 5 usuários', included: true },
        { text: 'Gestão de equipe', included: true },
        { text: 'API personalizada', included: true },
        { text: 'Treinamento dedicado', included: true },
        { text: 'Suporte 24/7', included: true },
        { text: 'Relatórios personalizados', included: true },
        { text: 'Integração com CRM', included: true },
      ]
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'gratuito') {
      toast({
        title: "Plano Gratuito",
        description: "Você já está no plano gratuito!",
      });
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Assinatura Ativada!",
        description: `Plano ${plans.find(p => p.id === planId)?.name} ativado com sucesso!`,
      });
      
      // Redirecionar para dashboard após sucesso
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Potencialize seu negócio com orçamentos profissionais. 
            Escolha o plano que melhor se adapta às suas necessidades.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    R$ {plan.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check 
                        className={`w-4 h-4 mr-3 ${
                          feature.included ? 'text-green-500' : 'text-gray-300'
                        }`} 
                      />
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                  variant={plan.buttonVariant}
                  className="w-full"
                >
                  {isProcessing && selectedPlan === plan.id ? 'Processando...' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-600 text-sm">
                Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Como funciona o período gratuito?</h3>
              <p className="text-gray-600 text-sm">
                O plano gratuito permite até 5 orçamentos por mês com funcionalidades básicas.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Posso mudar de plano depois?</h3>
              <p className="text-gray-600 text-sm">
                Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Os dados ficam seguros?</h3>
              <p className="text-gray-600 text-sm">
                Sim, utilizamos criptografia de ponta e backup automático para proteger seus dados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assinatura;
