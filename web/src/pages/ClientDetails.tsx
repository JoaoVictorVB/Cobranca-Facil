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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ClientWithSales, InstallmentDetails, clientWithSalesService } from "@/services/client-with-sales.service";
import { installmentService } from "@/services/installment.service";
import { saleService } from "@/services/sale.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ChevronDown, ChevronUp, Filter, Info, Loader2, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientWithSales | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentDetails | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(true);
  const [payingInstallment, setPayingInstallment] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "value" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "partial">("all");
  const [collapsedSales, setCollapsedSales] = useState<Set<string>>(new Set());

  const loadClientDetails = useCallback(async () => {
    try {
      setLoading(true);
      const clients = await clientWithSalesService.findAllWithSales();
      const foundClient = clients.find(c => c.id === clientId);
      
      if (foundClient) {
        const sortedClient = {
          ...foundClient,
          sales: foundClient.sales?.map(sale => ({
            ...sale,
            installments: sale.installments?.sort((a, b) => a.installmentNumber - b.installmentNumber) || []
          })) || []
        };
        setClient(sortedClient);
      }
    } catch (error) {
      console.error("Error loading client:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados do cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [clientId, toast]);

  useEffect(() => {
    loadClientDetails();
  }, [loadClientDetails]);

  const handleDeleteSale = async (saleId: string, saleDescription: string) => {
    try {
      await saleService.delete(saleId);
      toast({
        title: "✅ Venda Excluída",
        description: `A venda "${saleDescription}" e todas as suas parcelas foram removidas.`,
      });
      loadClientDetails();
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a venda",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTotalPurchases = () => {
    return client?.sales.reduce((acc, sale) => acc + Number(sale.totalValue), 0) || 0;
  };

  const getTotalPaid = () => {
    return client?.sales.reduce((acc, sale) => acc + Number(sale.totalPaid), 0) || 0;
  };

  const getTotalPending = () => {
    return getTotalPurchases() - getTotalPaid();
  };

  const toggleSaleCollapse = (saleId: string) => {
    setCollapsedSales(prev => {
      const newSet = new Set(prev);
      if (newSet.has(saleId)) {
        newSet.delete(saleId);
      } else {
        newSet.add(saleId);
      }
      return newSet;
    });
  };

  const getSaleStatus = (sale: ClientWithSales['sales'][0]) => {
    const totalPaid = Number(sale.totalPaid);
    const totalValue = Number(sale.totalValue);
    
    if (totalPaid >= totalValue) return "paid";
    if (totalPaid > 0) return "partial";
    return "pending";
  };

  const getFilteredAndSortedSales = () => {
    if (!client) return [];
    
    let filtered = [...client.sales];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(sale => getSaleStatus(sale) === statusFilter);
    }
    
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.saleDate).getTime() - new Date(b.saleDate).getTime();
          break;
        case "value":
          comparison = Number(a.totalValue) - Number(b.totalValue);
          break;
        case "status": {
          const statusOrder = { paid: 0, partial: 1, pending: 2 };
          comparison = statusOrder[getSaleStatus(a)] - statusOrder[getSaleStatus(b)];
          break;
        }
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
    
    return filtered;
  };

  const handlePayment = async () => {
    if (!selectedInstallment || !paymentAmount) return;

    try {
      setPayingInstallment(true);
      const paidValue = parseFloat(paymentAmount);
      const originalAmount = Number(selectedInstallment.amount);
      const currentPaidAmount = Number(selectedInstallment.paidAmount || 0);

      const paidDateWithTime = paymentDate ? `${paymentDate}T12:00:00` : undefined;
      
      await installmentService.payInstallment(selectedInstallment.id, {
        amount: paidValue,
        paidDate: paidDateWithTime,
      });

      const difference = paidValue - originalAmount;
      const isPartialPayment = paidValue < originalAmount;
      const isFullPayment = paidValue >= originalAmount;
      const totalPaid = currentPaidAmount + paidValue;

      if (isPartialPayment) {
        toast({
          title: "⚠️ Pagamento Parcial Registrado",
          description: `Pago: ${formatCurrency(paidValue)} de ${formatCurrency(originalAmount)}. Restante: ${formatCurrency(originalAmount - paidValue)}`,
          variant: "default",
        });
      } else if (difference > 0) {
        toast({
          title: "… Pagamento Completo com Excedente",
          description: `Valor maior que o combinado: ${formatCurrency(difference)}`,
        });
      } else {
        toast({
          title: "… Pagamento registrado com sucesso!",
          description: "Pagamento registrado no valor combinado",
        });
      }

      setSelectedInstallment(null);
      setPaymentAmount("");
      await loadClientDetails();
    } catch (error) {
      console.error("Error paying installment:", error);
      toast({
        title: "❌ Erro ao registrar pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setPayingInstallment(false);
    }
  };

  const openPaymentDialog = (installment: InstallmentDetails) => {
    setSelectedInstallment(installment);
    setPaymentAmount(installment.amount.toString());
    setPaymentDate(format(new Date(), "yyyy-MM-dd"));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Cliente não encontrado</p>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => navigate("/?tab=clients")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
      <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/?tab=clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{client.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="font-medium">{client.phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Indicado por</p>
              <p className="font-medium">{client.referredBy || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endereço</p>
              <p className="font-medium">{client.address || "-"}</p>
            </div>
          </div>

          {client.observation && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Observações</p>
              <p className="font-medium mt-1">{client.observation}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Total em Compras</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Soma de todas as vendas realizadas para este cliente, incluindo parcelas pagas e pendentes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(getTotalPurchases())}</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Total Pago</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Valor total já recebido de todas as parcelas pagas por este cliente.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-accent">{formatCurrency(getTotalPaid())}</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Total Pendente</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                      Valor restante a receber de parcelas ainda não pagas. <strong>Importante:</strong> Acompanhe este valor para cobranças futuras.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(getTotalPending())}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Vendas ({getFilteredAndSortedSales().length})</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">
                    <strong>Lista de todas as vendas deste cliente.</strong><br/>
                    Você pode expandir cada venda para ver as parcelas, registrar pagamentos, ou excluir vendas completas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (collapsedSales.size === client.sales.length) {
                    setCollapsedSales(new Set());
                  } else {
                    setCollapsedSales(new Set(client.sales.map(s => s.id)));
                  }
                }}
              >
                {collapsedSales.size === client.sales.length ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expandir Todas
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Colapsar Todas
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {showFilters && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label>Ordenar por</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        Escolha como organizar a lista de vendas: por data, valor ou status de pagamento.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "value" | "status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Data da Venda</SelectItem>
                    <SelectItem value="value">Valor Total</SelectItem>
                    <SelectItem value="status">Status de Pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Ordem</Label>
                <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Decrescente</SelectItem>
                    <SelectItem value="asc">Crescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label>Filtrar por Status</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        <strong>Paga:</strong> Todas as parcelas foram quitadas<br/>
                        <strong>Parcial:</strong> Algumas parcelas foram pagas<br/>
                        <strong>Pendente:</strong> Nenhuma parcela foi paga ainda
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "paid" | "pending" | "partial")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="paid">Pagas</SelectItem>
                    <SelectItem value="partial">Parciais</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(sortBy !== "date" || sortOrder !== "desc" || statusFilter !== "all") && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSortBy("date");
                    setSortOrder("desc");
                    setStatusFilter("all");
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {getFilteredAndSortedSales().map((sale) => (
        <Card key={sale.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSaleCollapse(sale.id)}
                    className="p-0 h-auto"
                  >
                    {collapsedSales.has(sale.id) ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronUp className="h-5 w-5" />
                    )}
                  </Button>
                  <div>
                    <CardTitle>{sale.itemDescription}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Venda realizada em {format(new Date(sale.saleDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  {getSaleStatus(sale) === "paid" && (
                    <Badge variant="default" className="bg-green-500">Paga</Badge>
                  )}
                  {getSaleStatus(sale) === "partial" && (
                    <Badge variant="default" className="bg-yellow-500">Parcial</Badge>
                  )}
                  {getSaleStatus(sale) === "pending" && (
                    <Badge variant="destructive">Pendente</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <div className="text-right flex-1">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">{formatCurrency(Number(sale.totalValue))}</p>
                  <p className="text-sm text-accent">Pago: {formatCurrency(Number(sale.totalPaid))}</p>
                  <p className="text-sm text-orange-600 font-medium">
                    Restante: {formatCurrency(Number(sale.totalValue) - Number(sale.totalPaid))}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a venda "{sale.itemDescription}"? 
                        Isso vai deletar permanentemente a venda e todas as {sale.totalInstallments} parcelas associadas.
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteSale(sale.id, sale.itemDescription)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirmar Exclusão
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          
          {!collapsedSales.has(sale.id) && (
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.installments.map((installment) => (
                  <TableRow key={installment.id}>
                    <TableCell>
                      {installment.installmentNumber}/{sale.totalInstallments}
                    </TableCell>
                    <TableCell>
                      {format(new Date(installment.dueDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{formatCurrency(Number(installment.amount))}</TableCell>
                    <TableCell>
                      {installment.paidAmount ? (
                        <span className={installment.paidAmount !== installment.amount ? "text-yellow-500" : ""}>
                          {formatCurrency(Number(installment.paidAmount))}
                          {installment.paidAmount !== installment.amount && (
                            <span className="text-xs block">
                              {installment.paidAmount > installment.amount ? "+" : ""}
                              {formatCurrency(Number(installment.paidAmount) - Number(installment.amount))}
                            </span>
                          )}
                        </span>
                      ) : "-"}
                    </TableCell>
                    <TableCell>
                      {installment.paidDate ? format(new Date(installment.paidDate), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          installment.status === "pago"
                            ? "default"
                            : installment.status === "atrasado"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {installment.status}
                        {installment.paidAmount && installment.status !== "pago" && (
                          <span className="ml-1 text-xs">(Parcial)</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {installment.status !== "pago" ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openPaymentDialog(installment)}
                            >
                              Pagar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Registrar Pagamento</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Valor Esperado</Label>
                                <p className="text-lg font-bold">{formatCurrency(Number(installment.amount))}</p>
                              </div>
                              <div>
                                <Label htmlFor="payment-amount">Valor Pago</Label>
                                <Input
                                  id="payment-amount"
                                  type="number"
                                  step="0.01"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="0.00"
                                />
                                {paymentAmount && parseFloat(paymentAmount) < Number(installment.amount) && (
                                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                    ⚠️ Pagamento parcial - Restante: {formatCurrency(Number(installment.amount) - parseFloat(paymentAmount))}
                                  </p>
                                )}
                                {paymentAmount && parseFloat(paymentAmount) > Number(installment.amount) && (
                                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                    ℹ️ Valor acima do esperado - Excedente: {formatCurrency(parseFloat(paymentAmount) - Number(installment.amount))}
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="payment-date">Data do Pagamento</Label>
                                <Input
                                  id="payment-date"
                                  type="date"
                                  value={paymentDate}
                                  onChange={(e) => setPaymentDate(e.target.value)}
                                />
                              </div>
                              <Button onClick={handlePayment} className="w-full" disabled={payingInstallment}>
                                {payingInstallment ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processando...
                                  </>
                                ) : (
                                  "Confirmar Pagamento"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openPaymentDialog(installment)}
                            >
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Pagamento</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <Label>Valor Original</Label>
                                <p className="text-lg font-bold">{formatCurrency(Number(installment.amount))}</p>
                              </div>
                              <div>
                                <Label>Valor Atual Pago</Label>
                                <p className="text-lg font-semibold text-accent">{formatCurrency(Number(installment.paidAmount))}</p>
                              </div>
                              <div>
                                <Label htmlFor="edit-payment-amount">Novo Valor Pago</Label>
                                <Input
                                  id="edit-payment-amount"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="0.00"
                                />
                                {paymentAmount && parseFloat(paymentAmount) < Number(installment.amount) && (
                                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                    ⚠️ Pagamento parcial - Restante: {formatCurrency(Number(installment.amount) - parseFloat(paymentAmount))}
                                  </p>
                                )}
                                {paymentAmount && parseFloat(paymentAmount) > Number(installment.amount) && (
                                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                    ℹ️ Valor acima do esperado - Excedente: {formatCurrency(parseFloat(paymentAmount) - Number(installment.amount))}
                                  </p>
                                )}
                                {paymentAmount && parseFloat(paymentAmount) === Number(installment.amount) && (
                                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    ✅ Valor exato da parcela
                                  </p>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="edit-payment-date">Nova Data do Pagamento</Label>
                                <Input
                                  id="edit-payment-date"
                                  type="date"
                                  value={paymentDate}
                                  onChange={(e) => setPaymentDate(e.target.value)}
                                />
                              </div>
                              <Button onClick={handlePayment} className="w-full" disabled={payingInstallment}>
                                {payingInstallment ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Atualizando...
                                  </>
                                ) : (
                                  "Salvar Alterações"
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </CardContent>
          )}
        </Card>
      ))}
      </TooltipProvider>
      </div>
    </div>
  );
}
