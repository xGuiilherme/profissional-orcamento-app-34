import { useState } from 'react';

// Interface para os itens do template
export interface TemplateItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  type: 'material' | 'labor';
}

// Interface principal para os dados do template
export interface TemplateData {
  id: string;
  name: string;
  profession: string;
  items: TemplateItem[];
  deadline: string;
  warranty: string;
  payment: string;
  validity: string;
  generalObservations: string;
}

// Dados de exemplo para os templates
const initialTemplates: TemplateData[] = [
  {
    id: 'pintura-fachada',
    name: 'Pintura de Fachada',
    profession: 'Pintores',
    items: [
      { description: 'Preparação e Correção de Superfícies', quantity: 1, unit: 'm²', unitPrice: 0, type: 'labor' },
      { description: 'Massa corrida e selador', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Materiais de Preparo (lixas, fita crepe, lona)', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Textura decorativa', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'dias', unitPrice: 0, type: 'material' },
    ],
    deadline: '10 dias úteis',
    warranty: '24 meses para a mão de obra',
    payment: '50% de entrada + 50% na conclusão',
    validity: '30',
    generalObservations: 'Garantia cobre apenas a mão de obra. Não inclui reparos estruturais pré-existentes na parede.'
  },
  {
    id: 'instalacao-eletrica-residencial',
    name: 'Instalação Elétrica Residencial',
    profession: 'Eletricistas',
    items: [
      { description: 'Montagem do Quadro de Distribuição', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Instalação de Ponto Elétrico (Tomada/Interruptor)', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Passagem de Fiação', quantity: 1, unit: 'm', unitPrice: 0, type: 'material' },
      { description: 'Cabos Flexíveis (2.5mm², 4.0mm², 6.0mm²)', quantity: 1, unit: 'm', unitPrice: 0, type: 'material' },
      { description: 'Conduítes, Caixas e Conectores', quantity: 1, unit: 'm', unitPrice: 0, type: 'material' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'm', unitPrice: 0, type: 'labor' },
    ],
    deadline: '7 dias úteis',
    warranty: '12 meses para toda a instalação',
    payment: '40% de entrada, 30% no meio e 30% na conclusão',
    validity: '15',
    generalObservations: 'Todos os materiais seguem a norma NBR 5410. O orçamento não inclui o fornecimento de luminárias.'
  },
  {
    id: 'reparo-hidraulico-banheiro',
    name: 'Reparo Hidráulico de Banheiro',
    profession: 'Encanadores',
    items: [
      { description: 'Troca de Sifão e Válvula de Pia', quantity: 1, unit: 'un', unitPrice: 0, type: 'labor' },
      { description: 'Vaso Sanitário c/s Caixa Acoplada', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Tubos PVC soldável 25mm e 32mm', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Reparo de Vazamento em Registros (Geral)', quantity: 1, unit: 'un', unitPrice: 0, type: 'labor' },
      { description: 'Conexões e redutores', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
    ],
    deadline: '1 dia útil',
    warranty: '6 meses para os reparos realizados',
    payment: 'À vista no PIX ou dinheiro',
    validity: '15',
    generalObservations: 'Caso seja necessário quebrar a parede para o reparo do registro, um novo orçamento para o serviço de alvenaria e acabamento será gerado.'
  },
  {
    id: 'construcao-parede-divisoria',
    name: 'Construção de Parede Divisória',
    profession: 'Pedreiros',
    items: [
      { description: 'Levantamento de Alvenaria (Tijolo Baiano)', quantity: 15, unit: 'm²', unitPrice: 50, type: 'labor' },
      { description: 'Tijolos Baianos 9x19x19', quantity: 450, unit: 'un', unitPrice: 1.2, type: 'material' },
      { description: 'Massa para Alvenaria (Cimento, areia, cal)', quantity: 1, unit: 'm³', unitPrice: 300, type: 'material' },
      { description: 'Reboco e Emboço (duas faces)', quantity: 30, unit: 'm²', unitPrice: 35, type: 'labor' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' }
    ],
    deadline: '5 dias úteis',
    warranty: '5 anos para a estrutura da parede',
    payment: '50% de entrada + 50% na conclusão',
    validity: '30',
    generalObservations: 'Orçamento não inclui o serviço de pintura ou acabamento final (massa corrida, gesso, etc).'
  },
  {
    id: 'armario-cozinha-planejado',
    name: 'Armário de Cozinha Planejado',
    profession: 'Marceneiros',
    items: [
      { description: 'Fabricação de Módulos em MDF Branco TX 18mm', quantity: 4, unit: 'm²', unitPrice: 400, type: 'labor' },
      { description: 'Chapas de MDF Branco TX 18mm', quantity: 3, unit: 'un', unitPrice: 350, type: 'material' },
      { description: 'Instalação de Portas com Dobradiças Slow-motion', quantity: 8, unit: 'un', unitPrice: 60, type: 'labor' },
      { description: 'Dobradiças Slow-motion e Puxadores', quantity: 1, unit: 'lote', unitPrice: 450, type: 'material' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' }
    ],
    deadline: '20 dias úteis',
    warranty: '12 meses para ferragens e estrutura',
    payment: '50% na aprovação do projeto, 50% na entrega',
    validity: '45',
    generalObservations: 'Projeto 3D incluso. Não contempla o valor da marmoraria (pia e bancada).'
  },
  {
    id: 'box-e-espelho-banheiro',
    name: 'Box de Vidro e Espelho para Banheiro',
    profession: 'Vidraceiros',
    items: [
      { description: 'Box de vidro temperado 8mm Incolor (m²)', quantity: 1, unit: 'm²', unitPrice: 0, type: 'material' },
      { description: 'Kit de Instalação para Box (alumínio, roldanas, puxador)', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Espelho Guardian 4mm Lapidado (m²)', quantity: 1, unit: 'm²', unitPrice: 0, type: 'material' },
      { description: 'Botões de fixação para espelho', quantity: 4, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Silicone para vedação', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' },
      { description: 'Mão de obra especializada', quantity: 1, unit: 'un', unitPrice: 0, type: 'material' }
    ],
    deadline: '20 dias úteis',
    warranty: '12 meses para ferragens e estrutura',
    payment: '50% na aprovação do projeto, 50% na entrega',
    validity: '45',
    generalObservations: 'Projeto 3D incluso. Não contempla o valor da marmoraria (pia e bancada).'
  }
];

export const useTemplateData = () => {
  const [templates, setTemplates] = useState<TemplateData[]>(initialTemplates);

  const getTemplateById = (id: string): TemplateData | undefined => {
    return templates.find(t => t.id === id);
  };

  const getTemplatesByProfession = (profession: string): TemplateData[] => {
    return templates.filter(t => t.profession === profession);
  };

  const addTemplate = (templateData: Omit<TemplateData, 'id'>) => {
    const newTemplate: TemplateData = {
      ...templateData,
      id: `custom-${crypto.randomUUID()}`
    };
    setTemplates(prevTemplates => [...prevTemplates, newTemplate]);
  };

  const updateTemplate = (id: string, updatedData: Partial<TemplateData>) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(t => (t.id === id ? { ...t, ...updatedData } : t))
    );  
  };
  
  const deleteTemplate = (id: string) => {
    setTemplates(prevTemplates => prevTemplates.filter(t => t.id !== id));
  };

  return {
    templates,
    getTemplateById,
    getTemplatesByProfession,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  };
};