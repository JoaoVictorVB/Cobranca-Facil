import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: { email: 'admin@cobranca.com', password: hashedPassword, name: 'Admin' },
  });
  console.log('Admin created:', adminUser.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
