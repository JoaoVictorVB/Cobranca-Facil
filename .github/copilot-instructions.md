# Cobrança Fácil - AI Coding Agent Instructions

## Project Overview

Sistema de gestão de cobranças e vendas parceladas (installment payment tracking system). Full-stack monorepo with NestJS backend (Clean Architecture) and React frontend (shadcn/ui + TanStack Query).

**Business Domain:** Manage clients, sales with installments, product inventory, and payment tracking with calendar views and analytics.

## Architecture

### Backend: Clean Architecture (NestJS + Prisma + PostgreSQL)

The API follows strict Clean Architecture layers with DDD principles:

```
api/src/
├── domain/           # Entities, Value Objects, Repository Interfaces
│   └── {domain}/
│       ├── entities/         # Business entities (Client, Sale, Product, Tag)
│       ├── repositories/     # IRepository interfaces + injection tokens
│       ├── value-objects/    # Immutable values (Phone, Money)
│       └── errors/           # Domain-specific exceptions
├── application/      # Use Cases (business logic orchestration)
│   └── {domain}/use-cases/   # One class per operation
├── infrastructure/   # External concerns
│   ├── database/             # PrismaService, connection management
│   ├── repositories/         # Prisma implementations of IRepositories
│   ├── filters/              # GlobalExceptionFilter (maps domain errors)
│   └── interceptors/         # LoggingInterceptor
└── presentation/     # HTTP layer
    └── {domain}/
        ├── controllers/      # One controller PER ENDPOINT (critical!)
        ├── dto/              # Request/Response DTOs with validation
        └── {domain}.module.ts # Wires everything together
```

**Critical Patterns:**

- **One Controller Per Endpoint**: Each REST operation has its own file (e.g., `create-client.controller.ts`, `get-client-by-id.controller.ts`). Never combine multiple endpoints in one controller class.
- **Use Case Pattern**: All business logic lives in `application/{domain}/use-cases/`. Controllers ONLY call use cases and map responses.
- **Repository Pattern**: Domain defines interfaces (`IClientRepository` with injection token `CLIENT_REPOSITORY`), infrastructure provides Prisma implementations.
- **Entity & Value Objects**: Domain entities encapsulate business rules. Value objects enforce validation (e.g., `Phone` validates Brazilian format).

**Example Flow** (Client Creation):

1. `CreateClientController` receives POST request with `@User('id')` decorator extracting userId from JWT
2. Validates `CreateClientDto` via class-validator decorators
3. Calls `CreateClientUseCase.execute(dto, userId)` - use case injected via constructor
4. Use case validates phone via `PhoneValidator.validate()`, creates `Client` entity using factory method
5. Use case calls `this.clientRepository.create()` (injected via `CLIENT_REPOSITORY` token)
6. `ClientRepository` (Prisma implementation) persists to database
7. Controller receives domain entity, maps to `ClientResponseDto.fromDomain(entity)` and returns

### Frontend: React + shadcn/ui + TanStack Query

```
web/src/
├── services/         # API clients (axios-based, typed, one per domain)
├── contexts/         # AuthContext with JWT + localStorage management
├── components/
│   ├── ui/           # shadcn/ui primitives (40+ components)
│   └── dashboard/    # Feature components (tables, dialogs, charts)
├── pages/            # Route components with ProtectedRoute wrapper
└── lib/              # Utilities (cn, formatters)
```

**Patterns:**

- **Service Layer**: Each domain has a service file (e.g., `client.service.ts`) with typed CRUD functions. Returns typed objects, throws `ApiError` on failure.
- **Centralized API Client**: `api.ts` (axios instance) handles:
  - JWT injection via request interceptor (reads from localStorage)
  - Global error handling via response interceptor (shows toasts, auto-redirects on 401)
  - NetworkError handling when backend is down
