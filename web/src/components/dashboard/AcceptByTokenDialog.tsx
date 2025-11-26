import { useState } from 'react';
import { Plug, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { distributionService } from '@/services/distribution.service';

interface AcceptByTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AcceptByTokenDialog({
  open,
  onOpenChange,
  onSuccess,
}: AcceptByTokenDialogProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!token || token.length !== 6) {
      toast({
        title: '⚠️ Código Inválido',
        description: 'O código deve ter exatamente 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await distributionService.acceptByToken(token.toUpperCase());
      
      toast({
        title: '✅ Conectado com Sucesso!',
        description: 'Você agora está conectado com o fornecedor',
      });
      
      setToken('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao conectar';
      
      toast({
        title: '❌ Erro ao Conectar',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setToken(value);
  };

  const handleClose = () => {
    setToken('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-purple-600" />
            Conectar Fornecedor
          </DialogTitle>
          <DialogDescription>
            Insira o código de 6 caracteres fornecido pelo seu fornecedor
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">Código de Convite</Label>
            <Input
              id="token"
              value={token}
              onChange={handleTokenChange}
              placeholder="ABC123"
              maxLength={6}
              className="text-center text-2xl font-bold tracking-widest uppercase"
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground text-center">
              {token.length}/6 caracteres
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Como obter o código:</strong>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              O fornecedor deve gerar o código na opção "Novo Parceiro" e compartilhar com você.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAccept}
              disabled={loading || token.length !== 6}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                'Conectando...'
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Conectar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
