import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface MonthSelectorProps {
  selectedMonths: string[];
  onMonthsChange: (months: string[]) => void;
  onCompare: () => void;
}

export function MonthSelector({ selectedMonths, onMonthsChange, onCompare }: MonthSelectorProps) {
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  const handleAddMonth = (monthValue: string) => {
    if (!selectedMonths.includes(monthValue)) {
      const newMonths = [...selectedMonths, monthValue].sort().reverse();
      onMonthsChange(newMonths);
    }
  };

  const handleRemoveMonth = (month: string) => {
    onMonthsChange(selectedMonths.filter((m) => m !== month));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Selecionar Meses
        </CardTitle>
        <CardDescription>Adicione meses para comparar (mínimo 2)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleAddMonth}>
          <SelectTrigger className="w-full">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Adicionar mês" />
          </SelectTrigger>
          <SelectContent>
            {getMonthOptions()
              .filter(option => !selectedMonths.includes(option.value))
              .map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {selectedMonths.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meses Selecionados</span>
              <Badge variant="secondary">{selectedMonths.length}</Badge>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedMonths.map((month) => {
                const date = new Date(month + '-01');
                return (
                  <div
                    key={month}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {format(date, "MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMonth(month)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button
          onClick={onCompare}
          disabled={selectedMonths.length < 2}
          className="w-full"
        >
          {selectedMonths.length < 2 
            ? `Adicione ${2 - selectedMonths.length} mês${2 - selectedMonths.length > 1 ? 'es' : ''}`
            : `Comparar ${selectedMonths.length} Meses`
          }
        </Button>

        {selectedMonths.length > 0 && (
          <Button
            onClick={() => onMonthsChange([])}
            variant="outline"
            className="w-full"
          >
            Limpar Tudo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
