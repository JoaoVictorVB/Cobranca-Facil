import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ClientWithSales, InstallmentDetails, clientWithSalesService } from "@/services/client-with-sales.service";
import { installmentService } from "@/services/installment.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Loader2 } from "lucide-react";
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

  const handlePayment = async () => {
    if (!selectedInstallment || !paymentAmount) return;

    try {
      setPayingInstallment(true);
      const paidValue = parseFloat(paymentAmount);

      await installmentService.payInstallment(selectedInstallment.id, {
        amount: paidValue,
        paidDate: paymentDate,
      });

      const originalAmount = Number(selectedInstallment.amount);
      const difference = paidValue - originalAmount;

      toast({
        title: "Pagamento registrado com sucesso!",
        description: difference !== 0 
          ? `Valor ${difference > 0 ? 'maior' : 'menor'} que o combinado: ${formatCurrency(Math.abs(difference))}`
          : "Pagamento registrado no valor combinado",
      });

      setSelectedInstallment(null);
      setPaymentAmount("");
      await loadClientDetails();
    } catch (error) {
      console.error("Error paying installment:", error);
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
    <div className="container mx-auto p-6 space-y-6">
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
              <p className="text-sm text-muted-foreground">Total em Compras</p>
              <p className="text-2xl font-bold">{formatCurrency(getTotalPurchases())}</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pago</p>
              <p className="text-2xl font-bold text-accent">{formatCurrency(getTotalPaid())}</p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Pendente</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(getTotalPending())}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {client.sales.map((sale) => (
        <Card key={sale.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{sale.itemDescription}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Venda realizada em {format(new Date(sale.saleDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold">{formatCurrency(Number(sale.totalValue))}</p>
                <p className="text-sm text-accent">Pago: {formatCurrency(Number(sale.totalPaid))}</p>
              </div>
            </div>
          </CardHeader>
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
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="0.00"
                                />
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
        </Card>
      ))}
    </div>
  );
}
