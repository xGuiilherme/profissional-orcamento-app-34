import { Fragment, useState, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Lógica e Tipos do Formulário
import { orcamentoFormReducer, initialState } from '@/reducers/orcamentoFormReducer';

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
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Trash2, Check, ChevronDown, ChevronUp, Eye, Wrench, Pencil } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const NovoOrcamento = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProfessionOpen, setIsProfessionOpen] = useState(false);
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(0);
  const [isItemEditorOpen, setIsItemEditorOpen] = useState(false);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { templateId, budgetId } = useParams<{ templateId?: string; budgetId?: string }>();

  const { getTemplateById, getTemplatesByProfession } = useTemplateData();
  const [formData, dispatch] = useReducer(orcamentoFormReducer, initialState);

  useEffect(() => {
    if (templateId && !budgetId) {
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
  }, [templateId, budgetId, getTemplateById]);

  useEffect(() => {
    const loadBudgetForEdit = async () => {
      if (!budgetId) return;
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', budgetId)
        .maybeSingle();

      if (budgetError || !budget) {
        toast({
          title: 'Erro ao carregar orçamento',
          description: budgetError?.message || 'Orçamento não encontrado',
          variant: 'destructive'
        });
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('budget_items')
        .select('*')
        .eq('budget_id', budgetId)
        .order('position', { ascending: true });

      if (itemsError) {
        toast({
          title: 'Erro ao carregar itens',
          description: itemsError.message,
          variant: 'destructive'
        });
        return;
      }

      const mappedItems = (itemsData || []).map((item) => ({
        description: item.description || '',
        quantity: Number(item.quantity || 1),
        unit: item.unit || 'un',
        unitPrice: Number(item.unit_price || 0),
        total: Number(item.total || 0),
        type: item.item_type === 'labor' ? 'labor' : 'material'
      }));

      dispatch({
        type: 'SET_FROM_TEMPLATE',
        payload: {
          ...initialState,
          clientName: budget.client_name || '',
          clientPhone: budget.client_phone || '',
          clientEmail: budget.client_email || '',
          clientAddress: budget.client_address || '',
          observations: budget.observations || '',
          profession: budget.profession || '',
          customProfession: budget.custom_profession || '',
          template: budget.template_name || '',
          items: mappedItems.length ? mappedItems : initialState.items,
          deadline: budget.deadline || '',
          payment: budget.payment || '',
          warranty: budget.warranty || '',
          generalObservations: budget.general_observations || '',
          validity: String(budget.validity_days || 30),
          discount: Number(budget.discount_percent || 0)
        }
      });
    };

    loadBudgetForEdit();
  }, [budgetId, toast]);

  const nextStep = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const openItemEditor = (index: number) => {
    setEditingItemIndex(index);
    setIsItemEditorOpen(true);
  };

  const handleAddItem = () => {
    dispatch({ type: 'ADD_ITEM' });
    setExpandedItemIndex(formData.items.length);
  };

  const handleSubmit = async (status: 'rascunho' | 'pendente') => {
    setIsSaving(true);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setIsSaving(false);
      toast({
        title: "Usuário não autenticado",
        description: "Faça login novamente para salvar o orçamento.",
        variant: "destructive"
      });
      return;
    }

    const budgetPayload = {
      user_id: user.id,
      client_name: formData.clientName,
      client_phone: formData.clientPhone,
      client_email: formData.clientEmail || null,
      client_address: formData.clientAddress,
      title: formData.template || `Serviço de ${formData.customProfession || formData.profession || 'Profissional'}`,
      profession: formData.profession || null,
      custom_profession: formData.customProfession || null,
      template_name: formData.template || null,
      status,
      observations: formData.observations || null,
      general_observations: formData.generalObservations || null,
      deadline: formData.deadline || null,
      payment: formData.payment || null,
      warranty: formData.warranty || null,
      validity_days: Number(formData.validity || 30),
      subtotal_materials: formData.subtotalMaterials,
      subtotal_labor: formData.subtotalLabor,
      discount_percent: formData.discount,
      total_amount: formData.total
    };

    let savedBudgetId = budgetId;
    if (budgetId) {
      const { error: updateError } = await supabase
        .from('budgets')
        .update(budgetPayload)
        .eq('id', budgetId)
        .eq('user_id', user.id);

      if (updateError) {
        setIsSaving(false);
        toast({
          title: "Erro ao atualizar orçamento",
          description: updateError.message,
          variant: "destructive"
        });
        return;
      }

      await supabase.from('budget_items').delete().eq('budget_id', budgetId);
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from('budgets')
        .insert(budgetPayload)
        .select('id')
        .single();

      if (insertError || !inserted) {
        setIsSaving(false);
        toast({
          title: "Erro ao salvar orçamento",
          description: insertError?.message || 'Não foi possível criar o orçamento',
          variant: "destructive"
        });
        return;
      }
      savedBudgetId = inserted.id;
    }

    const itemsToInsert = formData.items.map((item, index) => ({
      budget_id: savedBudgetId,
      position: index,
      description: item.description || 'Item',
      quantity: item.quantity,
      unit: item.unit,
      unit_price: item.unitPrice,
      total: item.total,
      item_type: item.type
    }));

    const { error: itemsInsertError } = await supabase.from('budget_items').insert(itemsToInsert);
    setIsSaving(false);

    if (itemsInsertError) {
      toast({
        title: "Erro ao salvar itens",
        description: itemsInsertError.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: budgetId ? "Orçamento atualizado com sucesso!" : "Orçamento criado com sucesso!",
      description: "Seu orçamento foi salvo corretamente no banco de dados.",
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
          <div className="space-y-8">
            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-blue-700 font-semibold">Profissão *</Label>
                  <Popover open={isProfessionOpen} onOpenChange={setIsProfessionOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isProfessionOpen}
                        className="w-full justify-between bg-white border-blue-200 hover:bg-white"
                      >
                        {formData.profession
                          ? PROFESSIONS.find((p) => p.value === formData.profession)?.label
                          : "Selecione ou busque sua profissão..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar profissão..." />
                        <CommandList>
                          <CommandEmpty>Nenhuma profissão encontrada.</CommandEmpty>
                          <CommandGroup>
                            {PROFESSIONS.map((profession) => (
                              <CommandItem
                                key={profession.value}
                                value={profession.label}
                                onSelect={() => {
                                  dispatch({ type: 'UPDATE_FIELD', field: 'profession', payload: profession.value });
                                  setIsProfessionOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.profession === profession.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {profession.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {formData.profession && formData.profession !== 'outros' && (
                  <div className="space-y-2">
                    <Label className="text-blue-700 font-semibold">Template Base</Label>
                    <Select
                      value={formData.template || ''}
                      onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'template', payload: value })}
                    >
                      <SelectTrigger className="bg-white border-blue-200">
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

                {formData.profession === 'outros' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-blue-700 font-semibold">Especifique sua Profissão *</Label>
                    <div className="relative">
                      <Wrench className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                      <Input
                        value={formData.customProfession || ''}
                        onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'customProfession', payload: e.target.value })}
                        placeholder="Ex: Gesseiro, Azulejista..."
                        className="pl-10 bg-white border-blue-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Itens do Orçamento</h3>
                  <p className="text-sm text-gray-500">Adicione os serviços e materiais necessários</p>
                </div>
                <Button onClick={handleAddItem} className="bg-green-500 hover:bg-green-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Descrição</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tipo</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Qtd</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Unidade</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Valor Unit.</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map((item, index) => (
                          <Fragment key={`item-group-${index}`}>
                            <tr
                              className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                              onClick={() => {
                                setExpandedItemIndex(expandedItemIndex === index ? null : index);
                                if (window.innerWidth < 768) {
                                  openItemEditor(index);
                                }
                              }}
                            >
                              <td className="py-3 px-4 max-w-[250px]">
                                <div className="truncate text-sm text-gray-900">{item.description || 'Sem descrição'}</div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">{item.type === 'material' ? 'Material' : 'Mão de obra'}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">{item.quantity}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">{item.unit}</td>
                              <td className="py-3 px-4 text-sm text-gray-700">R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="py-3 px-4 text-sm font-semibold text-green-600">R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="py-3 px-4">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedItemIndex(expandedItemIndex === index ? null : index);
                                    }}
                                  >
                                    {expandedItemIndex === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openItemEditor(index);
                                    }}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  {formData.items.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch({ type: 'REMOVE_ITEM', payload: { index } });
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {expandedItemIndex === index && (
                              <tr className="border-b bg-gray-50/60">
                                <td colSpan={7} className="p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                    <div className="md:col-span-2 space-y-2">
                                      <Label>Descrição</Label>
                                      <Input
                                        value={item.description}
                                        onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'description', value: e.target.value } })}
                                        placeholder="Descrição do item/serviço"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Tipo</Label>
                                      <Select
                                        value={item.type}
                                        onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'type', value } })}
                                      >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="material">Material</SelectItem>
                                          <SelectItem value="labor">Mão de obra</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Qtd</Label>
                                      <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'quantity', value: parseFloat(e.target.value) || 0 } })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Unidade</Label>
                                      <Select
                                        value={item.unit}
                                        onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'unit', value } })}
                                      >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          {UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Valor Unit.</Label>
                                      <Input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index, field: 'unitPrice', value: parseFloat(e.target.value) || 0 } })}
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

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
          </div>
        );
      }

      case 3: {
        const professionLabel = formData.profession === 'outros' 
          ? formData.customProfession 
          : PROFESSIONS.find(p => p.value === formData.profession)?.label;

        const budgetData: BudgetData = {
          id: Date.now(),
          clientName: formData.clientName,
          clientAddress: formData.clientAddress,
          clientPhone: formData.clientPhone,
          clientEmail: formData.clientEmail,
          title: formData.template || `Serviço de ${professionLabel || 'Profissional'}`,
          category: professionLabel || formData.profession,
          description: formData.generalObservations || 'Serviços e materiais conforme listado abaixo.',
          items: formData.items.map(i => i.description),
          itemDetails: formData.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitPrice: item.unitPrice,
            total: item.total,
            type: item.type,
          })),
          value: `R$ ${formData.total.toFixed(2).replace('.', ',')}`,
          terms: formData.payment,
          validity: `${formData.validity} dias`,
        };

        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vista">À vista</SelectItem>
                        <SelectItem value="50-50">50% entrada + 50% na conclusão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="validity">Validade (dias)</Label>
                    <Select
                      value={formData.validity}
                      onValueChange={(value) => dispatch({ type: 'UPDATE_FIELD', field: 'validity', payload: value })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dias</SelectItem>
                        <SelectItem value="30">30 dias</SelectItem>
                        <SelectItem value="45">45 dias</SelectItem>
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
                    placeholder="Termos e condições..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Prévia do Orçamento</h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Verifique todas as informações antes de gerar o documento final.
                </p>
                <Button 
                  onClick={() => setIsPreviewOpen(true)}
                  variant="outline"
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar PDF
                </Button>
                
                <PdfPreview
                  budget={budgetData}
                  isOpen={isPreviewOpen}
                  onClose={() => setIsPreviewOpen(false)}
                />
              </div>
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">{budgetId ? 'Editar Orçamento' : 'Novo Orçamento'}</h1>
            <p className="text-gray-600">Etapa {currentStep} de 3</p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 -z-0" />

          <div 
            className="absolute top-6 left-0 h-0.5 bg-blue-500 transition-all duration-300 -z-0" 
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step) => (
            <div key={step.number} className="relative z-10 flex flex-col items-center">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-blue-500 border-blue-100 text-white shadow-md'
                  : 'bg-white border-gray-100 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <step.icon className={`w-6 h-6 ${currentStep === step.number ? 'animate-pulse' : ''}`} />
                )}
              </div>
              <span className={`text-xs md:text-sm mt-3 font-semibold transition-colors ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {(() => {
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

      <Dialog open={isItemEditorOpen} onOpenChange={(open) => {
        setIsItemEditorOpen(open);
        if (!open) {
          setEditingItemIndex(null);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Item</DialogTitle>
          </DialogHeader>
          {editingItemIndex !== null && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.items[editingItemIndex]?.description || ''}
                  onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index: editingItemIndex, field: 'description', value: e.target.value } })}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.items[editingItemIndex]?.type || 'material'}
                    onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index: editingItemIndex, field: 'type', value } })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="material">Material</SelectItem>
                      <SelectItem value="labor">Mão de obra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    value={formData.items[editingItemIndex]?.quantity || 0}
                    onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index: editingItemIndex, field: 'quantity', value: parseFloat(e.target.value) || 0 } })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={formData.items[editingItemIndex]?.unit || 'un'}
                    onValueChange={(value) => dispatch({ type: 'UPDATE_ITEM', payload: { index: editingItemIndex, field: 'unit', value } })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor Unit.</Label>
                  <Input
                    type="number"
                    value={formData.items[editingItemIndex]?.unitPrice || 0}
                    onChange={(e) => dispatch({ type: 'UPDATE_ITEM', payload: { index: editingItemIndex, field: 'unitPrice', value: parseFloat(e.target.value) || 0 } })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="button" onClick={() => setIsItemEditorOpen(false)}>
                  Concluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
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
        {currentStep < 3 ? (
          <Button
            onClick={nextStep}
            disabled={isSaving || (
              (currentStep === 1 && (!formData.clientName || !formData.clientPhone || !formData.clientAddress)) ||
              (currentStep === 2 && (
                !formData.profession || 
                (formData.profession === 'outros' && !formData.customProfession) ||
                formData.items.length === 0
              ))
            )}
            className="min-w-32 bg-blue-500 hover:bg-blue-600"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="space-x-3">
            <Button variant="outline" onClick={() => handleSubmit('rascunho')} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
            </Button>
            <Button onClick={() => handleSubmit('pendente')} className="bg-green-500 hover:bg-green-600" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar e Enviar'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NovoOrcamento;
