import { useState, useEffect } from 'react';
import { Package, TrendingDown, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { distributionService, ResellerProduct } from '@/services/distribution.service';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ResellerInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resellerId: string;
}

export function ResellerInventoryDialog({
  open,
  onOpenChange,
  resellerId,
}: ResellerInventoryDialogProps) {
  const [products, setProducts] = useState<ResellerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && resellerId) {
      loadInventory();
    }
  }, [open, resellerId]);

  const loadInventory = async () => {
    if (!resellerId) {
      console.warn('⚠️ Attempted to load inventory without resellerId');
      return;
    }

    try {
      console.log('📦 Loading inventory for reseller:', resellerId);
      setLoading(true);
      const data = await distributionService.getResellerInventory(resellerId);
      console.log('✅ Inventory loaded:', data);
      setProducts(data);
    } catch (error: any) {
      console.error('❌ Error loading inventory:', error);
      toast({
        title: '❌ Erro ao Carregar Estoque',
        description: error.message || error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStalenessColor = (days?: number) => {
    if (!days) return 'text-muted-foreground';
    if (days > 30) return 'text-red-600';
    if (days > 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStalenessLabel = (days?: number) => {
    if (!days) return 'Sem vendas';
    if (days > 30) return '🔴 Encalhado';
    if (days > 15) return '🟡 Parado';
    return '🟢 Ativo';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-purple-600" />
            Estoque do Revendedor (Espelho)
          </DialogTitle>
          <DialogDescription>
            Produtos fornecidos por você que estão com o revendedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando estoque...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum produto seu foi encontrado no estoque do revendedor
              </p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="text-sm text-muted-foreground">Total de Produtos</div>
                  <div className="text-2xl font-bold text-purple-600">{products.length}</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-muted-foreground">Estoque Total</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {products.reduce((sum, p) => sum + p.stock, 0)}
                  </div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="text-sm text-muted-foreground">Encalhados</div>
                  <div className="text-2xl font-bold text-red-600">
                    {products.filter((p) => (p.daysSinceLastSale || 0) > 30).length}
                  </div>
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Preço Venda</TableHead>
                    <TableHead>Última Venda</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.stock}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.salePrice)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.lastSaleDate ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(new Date(product.lastSaleDate))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sem vendas</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={getStalenessColor(product.daysSinceLastSale)}
                          >
                            {getStalenessLabel(product.daysSinceLastSale)}
                          </Badge>
                          {product.daysSinceLastSale !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              {product.daysSinceLastSale} dias
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Legend */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Legenda de Status:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🟢</span>
                    <span className="text-muted-foreground">Ativo (&lt;15 dias)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🟡</span>
                    <span className="text-muted-foreground">Parado (15-30 dias)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔴</span>
                    <span className="text-muted-foreground">Encalhado (&gt;30 dias)</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
