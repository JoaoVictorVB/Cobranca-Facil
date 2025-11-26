# Changelog - Cobrança Fácil

## [Versão Atual] - 24/11/2025

### 🚀 Sistema B2B2C de Distribuição & Risco (NOVO)

#### Sistema de Token de Convite
- ✅ Campo `inviteToken` (6 caracteres) no `BusinessRelationship`
- ✅ `POST /distribution/invite-token` - Fornecedor gera código único
- ✅ `POST /distribution/accept-by-token` - Revendedor aceita via código
- ✅ Validações: token único, não reutilizável, relação única por par

#### Gestão de Remessas & Estoque Espelhado
- ✅ `POST /distribution/send-merchandise` - Envio transacional com decremento
- ✅ `POST /distribution/transfers/:id/accept` - Recebimento automático
- ✅ `GET /distribution/resellers/:id/inventory` - Dashboard espelho (multi-tenant seguro)
- ✅ Rastreabilidade: `originProductId` e `originSupplierId` nos produtos
- ✅ Filtros automáticos por fornecedor (isolamento de dados)

#### Inteligência Financeira (Risk Analytics)
- ✅ `GET /risk-analytics/run-rate/:resellerId` - Velocidade de vendas (média diária)
- ✅ `POST /risk-analytics/check-risk` - Análise preditiva de liquidez
- ✅ Classificação: 🟢 BAIXO (>120%), 🟡 MÉDIO (100-120%), 🔴 ALTO (<100%)
- ✅ Cálculo: `availableFunds = balance + (dailyAvg × daysUntilCheck)`

#### Relacionamentos Fornecedor-Revendedor
- ✅ `POST /distribution/relationships` - Convite direto por email/ID
- ✅ `PATCH /distribution/relationships/:id/accept` - Aceite manual
- ✅ `GET /distribution/relationships/pending` - Lista convites pendentes

**Ver documentação completa:** `B2B2C_IMPLEMENTATION.md`

---

## [22/11/2025]

### 🎨 Melhorias Visuais Completas

#### Login & Registro
- ✨ Adicionado gradiente animado de fundo (roxo → cinza → azul)
- 🌊 Efeitos de blur animados com bolhas flutuantes
- 💎 Card com glassmorphism (transparência + backdrop-blur)
- 🎯 Logo reformulado com gradiente roxo/azul e sombra colorida
- 🔥 Título com texto gradiente (`bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text`)
- 🚀 Botões com gradiente hover scale (1.02) e sombra

#### Header/Navegação
- 🎨 Background com gradiente sutil
- 💫 Logo com gradiente e sombra roxa (`shadow-purple-500/30`)
- ✨ Botões com hover colorido individual:
  - Dashboard: roxo (`hover:bg-purple-500/10 hover:text-purple-400`)
  - Relatórios: azul (`hover:bg-blue-500/10 hover:text-blue-400`)
  - Estoque: verde (`hover:bg-green-500/10 hover:text-green-400`)
  - Sair: vermelho (`hover:bg-red-500/10 hover:text-red-400`)
- 🌟 Título "Cobrança Fácil" com gradiente animado

#### Dashboard Principal
- 📊 Cards com `hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`
- 🎨 Gradientes de fundo temáticos por card:
  - Total Esperado: `from-card to-card/50`
  - Total Recebido: `from-card to-green-500/5` + borda verde
  - Pendente: `from-card to-yellow-500/5` + borda amarela
  - Em Atraso: `from-card to-red-500/5` + borda vermelha
- 🔵 Ícones com background colorido em círculo (`bg-{color}-500/10 rounded-lg`)
- 📈 Título com gradiente roxo/azul
- 💎 Select de mês com sombra (`shadow-md`)
- 🎯 Botão "Ver Análises" com gradiente roxo/azul

