import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import tagService, { CreateTagDto, Tag, UpdateTagDto } from '@/services/tag.service';
import { Edit2, Loader2, Plus, Tags, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TagManagementDialog() {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateTagDto>({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true,
  });

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.findAll();
      setTags(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar tags',
        description: 'Não foi possível carregar as tags',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadTags();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingTag) {
        const updateData: UpdateTagDto = {
          name: formData.name,
          description: formData.description,
          color: formData.color,
          isActive: formData.isActive,
        };
        await tagService.update(editingTag.id, updateData);
        toast({
          title: 'Tag atualizada',
          description: 'Tag atualizada com sucesso',
        });
      } else {
        await tagService.create(formData);
        toast({
          title: 'Tag criada',
          description: 'Tag criada com sucesso',
        });
      }
      
      await loadTags();
      handleCloseForm();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: editingTag ? 'Erro ao atualizar tag' : 'Erro ao criar tag',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || '',
      color: tag.color || '#3B82F6',
      isActive: tag.isActive,
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTagId) return;
    
    try {
      setLoading(true);
      await tagService.delete(deleteTagId);
      toast({
        title: 'Tag excluída',
        description: 'Tag excluída com sucesso',
      });
      await loadTags();
      setDeleteTagId(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao excluir tag',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTag(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Tags className="mr-2 h-4 w-4" />
            Gerenciar Tags
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Tags</DialogTitle>
            <DialogDescription>
              Crie e gerencie tags para categorizar seus produtos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button onClick={() => setFormOpen(true)} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tag
            </Button>

            {loading && !formOpen ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {tags.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma tag cadastrada
                  </p>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Badge
                          style={{ backgroundColor: tag.color || '#3B82F6' }}
                          className="text-white"
                        >
                          {tag.name}
                        </Badge>
                        {tag.description && (
                          <span className="text-sm text-muted-foreground">
                            {tag.description}
                          </span>
                        )}
                        {!tag.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Inativa
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTagId(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Editar Tag' : 'Nova Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag
                ? 'Atualize as informações da tag'
                : 'Preencha os dados da nova tag'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Prata 925"
                required
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descrição da tag (opcional)"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">Tag ativa</Label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingTag ? 'Atualizar' : 'Criar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTagId} onOpenChange={() => setDeleteTagId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tag? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
