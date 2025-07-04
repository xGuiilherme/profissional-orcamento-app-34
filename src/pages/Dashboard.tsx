import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const Dashboard = () => {
  const metrics = [
    {
      title: "Total de Orçamentos",
      value: "127",
      change: "+12%",
      changeType: "positive",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Valor Total Orçado",
      value: "R$ 85.420",
      change: "+18%",
      changeType: "positive",
      icon: DollarSign,
      color: "bg-green-500"
    },
    {
      title: "Taxa de Conversão",
      value: "73%",
      change: "+5%",
      changeType: "positive",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Orçamentos Este Mês",
      value: "23",
      change: "+8%",
      changeType: "positive",
      icon: Calendar,
      color: "bg-orange-500"
    }
  ];

  const recentBudgets = [
    {
      id: "ORC001",
      client: "João Silva",
      service: "Instalação Elétrica",
      value: "R$ 1.200",
      date: "15/12/2024",
      status: "Pendente"
    },
    {
      id: "ORC002",
      client: "Maria Santos",
      service: "Reparo Hidráulico",
      value: "R$ 450",
      date: "14/12/2024",
      status: "Aprovado"
    },
    {
      id: "ORC003",
      client: "Pedro Costa",
      service: "Pintura Residencial",
      value: "R$ 2.800",
      date: "13/12/2024",
      status: "Rejeitado"
    },
    {
      id: "ORC004",
      client: "Ana Oliveira",
      service: "Manutenção Elétrica",
      value: "R$ 680",
      date: "12/12/2024",
      status: "Aprovado"
    },
    {
      id: "ORC005",
      client: "Carlos Lima",
      service: "Instalação de Tomadas",
      value: "R$ 320",
      date: "11/12/2024",
      status: "Pendente"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description="Bem-vindo de volta! Aqui está o resumo do seu negócio."
        actionComponent={
          <Link to="/orcamento/novo">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
        }
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${metric.color}`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Budgets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Orçamentos Recentes</CardTitle>
          <Link to="/orcamentos">
            <Button variant="outline">Ver Todos</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">#ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Serviço</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Valor</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentBudgets.map((budget) => (
                  <tr key={budget.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">{budget.id}</td>
                    <td className="py-3 px-2 font-medium">{budget.client}</td>
                    <td className="py-3 px-2 text-gray-600">{budget.service}</td>
                    <td className="py-3 px-2 font-semibold text-green-600">{budget.value}</td>
                    <td className="py-3 px-2 text-gray-600">{budget.date}</td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Criar Orçamento</h3>
            <p className="text-sm text-gray-600">Novo orçamento profissional em minutos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Ver Relatórios</h3>
            <p className="text-sm text-gray-600">Analise seu desempenho e crescimento</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Agendar Visita</h3>
            <p className="text-sm text-gray-600">Organize sua agenda de trabalho</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
