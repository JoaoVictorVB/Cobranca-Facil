# 🐳 Guia Docker - Cobrança Fácil

## 🚀 Início Rápido (Apenas MySQL)

### 1️⃣ Subir o MySQL
```powershell
# Iniciar o container MySQL
docker-compose up -d mysql

# Verificar se está rodando
docker-compose ps

# Ver logs (se necessário)
docker-compose logs -f mysql
```

### 2️⃣ Configurar Banco de Dados
```powershell
# Gerar Prisma Client
cd api
npx prisma generate

# Criar tabelas (migration)
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio
npx prisma studio
```

### 3️⃣ Iniciar Aplicação Localmente
```powershell
# Terminal 1 - API
cd api
npm run start:dev

# Terminal 2 - Frontend
cd web
npm run dev
```

## 🏗️ Rodar Tudo no Docker (Futuro)

### Quando quiser rodar toda a aplicação no Docker:

1. **Edite o `docker-compose.yml`** e descomente os serviços `api` e `web`

2. **Build e start de todos os serviços:**
```powershell
docker-compose up --build
```

3. **Acessar:**
- Frontend: http://localhost:5173
- API: http://localhost:3001
- API Docs: http://localhost:3001/api

## 📋 Comandos Úteis

### Docker Compose
```powershell
# Subir todos os serviços
docker-compose up -d

# Subir com rebuild
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f mysql
docker-compose logs -f api
docker-compose logs -f web

# Parar serviços
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar e remover containers + volumes (APAGA DADOS!)
docker-compose down -v

# Ver status dos serviços
docker-compose ps

# Restart de um serviço específico
docker-compose restart mysql
```

### MySQL
```powershell
# Conectar ao MySQL via terminal
docker exec -it cobranca-facil-mysql mysql -uroot -proot

# Backup do banco
docker exec cobranca-facil-mysql mysqldump -uroot -proot cobranca_facil > backup.sql

# Restaurar backup
docker exec -i cobranca-facil-mysql mysql -uroot -proot cobranca_facil < backup.sql
```

### Containers
```powershell
# Entrar no container da API
docker exec -it cobranca-facil-api sh

# Entrar no container do MySQL
docker exec -it cobranca-facil-mysql bash

# Ver uso de recursos
docker stats

# Limpar containers parados
docker container prune

# Limpar imagens não usadas
docker image prune
```

## 🔧 Configuração

### Variáveis de Ambiente

**API (.env)**
```env
DATABASE_URL="mysql://root:root@localhost:3306/cobranca_facil"
PORT=3001
NODE_ENV=development
```

**Web (.env)**
```env
VITE_API_URL=http://localhost:3001
```

### Portas

- **3306** - MySQL
- **3001** - API (NestJS)
- **5173** - Frontend (Vite Dev) ou **80** (Nginx Production)

## 📦 Estrutura Docker

```
Cobranca-Facil/
├── docker-compose.yml       # Orquestração de serviços
├── api/
│   ├── Dockerfile           # Build da API
│   ├── docker-entrypoint.sh # Script de inicialização
│   └── .dockerignore        # Arquivos ignorados no build
└── web/
    ├── Dockerfile           # Build do Frontend
    ├── nginx.conf           # Config do servidor web
    └── .dockerignore        # Arquivos ignorados no build
```

## 🎯 Cenários de Uso

### Desenvolvimento Local (Atual)
```
✅ MySQL no Docker
✅ API rodando localmente (hot reload)
✅ Frontend rodando localmente (hot reload)
```

### Desenvolvimento Completo no Docker
```
✅ MySQL no Docker
✅ API no Docker (rebuild para ver mudanças)
✅ Frontend no Docker (rebuild para ver mudanças)
```

### Produção
```
✅ Tudo no Docker
✅ Otimizado e com builds de produção
✅ Nginx servindo frontend
✅ Variáveis de ambiente de produção
```

## 🐛 Troubleshooting

### MySQL não conecta
```powershell
# Verificar se o container está rodando
docker-compose ps

# Ver logs do MySQL
docker-compose logs mysql

# Restart do MySQL
docker-compose restart mysql

# Testar conexão
docker exec cobranca-facil-mysql mysqladmin ping -h localhost -uroot -proot
```

### Porta 3306 em uso
```powershell
# Verificar processo usando a porta
netstat -ano | findstr :3306

# Mude a porta no docker-compose.yml
ports:
  - "3307:3306"  # Usa 3307 localmente

# Atualize o .env
DATABASE_URL="mysql://root:root@localhost:3307/cobranca_facil"
```

### Migrations não funcionam
```powershell
# Deletar e recriar o banco
docker-compose down -v
docker-compose up -d mysql
cd api
npx prisma migrate dev --name init
```

### Reset completo
```powershell
# Para tudo e apaga volumes
docker-compose down -v

# Remove imagens antigas
docker-compose down --rmi all -v

# Rebuild tudo do zero
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Deploy (Futuro)

### Docker Swarm / Kubernetes
```powershell
# Build para produção
docker-compose -f docker-compose.prod.yml build

# Push para registry
docker tag cobranca-facil-api:latest seu-registry/cobranca-facil-api:latest
docker push seu-registry/cobranca-facil-api:latest
```

### Cloud (AWS ECS, Google Cloud Run, Azure Container Instances)
- Use os Dockerfiles fornecidos
- Configure variáveis de ambiente na plataforma
- Aponte DATABASE_URL para banco gerenciado (RDS, Cloud SQL, etc)

## 📊 Monitoramento

### Logs
```powershell
# Ver logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Recursos
```powershell
# CPU, Memória, Rede
docker stats
```

---

**🎉 Agora você tem MySQL rodando no Docker e está pronto para desenvolver!**

**No futuro, basta descomentar os serviços no `docker-compose.yml` para rodar tudo no Docker! 🐳**
