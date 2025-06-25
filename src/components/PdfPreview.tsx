
import { Calendar, User, MapPin, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BudgetData } from '@/hooks/useBudgetData';

interface PdfPreviewProps {
  budget: BudgetData;
  onClose: () => void;
}

const PdfPreview = ({ budget, onClose }: PdfPreviewProps) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="bg-white">
      {/* PDF Content */}
      <div className="p-8 bg-white border-2 border-gray-100" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Company Header */}
        <div className="text-center mb-8 pb-6 border-b-2 border-blue-500">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OrçaFácil</h1>
          </div>
          <p className="text-gray-600">Orçamentos Profissionais • contato@orcafacil.com • (11) 9999-0000</p>
        </div>

        {/* Document Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">ORÇAMENTO PROFISSIONAL</h2>
            <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
              #{budget.id.toString().padStart(3, '0')}
            </Badge>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Data: {currentDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>Validade: {budget.validity}</span>
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
              <p className="font-medium text-gray-900">{budget.clientName}</p>
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
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SERVIÇO SOLICITADO</h3>
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-900 text-lg">{budget.title}</h4>
            <Badge className="mt-2 bg-blue-500 text-white">{budget.category}</Badge>
          </div>
          <p className="text-gray-700 leading-relaxed">{budget.description}</p>
        </div>

        {/* Items Included */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ITENS INCLUSOS NO ORÇAMENTO</h3>
          <div className="bg-white border border-gray-200 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 w-16">Incluído</th>
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4 text-gray-700">{item}</td>
                    <td className="py-3 px-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Information */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">VALOR TOTAL</h3>
            <span className="text-3xl font-bold text-green-600">{budget.value}</span>
          </div>
          <div className="text-sm text-gray-600">
            <p><strong>Condições de Pagamento:</strong> {budget.terms}</p>
            <p><strong>Prazo de Execução:</strong> Conforme cronograma acordado</p>
            <p><strong>Garantia:</strong> 6 meses para serviços executados</p>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">OBSERVAÇÕES IMPORTANTES:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Este orçamento tem validade de {budget.validity} a partir da data de emissão.</p>
            <p>• Os valores podem sofrer alterações em caso de mudanças no escopo do projeto.</p>
            <p>• Materiais e mão de obra inclusos conforme especificado acima.</p>
            <p>• Início dos trabalhos condicionado à aprovação do orçamento e entrada acordada.</p>
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
      <div className="p-6 bg-gray-50 border-t flex justify-center">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default PdfPreview;
