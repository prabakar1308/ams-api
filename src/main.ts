import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // restrict to only the properties that are defined in the DTO
      whitelist: true,
      // remove properties that are not defined in the DTO
      forbidNonWhitelisted: true,
      // transform payload to DTO
      transform: true,
      // genericway to convert stringfied number
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /* Swagger Configuartion */
  const config = new DocumentBuilder()
    .setTitle('GMH-AMS: API')
    .setDescription('Use the base API url as http://localhost://3000')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/gh-pages/MIT-LICENSE.txt',
    )
    .setVersion('1.0')
    .addServer('http://localhost://3000')
    .build();
  // instantiate document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
