import { useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import InputMask from 'react-input-mask';

// Lógica e Tipos do Formulário
import { orcamentoFormReducer, initialState, type FormDataState } from '@/reducers/orcamentoFormReducer';

// Constantes
import { STEPS, PROFESSIONS, UNITS, TIME_UNITS } from '../constants/orcamentoConst';

// Hooks
import { useTemplateData } from '@/hooks/useTemplateData';
import { useToast } from '@/hooks/use-toast';
import { useBudgetOperations } from '@/hooks/useBudgetOperations';

// Validações
import { isValidEmail, isValidPhone } from '@/lib/validations';



// Componentes de UI
import PdfPreview from '@/components/PdfPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconInput } from '@/components/ui/IconInput';
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2, Mail } from 'lucide-react';

const NovoOrcamento = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { templateId, budgetId } = useParams<{ templateId?: string; budgetId?: string }>();

  const { getTemplateById, getTemplatesByProfession } = useTemplateData();
  const { convertFormDataToBudgetData, getBudgetById, getBudgets } = useBudgetOperations();
  const [formData, dispatch] = useReducer(orcamentoFormReducer, initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [nextBudgetId, setNextBudgetId] = useState<string>('');

  // Estados para validação
  const [validationErrors, setValidationErrors] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: ''
  });


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

  // Carregar dados para edição ou duplicação
  useEffect(() => {
    const loadBudgetData = async () => {
      // Se está editando um orçamento existente
      if (budgetId) {
        setIsEditing(true);
        try {
          const result = await getBudgetById(budgetId);
          if (result.success && result.data) {
            const budget = result.data;
            dispatch({
              type: 'SET_FROM_TEMPLATE',
              payload: {
                clientName: budget.client_name,
                clientPhone: budget.client_phone || '',
                clientEmail: budget.client_email || '',
                clientAddress: budget.client_address || '',
                profession: budget.profession || '',
                serviceDescription: budget.service_description || '',
                items: budget.items || [],
                discount: budget.discount || 0,
                deadline: budget.deadline || '',
                payment: budget.payment || '',
                warranty: budget.warranty || '',
                validity: budget.validity || '30',
                generalObservations: budget.general_observations || '',
                template: '',
                subtotalMaterials: 0,
                subtotalLabor: 0,
                total: budget.total || 0,
                observations: budget.general_observations || ''
              }
            });
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao carregar dados do orçamento",
            variant: "destructive",
          });
        }
      }
      // Se está duplicando um orçamento (dados vêm do state)
      else if (location.state?.duplicateData) {
        const data = location.state.duplicateData;
        dispatch({
          type: 'SET_FROM_TEMPLATE',
          payload: {
            ...initialState,
            ...data
          }
        });
      }
    };

    loadBudgetData();
  }, [budgetId, location.state, getBudgetById, toast]);

  // Gerar próximo ID sequencial para novos orçamentos
  useEffect(() => {
    const generateNextId = async () => {
      if (!budgetId && !isEditing) {
        try {
          const result = await getBudgets();
          if (result.success && result.data) {
            const nextNumber = result.data.length + 1;
            const nextId = `ORC${nextNumber.toString().padStart(3, '0')}`;
            setNextBudgetId(nextId);
          } else {
            setNextBudgetId('ORC001');
          }
        } catch (error) {
          setNextBudgetId('ORC001');
        }
      }
    };

    generateNextId();
  }, [budgetId, isEditing, getBudgets]);

  // Validar campos quando formData muda
  useEffect(() => {
    if (formData.clientName) {
      validateName(formData.clientName);
    }
    if (formData.clientEmail) {
      validateEmail(formData.clientEmail);
    }
    if (formData.clientPhone) {
      validatePhone(formData.clientPhone);
    }
  }, [formData.clientName, formData.clientEmail, formData.clientPhone]);

  // Atualizar campos combinados quando valores mudam
  useEffect(() => {
    updateDeadline();
  }, [formData.deadlineValue, formData.deadlineUnit]);

  useEffect(() => {
    updateWarranty();
  }, [formData.warrantyValue, formData.warrantyUnit]);

  const nextStep = () => currentStep < 5 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  // Funções de validação
  const validateName = (name: string) => {
    if (!name || name.trim() === '') {
      setValidationErrors(prev => ({ ...prev, clientName: 'Campo obrigatório' }));
      return false;
    }

    if (name.trim().length < 3) {
      setValidationErrors(prev => ({ ...prev, clientName: 'Mínimo 3 caracteres' }));
      return false;
    }

    if (name.trim().length > 30) {
      setValidationErrors(prev => ({ ...prev, clientName: 'Máximo 30 caracteres' }));
      return false;
    }

    setValidationErrors(prev => ({ ...prev, clientName: '' }));
    return true;
  };

  const validateEmail = (email: string) => {
    if (!email || email.trim() === '') {
      setValidationErrors(prev => ({ ...prev, clientEmail: '' }));
      return true; // Email é opcional
    }

    if (!isValidEmail(email)) {
      setValidationErrors(prev => ({ ...prev, clientEmail: 'Email inválido' }));
      return false;
    }

    setValidationErrors(prev => ({ ...prev, clientEmail: '' }));
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone || phone.trim() === '') {
      setValidationErrors(prev => ({ ...prev, clientPhone: 'Campo obrigatório' }));
      return false;
    }

    if (!isValidPhone(phone)) {
      setValidationErrors(prev => ({ ...prev, clientPhone: 'Telefone inválido' }));
      return false;
    }

    setValidationErrors(prev => ({ ...prev, clientPhone: '' }));
    return true;
  };

  // Handlers para os campos
  const handleNameChange = (name: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'clientName', payload: name });
    validateName(name);
  };

  const handleEmailChange = (email: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'clientEmail', payload: email });
    validateEmail(email);
  };

  const handlePhoneChange = (phone: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'clientPhone', payload: phone });
    validatePhone(phone);
  };

  // Funções para combinar valor e unidade de tempo
  const updateDeadline = () => {
    const combinedDeadline = formData.deadlineValue && formData.deadlineUnit
      ? `${formData.deadlineValue} ${formData.deadlineUnit}`
      : '';
    dispatch({ type: 'UPDATE_FIELD', field: 'deadline', payload: combinedDeadline });
  };

  const updateWarranty = () => {
    const combinedWarranty = formData.warrantyValue && formData.warrantyUnit
      ? `${formData.warrantyValue} ${formData.warrantyUnit}`
      : '';
    dispatch({ type: 'UPDATE_FIELD', field: 'warranty', payload: combinedWarranty });
  };

  // Handlers para os campos de prazo e garantia
  const handleDeadlineValueChange = (value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'deadlineValue', payload: value });
  };

  const handleDeadlineUnitChange = (unit: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'deadlineUnit', payload: unit });
  };

  const handleWarrantyValueChange = (value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'warrantyValue', payload: value });
  };

  const handleWarrantyUnitChange = (unit: string) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'warrantyUnit', payload: unit });
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
      case 1: {
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  className={validationErrors.clientName ? 'border-red-500' : ''}
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Nome completo do cliente"
                  maxLength={30}
                  required
                />
                {validationErrors.clientName && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.clientName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone/WhatsApp *</Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.clientPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                >
                  {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                    <Input
                      className={validationErrors.clientPhone ? 'border-red-500' : ''}
                      id="clientPhone"
                      {...inputProps}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  )}
                </InputMask>
                {validationErrors.clientPhone && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.clientPhone}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email (opcional)</Label>
              <IconInput
                icon={Mail}
                id="clientEmail"
                name="clientEmail"
                type="email"
                placeholder="cliente@email.com"
                value={formData.clientEmail}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={validationErrors.clientEmail ? 'border-red-500' : ''}
              />
              {validationErrors.clientEmail && (
                <p className="text-xs text-red-500 mt-1">{validationErrors.clientEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientAddress">Endereço Completo *</Label>
              <Textarea
                className={!formData.clientAddress.trim() ? 'border-red-500' : ''}
                id="clientAddress"
                value={formData.clientAddress}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'clientAddress', payload: e.target.value })}
                placeholder="Rua, número, bairro, cidade, CEP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observations">Observações (opcional)</Label>
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

            {/* Campo para descrição do serviço */}
            <div className="space-y-2">
              <Label htmlFor="serviceDescription">Tipo de Serviço *</Label>
              <Input
                id="serviceDescription"
                type="text"
                placeholder="Ex: Instalação elétrica residencial, Reparo de vazamento, etc."
                value={formData.serviceDescription || ''}
                onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'serviceDescription', payload: e.target.value })}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Descreva o tipo de serviço que será realizado. Esta informação aparecerá no orçamento.
              </p>
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
                        <Label>Descrição *</Label>
                        <Input 
                          className={!item.description.trim() ? 'border-red-500' : ''}
                          value={item.description}
                          onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'description', value: e.target.value }})}
                          placeholder="Descrição do item/serviço"
                          required
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
                <Label>Prazo de Execução *</Label>
                <div className="flex gap-2">
                  <Input
                    className={!formData.deadlineValue.trim() ? 'border-red-500' : ''}
                    value={formData.deadlineValue}
                    onChange={(e) => handleDeadlineValueChange(e.target.value)}
                    placeholder="Ex: 5"
                    type="number"
                    min="1"
                  />
                  <Select
                    value={formData.deadlineUnit}
                    onValueChange={handleDeadlineUnitChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment">Forma de Pagamento *</Label>
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
                <Label>Garantia</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.warrantyValue}
                    onChange={(e) => handleWarrantyValueChange(e.target.value)}
                    placeholder="Ex: 12"
                    type="number"
                    min="1"
                  />
                  <Select
                    value={formData.warrantyUnit}
                    onValueChange={handleWarrantyUnitChange}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              <Label htmlFor="generalObservations">Observações Gerais (opcional)</Label>
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
        const budgetData = convertFormDataToBudgetData(formData);

        return (
          <div className="text-center">
            <Button onClick={() => setIsPreviewOpen(true)}>Visualizar Prévia</Button>
            <PdfPreview
              budget={budgetData}
              formData={formData}
              isOpen={isPreviewOpen}
              customId={isEditing ? undefined : nextBudgetId}
              onClose={() => setIsPreviewOpen(false)}
              onSave={() => {
                toast({
                  title: "Sucesso!",
                  description: "Orçamento salvo com sucesso! Redirecionando...",
                });
                setTimeout(() => navigate('/orcamentos'), 2000);
              }}
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
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
            </h1>
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
              (currentStep === 1 && (
                !formData.clientName ||
                !formData.clientPhone ||
                !formData.clientAddress ||
                validationErrors.clientName ||
                validationErrors.clientPhone ||
                validationErrors.clientEmail
              )) ||
              (currentStep === 2 && (!formData.profession || !formData.serviceDescription)) ||
              (currentStep === 3 && formData.items.some(item => !item.description.trim())) ||
              (currentStep === 4 && (!formData.deadlineValue || !formData.payment))
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