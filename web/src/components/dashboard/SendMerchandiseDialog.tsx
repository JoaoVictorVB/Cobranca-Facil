import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { distributionService, type BusinessRelationship } from '@/services/distribution.service';
import { productService } from '@/services/product.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SendMerchandiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reseller: BusinessRelationship;
}

interface SelectedItem {
  productId: string;
  name: string;
  availableStock: number;
  quantity: number;
}

export function SendMerchandiseDialog({ open, onOpenChange, reseller }: SendMerchandiseDialogProps) {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: productService.findAll,
    enabled: open,
  });

  const sendMutation = useMutation({
    mutationFn: distributionService.sendMerchandise,
    onSuccess: () => {
      toast.success('Remessa enviada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      setSelectedItems([]);
      setNotes('');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar remessa');
    },
  });

  const availableProducts = products?.filter(
    (p) => !selectedItems.find((item) => item.productId === p.id),
  );

  const addItem = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    if (product) {
      setSelectedItems([
        ...selectedItems,
        {
          productId: product.id,
          name: product.name,
          availableStock: product.stock,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems(selectedItems.filter((item) => item.productId !== productId));
  };

  const handleSend = () => {
    if (selectedItems.length === 0) {
      toast.error('Selecione ao menos um produto');
      return;
    }

    const invalidItem = selectedItems.find((item) => item.quantity > item.availableStock);
    if (invalidItem) {
      toast.error(`Estoque insuficiente para ${invalidItem.name}`);
      return;
    }

    sendMutation.mutate({
      resellerId: reseller.resellerId,
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      notes: notes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Mercadoria - {reseller.resellerName || reseller.resellerId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="product-select">Adicionar Produto</Label>
            <select
              id="product-select"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              onChange={(e) => {
                if (e.target.value) {
                  addItem(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Selecione um produto...</option>
              {availableProducts?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} (Estoque: {product.stock})
                </option>
              ))}
            </select>
          </div>

          {selectedItems.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Itens Selecionados</h4>
              {selectedItems.map((item) => (
                <div key={item.productId} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Disponível: {item.availableStock} un
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="w-20 text-center"
                      min={1}
                      max={item.availableStock}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.availableStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="font-bold">
                  Total: {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} unidades
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre a remessa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={sendMutation.isPending || selectedItems.length === 0}>
            {sendMutation.isPending ? 'Enviando...' : 'Enviar Remessa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
