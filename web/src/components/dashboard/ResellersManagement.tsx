import { useState, useEffect } from 'react';
import { Users, Plus, Package, Eye, Send, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { distributionService, BusinessRelationship } from '@/services/distribution.service';
import { GenerateInviteTokenDialog } from './GenerateInviteTokenDialog';
import { ResellerInventoryDialog } from './ResellerInventoryDialog';
import { SendMerchandiseDialog } from './SendMerchandiseDialog';
import { formatDate } from '@/lib/utils';

export function ResellersManagement() {
  const [resellers, setResellers] = useState<BusinessRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedResellerId, setSelectedResellerId] = useState<string>('');
  const [showInventoryDialog, setShowInventoryDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const { toast } = useToast();

  const loadResellers = async () => {
    try {
      console.log('🔄 Loading resellers...');
      setLoading(true);
      setError(null);
      const data = await distributionService.getResellers();
      console.log('✅ Resellers loaded:', data);
      setResellers(data);
    } catch (error: any) {
      console.error('❌ Error loading resellers:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Erro ao carregar revendedores';
      setError(errorMessage);
      toast({
        title: '❌ Erro ao Carregar Revendedores',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResellers();
  }, []);

  const handleViewInventory = (resellerId: string) => {
    console.log('👁️ Opening inventory for reseller:', resellerId);
    setSelectedResellerId(resellerId);
    setShowInventoryDialog(true);
  };

  const handleSendMerchandise = (resellerId: string) => {
    console.log('📦 Opening send merchandise for reseller:', resellerId);
    setSelectedResellerId(resellerId);
    setShowSendDialog(true);
  };

  const getStatusBadge = (status: BusinessRelationship['status']) => {
    const variants = {
      ATIVO: 'default',
      PENDENTE: 'secondary',
      INATIVO: 'outline',
    } as const;

    const colors = {
      ATIVO: 'bg-green-500',
      PENDENTE: 'bg-yellow-500',
      INATIVO: 'bg-gray-500',
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Meus Revendedores
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Gerencie seus parceiros e acompanhe o estoque deles
          </p>
        </div>
        <Button
          onClick={() => setShowInviteDialog(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Parceiro
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Parceiros</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellers.length}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resellers.filter((r) => r.status === 'ATIVO').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {resellers.filter((r) => r.status === 'PENDENTE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Parceiros Conectados</CardTitle>
          <CardDescription>
            Visualize e gerencie seus revendedores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span>Carregando revendedores...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">⚠️ Erro ao Carregar</div>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                onClick={loadResellers}
                variant="outline"
              >
                🔄 Tentar Novamente
              </Button>
            </div>
          ) : resellers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum revendedor conectado ainda
              </p>
              <Button
                onClick={() => setShowInviteDialog(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Parceiro
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Revendedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conectado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resellers.map((reseller) => (
                  <TableRow key={reseller.id}>
                    <TableCell className="font-medium">
                      {reseller.resellerName || `ID: ${reseller.resellerId.slice(0, 8)}...`}
                    </TableCell>
                    <TableCell>{getStatusBadge(reseller.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {reseller.acceptedAt
                        ? formatDate(new Date(reseller.acceptedAt))
                        : formatDate(new Date(reseller.createdAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {reseller.status === 'ATIVO' && reseller.resellerId && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewInventory(reseller.resellerId!)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Estoque
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSendMerchandise(reseller.resellerId!)}
                              className="bg-gradient-to-r from-purple-600 to-blue-600"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Enviar
                            </Button>
                          </>
                        )}
                        {reseller.status === 'PENDENTE' && (
                          <Badge variant="secondary">Aguardando Aceite</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <GenerateInviteTokenDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
      />
      
      <ResellerInventoryDialog
        open={showInventoryDialog}
        onOpenChange={setShowInventoryDialog}
        resellerId={selectedResellerId}
      />
      <SendMerchandiseDialog
        open={showSendDialog}
        onOpenChange={setShowSendDialog}
        resellerId={selectedResellerId}
        onSuccess={loadResellers}
      />
    </div>
  );
}
