#!/bin/bash

case "$1" in
  start)
    echo "🚀 Iniciando todos os serviços..."
    docker-compose up -d
    echo "✅ Serviços iniciados!"
    echo "📱 Web: http://localhost:8081"
    echo "🔧 API: http://localhost:3001"
    echo "🗄️  MySQL: localhost:3306"
    ;;
  stop)
    echo "🛑 Parando todos os serviços..."
    docker-compose down
    echo "✅ Serviços parados!"
    ;;
  restart)
    echo "🔄 Reiniciando todos os serviços..."
    docker-compose down
    docker-compose up -d
    echo "✅ Serviços reiniciados!"
    ;;
  rebuild)
    echo "🔨 Reconstruindo e reiniciando..."
    docker-compose down
    docker-compose up -d --build
    echo "✅ Rebuild completo!"
    ;;
  logs)
    if [ -z "$2" ]; then
      docker-compose logs -f
    else
      docker-compose logs -f "$2"
    fi
    ;;
  clean)
    echo "🧹 Limpando tudo (volumes incluídos)..."
    docker-compose down -v
    echo "✅ Tudo limpo!"
    ;;
  status)
    docker-compose ps
    ;;
  *)
    echo "Uso: ./docker.sh {start|stop|restart|rebuild|logs|clean|status}"
    echo ""
    echo "Comandos:"
    echo "  start   - Inicia todos os serviços"
    echo "  stop    - Para todos os serviços"
    echo "  restart - Reinicia todos os serviços"
    echo "  rebuild - Reconstrói e reinicia"
    echo "  logs    - Mostra logs (use 'logs api' para logs específicos)"
    echo "  clean   - Remove tudo incluindo volumes"
    echo "  status  - Mostra status dos containers"
    exit 1
    ;;
esac
