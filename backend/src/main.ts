import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const context = 'NestApplication';
  const app: NestApplication = await NestFactory.create(AppModule);
  const logger = new Logger(context);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  setupOpenAPI(app);

  app.setGlobalPrefix('api/v1');
  await app.listen(3001);

  logger.debug(`Server environment set to development`);
  logger.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();

/**
 * Setup config for OpenAPI (Swagger)
 * @param app NestJS application
 */
function setupOpenAPI(app: NestApplication) {

  const config = new DocumentBuilder()
    .setTitle('Contractor RESTful API')
    .setDescription('Api is developed for contractor application.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
  });
  const options: SwaggerCustomOptions = {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      jsonDocumentUrl: 'swagger/json',
    },
  };

    // To expose the Swagger JSON at a different endpoint
    app.getHttpAdapter().getInstance().get('/swagger-json', (req, res) => {
      res.json(document);
    });
  SwaggerModule.setup(`api/v1`, app, document, options);
}
