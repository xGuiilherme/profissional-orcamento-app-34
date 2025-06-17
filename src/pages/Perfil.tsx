import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  User, 
  Building, 
  Settings, 
  MessageSquare,
  Upload,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Perfil = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  const [personalData, setPersonalData] = useState({
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    phone: '(11) 99999-1111',
    profession: 'Eletricista',
    specialties: 'Instalações residenciais, Manutenção preventiva'
  });

  const [companyData, setCompanyData] = useState({
    companyName: 'Silva Elétrica',
    cnpj: '12.345.678/0001-90',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    cep: '01234-567',
    city: 'São Paulo',
    state: 'SP'
  });

  const [budgetSettings, setBudgetSettings] = useState({
    defaultSignature: 'Atenciosamente,\nCarlos Silva\nEletricista Certificado\n(11) 99999-1111',
    defaultTerms: 'Validade: 30 dias\nGarantia: 12 meses\nForma de pagamento: A combinar',
    defaultColors: {
      primary: '#0ea5e9',
      secondary: '#10b981'
    },
    defaultMargin: 15
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    connected: false,
    phone: '(11) 99999-1111',
    lastTest: null as Date | null
  });

  const tabs = [
    { id: 'personal', title: 'Dados Pessoais', icon: User },
    { id: 'company', title: 'Dados da Empresa', icon: Building },
    { id: 'budget', title: 'Configurações Orçamento', icon: Settings },
    { id: 'whatsapp', title: 'Integração WhatsApp', icon: MessageSquare }
  ];

  const handleSave = (section: string) => {
    toast({
      title: "Dados salvos com sucesso!",
      description: `As informações de ${section} foram atualizadas.`,
    });
  };

  const testWhatsApp = () => {
    setWhatsappSettings(prev => ({ ...prev, lastTest: new Date() }));
    toast({
      title: "Teste realizado!",
      description: "Mensagem de teste enviada para o WhatsApp.",
    });
  };

  const renderPersonalData = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" />
          <AvatarFallback>CS</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" className="mb-2">
            <Upload className="w-4 h-4 mr-2" />
            Alterar Foto
          </Button>
          <p className="text-sm text-gray-600">JPG, PNG até 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={personalData.name}
            onChange={(e) => setPersonalData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={personalData.email}
            onChange={(e) => setPersonalData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={personalData.phone}
            onChange={(e) => setPersonalData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Profissão</Label>
          <Select value={personalData.profession} onValueChange={(value) => 
            setPersonalData(prev => ({ ...prev, profession: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Eletricista">Eletricista</SelectItem>
              <SelectItem value="Encanador">Encanador</SelectItem>
              <SelectItem value="Pintor">Pintor</SelectItem>
              <SelectItem value="Pedreiro">Pedreiro</SelectItem>
              <SelectItem value="Marceneiro">Marceneiro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialties">Especialidades</Label>
        <Textarea
          id="specialties"
          value={personalData.specialties}
          onChange={(e) => setPersonalData(prev => ({ ...prev, specialties: e.target.value }))}
          placeholder="Descreva suas principais especialidades..."
        />
      </div>

      <Button onClick={() => handleSave('dados pessoais')} className="bg-blue-500 hover:bg-blue-600">
        <Save className="w-4 h-4 mr-2" />
        Salvar Alterações
      </Button>
    </div>
  );

  const renderCompanyData = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <Building className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <Button variant="outline" className="mb-2">
            <Upload className="w-4 h-4 mr-2" />
            Upload Logo
          </Button>
          <p className="text-sm text-gray-600">Será usada nos orçamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nome da Empresa</Label>
          <Input
            id="companyName"
            value={companyData.companyName}
            onChange={(e) => setCompanyData(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ (opcional)</Label>
          <Input
            id="cnpj"
            value={companyData.cnpj}
            onChange={(e) => setCompanyData(prev => ({ ...prev, cnpj: e.target.value }))}
            placeholder="00.000.000/0000-00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço Completo</Label>
        <Input
          id="address"
          value={companyData.address}
          onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            value={companyData.cep}
            onChange={(e) => setCompanyData(prev => ({ ...prev, cep: e.target.value }))}
            placeholder="00000-000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={companyData.city}
            onChange={(e) => setCompanyData(prev => ({ ...prev, city: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={companyData.state} onValueChange={(value) => 
            setCompanyData(prev => ({ ...prev, state: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={() => handleSave('dados da empresa')} className="bg-blue-500 hover:bg-blue-600">
        <Save className="w-4 h-4 mr-2" />
        Salvar Alterações
      </Button>
    </div>
  );

  const renderBudgetSettings = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="defaultSignature">Assinatura Padrão</Label>
        <Textarea
          id="defaultSignature"
          value={budgetSettings.defaultSignature}
          onChange={(e) => setBudgetSettings(prev => ({ ...prev, defaultSignature: e.target.value }))}
          rows={4}
          placeholder="Sua assinatura que aparecerá nos orçamentos..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="defaultTerms">Termos e Condições Padrão</Label>
        <Textarea
          id="defaultTerms"
          value={budgetSettings.defaultTerms}
          onChange={(e) => setBudgetSettings(prev => ({ ...prev, defaultTerms: e.target.value }))}
          rows={4}
          placeholder="Termos e condições que aparecerão nos orçamentos..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Cor Primária</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={budgetSettings.defaultColors.primary}
              onChange={(e) => setBudgetSettings(prev => ({ 
                ...prev, 
                defaultColors: { ...prev.defaultColors, primary: e.target.value }
              }))}
              className="w-16 h-10"
            />
            <Input
              value={budgetSettings.defaultColors.primary}
              onChange={(e) => setBudgetSettings(prev => ({ 
                ...prev, 
                defaultColors: { ...prev.defaultColors, primary: e.target.value }
              }))}
              placeholder="#0ea5e9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cor Secundária</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={budgetSettings.defaultColors.secondary}
              onChange={(e) => setBudgetSettings(prev => ({ 
                ...prev, 
                defaultColors: { ...prev.defaultColors, secondary: e.target.value }
              }))}
              className="w-16 h-10"
            />
            <Input
              value={budgetSettings.defaultColors.secondary}
              onChange={(e) => setBudgetSettings(prev => ({ 
                ...prev, 
                defaultColors: { ...prev.defaultColors, secondary: e.target.value }
              }))}
              placeholder="#10b981"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultMargin">Margem de Lucro Padrão (%)</Label>
          <Input
            id="defaultMargin"
            type="number"
            value={budgetSettings.defaultMargin}
            onChange={(e) => setBudgetSettings(prev => ({ ...prev, defaultMargin: parseInt(e.target.value) || 0 }))}
            min="0"
            max="100"
          />
        </div>
      </div>

      <Button onClick={() => handleSave('configurações de orçamento')} className="bg-blue-500 hover:bg-blue-600">
        <Save className="w-4 h-4 mr-2" />
        Salvar Configurações
      </Button>
    </div>
  );

  const renderWhatsAppSettings = () => (
    <div className="space-y-6">
      <Card className={`border-2 ${whatsappSettings.connected ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {whatsappSettings.connected ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-yellow-600" />
              )}
              <div>
                <h3 className="font-semibold">Status da Conexão</h3>
                <p className={`text-sm ${whatsappSettings.connected ? 'text-green-700' : 'text-yellow-700'}`}>
                  {whatsappSettings.connected ? 'WhatsApp conectado e funcionando' : 'WhatsApp não conectado'}
                </p>
              </div>
            </div>
            <Badge variant={whatsappSettings.connected ? 'default' : 'secondary'}>
              {whatsappSettings.connected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Como conectar o WhatsApp:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Abra o WhatsApp no seu celular</li>
          <li>Toque nos três pontos no canto superior direito</li>
          <li>Vá em Configurações → Aparelhos conectados</li>
          <li>Toque em "Conectar um aparelho"</li>
          <li>Escaneie o QR Code que aparecerá abaixo</li>
        </ol>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg text-center">
        <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center">
          <MessageSquare className="w-16 h-16 text-gray-400" />
        </div>
        <p className="text-gray-600 mt-4">QR Code aparecerá aqui quando disponível</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsappPhone">Número do WhatsApp</Label>
        <Input
          id="whatsappPhone"
          value={whatsappSettings.phone}
          onChange={(e) => setWhatsappSettings(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="flex space-x-3">
        <Button 
          onClick={testWhatsApp}
          variant="outline"
          disabled={!whatsappSettings.connected}
        >
          Testar Envio
        </Button>
        <Button 
          onClick={() => setWhatsappSettings(prev => ({ ...prev, connected: !prev.connected }))}
          className={whatsappSettings.connected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
        >
          {whatsappSettings.connected ? 'Desconectar' : 'Conectar'} WhatsApp
        </Button>
      </div>

      {whatsappSettings.lastTest && (
        <p className="text-sm text-gray-600">
          Último teste: {whatsappSettings.lastTest.toLocaleString('pt-BR')}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e configurações</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {(() => {
              const activeTabData = tabs.find(tab => tab.id === activeTab);
              const IconComponent = activeTabData?.icon;
              return (
                <>
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                  {activeTabData?.title}
                </>
              );
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {activeTab === 'personal' && renderPersonalData()}
          {activeTab === 'company' && renderCompanyData()}
          {activeTab === 'budget' && renderBudgetSettings()}
          {activeTab === 'whatsapp' && renderWhatsAppSettings()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;
