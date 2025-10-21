import { AddProductDialog } from "@/components/dashboard/AddProductDialog";
import { AddSaleDialog } from "@/components/dashboard/AddSaleDialog";
import { ClientsTable } from "@/components/dashboard/ClientsTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PaymentCalendar } from "@/components/dashboard/PaymentCalendarView";
import { ProductsManagementDialog } from "@/components/dashboard/ProductsManagementDialog";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/client.service";
import { reportsService } from "@/services/reports.service";
import { useCallback, useEffect, useState } from "react";
import { Home } from "./Home";

const Index = () => {
  const [stats, setStats] = useState({
    totalSold: 0,
    totalPaid: 0,
    totalPending: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [dateRangeStart, setDateRangeStart] = useState<string | undefined>();
  const [dateRangeEnd, setDateRangeEnd] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    const tabParam = urlParams.get('tab');
    
    if (dateParam) {
      setSelectedDate(dateParam);
      setActiveTab("clients");
    } else if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  const clearAllFilters = () => {
    setSelectedDate(undefined);
    setDateRangeStart(undefined);
    setDateRangeEnd(undefined);
    window.history.pushState({}, '', window.location.pathname);
  };

  const setSpecificDateFilter = (date: string) => {
    setSelectedDate(date);
    setDateRangeStart(undefined);
    setDateRangeEnd(undefined);
    window.history.pushState({}, '', `/?date=${date}`);
  };

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const [clients, paymentStatus] = await Promise.all([
        clientService.findAll(),
        reportsService.getPaymentStatus()
      ]);
      
      let totalSold = 0;
      let totalPaid = 0;
      let totalPending = 0;
      
      paymentStatus.forEach(status => {
        if (status.status === 'pago') {
          totalPaid += status.totalAmount;
        } else if (status.status === 'pendente' || status.status === 'atrasado') {
          totalPending += status.totalAmount;
        }
      });
      
      totalSold = totalPaid + totalPending;
      
      setStats({
        totalSold,
        totalPaid,
        totalPending,
        totalClients: clients?.length || 0
      });
      
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats({
        totalSold: 0,
        totalPaid: 0,
        totalPending: 0,
        totalClients: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <DashboardHeader />
      
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard de Cobranças
            </h1>
            <p className="text-lg text-muted-foreground">
              Gerencie suas vendas e pagamentos de forma simples e eficiente
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ProductsManagementDialog onSuccess={loadStats} />
            <AddProductDialog onSuccess={loadStats} />
            <AddSaleDialog onSuccess={loadStats} />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <StatsCards stats={stats} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-2xl grid-cols-3">
                <TabsTrigger value="home">Dashboard</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="calendar">CalendÃ¡rio</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="mt-6">
                <Home key={refreshKey} />
              </TabsContent>
              
              <TabsContent value="clients" className="mt-6">
                <ClientsTable 
                  onUpdate={loadStats} 
                  dateFilter={selectedDate}
                  dateRangeStart={dateRangeStart}
                  dateRangeEnd={dateRangeEnd}
                  onClearFilters={clearAllFilters}
                  onSetSpecificDate={setSpecificDateFilter}
                />
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <PaymentCalendar 
                  selectedDate={selectedDate}
                  onDateClick={(date) => {
                    setSelectedDate(date);
                    setDateRangeStart(undefined);
                    setDateRangeEnd(undefined);
                  }}
                  onClearFilter={clearAllFilters}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