#### Gestão de Estoque
- 📦 6 cards estatísticos com cores temáticas:
  - **Roxo** - Total de Produtos (`text-purple-500`, `bg-purple-500/10`)
  - **Amarelo** - Estoque Baixo (`text-yellow-500`, `bg-yellow-500/10`)
  - **Azul** - Valor em Estoque (`text-blue-500`, `bg-blue-500/10`)
  - **Verde** - Valor de Venda (`text-green-500`, `bg-green-500/10`)
  - **Azul Claro** - Lucro Potencial (`text-blue-400`, `bg-blue-500/10`)
  - **Índigo** - Margem Média (`text-indigo-500`, `bg-indigo-500/10`)
- ✨ Todos com hover scale e sombras elevadas
- 🎯 Botão "Novo Produto" com gradiente roxo/azul
- 🔍 Input de busca com borda roxa no focus
- 📋 Card da tabela com sombra elevada (`shadow-lg`)
- 🎨 SKU com badge escuro (`bg-gray-800 text-gray-100 font-mono`)

#### Background Global
- 🌌 Body com gradiente escuro: `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`
- 🎨 Efeito de profundidade em toda aplicação

### 🗂️ Sistema de Categorias Hierárquicas

#### Backend - Clean Architecture
**Migrations:**
- `20251122183526_add_categories_hierarchy` - Modelo Category com auto-relação

**Domain Layer:**
- `domain/category/entities/category.entity.ts` - Entidade com propriedades computadas
  - `isSubcategory`: boolean (verifica se tem parentId)
  - `hasChildren`: boolean (verifica array children)
  - `fullPath`: string (parent.name > name)
  - Métodos: `activate()`, `deactivate()`, `updateOrder()`
  
- `domain/category/repositories/category.repository.interface.ts` - Interface com 10 métodos
  
**Application Layer:**
- `application/category/use-cases/create-category.use-case.ts`
- `application/category/use-cases/find-all-categories.use-case.ts`
- `application/category/use-cases/find-categories-with-children.use-case.ts`
- `application/category/use-cases/update-category.use-case.ts`
- `application/category/use-cases/delete-category.use-case.ts`

**Infrastructure Layer:**
- `infrastructure/repositories/category.repository.ts` - Implementação Prisma
  - Métodos de hierarquia: `findByParentId()`, `findRootCategories()`, `findSubcategories()`
  - Validação: `exists()` para prevenir duplicatas

**Presentation Layer:**
- 5 Controllers (padrão one-per-endpoint):
  - `CreateCategoryController` - POST /categories
  - `GetAllCategoriesController` - GET /categories
  - `GetCategoriesHierarchyController` - GET /categories/hierarchy
  - `UpdateCategoryController` - PUT /categories/:id
  - `DeleteCategoryController` - DELETE /categories/:id
  
- 3 DTOs:
  - `create-category.dto.ts`
  - `update-category.dto.ts`
  - `category-response.dto.ts`

**Integração com Produtos:**
- Product.category (String) → Product.categoryId (UUID)
- Relação opcional com `onDelete: SetNull`
- Constraint único: `@@unique([userId, name, parentId])`

#### Frontend
- `services/category.service.ts` - Cliente TypeScript completo
- Interfaces: `Category`, `CreateCategoryDto`, `UpdateCategoryDto`
- Métodos: create, findAll, findHierarchy, update, delete

### 📊 Tabela de Clientes - Sistema de Colunas Configuráveis

#### Nova Funcionalidade
- 🔧 Botão "Colunas" ao lado de "Mostrar Filtros"
- 🎨 Ícone Settings (engrenagem)
- 📋 Popover com checkboxes para 10 colunas configuráveis

#### Colunas Configuráveis
1. Telefone
2. Indicado por
3. Última Compra
4. Tipo Pagamento
5. Próximo Vencimento
6. Valor Parcela
7. Parcelas (Resumo)
8. Total Compras
9. Pago
10. Pendente

#### Colunas Fixas (Não Podem Ser Ocultadas)
- Nome (com status)
- Ações (visualizar, editar, excluir)