- **Protected Routes**: `<ProtectedRoute>` HOC checks `AuthContext.isAuthenticated` and redirects to `/login`
- **State Management**: TanStack Query for server state (caching, refetching), React Context for auth/theme
- **Form Patterns**:
  - Dialogs use controlled state with `open` + `onOpenChange` props
  - "Save and Add Another" pattern for batch entry (preserves context fields, clears specific fields)
  - Quick-create nested dialogs (e.g., create tag while creating product)

## Key Development Workflows

### Running Locally (Recommended Approach)

```powershell
# Terminal 1: Start PostgreSQL only
docker-compose up -d postgres
# Database available at localhost:5432

# Terminal 2: API (with hot-reload)
cd api
npm install
npx prisma generate          # Generate Prisma Client
npx prisma migrate dev       # Apply migrations (creates tables)
npm run start:dev            # Starts on port 3001, watches for changes

# Terminal 3: Frontend (with hot-reload)
cd web
npm install
npm run dev                  # Starts on port 5173, watches for changes
```

**Access:**

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Swagger Docs: http://localhost:3001/docs
- Prisma Studio: `cd api && npx prisma studio` → http://localhost:5555

**Default Credentials** (after seed):

- Username: `admin`
- Password: `admin123`

### Full Docker Stack (Alternative)

```powershell
docker-compose up -d  # Starts postgres + api + web
# Frontend: http://localhost:80
# API: http://localhost:3001
```

### Database Operations (Prisma)

```powershell
cd api

# Development workflow
npx prisma migrate dev         # Create + apply migration (prompts for name)
npx prisma migrate dev --name add-tags-system  # Named migration
npx prisma generate            # Regenerate Prisma Client (run after ANY schema change)
npx prisma studio              # Visual database browser (localhost:5555)

# Seeding
npm run prisma:seed            # Basic seed (admin user + sample data)
npm run prisma:seed:complete   # Full seed with realistic data

# Reset database (DESTRUCTIVE)
npx prisma migrate reset       # Drops DB, reapplies all migrations, runs seed
```

**Critical:** Always run `npx prisma generate` before `npx prisma migrate dev` after editing `schema.prisma`

### Adding New Features (Backend - Complete Checklist)

**Step-by-Step Process for New Domain:**

1. **Database Schema** (`api/prisma/schema.prisma`)

   - Add model with `userId` relation for multi-tenancy
   - Run `npx prisma generate && npx prisma migrate dev --name add-{domain}`

2. **Domain Layer** (`api/src/domain/{domain}/`)

   - Create `entities/{domain}.entity.ts` with factory methods (`create()`, `reconstitute()`)
   - Create `repositories/{domain}.repository.interface.ts` with injection token (e.g., `TAG_REPOSITORY`)
   - Optional: Add `value-objects/` or `errors/` if needed

3. **Application Layer** (`api/src/application/{domain}/use-cases/`)

   - Create use case files: `create-{domain}.use-case.ts`, `find-all-{domain}.use-case.ts`, etc.
   - Each use case injects repository via interface token
   - Implement `IUseCase<Request, Response>` pattern

4. **Infrastructure Layer** (`api/src/infrastructure/repositories/`)

   - Create `{domain}.repository.ts` implementing interface from domain
   - Inject `PrismaService` (not DatabaseModule)
   - Implement `toDomain()` and `toPrisma()` mapping methods
   - **Critical**: All queries MUST filter by `userId` for multi-tenancy

5. **Presentation Layer** (`api/src/presentation/{domain}/`)

   - **DTOs** (`dto/`):
     - `create-{domain}.request.dto.ts` with class-validator decorators
     - `update-{domain}.request.dto.ts` (if needed)
     - `{domain}.response.dto.ts` with static `fromDomain(entity)` method
   - **Controllers** (`controllers/`):
     - Create ONE controller per endpoint: `create-{domain}.controller.ts`, `find-all-{domain}.controller.ts`, etc.
     - Use `@User('id')` decorator to extract userId from JWT
     - Add Swagger decorators: `@ApiTags()`, `@ApiBearerAuth()`, `@ApiOperation()`
     - Create `index.ts` barrel export
   - **Module** (`{domain}.module.ts`):
     - Register all controllers
     - Provide repository with injection token pattern:
       ```typescript
       {
         provide: DOMAIN_REPOSITORY,
         useClass: DomainRepository,
       }
       ```
     - Provide PrismaService and all use cases

