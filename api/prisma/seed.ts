import { PaymentFrequency, PaymentStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.installment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();

  console.log('🗑️  Dados anteriores removidos');

  // Criar produtos
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Notebook Dell',
        description: 'Notebook Dell Inspiron 15, i5, 8GB RAM',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smart TV 50"',
        description: 'Smart TV Samsung 50 polegadas 4K',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Smartphone Samsung',
        description: 'Samsung Galaxy A54 128GB',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Geladeira Frost Free',
        description: 'Geladeira Brastemp 400L',
      },
    }),
  ]);

  console.log('📦 Produtos criados');

  // Função auxiliar para criar data de vencimento
  const createDueDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date;
  };

  // Função auxiliar para criar parcelas
  const generateInstallments = (
    saleId: string,
    totalValue: number,
    totalInstallments: number,
    startDaysOffset: number,
    frequencyDays: number,
    paidCount: number = 0,
  ) => {
    const installmentValue = totalValue / totalInstallments;
    const installments: Array<{
      saleId: string;
      installmentNumber: number;
      amount: number;
      dueDate: Date;
      status: PaymentStatus;
      paidDate: Date | null;
      paidAmount: number | null;
    }> = [];

    for (let i = 1; i <= totalInstallments; i++) {
      const daysOffset = startDaysOffset + (i - 1) * frequencyDays;
      const dueDate = createDueDate(daysOffset);
      const isPaid = i <= paidCount;
      const today = new Date();
      const isOverdue = !isPaid && dueDate < today;

      installments.push({
        saleId,
        installmentNumber: i,
        amount: installmentValue,
        dueDate,
        status: isPaid
          ? PaymentStatus.pago
          : isOverdue
          ? PaymentStatus.atrasado
          : PaymentStatus.pendente,
        paidDate: isPaid ? new Date(dueDate.getTime() - 86400000) : null, // 1 dia antes
        paidAmount: isPaid ? installmentValue : null,
      });
    }

    return installments;
  };

  // Cliente 1: João Silva (COM PARCELAS ATRASADAS)
  const client1 = await prisma.client.create({
    data: {
      name: 'João Silva',
      phone: '(11) 98765-4321',
      referredBy: 'Maria Santos',
      observation: 'Cliente antigo, sempre paga com alguns dias de atraso',
      address: 'Rua das Flores, 123 - São Paulo/SP',
    },
  });

  const sale1 = await prisma.sale.create({
    data: {
      clientId: client1.id,
      itemDescription: products[0].name,
      totalValue: 3000,
      totalInstallments: 10,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-11-05T00:00:00'),
      totalPaid: 900,
      saleDate: new Date('2024-10-01'),
    },
  });

  // Parcelas: 3 pagas, 2 atrasadas, 5 pendentes futuras
  await prisma.installment.createMany({
    data: generateInstallments(sale1.id, 3000, 10, -90, 30, 3),
  });

  // Cliente 2: Maria Oliveira (PAGAMENTOS EM DIA)
  const client2 = await prisma.client.create({
    data: {
      name: 'Maria Oliveira',
      phone: '(21) 99876-5432',
      referredBy: 'Pedro Costa',
      observation: 'Excelente pagadora, nunca atrasa',
      address: 'Av. Paulista, 1000 - São Paulo/SP',
    },
  });

  const sale2 = await prisma.sale.create({
    data: {
      clientId: client2.id,
      itemDescription: products[1].name,
      totalValue: 2400,
      totalInstallments: 12,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-10-15T00:00:00'),
      totalPaid: 1200,
      saleDate: new Date('2024-09-15'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale2.id, 2400, 12, -63, 30, 6),
  });

  // Cliente 3: Pedro Santos (QUINZENAL - ALGUNS ATRASADOS)
  const client3 = await prisma.client.create({
    data: {
      name: 'Pedro Santos',
      phone: '(31) 97654-3210',
      referredBy: null,
      observation: 'Trabalha como autônomo, preferiu parcelamento quinzenal',
      address: 'Rua Minas Gerais, 456 - Belo Horizonte/MG',
    },
  });

  const sale3 = await prisma.sale.create({
    data: {
      clientId: client3.id,
      itemDescription: products[2].name,
      totalValue: 1500,
      totalInstallments: 8,
      paymentFrequency: PaymentFrequency.quinzenal,
      firstDueDate: new Date('2024-09-10T00:00:00'),
      totalPaid: 562.5,
      saleDate: new Date('2024-08-10'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale3.id, 1500, 8, -69, 15, 3),
  });

  // Cliente 4: Ana Costa (TUDO PAGO)
  const client4 = await prisma.client.create({
    data: {
      name: 'Ana Costa',
      phone: '(41) 96543-2109',
      referredBy: 'João Silva',
      observation: 'Quitou tudo antecipadamente com desconto',
      address: 'Rua Curitiba, 789 - Curitiba/PR',
    },
  });

  const sale4 = await prisma.sale.create({
    data: {
      clientId: client4.id,
      itemDescription: products[3].name,
      totalValue: 2000,
      totalInstallments: 6,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-08-20T00:00:00'),
      totalPaid: 2000,
      saleDate: new Date('2024-07-20'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale4.id, 2000, 6, -89, 30, 6),
  });

  // Cliente 5: Carlos Mendes (MUITO ATRASADO)
  const client5 = await prisma.client.create({
    data: {
      name: 'Carlos Mendes',
      phone: '(51) 95432-1098',
      referredBy: null,
      observation: 'ATENÇÃO: Múltiplas parcelas em atraso, tentar contato urgente',
      address: 'Av. Brasil, 2000 - Porto Alegre/RS',
    },
  });

  const sale5 = await prisma.sale.create({
    data: {
      clientId: client5.id,
      itemDescription: 'Máquina de Lavar',
      totalValue: 1800,
      totalInstallments: 9,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-07-25T00:00:00'),
      totalPaid: 0,
      saleDate: new Date('2024-06-25'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale5.id, 1800, 9, -144, 30, 0),
  });

  // Cliente 6: Juliana Lima (VENCIMENTOS PRÓXIMOS)
  const client6 = await prisma.client.create({
    data: {
      name: 'Juliana Lima',
      phone: '(85) 94321-0987',
      referredBy: 'Ana Costa',
      observation: 'Cliente nova, aguardar comportamento de pagamento',
      address: 'Rua Fortaleza, 321 - Fortaleza/CE',
    },
  });

  const sale6 = await prisma.sale.create({
    data: {
      clientId: client6.id,
      itemDescription: 'Ar Condicionado',
      totalValue: 2500,
      totalInstallments: 10,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-11-18T00:00:00'),
      totalPaid: 0,
      saleDate: new Date(),
    },
  });

  // Parcelas começam hoje e nos próximos meses
  await prisma.installment.createMany({
    data: generateInstallments(sale6.id, 2500, 10, 0, 30, 0),
  });

  // Cliente 7: Roberto Alves (QUINZENAL EM DIA)
  const client7 = await prisma.client.create({
    data: {
      name: 'Roberto Alves',
      phone: '(71) 93210-9876',
      referredBy: 'Maria Oliveira',
      observation: 'Pagamento quinzenal sempre pontual',
      address: 'Rua Salvador, 654 - Salvador/BA',
    },
  });

  const sale7 = await prisma.sale.create({
    data: {
      clientId: client7.id,
      itemDescription: 'Fogão 5 Bocas',
      totalValue: 1200,
      totalInstallments: 6,
      paymentFrequency: PaymentFrequency.quinzenal,
      firstDueDate: new Date('2024-09-20T00:00:00'),
      totalPaid: 600,
      saleDate: new Date('2024-09-05'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale7.id, 1200, 6, -43, 15, 3),
  });

  // Cliente 8: Fernanda Rocha (VÁRIOS PRODUTOS)
  const client8 = await prisma.client.create({
    data: {
      name: 'Fernanda Rocha',
      phone: '(81) 92109-8765',
      referredBy: null,
      observation: 'Cliente VIP, comprou vários produtos',
      address: 'Av. Recife, 987 - Recife/PE',
    },
  });

  // Primeira venda
  const sale8a = await prisma.sale.create({
    data: {
      clientId: client8.id,
      itemDescription: products[0].name,
      totalValue: 3500,
      totalInstallments: 12,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-09-10T00:00:00'),
      totalPaid: 1750,
      saleDate: new Date('2024-08-10'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale8a.id, 3500, 12, -69, 30, 6),
  });

  // Segunda venda
  const sale8b = await prisma.sale.create({
    data: {
      clientId: client8.id,
      itemDescription: products[1].name,
      totalValue: 2000,
      totalInstallments: 8,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2024-10-10T00:00:00'),
      totalPaid: 750,
      saleDate: new Date('2024-09-10'),
    },
  });

  await prisma.installment.createMany({
    data: generateInstallments(sale8b.id, 2000, 8, -39, 30, 3),
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`- 8 clientes criados`);
  console.log(`- 9 vendas criadas`);
  console.log(`- ${products.length} produtos criados`);
  console.log('\n🎯 Cenários de teste:');
  console.log('✓ Cliente com parcelas atrasadas (João Silva)');
  console.log('✓ Cliente pagando em dia (Maria Oliveira)');
  console.log('✓ Cliente quinzenal com atrasos (Pedro Santos)');
  console.log('✓ Cliente com tudo pago (Ana Costa)');
  console.log('✓ Cliente muito atrasado (Carlos Mendes)');
  console.log('✓ Cliente novo com vencimentos próximos (Juliana Lima)');
  console.log('✓ Cliente quinzenal em dia (Roberto Alves)');
  console.log('✓ Cliente com múltiplas compras (Fernanda Rocha)');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
