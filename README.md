# 💰 Cobrança Fácil

Sistema completo de gestão de cobranças e vendas parceladas.

## 🚀 Quick Start com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Iniciar tudo com um comando

**Windows:**
```bash
docker.bat start
```

**Linux/Mac:**
```bash
chmod +x docker.sh
./docker.sh start
```

**Ou diretamente:**
```bash
docker-compose up -d
```

### Acessar a aplicação

- **Frontend**: http://localhost:8081
- **API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api
- **MySQL**: localhost:3306

### Credenciais padrão

**Login do sistema:**
- Usuário: `admin`
- Senha: `admin123`

**MySQL:**
- Host: `localhost:3306`
- Database: `cobranca_facil`
- User: `root`
- Password: `root`

## 🔧 Desenvolvimento Local (sem Docker)

### API

```bash
cd api
npm install
npm run start:dev
```

### Web

```bash
cd web
npm install
npm run dev
```

## 📚 Documentação Adicional

- **API Docs**: http://localhost:3001/api (quando rodando)

## 🎯 Funcionalidades

- ✅ Gestão de clientes
- ✅ Cadastro de produtos
- ✅ Vendas parceladas
- ✅ Controle de pagamentos
- ✅ Dashboard com estatísticas
- ✅ Calendário de vencimentos
- ✅ Relatórios mensais
- ✅ Análise comparativa de meses
- ✅ Sistema de autenticação

## 🏗️ Stack Tecnológica

**Backend:**
- NestJS 10.3
- Prisma ORM
- MySQL 8.0
- TypeScript

**Frontend:**
- React 18.3
- Vite
- shadcn/ui
- TailwindCSS
- Recharts

**DevOps:**
- Docker
- Docker Compose
- Nginx

## 📄 Licença

MIT
