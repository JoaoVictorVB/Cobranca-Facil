import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import tagService, { Tag } from '@/services/tag.service';
import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  disabled?: boolean;
}

export function TagSelector({ selectedTagIds, onChange, disabled }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3B82F6');
  const { toast } = useToast();

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.findAll();
      // Filter only active tags
      setTags(data.filter((tag) => tag.isActive));
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
    loadTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleTag = (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);
    if (isSelected) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Nome obrigatório',
        description: 'Digite um nome para a tag',
      });
      return;
    }

    try {
      setCreatingTag(true);
      const newTag = await tagService.create({
        name: newTagName.trim(),
        color: newTagColor,
        isActive: true,
      });
      
      toast({
        title: 'Tag criada',
        description: `Tag "${newTag.name}" criada com sucesso`,
      });
      
      // Adicionar à lista e selecionar automaticamente
      setTags([...tags, newTag]);
      onChange([...selectedTagIds, newTag.id]);
      
      // Resetar e fechar
      setNewTagName('');
      setNewTagColor('#3B82F6');
      setCreateDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar tag',
        description: 'Não foi possível criar a tag',
      });
    } finally {
      setCreatingTag(false);
    }
  };

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="text-muted-foreground">
              {selectedTags.length === 0
                ? 'Selecione as tags'
                : `${selectedTags.length} tag(s) selecionada(s)`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar tags..." />
            <CommandEmpty>
              {loading ? 'Carregando...' : 'Nenhuma tag encontrada'}
            </CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleToggleTag(tag.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <Check className="h-3 w-3" />
                      </div>
                      <Badge
                        style={{ backgroundColor: tag.color || '#3B82F6' }}
                        className="text-white text-xs"
                      >
                        {tag.name}
                      </Badge>
                      {tag.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {tag.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  setCreateDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar nova tag
              </Button>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              style={{ backgroundColor: tag.color || '#3B82F6' }}
              className="text-white pr-1"
            >
              {tag.name}
              <button
                type="button"
                onClick={(e) => handleRemoveTag(tag.id, e)}
                disabled={disabled}
                className="ml-1 rounded-full hover:bg-white/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Quick Create Tag Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Tag</DialogTitle>
            <DialogDescription>
              Crie uma tag rapidamente para usar no produto
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">Nome da Tag *</Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Ex: Prata 925"
                maxLength={50}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTag();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagColor">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="tagColor"
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={creatingTag}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateTag} disabled={creatingTag}>
              {creatingTag && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar e Usar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
