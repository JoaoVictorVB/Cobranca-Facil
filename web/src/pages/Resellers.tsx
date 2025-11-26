import { ResellerStockMirrorDialog } from '@/components/dashboard/ResellerStockMirrorDialog';
import { SendMerchandiseDialog } from '@/components/dashboard/SendMerchandiseDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { distributionService, type BusinessRelationship } from '@/services/distribution.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Package, Users } from 'lucide-react';
import { useState } from 'react';

export default function Resellers() {
  const [selectedReseller, setSelectedReseller] = useState<BusinessRelationship | null>(null);
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [stockMirrorOpen, setStockMirrorOpen] = useState(false);

  const { data: resellers, isLoading: loadingResellers } = useQuery({
    queryKey: ['resellers'],
    queryFn: distributionService.getResellers,
  });

  const { data: transfers, isLoading: loadingTransfers } = useQuery({
    queryKey: ['transfers'],
    queryFn: distributionService.getTransfers,
  });

  const activeResellers = resellers?.filter((r) => r.status === 'ATIVO') || [];
  const pendingResellers = resellers?.filter((r) => r.status === 'PENDENTE') || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ATIVO: 'default',
      PENDENTE: 'secondary',
      INATIVO: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTransferStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      ENVIADO: 'secondary',
      RECEBIDO: 'default',
      DEVOLVIDO: 'destructive',
      CANCELADO: 'destructive',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Meus Revendedores</h1>
          <p className="text-muted-foreground">Gerencie relacionamentos e envie mercadorias</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revendedores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeResellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Convites Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingResellers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remessas Enviadas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resellers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resellers">Revendedores</TabsTrigger>
          <TabsTrigger value="transfers">Remessas</TabsTrigger>
        </TabsList>

        <TabsContent value="resellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Revendedores</CardTitle>
              <CardDescription>
                Visualize estoque espelhado e envie mercadorias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResellers ? (
                <div className="text-center py-8">Carregando...</div>
              ) : activeResellers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum revendedor ativo ainda
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Relacionamento desde</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeResellers.map((reseller) => (
                      <TableRow key={reseller.id}>
                        <TableCell className="font-medium">
                          {reseller.resellerName || reseller.resellerId}
                        </TableCell>
                        <TableCell>{getStatusBadge(reseller.status)}</TableCell>
                        <TableCell>
                          {reseller.acceptedAt
                            ? format(new Date(reseller.acceptedAt), 'dd/MM/yyyy', {
                                locale: ptBR,
                              })
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedReseller(reseller);
                              setStockMirrorOpen(true);
                            }}
                          >
                            Ver Estoque
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedReseller(reseller);
                              setSendDialogOpen(true);
                            }}
                          >
                            Enviar Mercadoria
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Remessas</CardTitle>
              <CardDescription>Acompanhe todas as remessas enviadas</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTransfers ? (
                <div className="text-center py-8">Carregando...</div>
              ) : !transfers || transfers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma remessa ainda
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Revendedor</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>
                          {format(new Date(transfer.sentAt), 'dd/MM/yyyy HH:mm', {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>{transfer.resellerId}</TableCell>
                        <TableCell>{transfer.totalQuantity} un</TableCell>
                        <TableCell>R$ {transfer.totalValue.toFixed(2)}</TableCell>
                        <TableCell>{getTransferStatusBadge(transfer.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedReseller && (
        <>
          <SendMerchandiseDialog
            open={sendDialogOpen}
            onOpenChange={setSendDialogOpen}
            reseller={selectedReseller}
          />
          <ResellerStockMirrorDialog
            open={stockMirrorOpen}
            onOpenChange={setStockMirrorOpen}
            reseller={selectedReseller}
          />
        </>
      )}
    </div>
  );
}
