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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/client.service";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface EditClientDialogProps {
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientAddress?: string;
  clientObservation?: string;
  clientReferredBy?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditClientDialog({
  clientId,
  clientName,
  clientPhone,
  clientAddress,
  clientObservation,
  clientReferredBy,
  open,
  onOpenChange,
  onSuccess,
}: EditClientDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: clientName,
    phone: clientPhone || "",
    address: clientAddress || "",
    observation: clientObservation || "",
    referredBy: clientReferredBy || "",
  });

  useEffect(() => {
    setFormData({
      name: clientName,
      phone: clientPhone || "",
      address: clientAddress || "",
      observation: clientObservation || "",
      referredBy: clientReferredBy || "",
    });
  }, [clientName, clientPhone, clientAddress, clientObservation, clientReferredBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "O nome do cliente é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await clientService.update(clientId, {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        observation: formData.observation.trim() || undefined,
        referredBy: formData.referredBy.trim() || undefined,
      });

      toast({
        title: "✅ Cliente Atualizado",
        description: `Os dados de ${formData.name} foram atualizados com sucesso`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível atualizar o cliente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize os dados do cliente. O nome é obrigatório.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Nome *
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Endereço</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-referredBy">Indicado por</Label>
              <Input
                id="edit-referredBy"
                value={formData.referredBy}
                onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                placeholder="Quem indicou este cliente"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-observation">Observações</Label>
              <Textarea
                id="edit-observation"
                value={formData.observation}
                onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
                placeholder="Informações adicionais sobre o cliente"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
