import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Product, productService } from "@/services/product.service";
import { Minus, Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: StockAdjustmentDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");

  const handleAddStock = async () => {
    if (quantity <= 0) {
      toast({
        title: "⚠️ Quantidade inválida",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await productService.addStock(product.id, { quantity, reason, reference });
      toast({
        title: "✅ Estoque adicionado",
        description: `${quantity} ${product.unit} adicionados ao estoque.`,
      });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStock = async () => {
    if (quantity <= 0) {
      toast({
        title: "⚠️ Quantidade inválida",
        description: "A quantidade deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (quantity > product.stock) {
      toast({
        title: "⚠️ Estoque insuficiente",
        description: `Estoque disponível: ${product.stock} ${product.unit}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await productService.removeStock(product.id, { quantity, reason, reference });
      toast({
        title: "✅ Estoque removido",
        description: `${quantity} ${product.unit} removidos do estoque.`,
      });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustStock = async () => {
    if (quantity < 0) {
      toast({
        title: "⚠️ Quantidade inválida",
        description: "A quantidade não pode ser negativa.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await productService.adjustStock(product.id, { newQuantity: quantity, reason });
      toast({
        title: "✅ Estoque ajustado",
        description: `Estoque ajustado para ${quantity} ${product.unit}.`,
      });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setQuantity(0);
    setReason("");
    setReference("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajustar Estoque - {product.name}</DialogTitle>
          <DialogDescription>
            Estoque atual: <span className="font-bold">{product.stock} {product.unit}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </TabsTrigger>
            <TabsTrigger value="remove">
              <Minus className="h-4 w-4 mr-2" />
              Remover
            </TabsTrigger>
            <TabsTrigger value="adjust">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Ajustar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-quantity">Quantidade a Adicionar</Label>
              <Input
                id="add-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-reference">Referência (NF, Pedido, etc)</Label>
              <Input
                id="add-reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: NF-12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-reason">Motivo</Label>
              <Textarea
                id="add-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Compra de fornecedor, doação, etc..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleAddStock} disabled={isLoading}>
                {isLoading ? "Processando..." : "Adicionar ao Estoque"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="remove" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remove-quantity">Quantidade a Remover</Label>
              <Input
                id="remove-quantity"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">
                Máximo disponível: {product.stock} {product.unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remove-reference">Referência</Label>
              <Input
                id="remove-reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: Venda #123"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remove-reason">Motivo</Label>
              <Textarea
                id="remove-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Venda, perda, devolução, etc..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleRemoveStock} disabled={isLoading} variant="destructive">
                {isLoading ? "Processando..." : "Remover do Estoque"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="adjust" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adjust-quantity">Nova Quantidade Total</Label>
              <Input
                id="adjust-quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">
                Diferença: {quantity - product.stock > 0 ? "+" : ""}
                {quantity - product.stock} {product.unit}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adjust-reason">Motivo do Ajuste</Label>
              <Textarea
                id="adjust-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Inventário, contagem física, correção, etc..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleAdjustStock} disabled={isLoading}>
                {isLoading ? "Processando..." : "Ajustar Estoque"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
