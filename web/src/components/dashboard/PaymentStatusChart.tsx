import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip } from "../ui/chart";

interface PaymentStatusChartProps {
  data: {
    status: string;
    count: number;
    totalAmount: number;
  }[];
}

const COLORS = {
  pago: '#10b981', // green
  pendente: '#f59e0b', // yellow
  atrasado: '#ef4444', // red
};

const STATUS_LABELS = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
};

export function PaymentStatusChart({ data }: PaymentStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    value: item.count,
    amount: item.totalAmount,
    fill: COLORS[item.status as keyof typeof COLORS] || '#94a3b8',
  }));

  const chartConfig = {
    value: {
      label: "Parcelas",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Pagamentos</CardTitle>
        <CardDescription>Distribuição por status</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{data.name}</span>
                          <span className="text-sm">Parcelas: {data.value}</span>
                          <span className="text-sm">
                            Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
