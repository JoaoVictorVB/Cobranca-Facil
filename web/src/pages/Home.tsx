import { BarChart3, Calendar as CalendarIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentStatusChart } from "../components/dashboard/PaymentStatusChart";
import { RevenueChart } from "../components/dashboard/RevenueChart";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { TopClientsTable } from "../components/dashboard/TopClientsTable";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Skeleton } from "../components/ui/skeleton";
import { useToast } from "../hooks/use-toast";
import { MonthlySummary, PaymentStatus, reportsService, TopClient } from "../services/reports.service";

export function Home() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    for (let i = 6; i >= 1; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      options.push({ value, label: `${label} (Futuro)` });
    }
    
    const currentValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    options.push({ value: currentValue, label: `${currentLabel} (Atual)` });
    
    for (let i = 1; i <= 11; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    
    return options;
  };

  const loadDashboardData = useCallback(async (year: number, month: number) => {
    try {
      setLoading(true);
      
      const [summary, status, clients] = await Promise.all([
        reportsService.getMonthlySummary(year, month),
        reportsService.getPaymentStatus(),
        reportsService.getTopClients(5),
      ]);

      console.log('API returned summary for month:', summary.month);
      setMonthlySummary(summary);
      setPaymentStatus(status);
      setTopClients(clients);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "âŒ Erro",
        description: "NÃ£o foi possÃ­vel carregar os dados da dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleMonthChange = (value: string) => {
    console.log('Month changed to:', value);
    console.log('Previous selectedMonth:', selectedMonth);
    setSelectedMonth(value);
    const [year, month] = value.split('-').map(Number);
    console.log('Loading data for year:', year, 'month:', month);
    loadDashboardData(year, month);
  };

  useEffect(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    console.log('Initial load - selectedMonth:', selectedMonth, 'year:', year, 'month:', month);
    loadDashboardData(year, month);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">VisÃ£o geral do seu negÃ³cio</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-40 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!monthlySummary) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Nenhum dado disponÃ­vel</p>
      </div>
    );
  }

  const revenueData = [
    {
      month: monthlySummary.month,
      expected: monthlySummary.totalExpected,
      received: monthlySummary.totalReceived,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">VisÃ£o geral do seu negÃ³cio</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              <SelectValue>
                {getMonthOptions().find(opt => opt.value === selectedMonth)?.label || 'Selecionar mÃªs'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {getMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/analytics')} className="gap-2 w-full sm:w-auto">
            <BarChart3 className="h-4 w-4" />
            Ver AnÃ¡lises Detalhadas
          </Button>
        </div>
      </div>

      <SummaryCards
        totalExpected={monthlySummary.totalExpected}
        totalReceived={monthlySummary.totalReceived}
        totalPending={monthlySummary.totalPending}
        totalOverdue={monthlySummary.totalOverdue}
        receivedPercentage={monthlySummary.receivedPercentage}
      />

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Aproveitamento do MÃªs</CardTitle>
            <CardDescription>
              {monthlySummary.receivedPercentage.toFixed(1)}% do esperado jÃ¡ foi recebido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm text-muted-foreground">
                    {monthlySummary.receivedPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.min(monthlySummary.receivedPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parcelas Pagas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {monthlySummary.paidInstallments}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parcelas Atrasadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {monthlySummary.overdueInstallments}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">A Vencer</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {monthlySummary.upcomingInstallments}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Parcelas</p>
                  <p className="text-2xl font-bold">
                    {monthlySummary.paidInstallments + 
                     monthlySummary.overdueInstallments + 
                     monthlySummary.upcomingInstallments}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-4">
          <PaymentStatusChart data={paymentStatus} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RevenueChart data={revenueData} />
        <TopClientsTable clients={topClients} />
      </div>
    </div>
  );
}
