import { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Lógica e Tipos do Formulário
import { orcamentoFormReducer, initialState, type FormDataState } from '@/reducers/orcamentoFormReducer';

// Constantes
import { STEPS, PROFESSIONS, UNITS } from '../constants/orcamentoConst';

// Hooks
import { useTemplateData } from '@/hooks/useTemplateData';
import { useToast } from '@/hooks/use-toast';
import { type BudgetData } from '@/hooks/useBudgetData';

// Componentes de UI
import PdfPreview from '@/components/PdfPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2 } from 'lucide-react';

const NovoOrcamento = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { templateId } = useParams<{ templateId: string }>();

  const { getTemplateById, getTemplatesByProfession } = useTemplateData();
  const [formData, dispatch] = useReducer(orcamentoFormReducer, initialState);

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId);
      if (template) {
        const itemsWithTotal = template.items.map(item => ({
          ...item,
          total: item.quantity * item.unitPrice,
        }));
        dispatch({
          type: 'SET_FROM_TEMPLATE',
          payload: {
            ...initialState,
            profession: template.profession,
            template: template.name,
            items: itemsWithTotal,
            deadline: template.deadline,
            payment: template.payment,
            warranty: template.warranty,
            generalObservations: template.generalObservations,
            validity: template.validity,
          },
        });
        setCurrentStep(1);
      }
    }
  }, [templateId, getTemplateById]);

  const nextStep = () => currentStep < 5 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = () => {
    toast({
      title: "Orçamento criado com sucesso!",
      description: "Seu orçamento foi salvo e está pronto para ser enviado.",
    });
    navigate('/orcamentos');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: {
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'clientName', payload: e.target.value })}
                  placeholder="Nome completo do cliente"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone/WhatsApp *</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'clientPhone', payload: e.target.value })}
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
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'clientEmail', payload: e.target.value })}
                placeholder="cliente@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Endereço Completo *</Label>
              <Textarea
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'clientAddress', payload: e.target.value })}
                placeholder="Rua, número, bairro, cidade, CEP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'observations', payload: e.target.value })}
                placeholder="Informações adicionais sobre o cliente ou local"
              />
            </div>
          </div>
        );
      }

      case 2: {
        const professionTemplates = getTemplatesByProfession(formData.profession);
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Profissão *</Label>
              <Select
                value={formData.profession || ''}
                onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'profession', payload: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua profissão" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((profession) => (
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
                <Select
                  value={formData.template || ''}
                  onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'template', payload: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      }

      case 3: {
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Itens do Orçamento</h3>
              <Button onClick={() => dispatch({ type: 'ADD_ITEM' })} className="bg-green-500 hover:bg-green-600">
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
                          onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'description', value: e.target.value }})}
                          placeholder="Descrição do item/serviço"
                        />
                      </div>
                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={item.type}
                          onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'type', value }})}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
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
                          onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'quantity', value: parseFloat(e.target.value) || 0 }})}
                        />
                      </div>
                      <div>
                        <Label>Unidade</Label>
                        <Select
                          value={item.unit}
                          onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'unit', value }})}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Valor Unit.</Label>
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'unitPrice', value: parseFloat(e.target.value) || 0 }})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        Total: <span className="font-semibold text-green-600">R$ {item.total.toFixed(2).replace('.', ',')}</span>
                      </div>
                      {formData.items.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { index } })} className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'discount', payload: parseFloat(e.target.value) || 0 })}
                        className="w-20 text-right"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Geral</p>
                      <p className="text-3xl font-bold text-green-600">R$ {formData.total.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      case 4: {
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo de Execução</Label>
                <Input
                  id="deadline"
                  value={formData.deadline}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'deadline', payload: e.target.value })}
                  placeholder="Ex: 5 dias úteis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Forma de Pagamento</Label>
                <Select
                  value={formData.payment}
                  onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'payment', payload: value })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione a forma de pagamento" /></SelectTrigger>
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
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'warranty', payload: e.target.value })}
                  placeholder="Ex: 12 meses"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity">Validade do Orçamento (dias)</Label>
                <Select
                  value={formData.validity}
                  onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'validity', payload: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'generalObservations', payload: e.target.value })}
                placeholder="Termos, condições e observações importantes..."
                rows={4}
              />
            </div>
          </div>
        );
      }

      case 5: {
        const budgetData: BudgetData = {
          id: Date.now(),
          clientName: formData.clientName,
          clientAddress: formData.clientAddress,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail,
          title: formData.template || 'Serviço Personalizado',
          category: formData.profession,
          description: formData.generalObservations || 'Serviços e materiais conforme listado abaixo.',
          items: formData.items.map(i => i.description),
          value: `R$ ${formData.total.toFixed(2).replace('.', ',')}`,
          terms: formData.payment,
          validity: `${formData.validity} dias`,
        };
        return (
          <div className="text-center">
            <Button onClick={() => setIsPreviewOpen(true)}>Visualizar Prévia</Button>
            <PdfPreview
              budget={budgetData}
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
            />
          </div>
        );
      }
      
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
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

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {/* ✅ CORREÇÃO 2: Substituímos 'steps' por 'STEPS' aqui */}
          {STEPS.map((step, index) => (
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
              {/* ✅ CORREÇÃO 3: E aqui também */}
              {index < STEPS.length - 1 && (
                <div className={`hidden md:block w-20 h-0.5 absolute top-6 transform translate-x-12 ${
                  currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {(() => {
              // ✅ CORREÇÃO 4: E finalmente aqui
              const currentStepData = STEPS[currentStep - 1];
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