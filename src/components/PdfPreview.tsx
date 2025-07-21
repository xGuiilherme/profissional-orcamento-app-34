
import { useState, useEffect } from 'react';
import { Calendar, User, MapPin, Phone, Mail, FileText, CheckCircle, Save, Zap, Wrench, Paintbrush, Hammer, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BudgetData } from '@/hooks/useBudgetData';
import { useBudgetOperations } from '@/hooks/useBudgetOperations';
import { FormDataState } from '@/reducers/orcamentoFormReducer';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import Modal from './Modal';
import BudgetItemsPreview from './BudgetItemsPreview';

interface PdfPreviewProps {
  budget: BudgetData;
  formData?: FormDataState;
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  customId?: string; // ID customizado no formato ORC001
}

const PdfPreview = ({ budget, formData, isOpen, onClose, onSave, customId }: PdfPreviewProps) => {
  const { saveBudget } = useBudgetOperations();
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile } = useProfile();

  // Função para extrair primeiro e último nome
  const getFirstAndLastName = (fullName: string | null | undefined): string => {
    if (!fullName) return 'OrçaFácil';

    const names = fullName.trim().split(' ').filter(name => name.length > 0);

    if (names.length === 0) return 'OrçaFácil';
    if (names.length === 1) return names[0];

    // Retorna primeiro e último nome
    return `${names[0]} ${names[names.length - 1]}`;
  };

  // Mapeamento de profissões com ícones e cores
  const getProfessionInfo = (profession: string) => {
    const normalizedProfession = profession?.toLowerCase() || '';

    const professionMap: Record<string, { icon: any; color: string; bgColor: string; displayName: string }> = {
      'eletricistas': { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-100', displayName: 'ELETRICISTA' },
      'eletricista': { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-100', displayName: 'ELETRICISTA' },
      'encanadores': { icon: Wrench, color: 'text-blue-600', bgColor: 'bg-blue-100', displayName: 'ENCANADOR' },
      'encanador': { icon: Wrench, color: 'text-blue-600', bgColor: 'bg-blue-100', displayName: 'ENCANADOR' },
      'pintores': { icon: Paintbrush, color: 'text-green-600', bgColor: 'bg-green-100', displayName: 'PINTOR' },
      'pintor': { icon: Paintbrush, color: 'text-green-600', bgColor: 'bg-green-100', displayName: 'PINTOR' },
      'marceneiros': { icon: Hammer, color: 'text-amber-600', bgColor: 'bg-amber-100', displayName: 'MARCENEIRO' },
      'marceneiro': { icon: Hammer, color: 'text-amber-600', bgColor: 'bg-amber-100', displayName: 'MARCENEIRO' },
      'pedreiros': { icon: HardHat, color: 'text-gray-600', bgColor: 'bg-gray-100', displayName: 'PEDREIRO' },
      'pedreiro': { icon: HardHat, color: 'text-gray-600', bgColor: 'bg-gray-100', displayName: 'PEDREIRO' },
    };

    return professionMap[normalizedProfession] || {
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      displayName: profession?.toUpperCase() || 'PROFISSIONAL'
    };
  };

  // Estado local para gerenciar os itens editáveis
  const [localFormData, setLocalFormData] = useState(formData);

  useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Funções para edição de itens
  const handleItemUpdate = (index: number, field: keyof any, value: string | number) => {
    if (!localFormData) return;

    const newItems = [...localFormData.items];
    const updatedItem = { ...newItems[index], [field]: value };

    // Recalcular total quando quantidade ou preço unitário mudar
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
    }

    newItems[index] = updatedItem;

    // Recalcular totais
    const subtotalMaterials = newItems
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + item.total, 0);

    const subtotalLabor = newItems
      .filter(item => item.type === 'labor')
      .reduce((sum, item) => sum + item.total, 0);

    const total = subtotalMaterials + subtotalLabor - (localFormData.discount || 0);

    setLocalFormData({
      ...localFormData,
      items: newItems,
      subtotalMaterials,
      subtotalLabor,
      total
    });
  };

  const handleItemRemove = (index: number) => {
    if (!localFormData || localFormData.items.length <= 1) return;

    const newItems = localFormData.items.filter((_, i) => i !== index);

    // Recalcular totais
    const subtotalMaterials = newItems
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + item.total, 0);

    const subtotalLabor = newItems
      .filter(item => item.type === 'labor')
      .reduce((sum, item) => sum + item.total, 0);

    const total = subtotalMaterials + subtotalLabor - (localFormData.discount || 0);

    setLocalFormData({
      ...localFormData,
      items: newItems,
      subtotalMaterials,
      subtotalLabor,
      total
    });
  };

  const handleItemAdd = (newItem: any) => {
    if (!localFormData) return;

    const newItems = [...localFormData.items, newItem];

    // Recalcular totais
    const subtotalMaterials = newItems
      .filter(item => item.type === 'material')
      .reduce((sum, item) => sum + item.total, 0);

    const subtotalLabor = newItems
      .filter(item => item.type === 'labor')
      .reduce((sum, item) => sum + item.total, 0);

    const total = subtotalMaterials + subtotalLabor - (localFormData.discount || 0);

    setLocalFormData({
      ...localFormData,
      items: newItems,
      subtotalMaterials,
      subtotalLabor,
      total
    });
  };

  const handleSaveBudget = async () => {
    if (!localFormData) {
      toast({
        title: "Erro",
        description: "Dados do formulário não encontrados",
        variant: "destructive",
      });
      return;
    }

    const result = await saveBudget(localFormData);

    if (result.success) {
      toast({
        title: "Sucesso!",
        description: "Orçamento salvo com sucesso",
      });
      if (onSave) onSave();
      onClose();
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao salvar orçamento",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" className="max-w-4xl h-[90vh]">
      <div className="bg-white">
        {/* PDF Content */}
        <div className="p-8 bg-white border-2 border-gray-100" style={{ fontFamily: 'Arial, sans-serif' }}>
          {/* Company Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-blue-500">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getFirstAndLastName(profile?.full_name || user?.user_metadata?.full_name)}
              </h1>
            </div>
            <p className="text-gray-600">
              {profile?.profession || 'Orçamentos Profissionais'} • {profile?.email || user?.email || 'contato@orcafacil.com'} • {profile?.phone || '(11) 9999-0000'}
            </p>
          </div>

          {/* Document Title */}
          <div className="mb-8">
            {/* Título principal e ID */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                  PROPOSTA COMERCIAL
                </h2>
              </div>
              <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2 self-start sm:self-auto">
                {customId || `#${budget.id.toString().padStart(3, '0')}`}
              </Badge>
            </div>

            {/* Data e validade */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Data: {currentDate}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                <span className="text-sm sm:text-base">Validade: {budget.validity}</span>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              DADOS DO CLIENTE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="flex items-center font-medium text-gray-900">{budget.clientName}</p>
                <div className="flex items-start text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{budget.clientAddress}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{budget.clientPhone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{budget.clientEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="mb-8 text-left">
            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">SERVIÇO SOLICITADO</h3>
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-900 text-lg">{budget.serviceDescription || budget.title}</h4>
            </div>
            {budget.description && (
              <p className="text-gray-700 leading-relaxed text-left">{budget.description}</p>
            )}
          </div>

          {/* Items Included */}
          <BudgetItemsPreview
            items={localFormData?.items || budget.items}
            className="mb-8"
            showTotals={true}
            subtotalMaterials={localFormData?.subtotalMaterials || budget.subtotalMaterials}
            subtotalLabor={localFormData?.subtotalLabor || budget.subtotalLabor}
            discount={localFormData?.discount || budget.discount}
            total={localFormData?.total || budget.total}
            paymentTerms={budget.terms}
            warranty={budget.warranty}
            deadline={localFormData?.deadline || budget.deadline}
            editable={!!formData}
            onItemUpdate={handleItemUpdate}
            onItemRemove={handleItemRemove}
            onItemAdd={handleItemAdd}
          />

          {/* Terms and Conditions */}
          <div className="border-t pt-6">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <h3 className="flex items-center text-sm font-semibold text-amber-800 mb-3">OBSERVAÇÕES IMPORTANTES:</h3>
              <div className="text-sm text-amber-700 text-left space-y-1">
                <p>• Este orçamento tem validade de {budget.validity} a partir da data de emissão.</p>
                <p>• Os valores podem sofrer alterações em caso de mudanças no escopo do projeto.</p>
                <p>• Materiais e mão de obra inclusos conforme especificado acima.</p>
                <p>• Início dos trabalhos condicionado à aprovação do orçamento e entrada acordada.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center">
            <p className="text-sm text-gray-500">
              Documento gerado automaticamente pelo sistema OrçaFácil • www.orcafacil.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {formData && (
          <div className="flex justify-end space-x-3 p-6 bg-gray-50 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={handleSaveBudget} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Orçamento
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PdfPreview;
