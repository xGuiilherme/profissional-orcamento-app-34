import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTemplateData } from '@/hooks/useTemplateData';
import Modal from './Modal'; // Reutilize seu componente de Modal

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  profession?: string; // Para filtrar templates por profissão
}

export const TemplateSelectionModal = ({ isOpen, onClose, profession }: TemplateSelectionModalProps) => {
  const navigate = useNavigate();
  const { templates } = useTemplateData();

  const filteredTemplates = profession
    ? templates.filter(t => t.profession === profession)
    : templates;

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/orcamento/novo/${templateId}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Selecionar Template de Orçamento">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col flex-grow p-6 pt-0'>
              <p className="text-sm text-muted-foreground mb-4 capitalize">{template.profession}</p>
              <Button className="w-full mt-auto" onClick={() => handleSelectTemplate(template.id)}>
                Usar este Template
              </Button>
            </CardContent>
          </Card>
        ))}
        {filteredTemplates.length === 0 && (
          <p className="text-center col-span-full text-muted-foreground">
            Nenhum template encontrado para esta profissão.
          </p>
        )}
      </div>
    </Modal>
  );
};