6. **Registration** (`api/src/app.module.ts`)

   - Import and add `{Domain}Module` to imports array

7. **Swagger Tag** (`api/src/common/swagger/swagger-tags.ts`)
   - Add domain to `SWAGGER_TAGS` enum

**Example: See `api/src/presentation/tag/` for complete reference implementation**

### User Authentication Pattern

- **Backend**: Use `@User('id')` decorator to extract user ID from JWT (injected by `JwtAuthGuard`)
- **Frontend**: `AuthContext` stores token in localStorage, `api.ts` injects in headers
- All endpoints protected with `@UseGuards(JwtAuthGuard)` except `/auth/login` and `/auth/register`

## Critical Conventions

### API Controllers

- **File naming**: `{verb}-{resource}.controller.ts` (e.g., `pay-installment.controller.ts`)
- **Class naming**: `{Verb}{Resource}Controller` (e.g., `PayInstallmentController`)
- **Always use**:
  - `@ApiTags(SWAGGER_TAGS.{DOMAIN})` for Swagger grouping
  - `@ApiBearerAuth()` for authenticated endpoints
  - `@ApiOperation({ summary: '...' })` for documentation
  - `@UseGuards(JwtAuthGuard)` for all endpoints except `/auth/login` and `/auth/register`
  - DTO mapping: `ResponseDto.fromDomain(entity)` for responses

### Repository Multi-Tenancy

All repositories **must filter by userId** to ensure data isolation:

```typescript
// In repository implementation
async findById(id: string, userId?: string): Promise<DomainEntity | null> {
  const where: any = { id };
  if (userId) where.userId = userId; // Critical for multi-tenancy

  const record = await this.prisma.model.findFirst({ where });
  return record ? this.toDomain(record) : null;
}
```

### Date Handling

- **Backend**: Use `parseLocalDate()` from `common/utils/date.utils.ts` to handle date strings without timezone shifts
- **Frontend**: Send dates as ISO strings; backend converts to proper Date objects
- **Issue**: Date-only fields (like `dueDate`) should not shift timezones - use local date parsing

### Error Handling

- **Backend**: Domain errors (e.g., `InvalidPhoneNumberError`) caught by `GlobalExceptionFilter`, mapped to HTTP statuses
- **Frontend**: `api.ts` interceptor shows toast notifications automatically for all error types:
  - 400: "Dados Inválidos"
  - 401: Auto-redirects to `/login` and clears localStorage
  - 404: "Não Encontrado"
  - 409: "Conflito" (e.g., duplicate entries)
  - 422: "Erro de Validação"
  - 500: "Erro no Servidor"
  - Network errors: "Erro de Conexão" (backend down)

## Swagger Documentation

- Available at `http://localhost:3001/docs` when API is running
- All endpoints documented with DTOs via NestJS decorators
- Tags defined in `common/swagger/swagger-tags.ts`

## Testing Access

Default credentials (after seed):

- **User**: `admin`
- **Pass**: `admin123`

## Tech Stack Reference

- **Backend**: NestJS 10.3, Prisma 5.8, PostgreSQL 15, JWT auth, bcryptjs
- **Frontend**: React 18.3, Vite, shadcn/ui, TailwindCSS, TanStack Query, Axios, Zod
- **DevOps**: Docker Compose (PostgreSQL), separate containers for API/Web available but dev uses local

## Common Gotchas

