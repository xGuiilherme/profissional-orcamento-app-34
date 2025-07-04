import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2,
  Download,
  MessageSquare,
  Search,
  MoreHorizontal
} from 'lucide-react';
import { TemplateSelectionModal } from '@/components/TemplateSelectionModal';
import { PageHeader } from '@/components/layout/PageHeader';
import { FilterBar } from '@/components/layout/FilterBar';
import { MetricCard } from '@/components/layout/MetricCard';

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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      profession: ''
    });
    setSearchTerm('');
  };

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Aprovado', label: 'Aprovado' },
        { value: 'Rejeitado', label: 'Rejeitado' }
      ]
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'select' as const,
      options: [
        { value: 'Eletricista', label: 'Eletricista' },
        { value: 'Encanador', label: 'Encanador' },
        { value: 'Pintor', label: 'Pintor' }
      ]
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