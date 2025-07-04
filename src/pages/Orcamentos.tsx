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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Orçamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os seus orçamentos em um só lugar</p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, serviço ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={professionFilter} onValueChange={setProfessionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por profissão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Eletricista">Eletricista</SelectItem>
                <SelectItem value="Encanador">Encanador</SelectItem>
                <SelectItem value="Pintor">Pintor</SelectItem>
              </SelectContent>
            </Select>

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
          <Link to="/orcamento/novo">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Novo Orçamento
            </Button>
          </Link>
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

      {/* Budgets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orçamentos ({filteredBudgets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">#ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Telefone</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Serviço</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Valor</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Data</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget) => (
                  <tr key={budget.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm text-blue-600">{budget.id}</td>
                    <td className="py-3 px-2 font-medium">{budget.client}</td>
                    <td className="py-3 px-2 text-gray-600">{budget.phone}</td>
                    <td className="py-3 px-2 text-gray-600">{budget.service}</td>
                    <td className="py-3 px-2 font-semibold text-green-600">{budget.value}</td>
                    <td className="py-3 px-2 text-gray-600">{budget.date}</td>
                    <td className="py-3 px-2">
                      <Badge className={getStatusColor(budget.status)}>
                        {budget.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBudgets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum orçamento encontrado com os filtros aplicados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de seleção de template */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </div>
  );
};

export default Orcamentos;