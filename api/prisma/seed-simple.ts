import { PaymentFrequency, PaymentStatus, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed simples do banco de dados...');

  await prisma.installment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.client.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Dados anteriores removidos');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cobrancafacil.com',
      password: adminPassword,
      name: 'Administrador',
    },
  });

  console.log('👤 Usuário admin criado:');
  console.log('   Email: admin@cobrancafacil.com');
  console.log('   Senha: admin123');

  const product1 = await prisma.product.create({
    data: {
      name: 'Notebook Dell',
      description: 'Notebook Dell Inspiron 15',
      userId: adminUser.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Smart TV 50"',
      description: 'Smart TV Samsung 4K',
      userId: adminUser.id,
    },
  });

  console.log('📦 2 produtos criados');

  const client1 = await prisma.client.create({
    data: {
      userId: adminUser.id,
      name: 'João Silva',
      phone: '(11) 98765-4321',
      referredBy: 'Maria Santos',
      observation: 'Cliente teste',
      address: 'São Paulo/SP',
    },
  });

  const sale1 = await prisma.sale.create({
    data: {
      userId: adminUser.id,
      clientId: client1.id,
      itemDescription: product1.name,
      totalValue: 3000,
      totalInstallments: 6,
      paymentFrequency: PaymentFrequency.mensal,
      firstDueDate: new Date('2025-01-15'),
      totalPaid: 1000,
      saleDate: new Date('2024-12-01'),
    },
  });

  const installmentValue = 500;
  const installments: {
    saleId: string;
    installmentNumber: number;
    amount: number;
    dueDate: Date;
    status: PaymentStatus;
    paidDate: Date | null;
    paidAmount: number | null;
  }[] = [];

  for (let i = 1; i <= 6; i++) {
    const dueDate = new Date('2025-01-15');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    const isPaid = i <= 2;
    const isOverdue = i === 3;

    installments.push({
      saleId: sale1.id,
      installmentNumber: i,
      amount: installmentValue,
      dueDate,
      status: isPaid
        ? PaymentStatus.pago
        : isOverdue
          ? PaymentStatus.atrasado
          : PaymentStatus.pendente,
      paidDate: isPaid ? new Date(dueDate.getTime() - 86400000) : null,
      paidAmount: isPaid ? installmentValue : null,
    });
  }

  await prisma.installment.createMany({ data: installments });

  console.log('💰 1 cliente e 1 venda criados (6 parcelas: 2 pagas, 1 atrasada, 3 pendentes)');
  console.log('✅ Seed completo!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
