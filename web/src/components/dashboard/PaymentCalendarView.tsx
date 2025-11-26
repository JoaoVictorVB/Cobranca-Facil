import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Installment, installmentService, PaymentStatus } from "@/services/installment.service";
import { format } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

interface CalendarDay {
  date: Date;
  installments: Installment[];
}

interface PaymentCalendarProps {
  onDateClick?: (date: string) => void;
  selectedDate?: string;
  onClearFilter?: () => void;
}

export const PaymentCalendar = ({ onDateClick, selectedDate, onClearFilter }: PaymentCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInstallments = useCallback(async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const monthInstallments = await installmentService.getByMonth(year, month);
      
      setInstallments(monthInstallments);
    } catch (error) {
      console.error("Error loading installments:", error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    loadInstallments();
  }, [loadInstallments]);

  const getLocalDateParts = (dateString: string) => {
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-').map(Number);
    return { year, month: month - 1, day };
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: new Date(year, month, -startingDayOfWeek + i + 1),
        installments: [],
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      const dayInstallments = installments.filter((inst) => {
        const dueDateParts = getLocalDateParts(inst.dueDate);
        const matchDueDate = (
          dueDateParts.day === day &&
          dueDateParts.month === month &&
          dueDateParts.year === year
        );
        
        let matchPaidDate = false;
        if (inst.paidDate) {
          const paidDateParts = getLocalDateParts(inst.paidDate);
          matchPaidDate = (
            paidDateParts.day === day &&
            paidDateParts.month === month &&
            paidDateParts.year === year
          );
        }
        
        const match = matchDueDate || matchPaidDate;
        
        return match;
      });

      days.push({
        date: currentDay,
        installments: dayInstallments,
      });
    }

    return days;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTotalForDay = (dayInstallments: Installment[]) => {
    return dayInstallments.reduce((sum, inst) => sum + inst.amount, 0);
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAGO:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case PaymentStatus.ATRASADO:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendário de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <TooltipProvider delayDuration={200}>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>Calendário de Pagamentos</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">
                  <strong>Visualize os vencimentos mensais.</strong><br/>
                  🟢 Verde = Paga | 🔴 Vermelho = Atrasada | 🔵 Azul = A vencer<br/>
                  Clique em um dia para filtrar os clientes
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={currentDate.toISOString()}
            onValueChange={(value) => setCurrentDate(new Date(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue>{formatMonthYear(currentDate)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date(currentDate.getFullYear(), i, 1);
                return (
                  <SelectItem key={i} value={date.toISOString()}>
                    {formatMonthYear(date)}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          Visualize todas as parcelas com vencimento próximo
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Indicador de data selecionada */}
        {selectedDate && (
          <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                <span>
                  📅 Filtrado por: {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Vá para a aba "Clientes" para ver os resultados filtrados
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClearFilter?.();
                }}
              >
                Limpar
              </Button>
            </div>
          </div>
        )}

        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold capitalize">
            {formatMonthYear(currentDate)}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7 gap-2">
          {/* Dias da semana */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-sm text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Dias do mês */}
          {days.map((day, index) => {
            const isCurrentMonth = day.date.getMonth() === currentDate.getMonth();
            const isToday =
              day.date.toDateString() === new Date().toDateString();
            const hasInstallments = day.installments.length > 0;
            const totalAmount = getTotalForDay(day.installments);
            
            const dayString = format(day.date, 'yyyy-MM-dd');
            const isSelectedDate = selectedDate === dayString;

            return (
              <div
                key={index}
                onClick={() => {
                  if (hasInstallments && onDateClick) {
                    onDateClick(format(day.date, 'yyyy-MM-dd'));
                  }
                }}
                className={`
                  min-h-[100px] border rounded-lg p-2 transition-colors
                  ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                  ${hasInstallments ? 'hover:bg-muted/50 cursor-pointer' : ''}
                  ${isSelectedDate ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                </div>

                {hasInstallments && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {day.installments.length} parcela(s)
                    </div>
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Pago</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full ring-2 ring-primary"></div>
            <span>Hoje</span>
          </div>
        </div>
      </CardContent>
      </TooltipProvider>
    </Card>
  );
};
