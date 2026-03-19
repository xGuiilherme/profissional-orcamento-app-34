import { useEffect, useMemo, useState } from 'react';
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
import { supabase } from '@/lib/supabaseClient';
import PdfPreview from '@/components/PdfPreview';
import type { BudgetData } from '@/hooks/useBudgetData';
import { toast } from 'sonner';

type DashboardBudgetRow = {
  id: string;
  budget_number: number | null;
  client_name: string;
  profession: string | null;
  custom_profession: string | null;
  title: string | null;
  total_amount: number;
  created_at: string;
  status: string;
  payment: string | null;
  validity_days: number;
  client_phone: string;
  client_email: string | null;
  client_address: string;
  general_observations: string | null;
};

type DashboardTableRow = {
  id: string;
  code: string;
  client: string;
  service: string;
  value: string;
  date: string;
  status: string;
};

const statusLabel: Record<string, string> = {
  rascunho: 'Rascunho',
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  rejeitado: 'Rejeitado',
  enviado: 'Enviado',
  cancelado: 'Cancelado'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<DashboardBudgetRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBudget, setPreviewBudget] = useState<BudgetData | null>(null);

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
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      toast.error('Erro ao carregar dashboard', { description: error.message });
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    setBudgets((data || []) as DashboardBudgetRow[]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadBudgets();
  }, []);

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

  const budgetsForTable = useMemo(() => {
    return budgets.map((budget) => ({
      id: budget.id,
      code: `ORC-${String(budget.budget_number || 0).padStart(4, '0')}`,
      client: budget.client_name,
      service: budget.title || budget.custom_profession || budget.profession || 'Serviço',
      value: `R$ ${Number(budget.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      date: new Date(budget.created_at).toLocaleDateString('pt-BR'),
      status: statusLabel[budget.status] || budget.status
    }));
  }, [budgets]);

  const totalValue = useMemo(() => {
    return budgets.reduce((acc, b) => acc + Number(b.total_amount || 0), 0);
  }, [budgets]);

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return budgets.filter((budget) => {
      const created = new Date(budget.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  }, [budgets]);

  const approvedCount = useMemo(() => budgets.filter((b) => b.status === 'aprovado').length, [budgets]);
  const conversion = budgets.length ? `${Math.round((approvedCount / budgets.length) * 100)}%` : '0%';

  const metrics = [
    {
      title: "Total de Orçamentos",
      value: budgets.length.toString(),
      icon: FileText,
      iconColor: "bg-blue-500"
    },
    {
      title: "Valor Total Orçado",
      value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      iconColor: "bg-green-500"
    },
    {
      title: "Taxa de Conversão",
      value: conversion,
      icon: TrendingUp,
      iconColor: "bg-purple-500"
    },
    {
      title: "Orçamentos Este Mês",
      value: thisMonthCount.toString(),
      icon: Calendar,
      iconColor: "bg-orange-500"
    }
  ];

  const tableColumns = [
    { key: 'code', label: '#ID', width: '120px' },
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

    return {
      id: Number(budget.budget_number || 0),
      category: budget.custom_profession || budget.profession || 'Serviço',
      title: budget.title || 'Orçamento',
      description: budget.general_observations || '',
      value: `R$ ${Number(budget.total_amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      items: (itemsData || []).map((item) => item.description || ''),
      itemDetails: (itemsData || []).map((item) => ({
        description: item.description || '',
        quantity: Number(item.quantity || 0),
        unit: item.unit || 'un',
        unitPrice: Number(item.unit_price || 0),
        total: Number(item.total || 0),
        type: item.item_type === 'labor' ? 'labor' : 'material'
      })),
      clientName: budget.client_name || '',
      clientAddress: budget.client_address || '',
      clientPhone: budget.client_phone || '',
      clientEmail: budget.client_email || '',
      terms: budget.payment || 'A combinar',
      validity: `${budget.validity_days || 30} dias`
    };
  };

  const tableActions = [
    {
      label: 'Visualizar',
      icon: Eye,
      onClick: async (row: DashboardTableRow) => {
        const data = await buildBudgetData(row.id);
        if (!data) return;
        setPreviewBudget(data);
        setIsPreviewOpen(true);
      }
    },
    {
      label: 'Editar',
      icon: Edit,
      onClick: (row: DashboardTableRow) => navigate(`/orcamento/editar/${row.id}`)
    },
    {
      label: 'Duplicar',
      icon: Copy,
      onClick: async (row: DashboardTableRow) => {
        const source = budgets.find((b) => b.id === row.id);
        if (!source) return;
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;
        if (!user) return;

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
            status: 'rascunho',
            general_observations: source.general_observations,
            payment: source.payment,
            validity_days: source.validity_days,
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
          await supabase.from('budget_items').insert(
            sourceItems.data.map((item) => ({
              budget_id: newBudget.id,
              position: item.position,
              description: item.description,
              quantity: item.quantity,
              unit: item.unit,
              unit_price: item.unit_price,
              total: item.total,
              item_type: item.item_type
            }))
          );
        }

        toast.success('Orçamento duplicado');
        await loadBudgets();
      }
    },
    {
      label: 'Excluir',
      icon: Trash2,
      onClick: async (row: DashboardTableRow) => {
        const confirmed = window.confirm('Tem certeza que deseja excluir este orçamento?');
        if (!confirmed) return;
        const { error } = await supabase.from('budgets').delete().eq('id', row.id);
        if (error) {
          toast.error('Erro ao excluir orçamento', { description: error.message });
          return;
        }
        toast.success('Orçamento excluído');
        await loadBudgets();
      },
      variant: 'destructive' as const
    }
  ];

  return (
    <div className="p-6 space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Aqui está o resumo atual do seu negócio."
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
            icon={metric.icon}
            iconColor={metric.iconColor}
          />
        ))}
      </div>

      {/* Recent Budgets */}
      <DataTable
        title={isLoading ? "Carregando orçamentos..." : "Orçamentos Recentes"}
        data={isLoading ? [] : budgetsForTable}
        columns={tableColumns}
        actions={tableActions}
        headerActions={
          <Link to="/orcamentos">
            <Button variant="outline">Ver Todos</Button>
          </Link>
        }
      />
      {previewBudget && (
        <PdfPreview budget={previewBudget} isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