1. **Migrations**: After schema changes, always run `prisma generate` before `prisma migrate dev`
2. **User Context**: Never hardcode user IDs; always extract from JWT via `@User('id')` decorator
3. **Phone Validation**: Uses Brazilian format (10-11 digits); validated by `PhoneValidator` utility
4. **Payment Status**: Installments have `PaymentStatus` enum: `pendente`, `pago`, `atrasado`, `parcial`
5. **CORS**: API allows all origins in dev (configured in `main.ts`); production should restrict to specific domains
6. **Controller Pattern**: If adding new endpoint to existing domain, create NEW controller file - don't modify existing
7. **Prisma Version**: Using Prisma 5.x (stable). Schema format with `datasource db { url = env("DATABASE_URL") }` is correct
8. **Global Pipes**: ValidationPipe configured with `whitelist: true` and `transform: true` in `main.ts`
9. **Tag System**: Products can have multiple tags (many-to-many via `ProductTag` junction table)
10. **Batch Entry UX**: Dialogs support "Save and Add Another" pattern - preserves contextual fields (tags, prices) but clears specific fields (name, SKU)

## File Structure Patterns

- Controllers live in `presentation/{domain}/controllers/` with **index.ts** barrel export
- Use cases in `application/{domain}/use-cases/` implement `IUseCase<Request, Response>`
- DTOs in `presentation/{domain}/dto/` with `.request.dto.ts` and `.response.dto.ts` suffixes
- Domain entities never exposed directly - always map via DTOs
- Frontend services in `web/src/services/` export typed functions for each domain

## When Adding New Domain

1. Create Prisma model in `schema.prisma` (include `userId` relation)
2. Create full domain structure: `domain/{domain}/{entities,repositories,value-objects,errors}/`
3. Create application layer: `application/{domain}/{use-cases,interfaces}/`
4. Create infrastructure: `infrastructure/repositories/{domain}.repository.ts`
5. Create presentation: `presentation/{domain}/{controllers,dto}/` with module
6. Register module in `app.module.ts`
7. Add Swagger tag in `common/swagger/swagger-tags.ts`
8. Create frontend service in `web/src/services/{domain}.service.ts`
9. Create UI components in `web/src/components/dashboard/` following existing patterns

---

## B2B2C Distribution & Risk System (FUTURE ROADMAP)

This section documents the planned B2B2C distribution system for supplier-reseller relationships and financial risk analysis.

### Business Context

**Problem**: Suppliers need to:

1. Distribute merchandise to resellers without manual stock adjustments
2. Monitor reseller inventory in real-time ("Stock Mirror")
3. Assess financial risk of checks based on reseller sales velocity
4. Track product lineage (which products originated from which supplier)

**Solution**: Multi-tenant data sharing with controlled access and intelligent risk analytics.

### Database Schema Extensions (Prisma)

#### 1. BusinessRelationship Model

**Purpose**: Break multi-tenant isolation in controlled way - allow suppliers to view reseller data.

```prisma
model BusinessRelationship {
  id           String   @id @default(uuid())
  supplierId   String   @map("supplier_id")     // Your user ID (fornecedor)
  resellerId   String   @map("reseller_id")     // Your customer's user ID
  status       RelationshipStatus @default(PENDENTE)
  createdAt    DateTime @default(now()) @map("created_at")
  acceptedAt   DateTime? @map("accepted_at")

  supplier     User     @relation("SupplierRelations", fields: [supplierId], references: [id])
  reseller     User     @relation("ResellerRelations", fields: [resellerId], references: [id])

  @@unique([supplierId, resellerId])
  @@map("business_relationships")
}

enum RelationshipStatus {
  PENDENTE   // Invitation sent, awaiting acceptance
  ATIVO      // Active relationship, data sharing enabled
  INATIVO    // Deactivated
}
```

**Key Rule**: Only products where `originSupplierId == supplierId` are visible to supplier (privacy protection).

#### 2. Product Model Extensions

