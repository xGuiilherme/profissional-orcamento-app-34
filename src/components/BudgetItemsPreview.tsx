import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { FormItem } from '@/reducers/orcamentoFormReducer';
import { paymentTermsMap } from '@/constants/paymentTerms';
import { UNITS } from '@/constants/orcamentoConst';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';
import Modal from './Modal';

interface BudgetItemsPreviewProps {
  items: FormItem[];
  className?: string;
  showTotals?: boolean;
  subtotalMaterials?: number;
  subtotalLabor?: number;
  discount?: number;
  total?: number;
  paymentTerms?: string;
  warranty?: string;
  deadline?: string;
  // Props para funcionalidades de edição
  editable?: boolean;
  onItemUpdate?: (index: number, field: keyof FormItem, value: string | number) => void;
  onItemRemove?: (index: number) => void;
  onItemAdd?: (item: FormItem) => void;
}

const BudgetItemsPreview = ({
  items,
  className = '',
  showTotals = false,
  subtotalMaterials = 0,
  subtotalLabor = 0,
  discount = 0,
  total = 0,
  paymentTerms = '',
  warranty = '',
  deadline = '',
  editable = false,
  onItemUpdate,
  onItemRemove,
  onItemAdd
}: BudgetItemsPreviewProps) => {
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<FormItem>({
    description: '',
    quantity: 1,
    unit: 'un',
    unitPrice: 0,
    total: 0,
    type: 'material'
  });
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTypeLabel = (type: 'material' | 'labor') => {
    return type === 'material' ? 'Material' : 'Mão de obra';
  };

  const getTypeColor = (type: 'material' | 'labor') => {
    return 'text-gray-700'; // Cor neutra para ambos os tipos
  };

  const handleEdit = (index: number) => {
    setEditingItem(index);
  };

  const handleSaveEdit = (index: number) => {
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleFieldUpdate = (index: number, field: keyof FormItem, value: string | number) => {
    if (onItemUpdate) {
      onItemUpdate(index, field, value);
    }
  };

  const handleRemoveItem = (index: number) => {
    if (onItemRemove) {
      onItemRemove(index);
    }
    setShowDeleteConfirm(null);
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleSaveNewItem = () => {
    if (!newItem.description.trim()) return;

    const itemToAdd = {
      ...newItem,
      total: newItem.quantity * newItem.unitPrice
    };

    if (onItemAdd) {
      onItemAdd(itemToAdd);
    }

    // Reset form
    setNewItem({
      description: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0,
      total: 0,
      type: 'material'
    });

    setShowAddModal(false);
  };

  const handleCancelAddItem = () => {
    setNewItem({
      description: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0,
      total: 0,
      type: 'material'
    });
    setShowAddModal(false);
  };

  const handleNewItemChange = (field: keyof FormItem, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-blue-600">ITENS INCLUSOS NO ORÇAMENTO</h3>
      </div>

      <div className="p-2 sm:p-4 overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-left pl-2 sm:pl-4 min-w-[120px] sm:w-[30%]">Item</TableHead>
              <TableHead className="text-left min-w-[80px] sm:w-[15%] hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="text-center min-w-[60px] sm:w-[10%]">Qtd.</TableHead>
              <TableHead className="text-center min-w-[50px] sm:w-[10%] hidden sm:table-cell">Un.</TableHead>
              <TableHead className="text-center min-w-[80px] sm:w-[12.5%]">Unitário</TableHead>
              <TableHead className="text-center min-w-[80px] sm:w-[12.5%]">Total</TableHead>
              {editable && <TableHead className="text-center min-w-[80px] sm:w-[10%]">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <TableCell className="text-left font-medium pl-2 sm:pl-4">
                  <div className="flex flex-col">
                    <span className="text-sm sm:text-base">{item.description}</span>
                    <span className={`text-xs sm:hidden ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-left hidden sm:table-cell">
                  <span className={`text-sm font-medium whitespace-nowrap ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </TableCell>

                {/* Quantidade - Editável se estiver no modo de edição */}
                <TableCell className="text-center">
                  {editable && editingItem === index ? (
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleFieldUpdate(index, 'quantity', Number(e.target.value))}
                      className="w-12 sm:w-16 text-center text-xs sm:text-sm"
                      min="1"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm">{item.quantity}</span>
                  )}
                </TableCell>

                <TableCell className="text-center text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                  {item.unit}
                </TableCell>

                {/* Preço Unitário - Editável se estiver no modo de edição */}
                <TableCell className="text-center">
                  {editable && editingItem === index ? (
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleFieldUpdate(index, 'unitPrice', Number(e.target.value))}
                      className="w-16 sm:w-24 text-center text-xs sm:text-sm"
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm">{formatCurrency(item.unitPrice)}</span>
                  )}
                </TableCell>

                <TableCell className="text-center font-semibold text-green-600">
                  <span className="text-xs sm:text-sm">{formatCurrency(item.total)}</span>
                </TableCell>

                {/* Coluna de Ações */}
                {editable && (
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1">
                      {editingItem === index ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSaveEdit(index)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(index)}
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          {showDeleteConfirm === index ? (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(index)}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Confirmar exclusão"
                              >
                                <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(null)}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                title="Cancelar"
                              >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShowDeleteConfirm(index)}
                              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Remover item"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Linha para adicionar novo item */}
            {editable && (
              <TableRow className="border-b border-dashed border-gray-300">
                <TableCell colSpan={7} className="text-center py-3 sm:py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddItem}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center mx-auto text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Adicionar Item</span>
                    <span className="sm:hidden">Adicionar</span>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Financial Summary */}
      {showTotals && (
        <div className="p-4 bg-gray-50 border-t">
          <h4 className="text-center font-semibold text-gray-900 mb-4">Resumo Financeiro</h4>
          <div className="space-y-2">
            {subtotalMaterials > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-normal">Subtotal Materiais:</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotalMaterials)}</span>
              </div>
            )}
            {subtotalLabor > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-orange-600 font-normal">Subtotal Mão de Obra:</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotalLabor)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-red-600 font-normal">Desconto:</span>
                <span className="font-medium text-red-600">-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">Total Geral:</span>
              <span className="font-bold text-green-600 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Informações adicionais */}
          {(paymentTerms || warranty) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h5 className="text-sm font-semibold text-gray-900 mb-3 text-left">CONDIÇÕES COMERCIAIS</h5>
              <div className="text-sm text-gray-600 space-y-1 text-left">
                {paymentTerms && (
                  <div className="text-left">
                    <span><strong>Condições de Pagamento:</strong> {paymentTermsMap[paymentTerms] || paymentTerms}</span>
                  </div>
                )}
                {deadline && (
                  <div className="text-left">
                    <span><strong>Prazo de Execução:</strong> {deadline}</span>
                  </div>
                )}
                {warranty && (
                  <div className="text-left">
                    <span><strong>Garantia:</strong> {warranty} para serviços executados</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para adicionar novo item */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={handleCancelAddItem}
          title="Adicionar Novo Item"
          className="max-w-lg w-full mx-4"
        >
          <div className="space-y-4 p-1">
            <div>
              <Label htmlFor="new-item-description" className="text-sm font-medium">Nome do Item *</Label>
              <Input
                id="new-item-description"
                type="text"
                value={newItem.description}
                onChange={(e) => handleNewItemChange('description', e.target.value)}
                placeholder="Digite a descrição do item"
                className={`mt-1 ${!newItem.description.trim() ? 'border-red-500' : ''}`}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-item-type" className="text-sm font-medium">Tipo *</Label>
                <select
                  id="new-item-type"
                  value={newItem.type}
                  onChange={(e) => handleNewItemChange('type', e.target.value as 'material' | 'labor')}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="material">Material</option>
                  <option value="labor">Mão de obra</option>
                </select>
              </div>

              <div>
                <Label htmlFor="new-item-unit" className="text-sm font-medium">Unidade</Label>
                <select
                  id="new-item-unit"
                  value={newItem.unit}
                  onChange={(e) => handleNewItemChange('unit', e.target.value)}
                  className="mt-1 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-item-quantity" className="text-sm font-medium">Quantidade *</Label>
                <Input
                  id="new-item-quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => handleNewItemChange('quantity', Number(e.target.value) || 1)}
                  min="1"
                  step="1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="new-item-price" className="text-sm font-medium">Valor Unitário *</Label>
                <Input
                  id="new-item-price"
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) => handleNewItemChange('unitPrice', Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelAddItem}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveNewItem}
                disabled={!newItem.description.trim()}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                Adicionar Item
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BudgetItemsPreview;
