import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { productService } from '@/services/product.service';
import tagService from '@/services/tag.service';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Package, Tags, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function TagAnalytics() {
  const { data: tags = [], isLoading: loadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.findAll(),
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.findAll(),
  });

  const analytics = useMemo(() => {
    // Calcular estatísticas
    const tagUsage = new Map<string, number>();
    const tagValue = new Map<string, number>();
    const tagStock = new Map<string, number>();

    products.forEach((product) => {
      if (product.tagIds && product.tagIds.length > 0) {
        product.tagIds.forEach((tagId) => {
          // Contagem de produtos
          tagUsage.set(tagId, (tagUsage.get(tagId) || 0) + 1);
          
          // Valor total em estoque
          const currentValue = tagValue.get(tagId) || 0;
          tagValue.set(tagId, currentValue + (product.stock * product.salePrice));
          
          // Quantidade em estoque
          tagStock.set(tagId, (tagStock.get(tagId) || 0) + product.stock);
        });
      }
    });

    // Tags mais usadas
    const topTags = Array.from(tagUsage.entries())
      .map(([tagId, count]) => {
        const tag = tags.find((t) => t.id === tagId);
        return {
          tag,
          count,
          value: tagValue.get(tagId) || 0,
          stock: tagStock.get(tagId) || 0,
        };
      })
      .filter((item) => item.tag)
      .sort((a, b) => b.count - a.count);

    // Produtos sem tags
    const productsWithoutTags = products.filter(
      (p) => !p.tagIds || p.tagIds.length === 0
    ).length;

    return {
      topTags,
      productsWithoutTags,
      totalTaggedProducts: products.length - productsWithoutTags,
      tagUsagePercentage: products.length > 0 
        ? ((products.length - productsWithoutTags) / products.length) * 100 
        : 0,
    };
  }, [tags, products]);

  const loading = loadingTags || loadingProducts;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tags Cadastradas</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Tags className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tags.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {tags.filter((t) => t.isActive).length} ativas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos com Tags</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Package className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTaggedProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.tagUsagePercentage.toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Tags</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.productsWithoutTags}</div>
            <p className="text-xs text-muted-foreground mt-1">
              produtos sem categorização
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tags Mais Usadas */}
      <Card>
        <CardHeader>
          <CardTitle>Tags Mais Usadas</CardTitle>
          <CardDescription>
            Distribuição de produtos por tag
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topTags.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tag em uso ainda
            </p>
          ) : (
            <div className="space-y-4">
              {analytics.topTags.map((item, index) => {
                const percentage = products.length > 0 
                  ? (item.count / products.length) * 100 
                  : 0;
                
                return (
                  <div key={item.tag!.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <Badge
                          style={{ backgroundColor: item.tag!.color || '#3B82F6' }}
                          className="text-white"
                        >
                          {item.tag!.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {item.count} {item.count === 1 ? 'produto' : 'produtos'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {item.value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.stock} unidades
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.tag!.color || '#3B82F6',
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-right">
                      {percentage.toFixed(1)}% do total
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Distribuição Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tags</CardTitle>
          <CardDescription>
            Visualização proporcional do uso de cada tag
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.topTags.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tag para visualizar
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex w-full h-12 rounded-lg overflow-hidden">
                {analytics.topTags.map((item) => {
                  const percentage = products.length > 0 
                    ? (item.count / products.length) * 100 
                    : 0;
                  
                  return (
                    <div
                      key={item.tag!.id}
                      className="flex items-center justify-center text-white text-xs font-medium transition-all hover:opacity-80"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: item.tag!.color || '#3B82F6',
                        minWidth: percentage > 5 ? 'auto' : '0',
                      }}
                      title={`${item.tag!.name}: ${item.count} produtos (${percentage.toFixed(1)}%)`}
                    >
                      {percentage > 8 && item.tag!.name}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {analytics.topTags.slice(0, 10).map((item) => {
                  const percentage = products.length > 0 
                    ? (item.count / products.length) * 100 
                    : 0;
                  
                  return (
                    <div key={item.tag!.id} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.tag!.color || '#3B82F6' }}
                      />
                      <span className="text-sm">
                        {item.tag!.name} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