**Purpose**: Track product lineage and origin.

```prisma
model Product {
  // ... existing fields
  originProductId   String?  @map("origin_product_id")    // Links to supplier's product
  originSupplierId  String?  @map("origin_supplier_id")   // Which supplier it came from

  originProduct     Product?  @relation("ProductLineage", fields: [originProductId], references: [id])
  derivedProducts   Product[] @relation("ProductLineage")
}
```

**Business Logic**: When reseller receives merchandise, system creates products in their account with these fields populated.

#### 3. StockTransfer Model

**Purpose**: Formalize merchandise shipments between supplier and reseller.

```prisma
model StockTransfer {
  id            String   @id @default(uuid())
  supplierId    String   @map("supplier_id")
  resellerId    String   @map("reseller_id")
  status        TransferStatus @default(ENVIADO)
  items         Json     // Array of {productId, quantity, name}
  notes         String?
  sentAt        DateTime @default(now()) @map("sent_at")
  receivedAt    DateTime? @map("received_at")
  createdAt     DateTime @default(now()) @map("created_at")

  supplier      User     @relation("SentTransfers", fields: [supplierId], references: [id])
  reseller      User     @relation("ReceivedTransfers", fields: [resellerId], references: [id])

  @@map("stock_transfers")
}

enum TransferStatus {
  ENVIADO      // Sent by supplier, decremented their stock
  RECEBIDO     // Accepted by reseller, added to their stock
  DEVOLVIDO    // Returned
  CANCELADO    // Cancelled
}
```

**Transactional Flow**:

1. Supplier creates transfer → decrements their stock → creates `StockTransfer` record
2. Reseller accepts → system creates products in reseller's account → updates status to `RECEBIDO`

### Backend Architecture (New Domains)

#### Domain: `distribution` (Supplier-Reseller Operations)

**Use Cases:**

1. **SendMerchandiseUseCase** ("Mala Fechada")

   - **Input**: `{ resellerId, items: [{ productId, quantity }], notes? }`
   - **Logic (Transactional)**:

     ```typescript
     @Injectable()
     export class SendMerchandiseUseCase {
     	async execute(dto: SendMerchandiseDto, supplierId: string) {
     		return this.prisma.$transaction(async (tx) => {
     			// 1. Validate stock availability
     			for (const item of dto.items) {
     				const product = await tx.product.findUnique({
     					where: { id: item.productId },
     				});
     				if (product.stock < item.quantity)
     					throw new InsufficientStockError();
     			}

     			// 2. Decrement supplier stock
     			for (const item of dto.items) {
     				await tx.stockMovement.create({
     					data: {
     						productId: item.productId,
     						type: "saida",
     						quantity: -item.quantity,
     					},
     				});
     				await tx.product.update({
     					where: { id: item.productId },
     					data: { stock: { decrement: item.quantity } },
     				});
     			}

     			// 3. Create transfer record
     			const transfer = await tx.stockTransfer.create({
     				data: {
     					supplierId,
     					resellerId: dto.resellerId,
     					status: "ENVIADO",
     					items: dto.items,
     				},
     			});

     			// 4. (Optional) Notify reseller

     			return transfer;
     		});
     	}
     }
     ```

2. **AcceptMerchandiseUseCase** (Reseller Side)

   - **Input**: `{ transferId }`
   - **Logic (Transactional)**:
     - Validate transfer exists and status is `ENVIADO`
     - For each item in transfer:
       - Create product in reseller's account
       - Populate `originProductId` and `originSupplierId`
       - Set initial stock
     - Update transfer status to `RECEBIDO`

3. **GetResellerInventoryUseCase** ("Stock Mirror")
   - **Input**: `{ resellerId, supplierId }`
   - **Security Rule**:
     ```typescript
     const products = await this.prisma.product.findMany({
     	where: {
     		userId: resellerId,
     		originSupplierId: supplierId, // CRITICAL: Only see your products
     	},
     	include: {
     		sales: { orderBy: { createdAt: "desc" }, take: 1 }, // Last sale date
     	},
     });
     ```
   - **Return**: List with columns: Product Name, Qty with Reseller, Days Since Last Sale