#### Implementação Técnica
**Estado:**
```typescript
interface ColumnVisibility {
  phone: boolean;
  referredBy: boolean;
  lastPurchase: boolean;
  paymentType: boolean;
  nextDue: boolean;
  installmentValue: boolean;
  installmentsSummary: boolean;
  totalPurchases: boolean;
  paid: boolean;
  pending: boolean;
}
```

**Persistência:**
- LocalStorage com chave `clientsTableColumns`
- Carregado automaticamente ao montar componente
- Salvo automaticamente ao alterar qualquer coluna

**Funções:**
- `toggleColumn(column: keyof ColumnVisibility)` - Alterna visibilidade
- `resetColumns()` - Restaura todas as colunas para visíveis

**Renderização Condicional:**
```typescript
{visibleColumns.phone && <TableHead>Telefone</TableHead>}
{visibleColumns.phone && <TableCell>{phone}</TableCell>}
```

### 🗄️ Seed Completo de Dados

#### Criado: `prisma/seed-complete.ts`
**Script:** `npm run prisma:seed:complete`

**Dados Criados:**
- **2 Usuários:**
  - admin@cobranca.com / admin123
  - vendedor@cobranca.com / vendedor123

- **14 Categorias Hierárquicas:**
  - 5 Principais: Eletrônicos, Móveis, Vestuário, Casa e Decoração, Esportes
  - 9 Subcategorias: Computadores, Celulares, TVs e Audio, Quarto, Sala, Escritório, Masculino, Feminino, Calçados

- **24 Produtos:**
  - Com categoryId vinculado
  - Preços de custo e venda realistas
  - Níveis de estoque variados (incluindo 1 produto zerado)
  - SKUs, códigos de barras, fornecedores
  
- **7 Movimentações de Estoque:**
  - Tipos: entrada, venda, ajuste, saida, devolucao

- **7 Clientes:**
  - Perfis variados (VIP, indicações, histórico)
  
- **7 Vendas com ~90 Parcelas:**
  - Venda 1: Totalmente paga (10x mensal)
  - Venda 2: Parcial (7/12 pagas, 5 pendentes/atrasadas)
  - Venda 3: Com atrasos (7/15 pagas quinzenal)
  - Venda 4: Recente (3/12 pagas)
  - Venda 5: Pagamentos parciais (status 'parcial')
  - Venda 6: Muito recente (quinzenal)
  - Venda 7: Padrão de atraso (10 dias de atraso consistente)

### 🐛 Correções de Bugs

#### Produtos - Campo Category
**Problema:**
- Backend enviava `categoryId` (UUID)
- Frontend esperava `category` (string nome)
- Campos vazios na tabela

**Solução:**
- Atualizadas interfaces: `Product`, `CreateProductDto`, `UpdateProductDto`
- Campo `category` → `categoryId` em toda aplicação
- Removido display de categoria vazia
- Campo de texto removido dos formulários (preparação para dropdown)

#### UUID vs crypto.randomUUID()
**Problema:**
- Pacote `uuid` causava erro ESM (require() não suportado)

**Solução:**
- Substituído `import { v4 as uuidv4 } from 'uuid'`
- Por: `import { randomUUID } from 'crypto'` (nativo Node.js)
- Compatível com CommonJS

#### Product Entity - Compatibilidade Retroativa
**Problema:**
- Código antigo usava `category?: string`
- Novo código usa `categoryId?: string`

**Solução:**
```typescript
// No método create()
categoryId: props.categoryId ?? props.category  // Fallback
```

### 📝 Regras de Negócio

#### Categorias
1. **Unicidade**: Nome único por usuário e parent (`@@unique([userId, name, parentId])`)
2. **Hierarquia Ilimitada**: Suporta N níveis de subcategorias
3. **Soft Delete**: Campo `isActive` para desativação
4. **Ordenação**: Campo `order` para controle manual
5. **Isolamento**: Todas as operações filtradas por `userId`

