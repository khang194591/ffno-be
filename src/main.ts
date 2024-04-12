import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import { AppExceptionFilter } from './libs/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main (main.ts)');

  // App config
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:8080',
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AppExceptionFilter());

  // Swagger config
  const swaggerConfig = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.debug(`Server is running on http://localhost:${port}`);
  });
}

void bootstrap();
