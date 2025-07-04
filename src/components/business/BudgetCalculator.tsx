import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { TextInput, SelectInput, NumberInput } from '@/components/forms/FormFields';
import { useCurrency } from '@/hooks/useCurrency';

interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  type: 'material' | 'labor';
}

interface BudgetCalculatorProps {
  items: BudgetItem[];
  onItemsChange: (items: BudgetItem[]) => void;
  subtotalMaterials: number;
  subtotalLabor: number;
  discount: number;
  onDiscountChange: (discount: number) => void;
  total: number;
}

const units = [
  { value: 'un', label: 'Unidade' },
  { value: 'm²', label: 'Metro²' },
  { value: 'm', label: 'Metro' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'l', label: 'Litro' },
  { value: 'pç', label: 'Peça' },
  { value: 'h', label: 'Hora' }
];

const itemTypes = [
  { value: 'material', label: 'Material' },
  { value: 'labor', label: 'Mão de obra' }
];

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  items,
  onItemsChange,
  subtotalMaterials,
  subtotalLabor,
  discount,
  onDiscountChange,
  total
}) => {
  const { formatCurrency } = useCurrency();

  const addItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unit: 'un',
      unitPrice: 0,
      total: 0,
      type: 'material'
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof BudgetItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onItemsChange(updatedItems);
  };

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
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2">
                  <TextInput
                    label="Descrição"
                    name={`description-${item.id}`}
                    value={item.description}
                    onChange={(value) => updateItem(item.id, 'description', value)}
                    placeholder="Descrição do item/serviço"
                  />
                </div>
                
                <SelectInput
                  label="Tipo"
                  name={`type-${item.id}`}
                  value={item.type}
                  onChange={(value) => updateItem(item.id, 'type', value)}
                  options={itemTypes}
                />
                
                <NumberInput
                  label="Quantidade"
                  name={`quantity-${item.id}`}
                  value={item.quantity}
                  onChange={(value) => updateItem(item.id, 'quantity', value)}
                  min={0}
                  step={0.01}
                />
                
                <SelectInput
                  label="Unidade"
                  name={`unit-${item.id}`}
                  value={item.unit}
                  onChange={(value) => updateItem(item.id, 'unit', value)}
                  options={units}
                />
                
                <NumberInput
                  label="Valor Unit."
                  name={`unitPrice-${item.id}`}
                  value={item.unitPrice}
                  onChange={(value) => updateItem(item.id, 'unitPrice', value)}
                  min={0}
                  step={0.01}
                  prefix="R$"
                />
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Total: <span className="font-semibold text-green-600">
                    {formatCurrency(item.total)}
                  </span>
                </div>
                
                {items.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeItem(item.id)}
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

      {/* Totals */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal Materiais:</span>
                <span className="font-semibold">{formatCurrency(subtotalMaterials)}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal Mão de Obra:</span>
                <span className="font-semibold">{formatCurrency(subtotalLabor)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Desconto (%):</span>
                <div className="w-20">
                  <NumberInput
                    label=""
                    name="discount"
                    value={discount}
                    onChange={onDiscountChange}
                    min={0}
                    max={100}
                    suffix="%"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Geral</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(total)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};