import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ClientWithSales, clientWithSalesService } from "@/services/client-with-sales.service";
import { clientService } from "@/services/client.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, CalendarIcon, Edit, Eye, Filter, Info, Phone, Trash2, User, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditClientDialog } from "./EditClientDialog";

interface ClientsTableProps {
  onUpdate?: () => void;
  dateFilter?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  onClearFilters?: () => void;
  onSetSpecificDate?: (date: string) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'debt-asc' | 'debt-desc';
type FilterOption = 'all' | 'up-to-date' | 'overdue' | 'upcoming';

const STORAGE_KEY = 'clientsTableFilters';

export const ClientsTable = ({ onUpdate, dateFilter, dateRangeStart, dateRangeEnd, onClearFilters, onSetSpecificDate }: ClientsTableProps) => {
  const [clients, setClients] = useState<ClientWithSales[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [localDateStart, setLocalDateStart] = useState("");
  const [localDateEnd, setLocalDateEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientWithSales | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Carregar filtros salvos ao montar o componente
  useEffect(() => {
    const savedFilters = sessionStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        if (filters.searchTerm) setSearchTerm(filters.searchTerm);
        if (filters.sortBy) setSortBy(filters.sortBy);
        if (filters.filterBy) setFilterBy(filters.filterBy);
        if (filters.showFilters !== undefined) setShowFilters(filters.showFilters);
      } catch (error) {
        console.error("Error loading saved filters:", error);
      }
    }
  }, []);

  // Salvar filtros sempre que mudarem
  useEffect(() => {
    const filters = {
      searchTerm,
      sortBy,
      filterBy,
      showFilters,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [searchTerm, sortBy, filterBy, showFilters]);

  useEffect(() => {
    if (dateRangeStart) setLocalDateStart(dateRangeStart);
    if (dateRangeEnd) setLocalDateEnd(dateRangeEnd);
  }, [dateRangeStart, dateRangeEnd]);

  const getDateOnly = (dateString: string): string => {
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date.toISOString().split('T')[0];
  };

  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientWithSalesService.findAllWithSales();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleDelete = async (id: string) => {
    try {
      await clientService.delete(id);
      toast({
        title: "… Cliente Removido",
        description: "Cliente removido com sucesso.",
      });
      loadClients();
      onUpdate?.();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return "-";
    return phone;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPaymentFrequency = (frequency?: string) => {
    if (!frequency) return "-";
    return frequency === 'mensal' ? 'Mensal' : 'Quinzenal';
  };

  const getPaymentTypeLabel = (frequency?: string) => {
    if (!frequency) return "-";
    return frequency === 'mensal' ? 'Parcelado' : 'Quinzenal';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getLastPurchaseDate = (client: ClientWithSales): string => {
    if (!client.sales || client.sales.length === 0) return "-";
    
    const latestSale = client.sales.reduce((latest, sale) => {
      const saleDate = new Date(sale.saleDate);
      const latestDate = new Date(latest.saleDate);
      return saleDate > latestDate ? sale : latest;
    });
    
    return format(new Date(latestSale.saleDate), "dd/MM/yyyy", { locale: ptBR });
  };

  const hasOverdueInstallments = (client: ClientWithSales) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return client.sales?.some(sale => 
      sale.installments?.some(inst => {
        if (inst.status === 'pago') return false;
        const dueDate = new Date(inst.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate < today;
      })
    ) || false;
  };

  const hasUpcomingInstallments = (client: ClientWithSales) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return client.sales?.some(sale => 
      sale.installments?.some(inst => {
        if (inst.status === 'pago') return false;
        const dueDate = new Date(inst.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today;
      })
    ) || false;
  };

  const getNextDueDate = (client: ClientWithSales): string => {
    let nextDate: Date | null = null;

    client.sales?.forEach(sale => {
      sale.installments?.forEach(inst => {
        if (inst.status !== 'pago') {
          const dueDateStr = inst.dueDate.includes('T') ? inst.dueDate : inst.dueDate + 'T00:00:00';
          const dueDate = new Date(dueDateStr);
          if (!nextDate || dueDate < nextDate) {
            nextDate = dueDate;
          }
        }
      });
    });

    if (!nextDate) return '-';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = nextDate < today;
    
    return format(nextDate, "dd/MM/yyyy", { locale: ptBR }) + (isOverdue ? ' ⚠️' : '');
  };

  const getNextInstallmentAmount = (client: ClientWithSales): number => {
    let nextDate: Date | null = null;
    let nextAmount = 0;

    client.sales?.forEach(sale => {
      sale.installments?.forEach(inst => {
        if (inst.status !== 'pago') {
          const dueDateStr = inst.dueDate.includes('T') ? inst.dueDate : inst.dueDate + 'T00:00:00';
          const dueDate = new Date(dueDateStr);
          if (!nextDate || dueDate < nextDate) {
            nextDate = dueDate;
            nextAmount = inst.amount;
          }
        }
      });
    });

    return nextAmount;
  };

  const calculateClientStats = (client: ClientWithSales) => {
    let totalSales = 0;
    let totalPaid = 0;
    let remainingInstallments = 0;

    client.sales?.forEach((sale) => {
      totalSales += sale.totalValue;
      totalPaid += sale.totalPaid || 0;
      
      sale.installments?.forEach((installment) => {
        if (installment.status === 'pendente' || installment.status === 'atrasado') {
          remainingInstallments++;
        }
      });
    });

    return {
      totalSales,
      totalPaid,
      totalPending: totalSales - totalPaid,
      remainingInstallments,
    };
  };

  const filteredAndSortedClients = useMemo(() => {
    let filtered = [...clients];

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.referredBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(client => {
        return client.sales?.some(sale => 
          sale.installments?.some(inst => {
            const dueDate = getDateOnly(inst.dueDate);
            const paidDate = inst.paidDate ? getDateOnly(inst.paidDate) : null;
            return dueDate === dateFilter || paidDate === dateFilter;
          })
        );
      });
    }

    if (localDateStart && localDateEnd) {
      const startDate = new Date(localDateStart);
      const endDate = new Date(localDateEnd);
      
      filtered = filtered.filter(client => {
        return client.sales?.some(sale => 
          sale.installments?.some(inst => {
            const dueDate = new Date(inst.dueDate);
            const paidDate = inst.paidDate ? new Date(inst.paidDate) : null;
            
            const dueDateInRange = dueDate >= startDate && dueDate <= endDate;
            const paidDateInRange = paidDate && paidDate >= startDate && paidDate <= endDate;
            
            return dueDateInRange || paidDateInRange;
          })
        );
      });
    }

    if (filterBy !== 'all') {
      filtered = filtered.filter(client => {
        if (filterBy === 'overdue') {
          return hasOverdueInstallments(client);
        } else if (filterBy === 'up-to-date') {
          return !hasOverdueInstallments(client);
        } else if (filterBy === 'upcoming') {
          return hasUpcomingInstallments(client) && !hasOverdueInstallments(client);
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'debt-asc': {
          const debtA = calculateClientStats(a).totalPending;
          const debtB = calculateClientStats(b).totalPending;
          return debtA - debtB;
        }
        case 'debt-desc': {
          const debtA = calculateClientStats(a).totalPending;
          const debtB = calculateClientStats(b).totalPending;
          return debtB - debtA;
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [clients, searchTerm, sortBy, filterBy, dateFilter, localDateStart, localDateEnd]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Lista de todos os clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Lista de todos os clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
            <p className="text-sm text-muted-foreground">Comece adicionando uma nova venda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full rounded-none border-x-0">
      <TooltipProvider delayDuration={200}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b px-6">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5" />
          <CardTitle>Clientes Cadastrados</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">
                <strong>Gerencie seus clientes aqui.</strong><br/>
                Filtre por <strong>Em Dia</strong> (sem parcelas atrasadas) ou <strong>Atrasados</strong> (com vencimentos passados). 
                Ordene por nome, data ou dívida. Clique em "Ver Detalhes" para acessar as vendas completas.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <CardDescription>
          {filteredAndSortedClients.length} de {clients.length} cliente{clients.length !== 1 ? "s" : ""} {filteredAndSortedClients.length === clients.length ? "cadastrado" : "encontrado"}{filteredAndSortedClients.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {/* Filtros */}
        <div className="flex flex-col gap-4 mb-6 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filtros e Ordenação
              {(searchTerm || sortBy !== 'name-asc' || filterBy !== 'all') && (
                <Badge variant="secondary" className="ml-2">
                  {[searchTerm, sortBy !== 'name-asc', filterBy !== 'all'].filter(Boolean).length} ativo{[searchTerm, sortBy !== 'name-asc', filterBy !== 'all'].filter(Boolean).length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              {(searchTerm || sortBy !== 'name-asc' || filterBy !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSortBy('name-asc');
                    setFilterBy('all');
                    sessionStorage.removeItem(STORAGE_KEY);
                  }}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                {showFilters ? (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Ocultar Filtros
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    Mostrar Filtros
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Filtro de data vindo do calendário - sempre visível */}
          {(dateFilter || (localDateStart && localDateEnd)) && (
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">
                {dateFilter ? (
                  <>Filtrado por pagamentos em: {format(new Date(dateFilter + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })}</>
                ) : (
                  <>Período: {format(new Date(localDateStart + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })} até {format(new Date(localDateEnd + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })}</>
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLocalDateStart("");
                  setLocalDateEnd("");
                  onClearFilters?.();
                }}
              >
                Limpar filtro
              </Button>
            </div>
          )}

          {showFilters && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca por texto */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome, telefone ou indicado por..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Ordenação */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Nome (A-Z)
                    </div>
                  </SelectItem>
                  <SelectItem value="name-desc">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Nome (Z-A)
                    </div>
                  </SelectItem>
                  <SelectItem value="date-desc">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Mais Recente
                    </div>
                  </SelectItem>
                  <SelectItem value="date-asc">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Mais Antigo
                    </div>
                  </SelectItem>
                  <SelectItem value="debt-desc">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Maior Dívida
                    </div>
                  </SelectItem>
                  <SelectItem value="debt-asc">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" />
                      Menor Dívida
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Situação</label>
              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Clientes</SelectItem>
                  <SelectItem value="up-to-date">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Em Dia
                    </div>
                  </SelectItem>
                  <SelectItem value="upcoming">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">⏰</span>
                      A Vencer
                    </div>
                  </SelectItem>
                  <SelectItem value="overdue">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">⚠</span>
                      Atrasados
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtro por data específica */}
          <div className="space-y-2 pt-2 border-t">
            <div>
              <label className="text-sm font-medium">Filtrar por Data Específica</label>
              <p className="text-xs text-muted-foreground mt-1">Clientes com vencimento em uma data exata</p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!dateFilter && !localDateStart && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? (
                    format(new Date(dateFilter + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                  ) : localDateStart && !localDateEnd ? (
                    format(new Date(localDateStart + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data específica</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter ? new Date(dateFilter + 'T00:00:00') : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const dateStr = format(date, "yyyy-MM-dd");
                      setLocalDateStart("");
                      setLocalDateEnd("");
                      onSetSpecificDate?.(dateStr);
                    }
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Filtro por range de datas */}
          <div className="space-y-4 pt-2 border-t">
            <div>
              <label className="text-sm font-medium">Ou Filtrar por Intervalo de Datas</label>
              <p className="text-xs text-muted-foreground mt-1">Clientes com vencimentos entre duas datas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Desde</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!localDateStart && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateStart ? (
                        format(new Date(localDateStart + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data inicial</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localDateStart ? new Date(localDateStart + 'T00:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setLocalDateStart(format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">até©</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!localDateEnd && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localDateEnd ? (
                        format(new Date(localDateEnd + 'T00:00:00'), "dd/MM/yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione a data final</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={localDateEnd ? new Date(localDateEnd + 'T00:00:00') : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setLocalDateEnd(format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Botões de ação para filtro de data */}
            {(localDateStart || localDateEnd || dateFilter) && (
              <div className="flex gap-2">
                {(localDateStart || localDateEnd) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setLocalDateStart("");
                      setLocalDateEnd("");
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpar Intervalo
                  </Button>
                )}
                {dateFilter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClearFilters?.();
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpar Data Específica
                  </Button>
                )}
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* Indicador de scroll horizontal */}
        <div className="mt-2 mb-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-2 px-6">
          <ArrowDown className="h-3 w-3 rotate-[-90deg]" />
          <span>Role horizontalmente para ver todas as colunas</span>
          <ArrowDown className="h-3 w-3 rotate-90" />
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[1800px]">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-[200px]">Nome</TableHead>
                <TableHead className="min-w-[130px]">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </div>
                </TableHead>
                <TableHead className="min-w-[140px]">Indicado por</TableHead>
                <TableHead className="min-w-[120px]">Última Compra</TableHead>
                <TableHead className="min-w-[130px]">Tipo Pagamento</TableHead>
                <TableHead className="min-w-[150px]">Próximo Vencimento</TableHead>
                <TableHead className="min-w-[120px]">Valor Parcela</TableHead>
                <TableHead className="min-w-[100px]">Parcelas</TableHead>
                <TableHead className="min-w-[130px]">Total Compras</TableHead>
                <TableHead className="min-w-[120px]">Pago</TableHead>
                <TableHead className="min-w-[120px]">Pendente</TableHead>
                <TableHead className="text-center min-w-[140px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Filter className="h-8 w-8" />
                      <p className="font-medium">Nenhum cliente encontrado</p>
                      <p className="text-sm">Tente ajustar os filtros de busca</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedClients.map((client) => {
                  const stats = clientWithSalesService.calculateClientStats(client);
                const installmentsSummary = clientWithSalesService.getInstallmentsSummary(client);
                const isOverdue = hasOverdueInstallments(client);
                
                return (
                  <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium py-4 px-4">
                      <div className="flex items-center gap-2">
                        {isOverdue ? (
                          <Badge variant="destructive" className="text-xs whitespace-nowrap">
                            Atrasado
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs whitespace-nowrap">
                            Em Dia
                          </Badge>
                        )}
                        <span className={`${isOverdue ? 'text-red-600 dark:text-red-400' : ''} truncate max-w-[150px]`} title={client.name}>
                          {client.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">{formatPhone(client.phone)}</TableCell>
                    <TableCell className="py-4 px-4">
                      {client.referredBy ? (
                        <span className="text-sm truncate max-w-[120px] block" title={client.referredBy}>{client.referredBy}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-muted-foreground py-4 px-4 whitespace-nowrap">
                      {getLastPurchaseDate(client)}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 whitespace-nowrap">
                        {getPaymentTypeLabel(stats.paymentFrequency)}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-sm font-medium py-4 px-4 whitespace-nowrap ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                      {getNextDueDate(client)}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      {getNextInstallmentAmount(client) > 0 ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {formatCurrency(getNextInstallmentAmount(client))}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground py-4 px-4 whitespace-nowrap">
                      {installmentsSummary}
                    </TableCell>
                    <TableCell className="font-semibold py-4 px-4 whitespace-nowrap">
                      {formatCurrency(stats.totalSales)}
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {formatCurrency(stats.totalPaid)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4 whitespace-nowrap">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {formatCurrency(stats.totalPending)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-primary/10"
                          title="Ver detalhes"
                          onClick={() => navigate(`/client/${client.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                          title="Editar cliente"
                          onClick={() => setEditingClient(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Remover cliente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover o cliente {client.name}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(client.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      </TooltipProvider>

      {editingClient && (
        <EditClientDialog
          clientId={editingClient.id}
          clientName={editingClient.name}
          clientPhone={editingClient.phone}
          clientAddress={editingClient.address}
          clientObservation={editingClient.observation}
          clientReferredBy={editingClient.referredBy}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onSuccess={loadClients}
        />
      )}
    </Card>
  );
};
