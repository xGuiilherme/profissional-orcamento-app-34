import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Upload, 
  Save, 
  Eye, 
  Palette,
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Templates = () => {
  const { toast } = useToast();
  
  const [templateData, setTemplateData] = useState({
    // Identidade Visual
    logo: null as File | null,
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    font: 'Sistema',
    
    // Informações da Empresa
    companyName: 'Sua Empresa Ltda',
    email: 'contato@suaempresa.com',
    phone: '(11) 99999-9999',
    address: 'São Paulo, SP',
    
    // Informações Padrão
    validityDays: 30,
    defaultObservations: 'Ex: Valores válidos por 30 dias...',
    paymentTerms: 'PIX, Cartão, Boleto...',
    
    // Layout
    templateStyle: 'moderno'
  });

  const [previewData] = useState({
    budgetNumber: '001234',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    clientPhone: '(11) 99999-8888',
    services: [
      { description: 'Pintura de Fachada', qty: 1, unit: 'm²', value: 2500.00, total: 2500.00 },
      { description: 'Material de Pintura', qty: 1, unit: 'lote', value: 800.00, total: 800.00 }
    ],
    subtotal: 3300.00,
    total: 3300.00
  });

  const fontOptions = [
    { value: 'Sistema', label: 'Sistema' },
    { value: 'Clássica', label: 'Clássica' },
    { value: 'Moderna', label: 'Moderna' },
    { value: 'Simples', label: 'Simples' }
  ];

  const templateStyles = [
    { value: 'moderno', label: 'Moderno' },
    { value: 'classico', label: 'Clássico' },
    { value: 'minimalista', label: 'Minimalista' },
    { value: 'profissional', label: 'Profissional' }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTemplateData(prev => ({ ...prev, logo: file }));
    }
  };

  const handleSaveTemplate = () => {
    toast({
      title: "Template salvo com sucesso!",
      description: "Suas configurações foram aplicadas a todos os novos orçamentos.",
    });
  };

  const handleCancelTemplate = () => {
    // Reset to default values or previous saved state
    toast({
      title: "Alterações canceladas",
      description: "As configurações foram revertidas para o estado anterior.",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Personalizar Template</h1>
        <p className="text-gray-600 mt-1">Configure a aparência e informações padrão dos seus orçamentos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações */}
        <div className="space-y-6">
          {/* Identidade Visual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo da Empresa */}
              <div className="space-y-2">
                <Label>Logo da Empresa</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {templateData.logo ? (
                    <div className="flex items-center justify-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <span className="text-sm text-gray-600">{templateData.logo.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setTemplateData(prev => ({ ...prev, logo: null }))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Clique para fazer upload do logo</p>
                      <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Cores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={templateData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={templateData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={templateData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1 border rounded"
                    />
                    <Input
                      value={templateData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#64748b"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Fonte */}
              <div className="space-y-2">
                <Label>Fonte</Label>
                <div className="grid grid-cols-4 gap-2">
                  {fontOptions.map((font) => (
                    <Button
                      key={font.value}
                      variant={templateData.font === font.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('font', font.value)}
                      className="text-xs"
                    >
                      {font.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Padrão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Informações Padrão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="validityDays">Validade Padrão (dias)</Label>
                <Input
                  id="validityDays"
                  type="number"
                  value={templateData.validityDays}
                  onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value) || 30)}
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultObservations">Observações Padrão</Label>
                <Textarea
                  id="defaultObservations"
                  value={templateData.defaultObservations}
                  onChange={(e) => handleInputChange('defaultObservations', e.target.value)}
                  rows={3}
                  placeholder="Ex: Valores válidos por 30 dias..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Formas de Pagamento</Label>
                <Input
                  id="paymentTerms"
                  value={templateData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  placeholder="PIX, Cartão, Boleto..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Layout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Estilo do Template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templateStyles.map((style) => (
                    <Button
                      key={style.value}
                      variant={templateData.templateStyle === style.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('templateStyle', style.value)}
                      className="text-xs"
                    >
                      {style.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview do Orçamento */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Preview do Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-white border rounded-lg p-6 shadow-sm"
                style={{ 
                  fontFamily: templateData.font === 'Sistema' ? 'system-ui' : templateData.font,
                  borderColor: templateData.primaryColor + '20'
                }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {templateData.logo ? (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-bold" style={{ color: templateData.primaryColor }}>
                          {templateData.companyName}
                        </h2>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {templateData.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {templateData.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {templateData.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <h1 className="text-xl font-bold text-gray-900">ORÇAMENTO</h1>
                    <Badge 
                      className="mt-1"
                      style={{ backgroundColor: templateData.primaryColor }}
                    >
                      #{previewData.budgetNumber}
                    </Badge>
                  </div>
                </div>

                {/* Cliente */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                  <h3 className="font-semibold mb-2" style={{ color: templateData.primaryColor }}>
                    Cliente: {previewData.clientName}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{previewData.clientEmail} • {previewData.clientPhone}</p>
                  </div>
                </div>

                {/* Serviços */}
                <div className="mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b" style={{ borderColor: templateData.secondaryColor }}>
                        <th className="text-left py-2">Serviço</th>
                        <th className="text-center py-2 w-16">Qtd</th>
                        <th className="text-center py-2 w-16">Unit.</th>
                        <th className="text-right py-2 w-20">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.services.map((service, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">{service.description}</td>
                          <td className="text-center py-2">{service.qty}</td>
                          <td className="text-center py-2">{service.unit}</td>
                          <td className="text-right py-2">R$ {service.total.toFixed(2).replace('.', ',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total */}
                <div className="flex justify-end mb-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Subtotal: R$ {previewData.subtotal.toFixed(2).replace('.', ',')}</div>
                    <div 
                      className="text-xl font-bold"
                      style={{ color: templateData.primaryColor }}
                    >
                      Total: R$ {previewData.total.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="text-xs text-gray-600 border-t pt-4">
                  <p><strong>Observações:</strong> {templateData.defaultObservations}</p>
                  <p><strong>Validade:</strong> {templateData.validityDays} dias. <strong>Forma de pagamento:</strong> {templateData.paymentTerms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
        <Button variant="outline" onClick={handleCancelTemplate}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSaveTemplate}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Template
        </Button>
      </div>
    </div>
  );
};

export default Templates;