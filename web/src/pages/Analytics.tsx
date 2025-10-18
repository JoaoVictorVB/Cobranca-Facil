import { ArrowLeft, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddProductDialog } from "../components/dashboard/AddProductDialog";
import { AddSaleDialog } from "../components/dashboard/AddSaleDialog";
import { DateFilterSelector } from "../components/dashboard/DateFilterSelector";
import { MonthComparisonChart } from "../components/dashboard/MonthComparisonChart";
import { MonthSelector } from "../components/dashboard/MonthSelector";
import { PeriodSummaryCards } from "../components/dashboard/PeriodSummaryCards";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { MonthComparison, PeriodSummary, reportsService } from "../services/reports.service";

export function Analytics() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [periodSummary, setPeriodSummary] = useState<PeriodSummary | null>(null);
  const [monthComparison, setMonthComparison] = useState<MonthComparison | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const loadPeriodSummary = useCallback(async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const data = await reportsService.getPeriodSummary(startDate, endDate);
      setPeriodSummary(data);
      
      toast({
        title: "✅ Período Carregado",
        description: `Análise de ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`,
      });
    } catch (error) {
      console.error("Error loading period summary:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os dados do período",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMonthComparison = useCallback(async (months: string[]) => {
    if (months.length < 2) {
      toast({
        title: "⚠️ Aviso",
        description: "Selecione pelo menos 2 meses para comparar",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const data = await reportsService.getMonthComparison(months);
      setMonthComparison(data);
      
      toast({
        title: "✅ Comparação Carregada",
        description: `${months.length} meses comparados com sucesso`,
      });
    } catch (error) {
      console.error("Error loading month comparison:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar a comparação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleCompareMonths = () => {
    if (selectedMonths.length >= 2) {
      loadMonthComparison(selectedMonths);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
          <div className="flex gap-2">
            <AddProductDialog onSuccess={handleRefresh} />
            <AddSaleDialog onSuccess={handleRefresh} />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Análises e Relatórios</h1>
          <p className="text-muted-foreground">Compare períodos e analise seu desempenho financeiro</p>
        </div>

        <Tabs defaultValue="period" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="period" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Período Personalizado
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Comparação Mensal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="period" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <DateFilterSelector
                onApply={loadPeriodSummary}
                onClear={() => setPeriodSummary(null)}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : periodSummary ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo do Período</CardTitle>
                      <CardDescription>
                        {new Date(periodSummary.startDate).toLocaleDateString('pt-BR')} até {new Date(periodSummary.endDate).toLocaleDateString('pt-BR')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PeriodSummaryCards
                        totalExpected={periodSummary.totalExpected}
                        totalReceived={periodSummary.totalReceived}
                        totalPending={periodSummary.totalPending}
                        totalOverdue={periodSummary.totalOverdue}
                        receivedPercentage={periodSummary.receivedPercentage}
                        installmentsCount={periodSummary.installmentsCount}
                        paidCount={periodSummary.paidCount}
                        pendingCount={periodSummary.pendingCount}
                        overdueCount={periodSummary.overdueCount}
                      />
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Selecione um período</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Use o filtro ao lado para escolher as datas
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <MonthSelector
                selectedMonths={selectedMonths}
                onMonthsChange={setSelectedMonths}
                onCompare={handleCompareMonths}
              />
            </div>

            <div className="lg:col-span-3">
              {loading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                  </CardContent>
                </Card>
              ) : monthComparison ? (
                <MonthComparisonChart months={monthComparison.months} />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Compare múltiplos meses</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Selecione pelo menos 2 meses para visualizar a comparação
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
