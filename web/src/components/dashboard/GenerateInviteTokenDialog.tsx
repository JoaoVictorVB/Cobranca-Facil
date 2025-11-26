import { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { distributionService } from '@/services/distribution.service';

interface GenerateInviteTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateInviteTokenDialog({
  open,
  onOpenChange,
}: GenerateInviteTokenDialogProps) {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const relationship = await distributionService.generateInviteToken();
      
      if (relationship.inviteToken) {
        setToken(relationship.inviteToken);
        toast({
          title: '✅ Código Gerado',
          description: 'Compartilhe este código com seu revendedor',
        });
      }
    } catch (error: any) {
      toast({
        title: '❌ Erro ao Gerar Código',
        description: error.response?.data?.message || 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    toast({
      title: '📋 Copiado!',
      description: 'Código copiado para a área de transferência',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setToken('');
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            Novo Parceiro
          </DialogTitle>
          <DialogDescription>
            Gere um código de convite para conectar um revendedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!token ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ao clicar em "Gerar Código", um código único de 6 caracteres será criado.
                Compartilhe este código com seu revendedor para estabelecer a conexão.
              </p>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? 'Gerando...' : '✨ Gerar Código'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  Código de Convite
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold tracking-widest text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                    {token}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    className="hover:bg-purple-100 dark:hover:bg-purple-900"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5 text-purple-600" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>📌 Instruções:</strong>
                </p>
                <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-decimal list-inside">
                  <li>Compartilhe este código com seu revendedor</li>
                  <li>Ele deve acessar "Configurações {'>'} Fornecedores"</li>
                  <li>Inserir o código e clicar em "Conectar"</li>
                </ol>
              </div>

              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
