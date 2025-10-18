import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { MonthData } from "../../services/reports.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";

interface MonthComparisonChartProps {
  months: MonthData[];
}

export function MonthComparisonChart({ months }: MonthComparisonChartProps) {
  const chartData = months.map((month) => ({
    month: new Date(month.month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    esperado: month.totalExpected,
    recebido: month.totalReceived,
    pendente: month.totalPending,
    atrasado: month.totalOverdue,
    aproveitamento: month.receivedPercentage,
  }));

  const chartConfig = {
    esperado: {
      label: "Esperado",
      color: "hsl(var(--chart-1))",
    },
    recebido: {
      label: "Recebido",
      color: "hsl(var(--chart-2))",
    },
    pendente: {
      label: "Pendente",
      color: "hsl(var(--chart-3))",
    },
    atrasado: {
      label: "Atrasado",
      color: "hsl(var(--chart-4))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação Mensal</CardTitle>
        <CardDescription>Desempenho financeiro entre meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="flex flex-col gap-2">
                          <span className="font-semibold">{data.month}</span>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Esperado:</span>
                            <span className="font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.esperado)}</span>
                            
                            <span className="text-muted-foreground">Recebido:</span>
                            <span className="font-medium text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.recebido)}</span>
                            
                            <span className="text-muted-foreground">Pendente:</span>
                            <span className="font-medium text-yellow-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.pendente)}</span>
                            
                            <span className="text-muted-foreground">Atrasado:</span>
                            <span className="font-medium text-red-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.atrasado)}</span>
                            
                            <span className="text-muted-foreground">Aproveitamento:</span>
                            <span className="font-medium">{data.aproveitamento.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="esperado" fill="var(--color-esperado)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recebido" fill="var(--color-recebido)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendente" fill="var(--color-pendente)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atrasado" fill="var(--color-atrasado)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
