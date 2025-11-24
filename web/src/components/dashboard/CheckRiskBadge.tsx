import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { riskAnalyticsService } from '@/services/risk-analytics.service';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Calendar, DollarSign, Loader2, Package, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface CheckRiskBadgeProps {
  resellerId: string;
  checkDate: Date;
  checkAmount: number;
}

export function CheckRiskBadge({ resellerId, checkDate, checkAmount }: CheckRiskBadgeProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ['check-risk', resellerId, checkDate.toISOString(), checkAmount],
    queryFn: () =>
      riskAnalyticsService.analyzeCheckRisk({
        resellerId,
        checkDate: checkDate.toISOString(),
        checkAmount,
      }),
    enabled: popoverOpen,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const getRiskBadgeVariant = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'BAIXO':
        return 'default';
      case 'MEDIO':
        return 'secondary';
      case 'ALTO':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskEmoji = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'BAIXO':
        return '🟢';
      case 'MEDIO':
        return '🟡';
      case 'ALTO':
        return '🔴';
      default:
        return '⚪';
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <Badge variant={assessment ? getRiskBadgeVariant(assessment.riskLevel) : 'outline'} className="cursor-pointer">
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : assessment ? (
              <>
                {getRiskEmoji(assessment.riskLevel)} {assessment.riskLevel}
              </>
            ) : (
              'Ver Risco'
            )}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Calculando risco...</span>
          </div>
        ) : assessment ? (
          <div className="space-y-4">
            <div className="flex items-start gap-2 pb-3 border-b">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <h4 className="font-semibold">Análise de Risco - Cheque</h4>
                <p className="text-sm text-muted-foreground">
                  Baseado em velocidade de vendas dos últimos 60 dias
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Dias até Vencimento
                </div>
                <div className="text-lg font-bold">{assessment.daysUntilCheck}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Valor do Cheque
                </div>
                <div className="text-lg font-bold">R$ {assessment.checkAmount.toFixed(2)}</div>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saldo Atual:</span>
                <span className="font-medium">R$ {assessment.currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Receita Projetada:
                </span>
                <span className="font-medium text-green-600">
                  +R$ {assessment.projectedRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Valor em Estoque:
                </span>
                <span className="font-medium">R$ {assessment.stockValue.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-sm font-semibold">
                <span>Fundos Disponíveis:</span>
                <span className={assessment.availableFunds >= assessment.checkAmount ? 'text-green-600' : 'text-red-600'}>
                  R$ {assessment.availableFunds.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              assessment.riskLevel === 'BAIXO'
                ? 'bg-green-50 border-green-200'
                : assessment.riskLevel === 'MEDIO'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                <div className="text-xl">{getRiskEmoji(assessment.riskLevel)}</div>
                <div className="flex-1">
                  <div className={`font-semibold ${
                    assessment.riskLevel === 'BAIXO'
                      ? 'text-green-900'
                      : assessment.riskLevel === 'MEDIO'
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }`}>
                    Risco {assessment.riskLevel}
                  </div>
                  <p className={`text-sm mt-1 ${
                    assessment.riskLevel === 'BAIXO'
                      ? 'text-green-700'
                      : assessment.riskLevel === 'MEDIO'
                      ? 'text-yellow-700'
                      : 'text-red-700'
                  }`}>
                    {assessment.recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Calculado em {format(new Date(assessment.assessedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            Erro ao calcular risco
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
