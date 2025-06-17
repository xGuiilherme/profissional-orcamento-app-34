
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  MoreHorizontal,
  Download,
  MessageSquare
} from 'lucide-react';

const Orcamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');

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
    {
      id: "ORC003",
      client: "Pedro Costa",
      phone: "(11) 99999-3333",
      service: "Pintura Residencial",
      value: "R$ 2.800,00",
      date: "13/12/2024",
      status: "Rejeitado",
      profession: "Pintor"
    },
    {
      id: "ORC004",
      client: "Ana Oliveira",
      phone: "(11) 99999-4444",
      service: "Manutenção Elétrica",
      value: "R$ 680,00",
      date: "12/12/2024",
      status: "Aprovado",
      profession: "Eletricista"
    },
    {
      id: "ORC005",
      client: "Carlos Lima",
      phone: "(11) 99999-5555",
      service: "Instalação de Tomadas",
      value: "R$ 320,00",
      date: "11/12/2024",
      status: "Pendente",
      profession: "Eletricista"
    },
    {
      id: "ORC006",
      client: "Fernanda Costa",
      phone: "(11) 99999-6666",
      service: "Troca de Chuveiro",
      value: "R$ 180,00",
      date: "10/12/2024",
      status: "Aprovado",
      profession: "Encanador"
    },
    {
      id: "ORC007",
      client: "Roberto Alves",
      phone: "(11) 99999-7777",
      service: "Pintura de Fachada",
      value: "R$ 4.200,00",
      date: "09/12/2024",
      status: "Pendente",
      profession: "Pintor"
    },
    {
      id: "ORC008",
      client: "Luciana Mendes",
      phone: "(11) 99999-8888",
      service: "Instalação de Ventilador",
      value: "R$ 150,00",
      date: "08/12/2024",
      status: "Aprovado",
      profession: "Eletricista"
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

  const filteredBudgets = budgets.filter(budget => {
    const matchesSearch = budget.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || budget.status === statusFilter;
    const matchesProfession = !professionFilter || budget.profession === professionFilter;
    
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
        <Link to="/orcamento/novo">
          <Button className="mt-4 sm:mt-0 bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
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
                <SelectItem value="">Todos os status</SelectItem>
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
                <SelectItem value="">Todas as profissões</SelectItem>
                <SelectItem value="Eletricista">Eletricista</SelectItem>
                <SelectItem value="Encanador">Encanador</SelectItem>
                <SelectItem value="Pintor">Pintor</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
              <p className="text-sm text-gray-600">Total de Orçamentos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {budgets.filter(b => b.status === 'Pendente').length}
              </p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {budgets.filter(b => b.status === 'Aprovado').length}
              </p>
              <p className="text-sm text-gray-600">Aprovados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {budgets.filter(b => b.status === 'Rejeitado').length}
              </p>
              <p className="text-sm text-gray-600">Rejeitados</p>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
};

export default Orcamentos;
