import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

type Plan = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
};

type UserSubscription = {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  renews_at: string | null;
};

const Assinatura = () => {
  const [userId, setUserId] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) {
      setIsLoading(false);
      return;
    }
    setUserId(user.id);

    const [{ data: plansData, error: plansError }, { data: subData, error: subError }] = await Promise.all([
      supabase.from('subscription_plans').select('*').eq('is_active', true).order('price_cents', { ascending: true }),
      supabase.from('user_subscriptions').select('*').eq('user_id', user.id).maybeSingle()
    ]);

    if (plansError) {
      toast.error('Erro ao carregar planos', { description: plansError.message });
    } else {
      setPlans((plansData || []) as Plan[]);
    }

    if (subError && subError.code !== 'PGRST116') {
      toast.error('Erro ao carregar assinatura', { description: subError.message });
    } else {
      setSubscription((subData as UserSubscription) || null);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.id === subscription?.plan_id) || null,
    [plans, subscription]
  );

  const selectPlan = async (planId: string) => {
    if (!userId) return;
    setIsSaving(true);

    if (subscription) {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ plan_id: planId, status: 'active' })
        .eq('id', subscription.id);
      if (error) {
        setIsSaving(false);
        toast.error('Erro ao atualizar assinatura', { description: error.message });
        return;
      }
    } else {
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({ user_id: userId, plan_id: planId, status: 'active', provider: 'manual' });
      if (error) {
        setIsSaving(false);
        toast.error('Erro ao criar assinatura', { description: error.message });
        return;
      }
    }

    toast.success('Plano atualizado com sucesso');
    setIsSaving(false);
    await loadData();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assinatura</h1>
        <p className="text-gray-600 mt-1">Gerencie o plano da sua conta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-gray-500">Carregando assinatura...</p>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{currentPlan?.name || 'Sem plano ativo'}</p>
                <p className="text-sm text-gray-600">
                  {subscription ? `Status: ${subscription.status}` : 'Selecione um plano abaixo'}
                </p>
              </div>
              {currentPlan && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Ativo
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan_id === plan.id;
          return (
            <Card key={plan.id} className={isCurrent ? 'border-blue-500 shadow-md' : ''}>
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold">
                  R$ {(Number(plan.price_cents || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-600 min-h-[40px]">{plan.description || 'Plano OrçaFácil'}</p>
                <Button
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                  onClick={() => selectPlan(plan.id)}
                  disabled={isSaving || isCurrent}
                >
                  {isCurrent ? 'Plano Atual' : 'Selecionar Plano'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Assinatura;
