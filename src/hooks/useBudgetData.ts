
import { useState } from 'react';

export interface BudgetItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  type: 'material' | 'labor';
}

export interface BudgetData {
  id: number | string;
  category: string;
  title: string;
  description: string;
  value: string;
  items: BudgetItem[];
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  terms: string;
  validity: string;
  warranty: string;
  subtotalMaterials?: number;
  subtotalLabor?: number;
  discount?: number;
  total: number;
  generalObservations?: string;
  deadline?: string;
}

export const budgetExamples = [
    {
      id: 1,
      category: "Eletricistas",
      title: "Instalação Elétrica Residencial",
      description: "Orçamento completo para instalação elétrica de casa de 120m²",
      value: "R$ 3.500,00",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop",
      items: ["Quadro elétrico", "Tomadas e interruptores", "Fiação", "Mão de obra"],
      pdf: '/pdfs/exemplo-eletricista.pdf'
    },
    {
      id: 2,
      category: "Encanadores", 
      title: "Reforma Hidráulica Completa",
      description: "Substituição de tubulação e instalação de louças sanitárias",
      value: "R$ 2.800,00",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
      items: ["Tubos e conexões", "Registros", "Louças sanitárias", "Instalação"],
      pdf: '/pdfs/exemplo-encanador.pdf'
    },
    {
      id: 3,
      category: "Pintores",
      title: "Pintura Externa e Interna",
      description: "Pintura completa de casa de 2 andares com textura",
      value: "R$ 4.200,00", 
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
      items: ["Tinta acrílica", "Massa corrida", "Lixa e primers", "Mão de obra"],
      pdf: '/pdfs/exemplo-pintor.pdf'
    },
    {
      id: 4,
      category: "Marceneiros",
      title: "Móveis Planejados Cozinha",
      description: "Projeto completo de armários e bancadas sob medida",
      value: "R$ 8.500,00",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      items: ["MDF 18mm", "Ferragens", "Bancada granito", "Montagem"],
      pdf: '/pdfs/exemplo-marceneiro.pdf'
    },
    {
      id: 5,
      category: "Jardineiros",
      title: "Paisagismo e Jardinagem",
      description: "Criação de jardim com plantas ornamentais e sistema de irrigação",
      value: "R$ 1.950,00",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      items: ["Plantas e mudas", "Terra adubada", "Sistema irrigação", "Plantio"],
      pdf: '/pdfs/exemplo-jardineiro.pdf'
    },
    {
      id: 6,
      category: "Pedreiros",
      title: "Construção de Muro",
      description: "Muro de divisa com 30 metros lineares e portão",
      value: "R$ 5.200,00",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
      items: ["Blocos de concreto", "Cimento e areia", "Ferragens", "Acabamento"],
      pdf: '/pdfs/exemplo-pedreiro.pdf'
    }
  ];

export const useBudgetData = () => {
  const [selectedBudget, setSelectedBudget] = useState<BudgetData | null>(null);

  const getBudgetData = (budgetId: number): BudgetData | null => {
    // Esta função será removida pois vamos usar dados reais do Supabase
    return null;
  };
  const openBudgetModal = (budgetId: number) => {
    const budget = getBudgetData(budgetId);
    setSelectedBudget(budget);
  };

  const closeBudgetModal = () => {
    setSelectedBudget(null);
  };

  return {
    selectedBudget,
    openBudgetModal,
    closeBudgetModal,
    getBudgetData
  };
};
