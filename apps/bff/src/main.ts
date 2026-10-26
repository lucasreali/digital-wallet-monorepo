import { writeFileSync } from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  // O plugin do @nestjs/swagger (nest-cli.json) lê DTOs e tipos de retorno direto do código
  const config = new DocumentBuilder().setTitle('bff').setVersion('1.0').build();
  // operationId vira o nome no client gerado: AggregatedDataController.get → getAggregatedData
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controller, method) => method + controller.replace(/Controller$/, ''),
  });

  // `pnpm openapi` grava o contrato que o Kubb do apps/web usa para gerar o client
  if (process.argv.includes('--emit-openapi')) {
    writeFileSync('openapi.json', JSON.stringify(document, null, 2) + '\n');
    return app.close();
  }

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
