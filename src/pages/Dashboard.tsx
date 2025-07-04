import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Eye,
  Edit,
  Copy,
  Trash2
} from 'lucide-react';
import { PageHeader, MetricCard, DataTable } from '@/components';

const Dashboard = () => {
  const metrics = [
    {
      title: "Total de Orçamentos",
      value: "127",
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
      iconColor: "bg-blue-500"
    },
    {
      title: "Valor Total Orçado",
      value: "R$ 85.420",
      change: "+18%",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "bg-green-500"
    },
    {
      title: "Taxa de Conversão",
      value: "73%",
      change: "+5%",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconColor: "bg-purple-500"
    },
    {
      title: "Orçamentos Este Mês",
      value: "23",
      change: "+8%",
      changeType: "positive" as const,
      icon: Calendar,
      iconColor: "bg-orange-500"
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

  const tableColumns = [
    { key: 'id', label: '#ID', width: '100px' },
    { key: 'client', label: 'Cliente' },
    { key: 'service', label: 'Serviço' },
    { 
      key: 'value', 
      label: 'Valor',
      render: (value: string) => (
        <span className="font-semibold text-green-600">{value}</span>
      )
    },
    { key: 'date', label: 'Data' },
    { 
      key: 'status', 
      label: 'Status',
      render: (status: string) => (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      )
    }
  ];

  const tableActions = [
    {
      label: 'Visualizar',
      icon: Eye,
      onClick: (row: any) => console.log('View', row)
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (row: any) => console.log('Edit', row)
    },
    {
      label: 'Duplicar',
      icon: Copy,
      onClick: (row: any) => console.log('Copy', row)
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: (row: any) => console.log('Delete', row),
      variant: 'destructive' as const
    }
  ];

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
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            changeType={metric.changeType}
            icon={metric.icon}
            iconColor={metric.iconColor}
          />
        ))}
      </div>

      {/* Recent Budgets */}
      <DataTable
        title="Orçamentos Recentes"
        data={recentBudgets}
        columns={tableColumns}
        actions={tableActions}
        headerActions={
          <Link to="/orcamentos">
            <Button variant="outline">Ver Todos</Button>
          </Link>
        }
      />
    </div>
  );
};

export default Dashboard;