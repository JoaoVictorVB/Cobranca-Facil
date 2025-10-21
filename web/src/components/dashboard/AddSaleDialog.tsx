import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Client, clientService } from "@/services/client.service";
import { Product, productService } from "@/services/product.service";
import { PaymentFrequency, saleService } from "@/services/sale.service";
import { ApiErrorCode, isApiError } from "@/types/errors";
import { Info, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AddSaleDialogProps {
  onSuccess: () => void;
}

export const AddSaleDialog = ({ onSuccess }: AddSaleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    clientId: "",
    newClientName: "",
    newClientPhone: "",
    newClientReferredBy: "",
    newClientObservation: "",
    newClientAddress: "",
    productId: "",
    itemDescription: "",
    totalValue: "",
    totalInstallments: "1",
    paymentFrequency: PaymentFrequency.MENSAL,
    saleDate: new Date().toISOString().split('T')[0],
    firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias a partir de hoje
  });

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.findAll();
      setClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.findAll();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadClients();
      loadProducts();
    }
  }, [open, loadClients, loadProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let clientId = formData.clientId;

      if (!clientId && formData.newClientName) {
        try {
          const newClient = await clientService.create({
            name: formData.newClientName,
            phone: formData.newClientPhone || undefined,
            referredBy: formData.newClientReferredBy || undefined,
            observation: formData.newClientObservation || undefined,
            address: formData.newClientAddress || undefined,
          });
          clientId = newClient.id;
        } catch (error) {
          if (isApiError(error) && error.errorCode === ApiErrorCode.INVALID_PHONE_NUMBER) {
            return;
          }
          throw error;
        }
      }

      if (!clientId) {
        toast({
          title: "⚠️ Cliente Obrigatório",
          description: "Selecione um cliente existente ou cadastre um novo",
          variant: "destructive",
        });
        return;
      }

      // Adiciona horário meio-dia para evitar problemas de timezone
      const firstDueDateWithTime = formData.firstDueDate ? `${formData.firstDueDate}T12:00:00` : '';
      const saleDateWithTime = formData.saleDate ? `${formData.saleDate}T12:00:00` : '';

      await saleService.create({
        clientId,
        itemDescription: formData.itemDescription,
        totalValue: parseFloat(formData.totalValue),
        totalInstallments: parseInt(formData.totalInstallments),
        paymentFrequency: formData.paymentFrequency,
        firstDueDate: firstDueDateWithTime,
        saleDate: saleDateWithTime,
      });

      toast({
        title: "✅ Venda Cadastrada!",
        description: `${formData.totalInstallments} parcela(s) criada(s) com sucesso.`,
      });

      setOpen(false);
      resetForm();
      onSuccess();
    } catch (error) {
      console.error("Error creating sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: "",
      newClientName: "",
      newClientPhone: "",
      newClientReferredBy: "",
      newClientObservation: "",
      newClientAddress: "",
      productId: "",
      itemDescription: "",
      totalValue: "",
      totalInstallments: "1",
      paymentFrequency: PaymentFrequency.MENSAL,
      saleDate: new Date().toISOString().split('T')[0],
      firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const calculateInstallmentValue = () => {
    const total = parseFloat(formData.totalValue || "0");
    const installments = parseInt(formData.totalInstallments || "1");
    return (total / installments).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
          <ShoppingCart className="h-4 w-4" />
          Nova Venda
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <TooltipProvider delayDuration={200}>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Cadastrar Nova Venda
          </DialogTitle>
          <DialogDescription>
            Selecione um cliente existente ou cadastre um novo abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cliente */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-lg">Cliente</h3>
            
            <div className="space-y-2">
              <Label htmlFor="existingClient">Buscar Cliente Existente</Label>
              <Combobox
                options={clients.map((client) => ({
                  value: client.id,
                  label: `${client.name}${client.phone ? ` - ${client.phone}` : ""}`,
                }))}
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value, newClientName: "", newClientPhone: "", newClientReferredBy: "", newClientObservation: "", newClientAddress: "" })}
                placeholder="Busque por nome ou telefone"
                searchPlaceholder="Digite para buscar..."
                emptyText="Nenhum cliente encontrado"
              />
            </div>

            {!formData.clientId && (
              <div className="space-y-3 pt-2 border-t">
                <p className="text-sm text-muted-foreground">Ou cadastre um novo cliente:</p>
                <div className="grid gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="newClientName">Nome *</Label>
                    <Input
                      id="newClientName"
                      value={formData.newClientName}
                      onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                      placeholder="Nome completo do cliente"
                      required={!formData.clientId}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="newClientPhone">Telefone</Label>
                      <Input
                        id="newClientPhone"
                        value={formData.newClientPhone}
                        onChange={(e) => setFormData({ ...formData, newClientPhone: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newClientReferredBy">Indicado por</Label>
                      <Input
                        id="newClientReferredBy"
                        value={formData.newClientReferredBy}
                        onChange={(e) => setFormData({ ...formData, newClientReferredBy: e.target.value })}
                        placeholder="Nome"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newClientAddress">Endereço</Label>
                    <Input
                      id="newClientAddress"
                      value={formData.newClientAddress}
                      onChange={(e) => setFormData({ ...formData, newClientAddress: e.target.value })}
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newClientObservation">Observações</Label>
                    <Textarea
                      id="newClientObservation"
                      value={formData.newClientObservation}
                      onChange={(e) => setFormData({ ...formData, newClientObservation: e.target.value })}
                      placeholder="Informações adicionais sobre o cliente"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Venda */}
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg">
            <h3 className="font-semibold text-lg">Detalhes da Venda</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Data da Compra *</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="firstDueDate">Data do Primeiro Vencimento *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        <strong>Data em que a primeira parcela vence.</strong><br/>
                        Se mensal: próximas parcelas sempre no mesmo dia (ex: dia 10)<br/>
                        Se quinzenal: alterna entre dia X e dia X+15
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="firstDueDate"
                  type="date"
                  value={formData.firstDueDate}
                  onChange={(e) => setFormData({ ...formData, firstDueDate: e.target.value })}
                  min={formData.saleDate} // Não pode ser antes da data da compra
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productSelect">Selecionar Produto Cadastrado</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => {
                  const selectedProduct = products.find(p => p.id === value);
                  setFormData({
                    ...formData,
                    productId: value,
                    itemDescription: selectedProduct ? `${selectedProduct.name}${selectedProduct.description ? ` - ${selectedProduct.description}` : ''}` : formData.itemDescription
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um produto ou descreva abaixo" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                      {product.description && ` - ${product.description}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription">Descrição do Produto/Serviço *</Label>
              <Textarea
                id="itemDescription"
                value={formData.itemDescription}
                onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })}
                placeholder="Descreva o produto ou serviço vendido"
                required
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalValue">Valor Total (R$) *</Label>
              <Input
                id="totalValue"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.totalValue}
                onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="totalInstallments">Nº de Parcelas *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        Quantas vezes o valor será dividido. Cada parcela terá o mesmo valor.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.totalInstallments}
                  onValueChange={(value) => setFormData({ ...formData, totalInstallments: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="paymentFrequency">Frequência *</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">
                        <strong>Mensal:</strong> Uma parcela por mês, sempre no mesmo dia<br/>
                        <strong>Quinzenal:</strong> Uma parcela a cada 15 dias (dia X e dia X+15)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.paymentFrequency}
                  onValueChange={(value) => 
                    setFormData({ ...formData, paymentFrequency: value as PaymentFrequency })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentFrequency.MENSAL}>Mensal</SelectItem>
                    <SelectItem value={PaymentFrequency.QUINZENAL}>Quinzenal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Valor da Parcela</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                  <span className="text-sm font-medium">R$ {calculateInstallmentValue()}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  );
};
