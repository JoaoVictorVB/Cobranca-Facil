import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Store, Bell, Shield, User } from 'lucide-react';
import { AcceptByTokenDialog } from '@/components/dashboard/AcceptByTokenDialog';
import { useToast } from '@/hooks/use-toast';
import { distributionService, BusinessRelationship } from '@/services/distribution.service';

export default function Settings() {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [suppliers, setSuppliers] = useState<BusinessRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await distributionService.getSuppliers();
      setSuppliers(data);
    } catch (error: any) {
      toast({
        title: '❌ Erro ao Carregar Fornecedores',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuccess = () => {
    loadSuppliers();
    toast({
      title: '✅ Fornecedor Conectado',
      description: 'Você agora está conectado ao fornecedor!',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
              <p className="text-muted-foreground">Gerencie suas preferências e integrações</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="suppliers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="suppliers" className="gap-2">
              <Store className="h-4 w-4" />
              Fornecedores
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Aba Fornecedores */}
          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conectar com Fornecedor</CardTitle>
                <CardDescription>
                  Use o código de convite de 6 dígitos fornecido pelo seu fornecedor para estabelecer uma conexão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => setShowAcceptDialog(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Inserir Código de Convite
                  </Button>
                  <Button
                    variant="outline"
                    onClick={loadSuppliers}
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Atualizar Lista'}
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Meus Fornecedores</h3>
                  {suppliers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Você ainda não está conectado a nenhum fornecedor</p>
                      <p className="text-sm mt-1">Solicite um código de convite ao seu fornecedor</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {suppliers.map((supplier) => (
                        <Card key={supplier.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Fornecedor ID: {supplier.supplierId.slice(0, 8)}...</p>
                                <p className="text-sm text-muted-foreground">
                                  Status: {supplier.status === 'ATIVO' ? '✅ Ativo' : '⏳ Pendente'}
                                </p>
                                {supplier.acceptedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Conectado em: {new Date(supplier.acceptedAt).toLocaleDateString('pt-BR')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como Funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Solicite um código</p>
                    <p>Peça ao seu fornecedor para gerar um código de convite de 6 dígitos</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Insira o código</p>
                    <p>Clique em "Inserir Código de Convite" e digite o código fornecido</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Comece a receber mercadorias</p>
                    <p>Após conectar, seu fornecedor poderá enviar mercadorias diretamente para você</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Perfil */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e de contato
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" placeholder="Seu nome completo" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seu@email.com" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(11) 99999-9999" disabled />
                </div>
                <p className="text-sm text-muted-foreground">
                  🚧 Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Notificações */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificação</CardTitle>
                <CardDescription>
                  Configure como você deseja ser notificado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  🚧 Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Segurança */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie suas configurações de segurança e privacidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  🚧 Funcionalidade em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AcceptByTokenDialog
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onSuccess={handleAcceptSuccess}
      />
    </div>
  );
}
