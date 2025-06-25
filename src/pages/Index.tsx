import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Calculator, FileText, MessageSquare, Star, Users, Zap, Shield, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Modal from '@/components/Modal';
import PdfPreview from '@/components/PdfPreview';
import { useBudgetData } from '@/hooks/useBudgetData';

const Index = () => {
  const [activePlan, setActivePlan] = useState('pro');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedBudget, openBudgetModal, closeBudgetModal } = useBudgetData();

  const benefits = [
    {
      icon: Calculator,
      title: "Cálculos Automáticos",
      description: "Materiais + mão de obra calculados automaticamente"
    },
    {
      icon: FileText,
      title: "PDF Profissional",
      description: "Orçamentos com sua logo e identidade visual"
    },
    {
      icon: MessageSquare,
      title: "Envio Direto",
      description: "WhatsApp e email integrados para envio instantâneo"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      profession: "Eletricista",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      comment: "Aumentei minha conversão em 40% com orçamentos mais profissionais"
    },
    {
      name: "Ana Costa",
      profession: "Pintora",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b714?w=100&h=100&fit=crop&crop=face",
      comment: "Economizo 1 hora por orçamento. Ferramenta indispensável!"
    },
    {
      name: "João Santos",
      profession: "Encanador",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      comment: "Meus clientes ficaram impressionados com a qualidade dos orçamentos"
    }
  ];

  const budgetExamples = [
    {
      id: 1,
      category: "Eletricistas",
      title: "Instalação Elétrica Residencial",
      description: "Orçamento completo para instalação elétrica de casa de 120m²",
      value: "R$ 3.500,00",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop",
      items: ["Quadro elétrico", "Tomadas e interruptores", "Fiação", "Mão de obra"]
    },
    {
      id: 2,
      category: "Encanadores", 
      title: "Reforma Hidráulica Completa",
      description: "Substituição de tubulação e instalação de louças sanitárias",
      value: "R$ 2.800,00",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
      items: ["Tubos e conexões", "Registros", "Louças sanitárias", "Instalação"]
    },
    {
      id: 3,
      category: "Pintores",
      title: "Pintura Externa e Interna",
      description: "Pintura completa de casa de 2 andares com textura",
      value: "R$ 4.200,00", 
      image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop",
      items: ["Tinta acrílica", "Massa corrida", "Lixa e primers", "Mão de obra"]
    },
    {
      id: 4,
      category: "Marceneiros",
      title: "Móveis Planejados Cozinha",
      description: "Projeto completo de armários e bancadas sob medida",
      value: "R$ 8.500,00",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      items: ["MDF 18mm", "Ferragens", "Bancada granito", "Montagem"]
    },
    {
      id: 5,
      category: "Jardineiros",
      title: "Paisagismo e Jardinagem",
      description: "Criação de jardim com plantas ornamentais e sistema de irrigação",
      value: "R$ 1.950,00",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      items: ["Plantas e mudas", "Terra adubada", "Sistema irrigação", "Plantio"]
    },
    {
      id: 6,
      category: "Pedreiros",
      title: "Construção de Muro",
      description: "Muro de divisa com 30 metros lineares e portão",
      value: "R$ 5.200,00",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop",
      items: ["Blocos de concreto", "Cimento e areia", "Ferragens", "Acabamento"]
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: 19,
      description: "Para freelancers iniciantes",
      features: [
        "Até 50 orçamentos/mês",
        "3 templates básicos",
        "Geração de PDF",
        "Suporte por email"
      ],
      recommended: false
    },
    {
      name: "Pro",
      price: 29,
      description: "Para profissionais estabelecidos",
      features: [
        "Orçamentos ilimitados",
        "Templates personalizáveis",
        "Integração WhatsApp",
        "Relatórios avançados",
        "Suporte prioritário"
      ],
      recommended: true
    },
    {
      name: "Premium",
      price: 39,
      description: "Para empresas e equipes",
      features: [
        "Tudo do Pro +",
        "Multi-usuários",
        "API personalizada",
        "Marca branca",
        "Suporte telefônico"
      ],
      recommended: false
    }
  ];

  const categories = [...new Set(budgetExamples.map(example => example.category))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">OrçaFácil</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Depoimentos</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Preços</a>
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Entrar</Link>
            <Link to="/signup">
              <Button className="bg-blue-500 hover:bg-blue-600">Teste Grátis</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Usado por +1.000 profissionais
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Crie Orçamentos
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
              {" "}Profissionais
            </span>
            <br />em 2 Minutos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Para eletricistas, encanadores, pintores e outros profissionais que querem impressionar seus clientes e aumentar suas vendas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                Começar Teste Grátis
              </Button>
            </Link>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Eye className="w-5 h-5 mr-2" />
                  Ver Exemplos de Orçamentos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-4">
                    Exemplos de Orçamentos Profissionais
                  </DialogTitle>
                  <p className="text-gray-600 text-center">
                    Veja a qualidade dos orçamentos que você pode criar com o OrçaFácil
                  </p>
                </DialogHeader>
                
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {budgetExamples.map((example, index) => (
                      <Card 
                        key={example.id} 
                        className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="relative">
                          <img 
                            src={example.image} 
                            alt={example.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-3 left-3 bg-blue-500 text-white">
                            {example.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{example.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{example.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <h4 className="font-medium text-sm text-gray-700">Itens inclusos:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {example.items.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Check className="w-3 h-3 text-green-500 mr-1" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t">
                            <span className="text-lg font-bold text-blue-600">{example.value}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openBudgetModal(example.id)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              Ver PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">
                      Pronto para criar orçamentos como estes?
                    </p>
                    <Link to="/signup">
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Começar Agora - Teste Grátis
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-2xl border overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 ml-4">OrçaFácil Dashboard</div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-gray-600">Orçamentos</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">R$ 85k</div>
                    <div className="text-sm text-gray-600">Valor Total</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">73%</div>
                    <div className="text-sm text-gray-600">Conversão</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">23</div>
                    <div className="text-sm text-gray-600">Este Mês</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para vender mais
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recursos desenvolvidos especialmente para profissionais de serviços domésticos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in">
              Histórias reais de profissionais que transformaram seus negócios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: 'both'
                }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.profession}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600">
              Todos os planos incluem 7 dias de teste grátis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-lg transition-shadow ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Mais Popular</Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      R$ {plan.price}
                      <span className="text-sm font-normal text-gray-500">/mês</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/signup">
                    <Button 
                      className={`w-full ${plan.recommended ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                    >
                      Teste 7 dias grátis
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">OrçaFácil</span>
              </div>
              <p className="text-gray-400 mb-4">
                A ferramenta definitiva para profissionais criarem orçamentos profissionais.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OrçaFácil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={!!selectedBudget}
        onClose={closeBudgetModal}
        title={selectedBudget ? `Prévia do Orçamento - ${selectedBudget.title}` : ''}
        className="max-w-5xl"
      >
        {selectedBudget && (
          <PdfPreview budget={selectedBudget} onClose={closeBudgetModal} />
        )}
      </Modal>
    </div>
  );
};

export default Index;
