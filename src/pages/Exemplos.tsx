import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { budgetExamples, useBudgetData, BudgetData } from '@/hooks/useBudgetData';
import PdfPreview from '@/components/PdfPreview';

export default function Exemplos() {
  const [isPDFModalOpen, setPDFModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetData | null>(null);
  const { getBudgetData } = useBudgetData();

  const handlePDFOpen = (budgetExample: (typeof budgetExamples)[0]) => {
    const fullBudget = getBudgetData(budgetExample.id);
    setSelectedBudget(fullBudget);
    setPDFModalOpen(true);
  };

  const handlePDFClose = () => {
    setPDFModalOpen(false);
    setSelectedBudget(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Exemplos de Orçamentos Profissionais
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja a qualidade e a variedade dos orçamentos que você pode criar com o OrçaFácil. Cada exemplo é pensado para impressionar seus clientes e otimizar seu trabalho.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {budgetExamples.map((example) => (
            <Card 
              key={example.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative">
                <img 
                  src={example.image} 
                  alt={example.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {example.category}
                </Badge>
              </div>
              <CardContent className="p-6 flex-grow flex flex-col">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{example.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{example.description}</p>
                
                <div className="space-y-2 mb-5">
                  <h4 className="font-semibold text-sm text-gray-700">Itens inclusos:</h4>
                  <ul className="text-sm text-gray-600 space-y-1.5">
                    {example.items.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t mt-auto">
                  <span className="text-2xl font-bold text-blue-600">{example.value}</span>
                  <Button 
                    size="default"
                    variant="outline"
                    onClick={() => handlePDFOpen(example)}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Ver PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-700 text-lg mb-4">
            Pronto para criar orçamentos como estes e impressionar seus clientes?
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-10 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Começar Agora - Teste Grátis
            </Button>
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar para o site
          </Link>
        </div>
      </div>

      {selectedBudget && (
        <PdfPreview
          isOpen={isPDFModalOpen}
          onClose={handlePDFClose}
          budget={selectedBudget}
        />
      )}
    </div>
  );
}