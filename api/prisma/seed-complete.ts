import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting complete seed...');

  // Limpar dados existentes
  console.log('🧹 Cleaning existing data...');
  await prisma.stockMovement.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@cobranca.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'vendedor@cobranca.com',
      password: await bcrypt.hash('vendedor123', 10),
      name: 'João Vendedor',
    },
  });

  console.log('✅ Users created:', adminUser.email, user2.email);

  // Criar categorias principais
  console.log('📁 Creating categories...');

  const electronicsCategory = await prisma.category.create({
    data: {
      name: 'Eletrônicos',
      description: 'Produtos eletrônicos diversos',
      userId: adminUser.id,
      order: 0,
      isActive: true,
    },
  });

  const furnitureCategory = await prisma.category.create({
    data: {
      name: 'Móveis',
      description: 'Móveis para casa e escritório',
      userId: adminUser.id,
      order: 1,
      isActive: true,
    },
  });

  const clothingCategory = await prisma.category.create({
    data: {
      name: 'Vestuário',
      description: 'Roupas e acessórios',
      userId: adminUser.id,
      order: 2,
      isActive: true,
    },
  });

  const homeCategory = await prisma.category.create({
    data: {
      name: 'Casa e Decoração',
      description: 'Itens para decoração e utilidades domésticas',
      userId: adminUser.id,
      order: 3,
      isActive: true,
    },
  });

  const sportsCategory = await prisma.category.create({
    data: {
      name: 'Esportes',
      description: 'Equipamentos e roupas esportivas',
      userId: adminUser.id,
      order: 4,
      isActive: true,
    },
  });

  // Criar subcategorias de Eletrônicos
  const computersSubcat = await prisma.category.create({
    data: {
      name: 'Computadores',
      description: 'Notebooks, desktops e acessórios',
      parentId: electronicsCategory.id,
      userId: adminUser.id,
      order: 0,
      isActive: true,
    },
  });

  const phonesSubcat = await prisma.category.create({
    data: {
      name: 'Celulares',
      description: 'Smartphones e acessórios',
      parentId: electronicsCategory.id,
      userId: adminUser.id,
      order: 1,
      isActive: true,
    },
  });

  const tvSubcat = await prisma.category.create({
    data: {
      name: 'TVs e Audio',
      description: 'Televisores, caixas de som e fones',
      parentId: electronicsCategory.id,
      userId: adminUser.id,
      order: 2,
      isActive: true,
    },
  });

  // Criar subcategorias de Móveis
  const bedroomSubcat = await prisma.category.create({
    data: {
      name: 'Quarto',
      description: 'Camas, guarda-roupas, cômodas',
      parentId: furnitureCategory.id,
      userId: adminUser.id,
      order: 0,
      isActive: true,
    },
  });

  const livingRoomSubcat = await prisma.category.create({
    data: {
      name: 'Sala',
      description: 'Sofás, mesas, estantes',
      parentId: furnitureCategory.id,
      userId: adminUser.id,
      order: 1,
      isActive: true,
    },
  });

  const officeSubcat = await prisma.category.create({
    data: {
      name: 'Escritório',
      description: 'Mesas, cadeiras e armários para escritório',
      parentId: furnitureCategory.id,
      userId: adminUser.id,
      order: 2,
      isActive: true,
    },
  });

  // Criar subcategorias de Vestuário
  const mensClothingSubcat = await prisma.category.create({
    data: {
      name: 'Masculino',
      description: 'Roupas masculinas',
      parentId: clothingCategory.id,
      userId: adminUser.id,
      order: 0,
      isActive: true,
    },
  });

  const womensClothingSubcat = await prisma.category.create({
    data: {
      name: 'Feminino',
      description: 'Roupas femininas',
      parentId: clothingCategory.id,
      userId: adminUser.id,
      order: 1,
      isActive: true,
    },
  });

  const shoesSubcat = await prisma.category.create({
    data: {
      name: 'Calçados',
      description: 'Sapatos, tênis e sandálias',
      parentId: clothingCategory.id,
      userId: adminUser.id,
      order: 2,
      isActive: true,
    },
  });

  console.log('✅ Categories created: 5 main + 9 subcategories');

  // Criar produtos variados
  console.log('📦 Creating products...');

  // Produtos de Eletrônicos - Computadores
  const notebook1 = await prisma.product.create({
    data: {
      name: 'Notebook Dell Inspiron 15',
      description: 'Intel Core i7, 16GB RAM, 512GB SSD, Tela 15.6"',
      sku: 'NOT-DELL-001',
      categoryId: computersSubcat.id,
      costPrice: 2800.0,
      salePrice: 3999.0,
      stock: 5,
      minStock: 2,
      maxStock: 15,
      unit: 'un',
      barcode: '7891234567890',
      location: 'Prateleira A1',
      supplier: 'Dell Brasil',
      notes: 'Produto com alta demanda',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const notebook2 = await prisma.product.create({
    data: {
      name: 'Notebook Lenovo IdeaPad',
      description: 'AMD Ryzen 5, 8GB RAM, 256GB SSD, Tela 14"',
      sku: 'NOT-LEN-002',
      categoryId: computersSubcat.id,
      costPrice: 1800.0,
      salePrice: 2599.0,
      stock: 8,
      minStock: 3,
      maxStock: 20,
      unit: 'un',
      barcode: '7891234567891',
      location: 'Prateleira A1',
      supplier: 'Lenovo Distribuidora',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: 'Mouse Logitech MX Master 3',
      description: 'Mouse sem fio ergonômico, 7 botões programáveis',
      sku: 'MOU-LOG-003',
      categoryId: computersSubcat.id,
      costPrice: 180.0,
      salePrice: 349.9,
      stock: 25,
      minStock: 10,
      maxStock: 50,
      unit: 'un',
      barcode: '7891234567892',
      location: 'Prateleira A2',
      supplier: 'Logitech Brasil',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Eletrônicos - Celulares
  const phone1 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S23',
      description: '128GB, 8GB RAM, Câmera 50MP, Tela 6.1"',
      sku: 'CEL-SAM-004',
      categoryId: phonesSubcat.id,
      costPrice: 2200.0,
      salePrice: 3299.0,
      stock: 12,
      minStock: 5,
      maxStock: 25,
      unit: 'un',
      barcode: '7891234567893',
      location: 'Vitrine 1',
      supplier: 'Samsung Brasil',
      notes: 'Lançamento recente',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const phone2 = await prisma.product.create({
    data: {
      name: 'iPhone 14',
      description: '256GB, Câmera 12MP, Tela 6.1"',
      sku: 'CEL-APP-005',
      categoryId: phonesSubcat.id,
      costPrice: 3500.0,
      salePrice: 4999.0,
      stock: 1,
      minStock: 3,
      maxStock: 10,
      unit: 'un',
      barcode: '7891234567894',
      location: 'Vitrine 1',
      supplier: 'Apple Store Brasil',
      notes: 'Estoque baixo - reabastecer urgente',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Eletrônicos - TV e Audio
  const tv = await prisma.product.create({
    data: {
      name: 'Smart TV LG 55" 4K',
      description: 'TV LED 55 polegadas, 4K UHD, WebOS',
      sku: 'TV-LG-006',
      categoryId: tvSubcat.id,
      costPrice: 1600.0,
      salePrice: 2399.0,
      stock: 6,
      minStock: 2,
      maxStock: 12,
      unit: 'un',
      barcode: '7891234567895',
      location: 'Depósito B1',
      supplier: 'LG Electronics',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const soundbar = await prisma.product.create({
    data: {
      name: 'Soundbar Sony HT-S400',
      description: 'Soundbar 2.1 canais, 330W, Subwoofer sem fio',
      sku: 'SND-SON-007',
      categoryId: tvSubcat.id,
      costPrice: 600.0,
      salePrice: 999.0,
      stock: 15,
      minStock: 5,
      maxStock: 30,
      unit: 'un',
      barcode: '7891234567896',
      location: 'Prateleira C1',
      supplier: 'Sony Brasil',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Móveis - Quarto
  const bed = await prisma.product.create({
    data: {
      name: 'Cama Box Casal Premium',
      description: 'Cama box casal com colchão de molas ensacadas',
      sku: 'MOV-CAM-008',
      categoryId: bedroomSubcat.id,
      costPrice: 1200.0,
      salePrice: 1899.0,
      stock: 4,
      minStock: 2,
      maxStock: 8,
      unit: 'un',
      location: 'Depósito D1',
      supplier: 'Móveis Ideal',
      notes: 'Produto volumoso - verificar estoque antes da venda',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const wardrobe = await prisma.product.create({
    data: {
      name: 'Guarda-Roupa 6 Portas',
      description: 'Guarda-roupa 6 portas com espelho, cor branco',
      sku: 'MOV-GUA-009',
      categoryId: bedroomSubcat.id,
      costPrice: 800.0,
      salePrice: 1299.0,
      stock: 3,
      minStock: 1,
      maxStock: 6,
      unit: 'un',
      location: 'Depósito D1',
      supplier: 'Móveis Ideal',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Móveis - Sala
  const sofa = await prisma.product.create({
    data: {
      name: 'Sofá Retrátil 3 Lugares',
      description: 'Sofá retrátil e reclinável, tecido suede, cor cinza',
      sku: 'MOV-SOF-010',
      categoryId: livingRoomSubcat.id,
      costPrice: 1400.0,
      salePrice: 2199.0,
      stock: 2,
      minStock: 1,
      maxStock: 5,
      unit: 'un',
      location: 'Showroom',
      supplier: 'Estofados Premium',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const coffeeTable = await prisma.product.create({
    data: {
      name: 'Mesa de Centro Moderna',
      description: 'Mesa de centro madeira e vidro, 90x50cm',
      sku: 'MOV-MES-011',
      categoryId: livingRoomSubcat.id,
      costPrice: 250.0,
      salePrice: 449.0,
      stock: 10,
      minStock: 3,
      maxStock: 15,
      unit: 'un',
      location: 'Depósito D2',
      supplier: 'Móveis Modernos Ltda',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Móveis - Escritório
  const officeChair = await prisma.product.create({
    data: {
      name: 'Cadeira Gamer RGB',
      description: 'Cadeira gamer ergonômica com LED RGB, ajuste de altura',
      sku: 'MOV-CAD-012',
      categoryId: officeSubcat.id,
      costPrice: 450.0,
      salePrice: 799.0,
      stock: 18,
      minStock: 8,
      maxStock: 30,
      unit: 'un',
      barcode: '7891234567897',
      location: 'Prateleira E1',
      supplier: 'Ergonomic Plus',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const desk = await prisma.product.create({
    data: {
      name: 'Mesa Escrivaninha 120cm',
      description: 'Mesa para escritório/home office, 120x60cm',
      sku: 'MOV-ESC-013',
      categoryId: officeSubcat.id,
      costPrice: 300.0,
      salePrice: 549.0,
      stock: 7,
      minStock: 3,
      maxStock: 12,
      unit: 'un',
      location: 'Depósito D2',
      supplier: 'Móveis Modernos Ltda',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Vestuário - Masculino
  const mensTshirt = await prisma.product.create({
    data: {
      name: 'Camiseta Básica Masculina',
      description: 'Camiseta 100% algodão, diversas cores',
      sku: 'VES-CAM-014',
      categoryId: mensClothingSubcat.id,
      costPrice: 15.0,
      salePrice: 39.9,
      stock: 50,
      minStock: 20,
      maxStock: 100,
      unit: 'un',
      location: 'Prateleira F1',
      supplier: 'Confecções Alfa',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const mensJeans = await prisma.product.create({
    data: {
      name: 'Calça Jeans Masculina Slim',
      description: 'Calça jeans slim fit, diversos tamanhos',
      sku: 'VES-CAL-015',
      categoryId: mensClothingSubcat.id,
      costPrice: 45.0,
      salePrice: 129.9,
      stock: 35,
      minStock: 15,
      maxStock: 60,
      unit: 'un',
      location: 'Prateleira F2',
      supplier: 'Jeans & Co',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Vestuário - Feminino
  const womensDress = await prisma.product.create({
    data: {
      name: 'Vestido Floral Feminino',
      description: 'Vestido midi estampado, tecido leve',
      sku: 'VES-VES-016',
      categoryId: womensClothingSubcat.id,
      costPrice: 35.0,
      salePrice: 89.9,
      stock: 28,
      minStock: 12,
      maxStock: 50,
      unit: 'un',
      location: 'Prateleira G1',
      supplier: 'Moda Feminina Plus',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const womensBlouse = await prisma.product.create({
    data: {
      name: 'Blusa Social Feminina',
      description: 'Blusa social manga longa, cores variadas',
      sku: 'VES-BLU-017',
      categoryId: womensClothingSubcat.id,
      costPrice: 25.0,
      salePrice: 69.9,
      stock: 42,
      minStock: 18,
      maxStock: 70,
      unit: 'un',
      location: 'Prateleira G1',
      supplier: 'Moda Feminina Plus',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Vestuário - Calçados
  const sneakers = await prisma.product.create({
    data: {
      name: 'Tênis Esportivo Nike Air',
      description: 'Tênis para corrida e caminhada, tecnologia Air',
      sku: 'CAL-TEN-018',
      categoryId: shoesSubcat.id,
      costPrice: 180.0,
      salePrice: 349.9,
      stock: 22,
      minStock: 10,
      maxStock: 40,
      unit: 'par',
      barcode: '7891234567898',
      location: 'Prateleira H1',
      supplier: 'Nike Brasil',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const sandals = await prisma.product.create({
    data: {
      name: 'Sandália Havaianas',
      description: 'Sandália de borracha, diversos tamanhos e cores',
      sku: 'CAL-SAN-019',
      categoryId: shoesSubcat.id,
      costPrice: 12.0,
      salePrice: 29.9,
      stock: 80,
      minStock: 30,
      maxStock: 150,
      unit: 'par',
      barcode: '7891234567899',
      location: 'Prateleira H2',
      supplier: 'Alpargatas S.A.',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Casa e Decoração
  const kitchenSet = await prisma.product.create({
    data: {
      name: 'Jogo de Panelas Tramontina',
      description: 'Conjunto 5 panelas antiaderentes com tampas',
      sku: 'CAS-PAN-020',
      categoryId: homeCategory.id,
      costPrice: 120.0,
      salePrice: 249.9,
      stock: 16,
      minStock: 8,
      maxStock: 30,
      unit: 'jogo',
      barcode: '7891234567900',
      location: 'Prateleira I1',
      supplier: 'Tramontina',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const bedding = await prisma.product.create({
    data: {
      name: 'Jogo de Cama Casal 4 Peças',
      description: 'Lençol, fronha e edredom, 100% algodão',
      sku: 'CAS-CAM-021',
      categoryId: homeCategory.id,
      costPrice: 80.0,
      salePrice: 159.9,
      stock: 24,
      minStock: 10,
      maxStock: 50,
      unit: 'jogo',
      location: 'Prateleira I2',
      supplier: 'Casa & Cia',
      isActive: true,
      userId: adminUser.id,
    },
  });

  // Produtos de Esportes
  const dumbbell = await prisma.product.create({
    data: {
      name: 'Kit Halteres 2x5kg',
      description: 'Par de halteres emborrachados 5kg cada',
      sku: 'ESP-HAL-022',
      categoryId: sportsCategory.id,
      costPrice: 60.0,
      salePrice: 119.9,
      stock: 14,
      minStock: 6,
      maxStock: 25,
      unit: 'kit',
      location: 'Prateleira J1',
      supplier: 'FitnessPro',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const yogaMat = await prisma.product.create({
    data: {
      name: 'Tapete de Yoga Premium',
      description: 'Tapete yoga antiderrapante 180x60cm',
      sku: 'ESP-TAP-023',
      categoryId: sportsCategory.id,
      costPrice: 35.0,
      salePrice: 79.9,
      stock: 30,
      minStock: 12,
      maxStock: 50,
      unit: 'un',
      location: 'Prateleira J1',
      supplier: 'YogaLife',
      isActive: true,
      userId: adminUser.id,
    },
  });

  const bike = await prisma.product.create({
    data: {
      name: 'Bicicleta Mountain Bike Aro 29',
      description: 'Bike 21 marchas, freio a disco, suspensão dianteira',
      sku: 'ESP-BIC-024',
      categoryId: sportsCategory.id,
      costPrice: 800.0,
      salePrice: 1499.0,
      stock: 0,
      minStock: 2,
      maxStock: 8,
      unit: 'un',
      location: 'Depósito K1',
      supplier: 'BikesPro',
      notes: 'ESTOQUE ZERADO - Solicitar reposição urgente',
      isActive: true,
      userId: adminUser.id,
    },
  });

  console.log('✅ Products created: 24 items across all categories');

  // Criar movimentações de estoque
  console.log('📊 Creating stock movements...');

  // Entrada inicial de produtos
  await prisma.stockMovement.create({
    data: {
      productId: notebook1.id,
      type: 'entrada',
      quantity: 10,
      previousStock: 0,
      newStock: 10,
      reason: 'Compra inicial',
      reference: 'NF-2024-001',
      userId: adminUser.id,
    },
  });

  await prisma.stockMovement.create({
    data: {
      productId: phone2.id,
      type: 'entrada',
      quantity: 5,
      previousStock: 0,
      newStock: 5,
      reason: 'Compra fornecedor',
      reference: 'NF-2024-002',
      userId: adminUser.id,
    },
  });

  // Vendas (saída)
  await prisma.stockMovement.create({
    data: {
      productId: notebook1.id,
      type: 'venda',
      quantity: 3,
      previousStock: 10,
      newStock: 7,
      reason: 'Venda ao cliente',
      reference: 'VENDA-001',
      userId: adminUser.id,
    },
  });

  await prisma.stockMovement.create({
    data: {
      productId: phone2.id,
      type: 'venda',
      quantity: 2,
      previousStock: 5,
      newStock: 3,
      reason: 'Venda loja física',
      reference: 'VENDA-002',
      userId: adminUser.id,
    },
  });

  // Ajustes de estoque
  await prisma.stockMovement.create({
    data: {
      productId: notebook1.id,
      type: 'ajuste',
      quantity: -2,
      previousStock: 7,
      newStock: 5,
      reason: 'Ajuste de inventário',
      notes: 'Produtos danificados identificados',
      userId: adminUser.id,
    },
  });

  await prisma.stockMovement.create({
    data: {
      productId: phone2.id,
      type: 'saida',
      quantity: 2,
      previousStock: 3,
      newStock: 1,
      reason: 'Devolução ao fornecedor',
      reference: 'DEV-2024-001',
      notes: 'Produtos com defeito',
      userId: adminUser.id,
    },
  });

  // Devolução
  await prisma.stockMovement.create({
    data: {
      productId: tv.id,
      type: 'devolucao',
      quantity: 1,
      previousStock: 5,
      newStock: 6,
      reason: 'Cliente devolveu - arrependimento',
      reference: 'VENDA-003',
      userId: adminUser.id,
    },
  });

  console.log('✅ Stock movements created: 7 movements');

  // Criar clientes
  console.log('👥 Creating clients...');

  const client1 = await prisma.client.create({
    data: {
      name: 'Maria Silva Santos',
      phone: '11987654321',
      address: 'Rua das Flores, 123 - São Paulo/SP',
      observation: 'Cliente VIP - Sempre paga em dia',
      userId: adminUser.id,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'João Pedro Oliveira',
      phone: '11976543210',
      address: 'Av. Paulista, 1000 - São Paulo/SP',
      referredBy: 'Maria Silva Santos',
      userId: adminUser.id,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Ana Carolina Ferreira',
      phone: '11965432109',
      address: 'Rua Augusta, 500 - São Paulo/SP',
      observation: 'Prefere pagamento mensal',
      userId: adminUser.id,
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: 'Carlos Eduardo Souza',
      phone: '11954321098',
      address: 'Rua da Consolação, 800 - São Paulo/SP',
      userId: adminUser.id,
    },
  });

  const client5 = await prisma.client.create({
    data: {
      name: 'Juliana Costa Lima',
      phone: '11943210987',
      address: 'Av. Faria Lima, 2500 - São Paulo/SP',
      referredBy: 'Ana Carolina Ferreira',
      observation: 'Cliente corporativo',
      userId: adminUser.id,
    },
  });

  const client6 = await prisma.client.create({
    data: {
      name: 'Roberto Santos Almeida',
      phone: '11932109876',
      address: 'Rua Oscar Freire, 300 - São Paulo/SP',
      userId: adminUser.id,
    },
  });

  const client7 = await prisma.client.create({
    data: {
      name: 'Patricia Mendes Rocha',
      phone: '11921098765',
      address: 'Rua Haddock Lobo, 150 - São Paulo/SP',
      observation: 'Histórico de atraso - monitorar pagamentos',
      userId: adminUser.id,
    },
  });

  console.log('✅ Clients created: 7 clients');

  // Criar vendas com parcelas
  console.log('💰 Creating sales with installments...');

  // Venda 1 - Notebook (totalmente pago)
  const sale1 = await prisma.sale.create({
    data: {
      clientId: client1.id,
      userId: adminUser.id,
      itemDescription: 'Notebook Dell Inspiron 15',
      totalValue: 3999.0,
      totalInstallments: 10,
      paymentFrequency: 'mensal',
      firstDueDate: new Date('2024-01-15'),
      totalPaid: 3999.0,
      saleDate: new Date('2024-01-01'),
    },
  });

  // Criar parcelas da venda 1 (todas pagas)
  for (let i = 1; i <= 10; i++) {
    const dueDate = new Date('2024-01-15');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    await prisma.installment.create({
      data: {
        saleId: sale1.id,
        installmentNumber: i,
        amount: 399.9,
        dueDate: dueDate,
        status: 'pago',
        paidDate: dueDate,
        paidAmount: 399.9,
      },
    });
  }

  // Venda 2 - TV (parcialmente pago)
  const sale2 = await prisma.sale.create({
    data: {
      clientId: client2.id,
      userId: adminUser.id,
      itemDescription: 'Smart TV LG 55" 4K',
      totalValue: 2399.0,
      totalInstallments: 12,
      paymentFrequency: 'mensal',
      firstDueDate: new Date('2024-06-10'),
      totalPaid: 1399.3,
      saleDate: new Date('2024-06-01'),
    },
  });

  // Criar parcelas da venda 2 (7 pagas, 5 pendentes)
  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date('2024-06-10');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    const isPaid = i <= 7;
    await prisma.installment.create({
      data: {
        saleId: sale2.id,
        installmentNumber: i,
        amount: 199.92,
        dueDate: dueDate,
        status: isPaid ? 'pago' : i === 8 && dueDate < new Date() ? 'atrasado' : 'pendente',
        paidDate: isPaid ? dueDate : null,
        paidAmount: isPaid ? 199.92 : null,
      },
    });
  }

  // Venda 3 - Sofá (com atraso)
  const sale3 = await prisma.sale.create({
    data: {
      clientId: client3.id,
      userId: adminUser.id,
      itemDescription: 'Sofá Retrátil 3 Lugares',
      totalValue: 2199.0,
      totalInstallments: 15,
      paymentFrequency: 'quinzenal',
      firstDueDate: new Date('2024-08-01'),
      totalPaid: 1099.5,
      saleDate: new Date('2024-07-25'),
    },
  });

  // Criar parcelas da venda 3 (algumas pagas, algumas atrasadas)
  for (let i = 1; i <= 15; i++) {
    const dueDate = new Date('2024-08-01');
    dueDate.setDate(dueDate.getDate() + (i - 1) * 15); // Quinzenal

    let status: 'pago' | 'pendente' | 'atrasado' = 'pendente';
    let paidDate: Date | null = null;
    let paidAmount: number | null = null;

    if (i <= 7) {
      status = 'pago';
      paidDate = dueDate;
      paidAmount = 146.6;
    } else if (dueDate < new Date()) {
      status = 'atrasado';
    }

    await prisma.installment.create({
      data: {
        saleId: sale3.id,
        installmentNumber: i,
        amount: 146.6,
        dueDate: dueDate,
        status: status,
        paidDate: paidDate,
        paidAmount: paidAmount,
      },
    });
  }

  // Venda 4 - Celular (recente, algumas pagas)
  const sale4 = await prisma.sale.create({
    data: {
      clientId: client4.id,
      userId: adminUser.id,
      itemDescription: 'Samsung Galaxy S23 128GB',
      totalValue: 3299.0,
      totalInstallments: 12,
      paymentFrequency: 'mensal',
      firstDueDate: new Date('2024-10-05'),
      totalPaid: 824.75,
      saleDate: new Date('2024-09-28'),
    },
  });

  for (let i = 1; i <= 12; i++) {
    const dueDate = new Date('2024-10-05');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    const isPaid = i <= 3;
    await prisma.installment.create({
      data: {
        saleId: sale4.id,
        installmentNumber: i,
        amount: 274.92,
        dueDate: dueDate,
        status: isPaid ? 'pago' : 'pendente',
        paidDate: isPaid ? dueDate : null,
        paidAmount: isPaid ? 274.92 : null,
      },
    });
  }

  // Venda 5 - Cama Box (pagamento parcial com atraso)
  const sale5 = await prisma.sale.create({
    data: {
      clientId: client5.id,
      userId: adminUser.id,
      itemDescription: 'Cama Box Casal Premium',
      totalValue: 1899.0,
      totalInstallments: 10,
      paymentFrequency: 'mensal',
      firstDueDate: new Date('2024-09-20'),
      totalPaid: 569.7,
      saleDate: new Date('2024-09-15'),
    },
  });

  for (let i = 1; i <= 10; i++) {
    const dueDate = new Date('2024-09-20');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    let status: 'pago' | 'pendente' | 'atrasado' | 'parcial' = 'pendente';
    let paidDate: Date | null = null;
    let paidAmount: number | null = null;

    if (i === 1) {
      status = 'pago';
      paidDate = dueDate;
      paidAmount = 189.9;
    } else if (i === 2) {
      status = 'pago';
      paidDate = dueDate;
      paidAmount = 189.9;
    } else if (i === 3) {
      status = 'parcial';
      paidDate = dueDate;
      paidAmount = 189.9; // Pagou só parte
    } else if (dueDate < new Date()) {
      status = 'atrasado';
    }

    await prisma.installment.create({
      data: {
        saleId: sale5.id,
        installmentNumber: i,
        amount: 189.9,
        dueDate: dueDate,
        status: status,
        paidDate: paidDate,
        paidAmount: paidAmount,
      },
    });
  }

  // Venda 6 - Mesa de Centro (quinzenal, recente)
  const sale6 = await prisma.sale.create({
    data: {
      clientId: client6.id,
      userId: adminUser.id,
      itemDescription: 'Mesa de Centro Moderna + Jogo de Panelas',
      totalValue: 699.8,
      totalInstallments: 8,
      paymentFrequency: 'quinzenal',
      firstDueDate: new Date('2024-11-01'),
      totalPaid: 174.95,
      saleDate: new Date('2024-10-25'),
    },
  });

  for (let i = 1; i <= 8; i++) {
    const dueDate = new Date('2024-11-01');
    dueDate.setDate(dueDate.getDate() + (i - 1) * 15);

    const isPaid = i === 1;
    await prisma.installment.create({
      data: {
        saleId: sale6.id,
        installmentNumber: i,
        amount: 87.48,
        dueDate: dueDate,
        status: isPaid ? 'pago' : 'pendente',
        paidDate: isPaid ? dueDate : null,
        paidAmount: isPaid ? 87.48 : null,
      },
    });
  }

  // Venda 7 - Cadeira Gamer (cliente com histórico de atraso)
  const sale7 = await prisma.sale.create({
    data: {
      clientId: client7.id,
      userId: adminUser.id,
      itemDescription: 'Cadeira Gamer RGB',
      totalValue: 799.0,
      totalInstallments: 8,
      paymentFrequency: 'mensal',
      firstDueDate: new Date('2024-07-15'),
      totalPaid: 299.62,
      saleDate: new Date('2024-07-10'),
    },
  });

  for (let i = 1; i <= 8; i++) {
    const dueDate = new Date('2024-07-15');
    dueDate.setMonth(dueDate.getMonth() + (i - 1));

    let status: 'pago' | 'pendente' | 'atrasado' = 'pendente';
    let paidDate: Date | null = null;
    let paidAmount: number | null = null;

    if (i <= 3) {
      status = 'pago';
      const paymentDelay = new Date(dueDate);
      paymentDelay.setDate(paymentDelay.getDate() + 10); // Pagou com 10 dias de atraso
      paidDate = paymentDelay;
      paidAmount = 99.88;
    } else if (dueDate < new Date()) {
      status = 'atrasado';
    }

    await prisma.installment.create({
      data: {
        saleId: sale7.id,
        installmentNumber: i,
        amount: 99.88,
        dueDate: dueDate,
        status: status,
        paidDate: paidDate,
        paidAmount: paidAmount,
      },
    });
  }

  console.log('✅ Sales created: 7 sales with multiple installments');

  // Resumo final
  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- Users: 2');
  console.log('- Categories: 5 main + 9 subcategories = 14 total');
  console.log('- Products: 24 items');
  console.log('- Stock Movements: 7 movements');
  console.log('- Clients: 7 clients');
  console.log('- Sales: 7 sales with various payment statuses');
  console.log('- Installments: ~90 installments (paid, pending, overdue, partial)');
  console.log('\n🔐 Login credentials:');
  console.log('- Email: admin@cobranca.com');
  console.log('- Password: admin123');
  console.log('\n- Email: vendedor@cobranca.com');
  console.log('- Password: vendedor123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
