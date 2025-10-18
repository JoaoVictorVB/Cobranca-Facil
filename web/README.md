# Cobrança Fácil - Sistema Completo

Sistema completo de gerenciamento de cobranças com arquitetura moderna, separando frontend e backend.

## 📁 Estrutura do Projeto

```
Cobranca-Facil/
├── api/                    # Backend - NestJS + Prisma + DDD
│   ├── src/
│   │   ├── domain/         # Entidades, Value Objects, Interfaces
│   │   ├── application/    # Casos de Uso
│   │   ├── infrastructure/ # Repositórios, Banco de Dados
│   │   └── presentation/   # Controllers, DTOs
│   ├── prisma/             # Schema e Migrations
│   └── package.json
│
├── src/                    # Frontend - React + TypeScript + Vite
│   ├── components/         # Componentes UI
│   ├── services/           # Integração com API
│   ├── pages/              # Páginas da aplicação
│   └── lib/                # Utilitários
└── package.json
```

## 🏗️ Arquitetura

### Backend (API)

A API foi construída seguindo os princípios de **Domain-Driven Design (DDD)**, proporcionando:

- **Separação de responsabilidades** em camadas bem definidas
- **Testabilidade** através de inversão de dependências
- **Manutenibilidade** com código organizado e limpo
- **Escalabilidade** permitindo crescimento sustentável

#### Camadas da Arquitetura

1. **Domain Layer (Domínio)**
   - Entidades de negócio (Client, Sale, Installment, Product)
   - Value Objects (Money, Phone)
   - Interfaces de repositórios
   - Lógica de negócio pura

2. **Application Layer (Aplicação)**
   - Casos de uso (Use Cases)
   - DTOs de aplicação
   - Orquestração de regras de negócio

3. **Infrastructure Layer (Infraestrutura)**
   - Implementação dos repositórios com Prisma
   - Configuração de banco de dados
   - Integrações externas

4. **Presentation Layer (Apresentação)**
   - Controllers REST
   - DTOs de requisição/resposta
   - Validações de entrada
   - Documentação Swagger

### Frontend

Aplicação React moderna com:
- **TypeScript** para type-safety
- **Vite** para builds rápidos
- **TanStack Query** para gerenciamento de estado
- **Shadcn/ui** para componentes UI
- **Axios** para comunicação com API

## 🚀 Como Executar

### Pré-requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

### 1. Configurar e Executar o Backend

```bash
# Navegar para a pasta da API
cd api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Gerar o Prisma Client
npm run prisma:generate

# Executar migrations do banco de dados
npm run prisma:migrate

# Iniciar servidor de desenvolvimento
npm run start:dev
```

A API estará disponível em: `http://localhost:3001`
Documentação Swagger: `http://localhost:3001/api/docs`

### 2. Configurar e Executar o Frontend

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com a URL da API

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 📚 Documentação da API

### Endpoints Principais

#### Clientes
- `POST /clients` - Criar cliente
- `GET /clients` - Listar clientes
- `GET /clients/:id` - Obter cliente
- `PUT /clients/:id` - Atualizar cliente
- `DELETE /clients/:id` - Remover cliente

#### Vendas
- `POST /sales` - Criar venda (gera parcelas automaticamente)
- `PUT /sales/installments/:id/pay` - Registrar pagamento
- `GET /sales/installments/upcoming` - Parcelas próximas
- `GET /sales/installments/overdue` - Parcelas vencidas

#### Produtos
- `POST /products` - Criar produto
- `GET /products` - Listar produtos
- `GET /products/:id` - Obter produto
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Remover produto

### Documentação Interativa

Acesse `http://localhost:3001/api/docs` para documentação completa com Swagger.

## 🔧 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo
- **Prisma** - ORM moderno e type-safe
- **PostgreSQL** - Banco de dados relacional
- **TypeScript** - Superset tipado do JavaScript
- **Class Validator** - Validação de dados
- **Swagger** - Documentação de API

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Type-safety
- **Vite** - Build tool
- **TanStack Query** - Gerenciamento de estado server
- **Axios** - Cliente HTTP
- **Shadcn/ui** - Componentes UI
- **Tailwind CSS** - Framework CSS
- **React Hook Form** - Formulários
- **Zod** - Validação de esquemas

## 🎯 Princípios de DDD Aplicados

### Entities (Entidades)
Objetos com identidade única:
- `Client` - Cliente do sistema
- `Sale` - Venda realizada
- `Installment` - Parcela de uma venda
- `Product` - Produto cadastrado

### Value Objects
Objetos imutáveis sem identidade:
- `Money` - Representação de valores monetários
- `Phone` - Número de telefone formatado

### Repositories
Abstração para acesso a dados:
- `IClientRepository`
- `ISaleRepository`
- `IInstallmentRepository`
- `IProductRepository`

### Use Cases
Lógica de aplicação isolada:
- `CreateClientUseCase`
- `CreateSaleUseCase`
- `PayInstallmentUseCase`
- E outros...

## 🔐 Variáveis de Ambiente

### Backend (api/.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/cobranca_facil"
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 📝 Licença

MIT
