import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  User,
  Wrench,
  Calculator,
  FileText,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NovoOrcamento = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    // Etapa 1 - Cliente
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    observations: '',
    
    // Etapa 2 - Serviço
    profession: '',
    template: '',
    
    // Etapa 3 - Itens
    items: [
      { description: '', quantity: 1, unit: 'un', unitPrice: 0, total: 0, type: 'material' }
    ],
    
    // Etapa 4 - Condições
    deadline: '',
    payment: '',
    warranty: '',
    generalObservations: '',
    validity: '30',
    
    // Calculados
    subtotalMaterials: 0,
    subtotalLabor: 0,
    discount: 0,
    total: 0
  });

  const steps = [
    { number: 1, title: 'Dados do Cliente', icon: User },
    { number: 2, title: 'Tipo de Serviço', icon: Wrench },
    { number: 3, title: 'Serviços e Materiais', icon: Calculator },
    { number: 4, title: 'Condições', icon: FileText },
    { number: 5, title: 'Preview', icon: Eye }
  ];

  const professions = [
    { value: 'eletricista', label: 'Eletricista' },
    { value: 'encanador', label: 'Encanador' },
    { value: 'pintor', label: 'Pintor' },
    { value: 'pedreiro', label: 'Pedreiro' },
    { value: 'marceneiro', label: 'Marceneiro' }
  ];

  const templates = {
    eletricista: [
      'Instalação Elétrica Residencial',
      'Manutenção e Reparo',
      'Instalação de Tomadas e Interruptores',
      'Quadro Elétrico'
    ],
    encanador: [
      'Instalação Hidráulica',
      'Reparo de Vazamentos',
      'Desentupimento',
      'Troca de Registros'
    ],
    pintor: [
      'Pintura Interna',
      'Pintura Externa',
      'Pintura de Fachada',
      'Textura e Acabamentos'
    ]
  };

  const units = ['un', 'm²', 'm', 'kg', 'l', 'pç', 'h'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calcular total do item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setFormData(prev => ({ ...prev, items: newItems }));
    calculateTotals(newItems);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unit: 'un', unitPrice: 0, total: 0, type: 'material' }]
    }));
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: newItems }));
    calculateTotals(newItems);
  };

  const calculateTotals = (items: any[]) => {
    const subtotalMaterials = items
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + item.total, 0);
    
    const subtotalLabor = items
      .filter(item => item.type === 'labor')
      .reduce((sum, item) => sum + item.total, 0);
    
    const subtotal = subtotalMaterials + subtotalLabor;
    const discountAmount = (subtotal * formData.discount) / 100;
    const total = subtotal - discountAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotalMaterials,
      subtotalLabor,
      total
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Orçamento criado com sucesso!",
      description: "Seu orçamento foi salvo e está pronto para ser enviado.",
    });
    navigate('/orcamentos');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone/WhatsApp *</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email (opcional)</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientAddress">Endereço Completo *</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                placeholder="Rua, número, bairro, cidade, CEP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange('observations', e.target.value)}
                placeholder="Informações adicionais sobre o cliente ou local"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Profissão *</Label>
              <Select onValueChange={(value) => handleInputChange('profession', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua profissão" />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((profession) => (
                    <SelectItem key={profession.value} value={profession.value}>
                      {profession.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.profession && (
              <div className="space-y-2">
                <Label>Template Base</Label>
                <Select onValueChange={(value) => handleInputChange('template', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates[formData.profession as keyof typeof templates]?.map((template) => (
                      <SelectItem key={template} value={template}>
                        {template}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.template && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Template Selecionado</h4>
                <p className="text-blue-800">{formData.template}</p>
                <Button variant="outline" className="mt-3" size="sm">
                  Personalizar Template
                </Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
              <Button onClick={addItem} className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                      <div className="md:col-span-2">
                        <Label>Descrição</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Descrição do item/serviço"
                        />
                      </div>
                      
                      <div>
                        <Label>Tipo</Label>
                        <Select 
                          value={item.type} 
                          onValueChange={(value) => handleItemChange(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="material">Material</SelectItem>
                            <SelectItem value="labor">Mão de obra</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Qtd</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <Label>Unidade</Label>
                        <Select 
                          value={item.unit} 
                          onValueChange={(value) => handleItemChange(index, 'unit', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((unit) => (
                              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Valor Unit.</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Total: <span className="font-semibold text-green-600">
                          R$ {item.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      
                      {formData.items.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Totais */}
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal Materiais:</span>
                      <span className="font-semibold">R$ {formData.subtotalMaterials.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal Mão de Obra:</span>
                      <span className="font-semibold">R$ {formData.subtotalLabor.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Desconto (%):</span>
                      <Input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                        className="w-20 text-right"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Geral</p>
                      <p className="text-3xl font-bold text-green-600">
                        R$ {formData.total.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo de Execução</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  placeholder="Ex: 5 dias úteis"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payment">Forma de Pagamento</Label>
                <Select onValueChange={(value) => handleInputChange('payment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vista">À vista</SelectItem>
                    <SelectItem value="50-50">50% entrada + 50% na conclusão</SelectItem>
                    <SelectItem value="30-70">30% entrada + 70% na conclusão</SelectItem>
                    <SelectItem value="3x">3x sem juros</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="warranty">Garantia</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => handleInputChange('warranty', e.target.value)}
                  placeholder="Ex: 12 meses"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validity">Validade do Orçamento (dias)</Label>
                <Select value={formData.validity} onValueChange={(value) => handleInputChange('validity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="45">45 dias</SelectItem>
                    <SelectItem value="60">60 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="generalObservations">Observações Gerais</Label>
              <Textarea
                id="generalObservations"
                value={formData.generalObservations}
                onChange={(e) => handleInputChange('generalObservations', e.target.value)}
                placeholder="Termos, condições e observações importantes..."
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-8 shadow-sm">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">ORÇAMENTO</h2>
                <p className="text-gray-600">#{Date.now().toString().slice(-6)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dados do Cliente</h3>
                  <p className="text-gray-700">{formData.clientName}</p>
                  <p className="text-gray-700">{formData.clientPhone}</p>
                  {formData.clientEmail && <p className="text-gray-700">{formData.clientEmail}</p>}
                  <p className="text-gray-700 text-sm mt-2">{formData.clientAddress}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informações do Serviço</h3>
                  <p className="text-gray-700">Profissão: {formData.profession}</p>
                  <p className="text-gray-700">Template: {formData.template}</p>
                  <p className="text-gray-700">Prazo: {formData.deadline}</p>
                  <p className="text-gray-700">Pagamento: {formData.payment}</p>
                  <p className="text-gray-700">Garantia: {formData.warranty}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Itens do Orçamento</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Descrição</th>
                        <th className="text-left py-2 px-2">Tipo</th>
                        <th className="text-right py-2 px-2">Qtd</th>
                        <th className="text-center py-2 px-2">Un</th>
                        <th className="text-right py-2 px-2">Valor Unit.</th>
                        <th className="text-right py-2 px-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-2">{item.description}</td>
                          <td className="py-2 px-2">
                            <Badge variant={item.type === 'material' ? 'secondary' : 'outline'}>
                              {item.type === 'material' ? 'Material' : 'Mão de obra'}
                            </Badge>
                          </td>
                          <td className="text-right py-2 px-2">{item.quantity}</td>
                          <td className="text-center py-2 px-2">{item.unit}</td>
                          <td className="text-right py-2 px-2">R$ {item.unitPrice.toFixed(2).replace('.', ',')}</td>
                          <td className="text-right py-2 px-2 font-semibold">R$ {item.total.toFixed(2).replace('.', ',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal Materiais:</span>
                  <span>R$ {formData.subtotalMaterials.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal Mão de Obra:</span>
                  <span>R$ {formData.subtotalLabor.toFixed(2).replace('.', ',')}</span>
                </div>
                {formData.discount > 0 && (
                  <div className="flex justify-between items-center mb-2 text-red-600">
                    <span>Desconto ({formData.discount}%):</span>
                    <span>- R$ {((formData.subtotalMaterials + formData.subtotalLabor) * formData.discount / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                  <span>TOTAL GERAL:</span>
                  <span className="text-green-600">R$ {formData.total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {formData.generalObservations && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                  <p className="text-gray-700 text-sm">{formData.generalObservations}</p>
                </div>
              )}

              <div className="text-center mt-8 text-sm text-gray-600">
                <p>Orçamento válido por {formData.validity} dias</p>
                <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/orcamentos')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
            <p className="text-gray-600">Etapa {currentStep} de 5</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                currentStep >= step.number
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <span className={`text-sm mt-2 text-center ${
                currentStep >= step.number ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-20 h-0.5 absolute top-6 transform translate-x-12 ${
                  currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {(() => {
              const currentStepData = steps[currentStep - 1];
              const IconComponent = currentStepData?.icon;
              return (
                <>
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                  {currentStepData?.title}
                </>
              );
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="min-w-32"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < 5 ? (
          <Button
            onClick={nextStep}
            disabled={
              (currentStep === 1 && (!formData.clientName || !formData.clientPhone || !formData.clientAddress)) ||
              (currentStep === 2 && !formData.profession)
            }
            className="min-w-32 bg-blue-500 hover:bg-blue-600"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="space-x-3">
            <Button variant="outline" onClick={handleSubmit}>
              Salvar Rascunho
            </Button>
            <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
              Salvar e Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NovoOrcamento;
