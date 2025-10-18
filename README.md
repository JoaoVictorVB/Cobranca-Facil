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

## 📦 Estrutura do Projeto

```
cobranca-facil/
├── api/              # Backend NestJS + Prisma + MySQL
├── web/              # Frontend React + Vite + shadcn/ui
├── docker-compose.yml
├── docker.sh         # Helper script Linux/Mac
├── docker.bat        # Helper script Windows
└── DOCKER.md         # Documentação detalhada do Docker
```

## 🛠️ Comandos Úteis

### Usando os scripts helper

```bash
# Iniciar
docker.bat start

# Parar
docker.bat stop

# Reiniciar
docker.bat restart

# Reconstruir após mudanças
docker.bat rebuild

# Ver logs
docker.bat logs
docker.bat logs api
docker.bat logs web

# Limpar tudo
docker.bat clean

# Ver status
docker.bat status
```

### Comandos Docker Compose diretos

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build

# Limpar volumes
docker-compose down -v
```

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

- [DOCKER.md](DOCKER.md) - Guia completo de Docker
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
