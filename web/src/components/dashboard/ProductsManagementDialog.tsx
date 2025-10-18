import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Product, productService } from "@/services/product.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Package, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface ProductsManagementDialogProps {
  onSuccess?: () => void;
}

export function ProductsManagementDialog({ onSuccess }: ProductsManagementDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.findAll();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open, loadProducts]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      await productService.delete(productToDelete.id);
      
      toast({
        title: "✅ Produto excluído",
        description: `O produto "${productToDelete.name}" foi removido com sucesso`,
      });

      await loadProducts();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMessage = error instanceof Error ? error.message : "Não foi possível excluir o produto";
      toast({
        title: "❌ Erro ao excluir",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Package className="h-4 w-4" />
            Gerenciar Produtos
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gerenciar Produtos
            </DialogTitle>
            <DialogDescription>
              Visualize e gerencie todos os produtos cadastrados no sistema
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum produto cadastrado</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione produtos usando o botão "Novo Produto"
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {products.length} {products.length === 1 ? "produto cadastrado" : "produtos cadastrados"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadProducts}
                  disabled={loading}
                >
                  Atualizar
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {product.description || (
                          <span className="text-muted-foreground italic">Sem descrição</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(product.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(product)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Confirmar exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto{" "}
              <span className="font-semibold">{productToDelete?.name}</span>?
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