#### Produtos
1. **Categoria Opcional**: `categoryId` pode ser null
2. **Cascade SetNull**: Se categoria deletada, produto fica sem categoria
3. **Margem de Lucro**: Calculada automaticamente: `((salePrice - costPrice) / costPrice) * 100`
4. **Estoque Baixo**: `isLowStock = stock <= minStock`
5. **Validações**:
   - Nome obrigatório
   - Preços não podem ser negativos
   - Estoque não pode ser negativo
   - Estoque mínimo não pode ser negativo

#### Multi-Tenancy
**Todas as queries filtradas por userId:**
```typescript
const where: any = { id };
if (userId) where.userId = userId;
```

### 🔧 Alterações Técnicas

#### Package.json (API)
- Removido: `uuid` e `@types/uuid`
- Scripts adicionados: `"prisma:seed:complete": "ts-node prisma/seed-complete.ts"`

#### Prisma Schema
```prisma
model Category {
  id          String   @id @default(uuid())
  name        String
  description String?
  parentId    String?
  isActive    Boolean  @default(true)
  order       Int      @default(0)
  userId      String
  
  parent      Category?  @relation("CategoryHierarchy", fields: [parentId])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  user        User       @relation(fields: [userId])
  
  @@unique([userId, name, parentId])
}

model Product {
  categoryId  String?
  category    Category? @relation(fields: [categoryId], onDelete: SetNull)
}
```

#### Interfaces Atualizadas (Frontend)
```typescript
// services/product.service.ts
export interface Product {
  categoryId?: string;  // Era: category?: string
}

export interface CreateProductDto {
  categoryId?: string;  // Era: category?: string
}

export interface UpdateProductDto {
  categoryId?: string;  // Era: category?: string
}
```

### 📦 Estrutura de Arquivos Novos

```
api/src/
├── domain/category/
│   ├── entities/category.entity.ts
│   ├── repositories/category.repository.interface.ts
│   └── errors/ (não implementado ainda)
│
├── application/category/
│   ├── interfaces/
│   └── use-cases/
│       ├── create-category.use-case.ts
│       ├── find-all-categories.use-case.ts
│       ├── find-categories-with-children.use-case.ts
│       ├── update-category.use-case.ts
│       └── delete-category.use-case.ts
│
├── infrastructure/repositories/
│   └── category.repository.ts
│
└── presentation/category/
    ├── dto/
    │   ├── create-category.dto.ts
    │   ├── update-category.dto.ts
    │   └── category-response.dto.ts
    ├── controllers/
    │   ├── create-category.controller.ts
    │   ├── get-all-categories.controller.ts
    │   ├── get-categories-hierarchy.controller.ts
    │   ├── update-category.controller.ts
    │   └── delete-category.controller.ts
    └── category.module.ts

prisma/
└── seed-complete.ts (1167 linhas)

web/src/services/
└── category.service.ts
```

### 🎯 Próximos Passos Recomendados

1. **Dropdown de Categorias nos Formulários de Produto**
   - Substituir input de texto por select hierárquico
   - Buscar categorias via `category.service.ts`
   - Mostrar estrutura de árvore (Parent > Child)

2. **Exibição de Nome da Categoria na Tabela**
   - Buscar dados da categoria via `categoryId`
   - Exibir nome abaixo do produto
   - Cache de categorias para performance

3. **Filtro por Categoria**
   - Adicionar select de categorias nos filtros
   - Suporte para filtrar por categoria pai (incluir subcategorias)

4. **UI de Gerenciamento de Categorias**
   - Página dedicada para CRUD de categorias
   - Visualização em árvore/tabela
   - Drag & drop para reordenação

5. **Relatórios por Categoria**
   - Vendas por categoria
   - Estoque por categoria
   - Margem por categoria

### 📚 Documentação Adicional

- Ver `PRODUCT_MARGINS.md` para detalhes sobre cálculo de margens e porcentagens
- Ver `API_DOCUMENTATION.md` para endpoints completos (em desenvolvimento)
- Ver Swagger em `http://localhost:3001/docs` quando API estiver rodando
