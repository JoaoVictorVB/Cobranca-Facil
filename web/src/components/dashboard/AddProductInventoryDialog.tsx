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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CreateProductDto, productService } from "@/services/product.service";
import { useState } from "react";
import { TagSelector } from "./TagSelector";

interface AddProductInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddProductInventoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddProductInventoryDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    sku: "",
    tagIds: [],
    costPrice: 0,
    salePrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: undefined,
    unit: "un",
    barcode: "",
    location: "",
    supplier: "",
    notes: "",
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await productService.create(formData);
      toast({
        title: "✅ Produto criado",
        description: "O produto foi cadastrado com sucesso.",
      });
      onSuccess();
      
      if (addAnother) {
        // Resetar formulário mas manter o dialog aberto
        setFormData({
          name: "",
          description: "",
          sku: "",
          tagIds: formData.tagIds, // Manter as tags selecionadas
          costPrice: formData.costPrice, // Manter preços como referência
          salePrice: formData.salePrice,
          stock: 0,
          minStock: formData.minStock,
          maxStock: formData.maxStock,
          unit: formData.unit,
          barcode: "",
          location: formData.location, // Manter localização
          supplier: formData.supplier, // Manter fornecedor
          notes: "",
          isActive: true,
        });
        // Focar no campo nome
        setTimeout(() => {
          document.getElementById('name')?.focus();
        }, 100);
      } else {
        // Fechar dialog e resetar tudo
        onOpenChange(false);
        setFormData({
          name: "",
          description: "",
          sku: "",
          tagIds: [],
          costPrice: 0,
          salePrice: 0,
          stock: 0,
          minStock: 0,
          maxStock: undefined,
          unit: "un",
          barcode: "",
          location: "",
          supplier: "",
          notes: "",
          isActive: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const profitMargin = formData.costPrice > 0
    ? ((formData.salePrice! - formData.costPrice) / formData.costPrice) * 100
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os dados do produto para adicionar ao estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Notebook Dell Inspiron"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Ex: NOT-DELL-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Ex: 7891234567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o produto..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <TagSelector
                selectedTagIds={formData.tagIds || []}
                onChange={(tagIds) => setFormData({ ...formData, tagIds })}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Preços e Margem */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Preços e Margem</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo (R$) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.salePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Margem de Lucro</Label>
                <div className="h-10 flex items-center px-3 bg-gray-100 rounded-md">
                  <span
                    className={`font-bold ${
                      profitMargin > 30
                        ? "text-green-600"
                        : profitMargin > 15
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {profitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estoque */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Controle de Estoque</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Quantidade Inicial *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  required
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStock">Estoque Máximo</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStock: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="un">Unidade</SelectItem>
                    <SelectItem value="kg">Quilograma</SelectItem>
                    <SelectItem value="g">Grama</SelectItem>
                    <SelectItem value="l">Litro</SelectItem>
                    <SelectItem value="ml">Mililitro</SelectItem>
                    <SelectItem value="m">Metro</SelectItem>
                    <SelectItem value="cm">Centímetro</SelectItem>
                    <SelectItem value="cx">Caixa</SelectItem>
                    <SelectItem value="pct">Pacote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Informações Adicionais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Localização no Estoque</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Prateleira A3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Ex: Dell Brasil"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informações adicionais sobre o produto..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Produto ativo</Label>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar e Adicionar Outro"}
            </Button>
            <Button type="submit" disabled={isLoading} onClick={(e) => handleSubmit(e, false)}>
              {isLoading ? "Salvando..." : "Salvar e Fechar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
