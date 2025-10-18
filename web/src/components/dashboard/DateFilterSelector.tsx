import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface DateFilterSelectorProps {
  onApply: (startDate: string, endDate: string) => void;
  onClear: () => void;
}

export function DateFilterSelector({ onApply, onClear }: DateFilterSelectorProps) {
  const [filterType, setFilterType] = useState<"custom" | "month" | "quarter">("custom");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>();
  const [selectedQuarter, setSelectedQuarter] = useState("");

  const handleApply = () => {
    if (filterType === "custom" && startDate && endDate) {
      onApply(
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
    } else if (filterType === "month" && selectedMonth) {
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1;
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const end = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
      onApply(start, end);
    } else if (filterType === "quarter" && selectedQuarter) {
      const [year, quarter] = selectedQuarter.split('-Q');
      const quarterStart = (parseInt(quarter) - 1) * 3 + 1;
      const start = `${year}-${String(quarterStart).padStart(2, '0')}-01`;
      const endMonth = quarterStart + 2;
      const lastDay = new Date(parseInt(year), endMonth, 0).getDate();
      const end = `${year}-${String(endMonth).padStart(2, '0')}-${lastDay}`;
      onApply(start, end);
    }
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedMonth(undefined);
    setSelectedQuarter("");
    onClear();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Filtrar por Período
        </CardTitle>
        <CardDescription>Escolha um intervalo de datas para análise</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tipo de Filtro</Label>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as "custom" | "month" | "quarter")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Personalizado</SelectItem>
              <SelectItem value="month">Mês Específico</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filterType === "custom" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="right">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left font-normal"
                    disabled={!startDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="right">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {filterType === "month" && (
          <div className="space-y-2">
            <Label>Selecione o Mês</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth 
                    ? format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })
                    : "Selecione um mês"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="right">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={setSelectedMonth}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {filterType === "quarter" && (
          <div className="space-y-2">
            <Label htmlFor="quarter">Selecione o Trimestre</Label>
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um trimestre" />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025].map((year) =>
                  [1, 2, 3, 4].map((quarter) => (
                    <SelectItem key={`${year}-Q${quarter}`} value={`${year}-Q${quarter}`}>
                      {year} - Q{quarter} ({['Jan-Mar', 'Abr-Jun', 'Jul-Set', 'Out-Dez'][quarter - 1]})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">
            Aplicar Filtro
          </Button>
          <Button onClick={handleClear} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
