
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
    const budgetDataMap: Record<number, BudgetData> = {
      1: {
        id: 1,
        category: "Eletricistas",
        title: "Instalação Elétrica Residencial",
        description: "Orçamento completo para instalação elétrica de casa de 120m² com materiais de primeira qualidade e mão de obra especializada.",
        value: "R$ 3.500,00",
        clientName: "João Silva",
        clientAddress: "Rua das Flores, 123 - Centro - São Paulo/SP - CEP: 01234-567",
        clientPhone: "(11) 99999-1234",
        clientEmail: "joao.silva@email.com",
        terms: "vista",
        validity: "30 dias",
        warranty: "12 meses",
        items: [
          {
            description: "Quadro elétrico completo 12 disjuntores",
            quantity: 1,
            unit: "un",
            unitPrice: 450.00,
            total: 450.00,
            type: "material"
          },
          {
            description: "Tomadas e interruptores (conjunto)",
            quantity: 15,
            unit: "un",
            unitPrice: 25.00,
            total: 375.00,
            type: "material"
          },
          {
            description: "Fiação elétrica 2,5mm e 4mm",
            quantity: 200,
            unit: "m",
            unitPrice: 8.50,
            total: 1700.00,
            type: "material"
          },
          {
            description: "Instalação elétrica completa",
            quantity: 1,
            unit: "serv",
            unitPrice: 975.00,
            total: 975.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 2525.00,
        subtotalLabor: 975.00,
        discount: 0,
        total: 3500.00
      },
      2: {
        id: 2,
        category: "Encanadores",
        title: "Reforma Hidráulica Completa",
        description: "Substituição completa de tubulação e instalação de louças sanitárias com materiais de alta qualidade.",
        value: "R$ 2.800,00",
        clientName: "Maria Santos",
        clientAddress: "Av. Paulista, 456 - Bela Vista - São Paulo/SP - CEP: 01310-100",
        clientPhone: "(11) 98888-5678",
        clientEmail: "maria.santos@email.com",
        terms: "parcelado_2x",
        validity: "15 dias",
        warranty: "24 meses",
        items: [
          {
            description: "Tubos PVC 50mm e conexões",
            quantity: 50,
            unit: "m",
            unitPrice: 18.00,
            total: 900.00,
            type: "material"
          },
          {
            description: "Registros e válvulas",
            quantity: 8,
            unit: "un",
            unitPrice: 45.00,
            total: 360.00,
            type: "material"
          },
          {
            description: "Louças sanitárias completas",
            quantity: 2,
            unit: "conj",
            unitPrice: 320.00,
            total: 640.00,
            type: "material"
          },
          {
            description: "Instalação hidráulica completa",
            quantity: 1,
            unit: "serv",
            unitPrice: 900.00,
            total: 900.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 1900.00,
        subtotalLabor: 900.00,
        discount: 0,
        total: 2800.00
      },
      3: {
        id: 3,
        category: "Pintores",
        title: "Pintura Externa e Interna",
        description: "Pintura completa de casa de 2 andares com textura, preparação de superfície e acabamento premium.",
        value: "R$ 4.200,00",
        clientName: "Carlos Oliveira",
        clientAddress: "Rua dos Jardins, 789 - Vila Madalena - São Paulo/SP - CEP: 05435-010",
        clientPhone: "(11) 97777-9012",
        clientEmail: "carlos.oliveira@email.com",
        terms: "parcelado_3x",
        validity: "20 dias",
        warranty: "18 meses",
        items: [
          {
            description: "Tinta acrílica premium 18L",
            quantity: 12,
            unit: "gl",
            unitPrice: 85.00,
            total: 1020.00,
            type: "material"
          },
          {
            description: "Massa corrida e primer",
            quantity: 8,
            unit: "bd",
            unitPrice: 35.00,
            total: 280.00,
            type: "material"
          },
          {
            description: "Lixa, pincéis e rolos",
            quantity: 1,
            unit: "kit",
            unitPrice: 150.00,
            total: 150.00,
            type: "material"
          },
          {
            description: "Serviço de pintura completa",
            quantity: 1,
            unit: "serv",
            unitPrice: 2750.00,
            total: 2750.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 1450.00,
        subtotalLabor: 2750.00,
        discount: 0,
        total: 4200.00
      },
      4: {
        id: 4,
        category: "Marceneiros",
        title: "Móveis Planejados Cozinha",
        description: "Projeto completo de armários e bancadas sob medida para cozinha moderna com acabamento premium.",
        value: "R$ 8.500,00",
        clientName: "Ana Costa",
        clientAddress: "Rua Augusta, 321 - Consolação - São Paulo/SP - CEP: 01305-000",
        clientPhone: "(11) 96666-3456",
        clientEmail: "ana.costa@email.com",
        terms: "parcelado_4x",
        validity: "45 dias",
        warranty: "36 meses",
        items: [
          {
            description: "MDF 18mm branco",
            quantity: 25,
            unit: "m²",
            unitPrice: 120.00,
            total: 3000.00,
            type: "material"
          },
          {
            description: "Ferragens e puxadores",
            quantity: 1,
            unit: "kit",
            unitPrice: 800.00,
            total: 800.00,
            type: "material"
          },
          {
            description: "Bancada granito preto",
            quantity: 6,
            unit: "m²",
            unitPrice: 250.00,
            total: 1500.00,
            type: "material"
          },
          {
            description: "Projeto, corte e montagem",
            quantity: 1,
            unit: "serv",
            unitPrice: 3200.00,
            total: 3200.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 5300.00,
        subtotalLabor: 3200.00,
        discount: 0,
        total: 8500.00
      },
      5: {
        id: 5,
        category: "Jardineiros",
        title: "Paisagismo e Jardinagem",
        description: "Criação de jardim com plantas ornamentais e sistema de irrigação automatizado.",
        value: "R$ 1.950,00",
        clientName: "Pedro Almeida",
        clientAddress: "Rua das Palmeiras, 654 - Morumbi - São Paulo/SP - CEP: 05650-000",
        clientPhone: "(11) 95555-7890",
        clientEmail: "pedro.almeida@email.com",
        terms: "vista",
        validity: "10 dias",
        warranty: "6 meses",
        items: [
          {
            description: "Plantas ornamentais variadas",
            quantity: 30,
            unit: "un",
            unitPrice: 25.00,
            total: 750.00,
            type: "material"
          },
          {
            description: "Terra adubada e substrato",
            quantity: 10,
            unit: "sc",
            unitPrice: 18.00,
            total: 180.00,
            type: "material"
          },
          {
            description: "Sistema irrigação gotejamento",
            quantity: 1,
            unit: "kit",
            unitPrice: 320.00,
            total: 320.00,
            type: "material"
          },
          {
            description: "Plantio e instalação completa",
            quantity: 1,
            unit: "serv",
            unitPrice: 700.00,
            total: 700.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 1250.00,
        subtotalLabor: 700.00,
        discount: 0,
        total: 1950.00
      },
      6: {
        id: 6,
        category: "Pedreiros",
        title: "Construção de Muro",
        description: "Muro de divisa com 30 metros lineares, portão e acabamento em textura.",
        value: "R$ 5.200,00",
        clientName: "Roberto Lima",
        clientAddress: "Rua dos Operários, 987 - Ipiranga - São Paulo/SP - CEP: 04261-000",
        clientPhone: "(11) 94444-2468",
        clientEmail: "roberto.lima@email.com",
        terms: "parcelado_2x",
        validity: "30 dias",
        warranty: "12 meses",
        items: [
          {
            description: "Blocos de concreto 14x19x39",
            quantity: 400,
            unit: "un",
            unitPrice: 4.50,
            total: 1800.00,
            type: "material"
          },
          {
            description: "Cimento, areia e brita",
            quantity: 1,
            unit: "kit",
            unitPrice: 800.00,
            total: 800.00,
            type: "material"
          },
          {
            description: "Ferragens e vergalhões",
            quantity: 50,
            unit: "kg",
            unitPrice: 8.00,
            total: 400.00,
            type: "material"
          },
          {
            description: "Construção e acabamento",
            quantity: 1,
            unit: "serv",
            unitPrice: 2200.00,
            total: 2200.00,
            type: "labor"
          }
        ],
        subtotalMaterials: 3000.00,
        subtotalLabor: 2200.00,
        discount: 0,
        total: 5200.00
      }
    };

    return budgetDataMap[budgetId] || null;
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
