import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useBudgetOperations } from '@/hooks/useBudgetOperations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalBudgets: 0,
    totalValue: 0,
    approvedBudgets: 0,
    thisMonthBudgets: 0
  });

  const { getBudgets, deleteBudget } = useBudgetOperations();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Carregar orçamentos do Supabase
  const loadBudgets = async () => {
    setLoading(true);
    try {
      const result = await getBudgets();
      if (result.success && result.data) {
        // Transformar dados do Supabase para o formato esperado
        const transformedBudgets = result.data.map((budget: any, index: number) => {
          const sequentialId = (index + 1).toString().padStart(3, '0');

          return {
            id: `ORC${sequentialId}`,
            originalId: budget.id,
            client: budget.client_name,
            service: budget.service_description || budget.profession || 'Serviço não especificado',
            value: `R$ ${(budget.total || 0).toFixed(2).replace('.', ',')}`,
            date: new Date(budget.created_at).toLocaleDateString('pt-BR'),
            status: getStatusLabel(budget.status),
            rawData: budget
          };
        });

        setBudgets(transformedBudgets);
        calculateMetrics(result.data);
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao carregar orçamentos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar orçamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calcular métricas do dashboard
  const calculateMetrics = (budgetsData: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalBudgets = budgetsData.length;
    const totalValue = budgetsData.reduce((sum, budget) => sum + (budget.total || 0), 0);
    const approvedBudgets = budgetsData.filter(budget => budget.status === 'approved').length;
    const thisMonthBudgets = budgetsData.filter(budget => {
      const budgetDate = new Date(budget.created_at);
      return budgetDate.getMonth() === currentMonth && budgetDate.getFullYear() === currentYear;
    }).length;

    setDashboardMetrics({
      totalBudgets,
      totalValue,
      approvedBudgets,
      thisMonthBudgets
    });
  };

  // Função para mapear status do banco para labels
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'draft': 'Rascunho',
      'pending': 'Pendente',
      'approved': 'Aprovado',
      'rejected': 'Rejeitado',
      'completed': 'Concluído'
    };
    return statusMap[status] || 'Rascunho';
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadBudgets();
  }, []);

  // Calcular taxa de conversão
  const conversionRate = dashboardMetrics.totalBudgets > 0
    ? Math.round((dashboardMetrics.approvedBudgets / dashboardMetrics.totalBudgets) * 100)
    : 0;

  // Métricas dinâmicas
  const metrics = [
    {
      title: "Total de Orçamentos",
      value: dashboardMetrics.totalBudgets.toString(),
      change: "+0%", // TODO: Implementar cálculo de mudança
      changeType: "neutral" as const,
      icon: FileText,
      iconColor: "bg-blue-500"
    },
    {
      title: "Valor Total Orçado",
      value: `R$ ${dashboardMetrics.totalValue.toFixed(2).replace('.', ',')}`,
      change: "+0%", // TODO: Implementar cálculo de mudança
      changeType: "neutral" as const,
      icon: DollarSign,
      iconColor: "bg-green-500"
    },
    {
      title: "Taxa de Conversão",
      value: `${conversionRate}%`,
      change: "+0%", // TODO: Implementar cálculo de mudança
      changeType: "neutral" as const,
      icon: TrendingUp,
      iconColor: "bg-purple-500"
    },
    {
      title: "Orçamentos Este Mês",
      value: dashboardMetrics.thisMonthBudgets.toString(),
      change: "+0%", // TODO: Implementar cálculo de mudança
      changeType: "neutral" as const,
      icon: Calendar,
      iconColor: "bg-orange-500"
    }
  ];

  // Pegar os 5 orçamentos mais recentes
  const recentBudgets = budgets.slice(0, 5);

  // Ações de CRUD
  const handleDeleteBudget = async (row: any) => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      try {
        const result = await deleteBudget(row.originalId);
        if (result.success) {
          toast({
            title: "Sucesso",
            description: "Orçamento excluído com sucesso",
          });
          loadBudgets(); // Recarregar dados
        } else {
          toast({
            title: "Erro",
            description: result.error || "Erro ao excluir orçamento",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro inesperado ao excluir orçamento",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800';
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
      label: 'Ver Detalhes',
      icon: Eye,
      onClick: (row: any) => {
        window.location.href = '/orcamentos';
      }
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Bem-vindo de volta, Carlos! Aqui está o resumo do seu negócio."
        actions={
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
          <Button
            variant="outline"
            className="whitespace-nowrap hover:bg-gray-50"
            onClick={() => navigate('/orcamentos')}
          >
            Ver Todos
          </Button>
        }
      />
    </div>
  );
};

export default Dashboard;