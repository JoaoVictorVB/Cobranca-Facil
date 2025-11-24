import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import tagService from "@/services/tag.service";
import { useQuery } from "@tanstack/react-query";
import {
    AlertTriangle,
    Archive,
    BarChart3,
    Edit,
    Package,
    Plus,
    Search,
    Trash2,
    TrendingDown,
    TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AddProductInventoryDialog } from "./AddProductInventoryDialog";
import { EditProductInventoryDialog } from "./EditProductInventoryDialog";
import { StockAdjustmentDialog } from "./StockAdjustmentDialog";
import { StockMovementsDialog } from "./StockMovementsDialog";
import { TagAnalytics } from "./TagAnalytics";
import { TagManagementDialog } from "./TagManagementDialog";

export function ProductInventoryManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isMovementsDialogOpen, setIsMovementsDialogOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.findAll(),
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.findAll(),
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.isActive) ||
        (statusFilter === "inactive" && !product.isActive) ||
        (statusFilter === "lowStock" && product.isLowStock);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      lowStockProducts: products.filter(p => p.isLowStock).length,
      totalStockValue: products.reduce((sum, p) => sum + p.stockValue, 0),
      totalSaleValue: products.reduce((sum, p) => sum + p.stockValueSale, 0),
      averageMargin: products.length > 0
        ? products.reduce((sum, p) => sum + p.profitMargin, 0) / products.length
        : 0,
    };
  }, [products]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await productService.delete(id);
      toast({
        title: "✅ Produto excluído",
        description: "O produto foi removido com sucesso.",
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleStockClick = (product: Product) => {
    setSelectedProduct(product);
    setIsStockDialogOpen(true);
  };

  const handleMovementsClick = (product: Product) => {
    setSelectedProduct(product);
    setIsMovementsDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeProducts} ativos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
              {stats.lowStockProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              produtos abaixo do mínimo
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Archive className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalStockValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">custo total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor de Venda</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
              {formatCurrency(stats.totalSaleValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">potencial de venda</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Potencial</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.totalSaleValue - stats.totalStockValue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">margem total</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageMargin.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">lucro médio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex-1 space-y-4 lg:space-y-0 lg:flex lg:gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, SKU ou código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-border/50 focus:border-purple-500 transition-colors"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px] border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                  <SelectItem value="lowStock">Estoque Baixo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex-1 lg:flex-none"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {showAnalytics ? "Ver Produtos" : "Ver Analytics"}
              </Button>
              <TagManagementDialog />
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="flex-1 lg:flex-none"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {showAnalytics ? (
            <TagAnalytics />
          ) : (
            <div className="rounded-md border">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-right">Custo</TableHead>
                  <TableHead className="text-right">Venda</TableHead>
                  <TableHead className="text-right">Margem</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {products.length === 0
                        ? "Nenhum produto cadastrado"
                        : "Nenhum produto encontrado com os filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-800 text-gray-100 px-2 py-1 rounded font-mono">
                          {product.sku || "-"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.tagIds && product.tagIds.length > 0 ? (
                            product.tagIds.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId);
                              return tag ? (
                                <Badge
                                  key={tag.id}
                                  style={{ backgroundColor: tag.color || '#3B82F6' }}
                                  className="text-white text-xs"
                                >
                                  {tag.name}
                                </Badge>
                              ) : null;
                            })
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className={product.isLowStock ? "text-yellow-600 font-bold" : ""}>
                            {product.stock} {product.unit}
                          </span>
                          <span className="text-xs text-gray-500">
                            Mín: {product.minStock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(product.costPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(product.salePrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-medium ${
                            product.profitMargin > 30
                              ? "text-green-600"
                              : product.profitMargin > 15
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.profitMargin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex gap-1 justify-center">
                          {product.isActive ? (
                            <Badge variant="default" className="text-xs">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inativo
                            </Badge>
                          )}
                          {product.isLowStock && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Baixo
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockClick(product)}
                            title="Ajustar estoque"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMovementsClick(product)}
                            title="Ver movimentações"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <AddProductInventoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refetch}
      />

      {selectedProduct && (
        <>
          <EditProductInventoryDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            product={selectedProduct}
            onSuccess={refetch}
          />

          <StockAdjustmentDialog
            open={isStockDialogOpen}
            onOpenChange={setIsStockDialogOpen}
            product={selectedProduct}
            onSuccess={refetch}
          />

          <StockMovementsDialog
            open={isMovementsDialogOpen}
            onOpenChange={setIsMovementsDialogOpen}
            product={selectedProduct}
          />
        </>
      )}
    </div>
  );
}
