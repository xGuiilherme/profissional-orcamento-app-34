
import { useState } from 'react';

export interface BudgetData {
  id: number;
  category: string;
  title: string;
  description: string;
  value: string;
  items: string[];
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  terms: string;
  validity: string;
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

  const getBudgetData = (budgetId: number): BudgetData => {
    const budgetMap: Record<number, BudgetData> = {
      1: {
        id: 1,
        category: "Eletricistas",
        title: "Instalação Elétrica Residencial",
        description: "Instalação elétrica completa para residência de 120m² incluindo quadro elétrico, pontos de luz e tomadas.",
        value: "R$ 3.500,00",
        items: [
          "Quadro elétrico com disjuntores",
          "50 pontos de tomadas 110V/220V",
          "25 pontos de iluminação",
          "Fiação de cobre 2,5mm e 4mm",
          "Eletrodutos e conexões",
          "Mão de obra especializada",
          "Teste e certificação da instalação"
        ],
        clientName: "João da Silva",
        clientAddress: "Rua das Flores, 123 - Vila Madalena, São Paulo - SP",
        clientPhone: "(11) 99999-1111",
        clientEmail: "joao.silva@email.com",
        terms: "50% antecipado, 50% na conclusão",
        validity: "30 dias"
      },
      2: {
        id: 2,
        category: "Encanadores",
        title: "Reforma Hidráulica Completa",
        description: "Substituição completa da tubulação hidráulica e instalação de louças sanitárias premium.",
        value: "R$ 2.800,00",
        items: [
          "Tubos PVC soldável 25mm e 32mm",
          "Registros de gaveta e pressão",
          "Conexões e redutores",
          "Vaso sanitário com caixa acoplada",
          "Lavatório com torneira",
          "Chuveiro elétrico 5500W",
          "Mão de obra e teste de pressão"
        ],
        clientName: "Maria Santos",
        clientAddress: "Av. Paulista, 456 - Bela Vista, São Paulo - SP",
        clientPhone: "(11) 99999-2222",
        clientEmail: "maria.santos@email.com",
        terms: "À vista com 10% desconto",
        validity: "30 dias"
      },
      3: {
        id: 3,
        category: "Pintores",
        title: "Pintura Externa e Interna",
        description: "Pintura completa de casa de 2 andares com preparação de superfície e textura decorativa.",
        value: "R$ 4.200,00",
        items: [
          "Tinta acrílica premium para área externa",
          "Tinta látex para área interna",
          "Massa corrida e selador",
          "Lixa, primer e fita crepe",
          "Textura decorativa para sala",
          "320m² de área pintada",
          "Mão de obra especializada"
        ],
        clientName: "Pedro Costa",
        clientAddress: "Rua do Bosque, 789 - Jardins, São Paulo - SP",
        clientPhone: "(11) 99999-3333",
        clientEmail: "pedro.costa@email.com",
        terms: "3x sem juros no cartão",
        validity: "30 dias"
      },
      4: {
        id: 4,
        category: "Marceneiros",
        title: "Móveis Planejados Cozinha",
        description: "Projeto completo de móveis planejados para cozinha com armários suspensos e bancada de granito.",
        value: "R$ 8.500,00",
        items: [
          "Projeto 3D personalizado",
          "Armários em MDF 18mm com acabamento",
          "Bancada em granito branco Dallas",
          "Ferragens Blum com soft closing",
          "Puxadores em aço inox",
          "Iluminação LED embutida",
          "Montagem e instalação completa"
        ],
        clientName: "Ana Oliveira",
        clientAddress: "Rua das Magnólias, 321 - Morumbi, São Paulo - SP",
        clientPhone: "(11) 99999-4444",
        clientEmail: "ana.oliveira@email.com",
        terms: "Entrada + 6x sem juros",
        validity: "30 dias"
      },
      5: {
        id: 5,
        category: "Jardineiros",
        title: "Paisagismo e Jardinagem",
        description: "Criação de jardim ornamental com plantas tropicais e sistema de irrigação automatizada.",
        value: "R$ 1.950,00",
        items: [
          "Projeto paisagístico personalizado",
          "Plantas ornamentais tropicais",
          "Terra vegetal e substrato",
          "Sistema de irrigação por gotejamento",
          "Pedras decorativas e mulch",
          "Plantio e paisagismo",
          "Manual de cuidados"
        ],
        clientName: "Carlos Lima",
        clientAddress: "Condomínio Sunset, 654 - Alphaville, São Paulo - SP",
        clientPhone: "(11) 99999-5555",
        clientEmail: "carlos.lima@email.com",
        terms: "À vista ou 2x sem juros",
        validity: "30 dias"
      },
      6: {
        id: 6,
        category: "Pedreiros",
        title: "Construção de Muro",
        description: "Construção de muro de divisa com 30 metros lineares, incluindo fundação e acabamento.",
        value: "R$ 5.200,00",
        items: [
          "Fundação em concreto armado",
          "Blocos de concreto estrutural",
          "Cimento, areia e brita",
          "Ferragens 8mm e 10mm",
          "Reboco e acabamento",
          "Portão de ferro 1,2m",
          "30 metros lineares x 2m altura"
        ],
        clientName: "Roberto Alves",
        clientAddress: "Rua das Palmeiras, 987 - Vila Olímpia, São Paulo - SP",
        clientPhone: "(11) 99999-7777",
        clientEmail: "roberto.alves@email.com",
        terms: "40% início, 60% conclusão",
        validity: "30 dias"
      }
    };

    return budgetMap[budgetId] || budgetMap[1];
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
