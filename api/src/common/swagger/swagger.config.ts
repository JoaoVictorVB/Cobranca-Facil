import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_TAGS } from './swagger-tags';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Cobrança Fácil API')
    .setDescription('Sistema de Gestão de Vendas e Cobranças')
    .setVersion('1.0')
    .addServer('http://localhost:3333/', 'Local environment')
    .addBearerAuth()
    .build();

  Object.values(SWAGGER_TAGS)
    .sort()
    .forEach((tag) => {
      if (!config.tags) {
        config.tags = [];
      }
      config.tags.push({ name: tag });
    });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
