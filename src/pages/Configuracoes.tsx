import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const Configuracoes = () => {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    defaultSignature: '',
    defaultTerms: '',
    whatsappPhone: ''
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;
      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserId(user.id);
      const { data } = await supabase
        .from('user_profiles')
        .select('default_signature, default_terms, whatsapp_phone')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setSettings({
          defaultSignature: data.default_signature || '',
          defaultTerms: data.default_terms || '',
          whatsappPhone: data.whatsapp_phone || ''
        });
      }
      setIsLoading(false);
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    if (!userId) return;
    setIsSaving(true);
    const { error } = await supabase.from('user_profiles').upsert({
      id: userId,
      default_signature: settings.defaultSignature,
      default_terms: settings.defaultTerms,
      whatsapp_phone: settings.whatsappPhone
    }, { onConflict: 'id' });
    setIsSaving(false);

    if (error) {
      toast.error('Erro ao salvar configurações', { description: error.message });
      return;
    }
    toast.success('Configurações salvas com sucesso');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Ajuste as preferências globais da sua conta</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Configurações Gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <p className="text-gray-500">Carregando configurações...</p>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="defaultSignature">Assinatura Padrão</Label>
                <Textarea
                  id="defaultSignature"
                  value={settings.defaultSignature}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultSignature: e.target.value }))}
                  rows={4}
                  placeholder="Sua assinatura que aparecerá nos orçamentos..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultTerms">Termos e Condições Padrão</Label>
                <Textarea
                  id="defaultTerms"
                  value={settings.defaultTerms}
                  onChange={(e) => setSettings((prev) => ({ ...prev, defaultTerms: e.target.value }))}
                  rows={4}
                  placeholder="Termos e condições que aparecerão nos orçamentos..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsappPhone">Número padrão do WhatsApp</Label>
                <Input
                  id="whatsappPhone"
                  value={settings.whatsappPhone}
                  onChange={(e) => setSettings((prev) => ({ ...prev, whatsappPhone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <Button onClick={saveSettings} className="bg-blue-500 hover:bg-blue-600" disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
