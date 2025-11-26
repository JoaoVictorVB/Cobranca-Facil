import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { distributionService, type BusinessRelationship } from '@/services/distribution.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, TrendingDown } from 'lucide-react';

interface ResellerStockMirrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reseller: BusinessRelationship;
}

export function ResellerStockMirrorDialog({
  open,
  onOpenChange,
  reseller,
}: ResellerStockMirrorDialogProps) {
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['reseller-inventory', reseller.resellerId],
    queryFn: () => distributionService.getResellerInventory(reseller.resellerId),
    enabled: open,
  });

  const getDaysStagnantBadge = (days?: number) => {
    if (!days) return null;
    if (days > 30) return <Badge variant="destructive">🔴 {days}d parado</Badge>;
    if (days > 15) return <Badge variant="secondary">🟡 {days}d parado</Badge>;
    return <Badge variant="default">🟢 {days}d</Badge>;
  };

  const sortedInventory = inventory
    ? [...inventory].sort((a, b) => (b.daysSinceLastSale || 0) - (a.daysSinceLastSale || 0))
    : [];

  const totalStockValue =
    inventory?.reduce((sum, item) => sum + item.stock * item.salePrice, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Espelho de Estoque - {reseller.resellerName || reseller.resellerId}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : !inventory || inventory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center gap-2">
            <Package className="h-12 w-12 opacity-20" />
            <p>Revendedor ainda não possui produtos em estoque</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total de Produtos</div>
                <div className="text-2xl font-bold">{inventory.length}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Valor do Estoque</div>
                <div className="text-2xl font-bold">R$ {totalStockValue.toFixed(2)}</div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead>Última Venda</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.stock}</TableCell>
                    <TableCell className="text-right">R$ {item.salePrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {item.lastSaleDate
                        ? format(new Date(item.lastSaleDate), 'dd/MM/yyyy', { locale: ptBR })
                        : 'Nunca vendido'}
                    </TableCell>
                    <TableCell>{getDaysStagnantBadge(item.daysSinceLastSale)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {sortedInventory.some((item) => (item.daysSinceLastSale || 0) > 30) && (
              <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <TrendingDown className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">Produtos parados detectados</div>
                  <div className="text-sm text-yellow-700">
                    {sortedInventory.filter((item) => (item.daysSinceLastSale || 0) > 30).length}{' '}
                    produto(s) sem venda há mais de 30 dias. Considere negociar trocas ou promoções.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
