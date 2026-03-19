import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { supabase } from '@/lib/supabaseClient';
import PdfPreview from '@/components/PdfPreview';
import type { BudgetData } from '@/hooks/useBudgetData';
import { toast } from 'sonner';

type BudgetRow = {
  id: string;
  budget_number: number | null;
  client_name: string;
  client_phone: string;
  profession: string | null;
  custom_profession: string | null;
  title: string | null;
  total_amount: number;
  created_at: string;
  status: string;
  payment: string | null;
  validity_days: number;
  client_email: string | null;
  client_address: string;
  general_observations: string | null;
  warranty: string | null;
  deadline: string | null;
  template_name?: string | null;
  observations?: string | null;
  subtotal_materials?: number;
  subtotal_labor?: number;
  discount_percent?: number;
};

type BudgetTableRow = {
  id: string;
  code: string;
  client: string;
  phone: string;
  service: string;
  profession: string;
  value: number;
  valueFormatted: string;
  date: string;
  status: string;
  statusRaw: string;
};

const statusLabel: Record<string, string> = {
  rascunho: 'Rascunho',
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  enviado: 'Enviado',
  cancelado: 'Cancelado'
};

const Orcamentos = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBudget, setPreviewBudget] = useState<BudgetData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    profession: ''
  });

  const loadBudgets = async () => {
    setIsLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) {
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar orçamentos', { description: error.message });
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    setBudgets((data || []) as BudgetRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (statusLabel[status] || status) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rascunho':
        return 'bg-gray-100 text-gray-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      case 'Enviado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mappedBudgets = useMemo(() => {
    return budgets.map((budget) => ({
      id: budget.id,
      code: `ORC-${String(budget.budget_number || 0).padStart(4, '0')}`,
      client: budget.client_name,
      phone: budget.client_phone,
      service: budget.title || budget.profession || budget.custom_profession || 'Serviço',
      profession: budget.custom_profession || budget.profession || 'Não informado',
      value: Number(budget.total_amount || 0),
      valueFormatted: `R$ ${Number(budget.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      date: new Date(budget.created_at).toLocaleDateString('pt-BR'),
      status: statusLabel[budget.status] || budget.status,
      statusRaw: budget.status
    }));
  }, [budgets]);

  const filteredBudgets = mappedBudgets.filter((budget) => {
    const matchesSearch =
      budget.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      budget.code.toLowerCase().includes(searchTerm.toLowerCase());
    
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
        { value: 'Rascunho', label: 'Rascunho' },
        { value: 'Pendente', label: 'Pendente' },
        { value: 'Aprovado', label: 'Aprovado' },
        { value: 'Rejeitado', label: 'Rejeitado' },
        { value: 'Enviado', label: 'Enviado' },
        { value: 'Cancelado', label: 'Cancelado' }
      ],
      placeholder: 'Filtrar por status'
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'select' as const,
      options: Array.from(new Set(mappedBudgets.map((b) => b.profession))).map((profession) => ({
        value: profession,
        label: profession
      })),
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
    { key: 'code', label: '#ID', width: '120px' },
    { key: 'client', label: 'Cliente' },
    { key: 'phone', label: 'Telefone' },
    { key: 'service', label: 'Serviço' },
    { 
      key: 'valueFormatted', 
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

  const buildBudgetData = async (budgetId: string): Promise<BudgetData | null> => {
    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .maybeSingle();

    if (budgetError || !budget) {
      toast.error('Erro ao carregar orçamento', { description: budgetError?.message || 'Orçamento não encontrado' });
      return null;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('budget_items')
      .select('*')
      .eq('budget_id', budgetId)
      .order('position', { ascending: true });

    if (itemsError) {
      toast.error('Erro ao carregar itens', { description: itemsError.message });
      return null;
    }

    const itemDetails = (itemsData || []).map((item) => ({
      description: item.description || '',
      quantity: Number(item.quantity || 0),
      unit: item.unit || 'un',
      unitPrice: Number(item.unit_price || 0),
      total: Number(item.total || 0),
      type: item.item_type === 'labor' ? 'labor' : 'material'
    }));

    return {
      id: Number(budget.budget_number || 0),
      category: budget.custom_profession || budget.profession || 'Serviço',
      title: budget.title || 'Orçamento',
      description: budget.general_observations || '',
      value: `R$ ${Number(budget.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      items: itemDetails.map((item) => item.description),
      itemDetails,
      clientName: budget.client_name || '',
      clientAddress: budget.client_address || '',
      clientPhone: budget.client_phone || '',
      clientEmail: budget.client_email || '',
      terms: budget.payment || 'A combinar',
      validity: `${budget.validity_days || 30} dias`
    };
  };

  const openPreview = async (row: BudgetTableRow) => {
    const data = await buildBudgetData(row.id);
    if (!data) return;
    setPreviewBudget(data);
    setIsPreviewOpen(true);
  };

  const deleteBudget = async (row: BudgetTableRow) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este orçamento?');
    if (!confirmed) return;

    const { error } = await supabase.from('budgets').delete().eq('id', row.id);
    if (error) {
      toast.error('Erro ao excluir orçamento', { description: error.message });
      return;
    }
    toast.success('Orçamento excluído com sucesso');
    await loadBudgets();
  };

  const duplicateBudget = async (row: BudgetTableRow) => {
    const data = await buildBudgetData(row.id);
    if (!data) return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) return;

    const source = budgets.find((b) => b.id === row.id);
    if (!source) return;

    const { data: newBudget, error: insertError } = await supabase
      .from('budgets')
      .insert({
        user_id: user.id,
        client_name: source.client_name,
        client_phone: source.client_phone,
        client_email: source.client_email,
        client_address: source.client_address,
        title: `${source.title || 'Orçamento'} (Cópia)`,
        profession: source.profession,
        custom_profession: source.custom_profession,
        template_name: source.template_name,
        status: 'rascunho',
        observations: source.observations,
        general_observations: source.general_observations,
        deadline: source.deadline,
        payment: source.payment,
        warranty: source.warranty,
        validity_days: source.validity_days,
        subtotal_materials: source.subtotal_materials,
        subtotal_labor: source.subtotal_labor,
        discount_percent: source.discount_percent,
        total_amount: source.total_amount
      })
      .select('id')
      .single();

    if (insertError || !newBudget) {
      toast.error('Erro ao duplicar orçamento', { description: insertError?.message });
      return;
    }

    const sourceItems = await supabase
      .from('budget_items')
      .select('*')
      .eq('budget_id', row.id)
      .order('position', { ascending: true });

    if (!sourceItems.error && sourceItems.data?.length) {
      const itemsToInsert = sourceItems.data.map((item) => ({
        budget_id: newBudget.id,
        position: item.position,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total: item.total,
        item_type: item.item_type
      }));
      await supabase.from('budget_items').insert(itemsToInsert);
    }

    toast.success('Orçamento duplicado com sucesso');
    await loadBudgets();
  };

  const quickActions = [
    {
      label: 'Visualizar',
      icon: Eye,
      onClick: openPreview
    },
    {
      label: 'Download',
      icon: Download,
      onClick: openPreview
    },
    {
      label: 'WhatsApp',
      icon: MessageSquare,
      onClick: (row: BudgetTableRow) => {
        const digits = String(row.phone || '').replace(/\D/g, '');
        const text = encodeURIComponent(`Olá ${row.client}, segue seu orçamento ${row.code}.`);
        if (!digits) return;
        window.open(`https://wa.me/55${digits}?text=${text}`, '_blank');
      }
    }
  ];

  const tableActions = [
    {
      label: 'Editar',
      icon: Edit,
      onClick: (row: BudgetTableRow) => navigate(`/orcamento/editar/${row.id}`)
    },
    {
      label: 'Duplicar',
      icon: Copy,
      onClick: duplicateBudget
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: deleteBudget,
      variant: 'destructive' as const
    }
  ];

  const summaryMetrics = [
    {
      title: "Total de Orçamentos",
      value: mappedBudgets.length.toString(),
      iconColor: "bg-blue-500"
    },
    {
      title: "Pendentes",
      value: mappedBudgets.filter(b => b.statusRaw === 'pendente').length.toString(),
      iconColor: "bg-yellow-500"
    },
    {
      title: "Aprovados",
      value: mappedBudgets.filter(b => b.statusRaw === 'aprovado').length.toString(),
      iconColor: "bg-green-500"
    },
    {
      title: "Rejeitados",
      value: mappedBudgets.filter(b => b.statusRaw === 'rejeitado').length.toString(),
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
        title={isLoading ? 'Carregando orçamentos...' : `Orçamentos (${filteredBudgets.length})`}
        data={isLoading ? [] : filteredBudgets}
        columns={tableColumns}
        actions={[...quickActions, ...tableActions]}
        emptyMessage="Nenhum orçamento encontrado com os filtros aplicados."
      />

      {previewBudget && (
        <PdfPreview
          budget={previewBudget}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default Orcamentos;
