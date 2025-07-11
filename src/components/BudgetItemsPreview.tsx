import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { FormItem } from '@/reducers/orcamentoFormReducer';
import { paymentTermsMap } from '@/constants/paymentTerms';

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
  warranty = ''
}: BudgetItemsPreviewProps) => {
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
    return type === 'material' ? 'text-blue-600' : 'text-orange-600';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">ITENS INCLUSOS NO ORÇAMENTO</h3>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="text-left pl-4 w-[40%]">Item</TableHead>
            <TableHead className="text-left w-[15%]">Tipo</TableHead>
            <TableHead className="text-center w-[10%]">Qtd.</TableHead>
            <TableHead className="text-center w-[10%]">Un.</TableHead>
            <TableHead className="text-center w-[12.5%]">Unitário</TableHead>
            <TableHead className="text-center w-[12.5%]">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index} className="border-b">
              <TableCell className="text-left font-medium pl-4">{item.description}</TableCell>
              <TableCell className="text-left">
                <span className={`text-sm font-medium ${getTypeColor(item.type)}`}>
                  {getTypeLabel(item.type)}
                </span>
              </TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell className="text-center text-muted-foreground">{item.unit}</TableCell>
              <TableCell className="text-center">{formatCurrency(item.unitPrice)}</TableCell>
              <TableCell className="text-center font-semibold text-green-600">
                {formatCurrency(item.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

      </Table>

      {/* Financial Summary */}
      {showTotals && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-center font-semibold text-gray-900 mb-4">Resumo Financeiro</h4>
          <div className="space-y-2">
            {subtotalMaterials > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-normal">Subtotal Materiais:</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotalMaterials)}</span>
              </div>
            )}
            {subtotalLabor > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-normal">Subtotal Mão de Obra:</span>
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
              <div className="text-sm text-gray-600 space-y-1 text-left">
                {paymentTerms && (
                  <div className="text-left">
                    <span><strong>Condições de Pagamento:</strong> {paymentTermsMap[paymentTerms] || paymentTerms}</span>
                  </div>
                )}
                <div className="text-left">
                  <span><strong>Prazo de Execução:</strong> Conforme cronograma acordado</span>
                </div>
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
    </div>
  );
};

export default BudgetItemsPreview;
