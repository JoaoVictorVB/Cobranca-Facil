import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, StockMovement, productService } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";

interface StockMovementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

export function StockMovementsDialog({
  open,
  onOpenChange,
  product,
}: StockMovementsDialogProps) {
  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["stock-movements", product.id],
    queryFn: () => productService.getStockMovements(product.id),
    enabled: open,
  });

  const getMovementIcon = (type: StockMovement["type"]) => {
    switch (type) {
      case "entrada":
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case "saida":
      case "venda":
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
    }
  };

  const getMovementBadge = (type: StockMovement["type"]) => {
    const variants: Record<StockMovement["type"], { label: string; variant: any }> = {
      entrada: { label: "Entrada", variant: "default" },
      saida: { label: "Saída", variant: "destructive" },
      ajuste: { label: "Ajuste", variant: "secondary" },
      venda: { label: "Venda", variant: "destructive" },
      devolucao: { label: "Devolução", variant: "default" },
    };

    const { label, variant } = variants[type];
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Movimentações - {product.name}</DialogTitle>
          <DialogDescription>
            Estoque atual: <span className="font-bold">{product.stock} {product.unit}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Carregando movimentações...</p>
            </div>
          </div>
        ) : movements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma movimentação registrada para este produto.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Anterior</TableHead>
                  <TableHead className="text-right">Novo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Referência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="text-sm">
                      {format(new Date(movement.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        {getMovementBadge(movement.type)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${
                          movement.quantity > 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity} {product.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {movement.previousStock}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {movement.newStock}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {movement.reason || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {movement.reference ? (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {movement.reference}
                        </code>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
