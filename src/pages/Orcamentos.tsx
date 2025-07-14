import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  MessageSquare
} from 'lucide-react';
import { PageHeader, MetricCard, DataTable, FilterBar } from '@/components';
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal';
import { useBudgetOperations } from '@/hooks/useBudgetOperations';
import { useToast } from '@/hooks/use-toast';

const Orcamentos = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    profession: ''
  });
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { getBudgets, deleteBudget, updateBudgetStatus } = useBudgetOperations();
  const { toast } = useToast();

  // Carregar orçamentos do Supabase
  const loadBudgets = async () => {
    setLoading(true);
    try {
      const result = await getBudgets();
      if (result.success && result.data) {
        // Transformar dados do Supabase para o formato esperado pela tabela
        const transformedBudgets = result.data.map((budget: any, index: number) => {
          // Gerar ID sequencial no formato ORC001
          const sequentialId = (index + 1).toString().padStart(3, '0');

          return {
            id: `ORC${sequentialId}`,
            originalId: budget.id,
            client: budget.client_name,
            phone: budget.client_phone || 'Não informado',
            service: budget.profession || 'Serviço Personalizado',
            value: `R$ ${(budget.total || 0).toFixed(2).replace('.', ',')}`,
            date: new Date(budget.created_at).toLocaleDateString('pt-BR'),
            status: getStatusLabel(budget.status),
            profession: budget.profession || 'Não informado',
            rawData: budget // Manter dados originais para operações
          };
        });
        setBudgets(transformedBudgets);
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

  // Carregar orçamentos ao montar o componente
  useEffect(() => {
    loadBudgets();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Concluído':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || budget.status === filters.status;
    const matchesProfession = !filters.profession || budget.profession === filters.profession;
    
    return matchesSearch && matchesStatus && matchesProfession;
  });

  // Gerar opções de filtro dinamicamente
  const uniqueStatuses = [...new Set(budgets.map(b => b.status))];
  const uniqueProfessions = [...new Set(budgets.map(b => b.profession).filter(p => p !== 'Não informado'))];

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: uniqueStatuses.map(status => ({ value: status, label: status })),
      placeholder: 'Filtrar por status'
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'select' as const,
      options: uniqueProfessions.map(profession => ({ value: profession, label: profession })),
      placeholder: 'Filtrar por profissão'
    }
  ];

  // Calcular métricas dinamicamente
  const summaryMetrics = [
    {
      title: 'Total de Orçamentos',
      value: budgets.length.toString(),
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pendentes',
      value: budgets.filter(b => b.status === 'Pendente').length.toString(),
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Aprovados',
      value: budgets.filter(b => b.status === 'Aprovado').length.toString(),
      iconColor: 'text-green-600'
    },
    {
      title: 'Rejeitados',
      value: budgets.filter(b => b.status === 'Rejeitado').length.toString(),
      iconColor: 'text-red-600'
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', profession: '' });
    setSearchTerm('');
  };

  const tableColumns = [
    { key: 'id', label: '#ID', width: '100px' },
    { key: 'client', label: 'Cliente' },
    { key: 'phone', label: 'Telefone' },
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
          loadBudgets(); // Recarregar lista
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

  const handleStatusChange = async (row: any, newStatus: string) => {
    try {
      const result = await updateBudgetStatus(row.originalId, newStatus);
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Status atualizado com sucesso",
        });
        loadBudgets(); // Recarregar lista
      } else {
        toast({
          title: "Erro",
          description: result.error || "Erro ao atualizar status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    {
      label: 'Visualizar',
      icon: Eye,
      onClick: (row: any) => {
        // TODO: Implementar visualização do orçamento
        console.log('View', row);
      }
    },
    {
      label: 'Download PDF',
      icon: Download,
      onClick: (row: any) => {
        // TODO: Implementar download do PDF
        console.log('Download', row);
      }
    },
    {
      label: 'WhatsApp',
      icon: MessageSquare,
      onClick: (row: any) => {
        // TODO: Implementar envio via WhatsApp
        console.log('WhatsApp', row);
      }
    }
  ];

  const tableActions = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: (row: any) => {
        // TODO: Implementar edição do orçamento
        console.log('Edit', row);
      }
    },
    {
      label: 'Duplicar',
      icon: Copy,
      onClick: (row: any) => {
        // TODO: Implementar duplicação do orçamento
        console.log('Copy', row);
      }
    },
    {
      label: 'Marcar como Pendente',
      icon: Eye,
      onClick: (row: any) => handleStatusChange(row, 'pending')
    },
    {
      label: 'Marcar como Aprovado',
      icon: Eye,
      onClick: (row: any) => handleStatusChange(row, 'approved')
    },
    {
      label: 'Marcar como Rejeitado',
      icon: Eye,
      onClick: (row: any) => handleStatusChange(row, 'rejected')
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: handleDeleteBudget,
      variant: 'destructive' as const
    }
  ];



  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Meus Orçamentos"
        subtitle="Gerencie todos os seus orçamentos em um só lugar"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(true)}>
              Criar com Template
            </Button>
            <Link to="/orcamento/novo">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Novo Orçamento
              </Button>
            </Link>
          </div>
        }
      />

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por cliente, serviço ou ID..."
        filters={filterConfigs}
        filterValues={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            iconColor={metric.iconColor}
          />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando orçamentos...</p>
          </div>
        </div>
      ) : (
        <DataTable
          title={`Orçamentos (${filteredBudgets.length})`}
          data={filteredBudgets}
          columns={tableColumns}
          actions={[...quickActions, ...tableActions]}
          emptyMessage="Nenhum orçamento encontrado. Crie seu primeiro orçamento!"
        />
      )}

      {/* Modal de seleção de template */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
};

export default Orcamentos;