#### Domain: `risk-analytics` (Financial Intelligence)

**Use Cases:**

1. **CalculateSalesVelocityUseCase** ("Run Rate")

   - **Input**: `{ resellerId, days: 30 }`
   - **Formula**:
     ```typescript
     const sales = await this.prisma.sale.findMany({
     	where: {
     		userId: resellerId,
     		saleDate: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
     	},
     });
     const totalRevenue = sales.reduce((sum, s) => sum + s.totalValue, 0);
     const dailyAverage = totalRevenue / days;
     return { dailyAverage, totalRevenue, periodDays: days };
     ```
   - **Output**: `{ dailyAverage: 500.00, totalRevenue: 15000.00, periodDays: 30 }`

2. **AnalyzeCheckRiskUseCase** ("Check Liquidity Prediction")

   - **Input**: `{ resellerId, checkDate, checkAmount }`
   - **Complex Logic**:

     ```typescript
     // 1. Get current balance (if accessible)
     const currentBalance = await this.getResellerBalance(resellerId);

     // 2. Get current stock value
     const inventory = await this.prisma.product.findMany({
     	where: { userId: resellerId },
     	select: { stock: true, salePrice: true },
     });
     const stockValue = inventory.reduce(
     	(sum, p) => sum + p.stock * p.salePrice,
     	0
     );

     // 3. Calculate sales velocity
     const velocity = await this.calculateSalesVelocity.execute({
     	resellerId,
     	days: 60,
     });

     // 4. Project future revenue
     const daysUntilCheck = Math.ceil(
     	(checkDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
     );
     const projectedRevenue = velocity.dailyAverage * daysUntilCheck;

     // 5. Assess risk
     const availableFunds = currentBalance + projectedRevenue;
     const riskLevel =
     	availableFunds >= checkAmount * 1.2
     		? "BAIXO"
     		: availableFunds >= checkAmount
     		? "MEDIO"
     		: "ALTO";

     return {
     	riskLevel,
     	checkAmount,
     	projectedRevenue,
     	currentBalance,
     	stockValue,
     	daysUntilCheck,
     	recommendation:
     		riskLevel === "BAIXO" ? "Seguro aceitar" : "Negociar prazo maior",
     };
     ```

3. **GetResellerFinancialHealthUseCase**
   - Aggregates: Sales velocity, stock turnover rate, payment history
   - Returns: Overall health score (0-100)

### Frontend Modules

#### Module: "Meus Revendedores" (My Resellers)

**Route**: `/resellers`

**Components:**

1. **ResellerListTable**:

   - Columns: Name, Status, Total Merchandise Sent, Last Transfer Date, Actions
   - Action "Ver Stock" → opens `ResellerStockMirrorDialog`

2. **ResellerStockMirrorDialog**:

   - Uses shadcn/ui `<Table>` component
   - Columns: Product Name, Qty, Last Sale Date, Days Stagnant
   - **Insight**: Sort by "Days Stagnant" descending → identify slow-moving items for swaps
   - Color coding: 🔴 >30 days, 🟡 15-30 days, 🟢 <15 days

3. **SendMerchandiseDialog**:
   - Multi-select product list from supplier's inventory
   - Quantity inputs
   - "Enviar Remessa" button → calls `POST /distribution/send-merchandise`

#### Module: "Contas a Receber (Avançado)" (Advanced Receivables)

**Route**: `/receivables` (extends existing installments view)

**Enhancements:**

1. **Risk Badge Column**:
   - For each installment with check payment, show risk level:
     - 🟢 "Baixo Risco" - Sales velocity covers with 20%+ margin
     - 🟡 "Médio Risco" - Needs to sell 80%+ of current stock
     - 🔴 "Alto Risco" - Current sales pace won't cover check
