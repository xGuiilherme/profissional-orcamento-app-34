import { useState } from 'react';
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

const Orcamentos = () => {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    profession: ''
  });

  const budgets = [
    {
      id: "ORC001",
      client: "João Silva",
      phone: "(11) 99999-1111",
      service: "Instalação Elétrica",
      value: "R$ 1.200,00",
      date: "15/12/2024",
      status: "Pendente",
      profession: "Eletricista"
    },
    {
      id: "ORC002",
      client: "Maria Santos",
      phone: "(11) 99999-2222",
      service: "Reparo Hidráulico",
      value: "R$ 450,00",
      date: "14/12/2024",
      status: "Aprovado",
      profession: "Encanador"
    },
    // ... outros orçamentos
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

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || budget.status === filters.status;
    const matchesProfession = !filters.profession || budget.profession === filters.profession;
    
    return matchesSearch && matchesStatus && matchesProfession;
  });

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Aprovado', label: 'Aprovado' },
        { value: 'Rejeitado', label: 'Rejeitado' }
      ],
      placeholder: 'Filtrar por status'
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'select' as const,
      options: [
        { value: 'Eletricista', label: 'Eletricista' },
        { value: 'Encanador', label: 'Encanador' },
        { value: 'Pintor', label: 'Pintor' }
      ],
      placeholder: 'Filtrar por profissão'
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

  const quickActions = [
    {
      label: 'Visualizar',
      icon: Eye,
      onClick: (row: any) => console.log('View', row)
    },
    {
      label: 'Download',
      icon: Download,
      onClick: (row: any) => console.log('Download', row)
    },
    {
      label: 'WhatsApp',
      icon: MessageSquare,
      onClick: (row: any) => console.log('WhatsApp', row)
    }
  ];

  const tableActions = [
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

  const summaryMetrics = [
    {
      title: "Total de Orçamentos",
      value: budgets.length.toString(),
      iconColor: "bg-blue-500"
    },
    {
      title: "Pendentes",
      value: budgets.filter(b => b.status === 'Pendente').length.toString(),
      iconColor: "bg-yellow-500"
    },
    {
      title: "Aprovados",
      value: budgets.filter(b => b.status === 'Aprovado').length.toString(),
      iconColor: "bg-green-500"
    },
    {
      title: "Rejeitados",
      value: budgets.filter(b => b.status === 'Rejeitado').length.toString(),
      iconColor: "bg-red-500"
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

      <DataTable
        title={`Orçamentos (${filteredBudgets.length})`}
        data={filteredBudgets}
        columns={tableColumns}
        actions={[...quickActions, ...tableActions]}
        emptyMessage="Nenhum orçamento encontrado com os filtros aplicados."
      />

      {/* Modal de seleção de template */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
};

export default Orcamentos;