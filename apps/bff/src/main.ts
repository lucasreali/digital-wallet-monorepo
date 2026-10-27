import { writeFileSync } from 'node:fs';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainErrorFilter } from './api/domain-error.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter(app.getHttpAdapter()));
  // The web app is served from another origin; @fastify/cors only allows GET, HEAD and POST by default
  app.enableCors({ methods: ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'] });
  // The @nestjs/swagger plugin (nest-cli.json) reads DTOs and return types straight from the code
  const config = new DocumentBuilder().setTitle('bff').setVersion('1.0').build();
  // One route per slice controller, so its name is the operationId and the generated hook name:
  // ListUsersController -> listUsers -> useListUsers
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controller) => controller.replace(/Controller$/, '').replace(/^./, (c) => c.toLowerCase()),
  });

  // `pnpm openapi` writes the contract that Kubb in apps/web uses to generate the client
  if (process.argv.includes('--emit-openapi')) {
    writeFileSync('openapi.json', `${JSON.stringify(document, null, 2)}\n`);
    return app.close();
  }

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