2. **Risk Details Popover**:
   - Click badge → shows breakdown:
     - Current Balance: R$ X
     - Projected Revenue by Check Date: R$ Y
     - Stock Value: R$ Z
     - Recommendation: "Safe to accept" / "Negotiate longer term"

### API Endpoints (Summary)

**Distribution:**

- `POST /distribution/relationships` - Send reseller invitation
- `PATCH /distribution/relationships/:id/accept` - Accept invitation (reseller)
- `GET /distribution/resellers` - List my resellers (supplier)
- `POST /distribution/send-merchandise` - Create stock transfer
- `GET /distribution/transfers` - List transfers
- `PATCH /distribution/transfers/:id/receive` - Accept transfer (reseller)
- `GET /distribution/resellers/:id/inventory` - Stock mirror (supplier only)

**Risk Analytics:**

- `GET /risk/sales-velocity/:resellerId` - Calculate run rate
- `POST /risk/analyze-check` - Check risk assessment
- `GET /risk/financial-health/:resellerId` - Overall health score

### Implementation Workflow

**Phase 1: Database & Core Relationships**

1. Add `BusinessRelationship`, `StockTransfer` models to schema
2. Extend `Product` model with origin fields
3. Run migration: `npx prisma migrate dev --name add-distribution-system`

**Phase 2: Backend - Distribution Domain**

1. Create `domain/distribution/` structure
2. Implement `SendMerchandiseUseCase` with transactional logic
3. Implement `GetResellerInventoryUseCase` with security filters
4. Create controllers following one-per-endpoint pattern

**Phase 3: Backend - Risk Analytics Domain**

1. Create `domain/risk-analytics/` structure
2. Implement `CalculateSalesVelocityUseCase`
3. Implement `AnalyzeCheckRiskUseCase` with projections
4. Create aggregation queries

**Phase 4: Frontend - Reseller Management**

1. Create `ResellerListPage.tsx`
2. Create `ResellerStockMirrorDialog.tsx` component
3. Create `SendMerchandiseDialog.tsx` with product multi-select
4. Add service: `web/src/services/distribution.service.ts`

**Phase 5: Frontend - Risk Indicators**

1. Extend `InstallmentsTable` with Risk Badge column
2. Create `CheckRiskPopover.tsx` component
3. Add TanStack Query hooks for risk calculations
4. Add service: `web/src/services/risk-analytics.service.ts`

### Security Considerations

**Critical Rules:**

1. **Stock Mirror Access**: Supplier can ONLY see products where `originSupplierId = theirUserId`
2. **Relationship Validation**: Always verify active `BusinessRelationship` exists before data sharing
3. **Transactional Integrity**: All stock transfers MUST use Prisma transactions to prevent inconsistencies
4. **Privacy**: Reseller's sales to end-customers remain private - supplier only sees aggregate velocity

**Repository Pattern Example:**

```typescript
// distribution.repository.ts
async getResellerInventory(resellerId: string, supplierId: string): Promise<Product[]> {
  // NEVER allow viewing all reseller products - only those from this supplier
  const relationship = await this.prisma.businessRelationship.findUnique({
    where: { supplierId_resellerId: { supplierId, resellerId } }
  });

  if (!relationship || relationship.status !== 'ATIVO') {
    throw new UnauthorizedError('No active relationship');
  }

  return this.prisma.product.findMany({
    where: {
      userId: resellerId,
      originSupplierId: supplierId  // CRITICAL FILTER
    }
  });
}
```

### Future Enhancements

- Real-time notifications (WebSocket) for transfer status changes
- Automated swap suggestions based on stagnant inventory analysis
- Historical risk accuracy tracking (were predictions correct?)
- Integration with banking APIs for real-time balance checks
- Mobile app for resellers to accept transfers on-the-go
