import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProductInventoryManagement } from "@/components/dashboard/ProductInventoryManagement";

const ProductInventory = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 max-w-[1600px]">
        <div className="mb-6 space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Gestão de Estoque</h1>
          <p className="text-muted-foreground text-lg">
            Controle completo de produtos, preços e movimentações de estoque
          </p>
        </div>
        <ProductInventoryManagement />
      </main>
    </div>
  );
};

export default ProductInventory;
