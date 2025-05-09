import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    logger.log('Initializing NestJS application...');
    const app = await NestFactory.create(AppModule);

    logger.log('Setting up Swagger documentation...');
    const config = new DocumentBuilder()
      .setTitle('Phishing Simulation')
      .setDescription('API for send phishing mails')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const port = process.env.PORT || 3002;
    await app.listen(port);
    logger.log(`Server is running on port ${port}`);
    logger.log(`Swagger is running on http://localhost:${port}/api`);
  } catch (error) {
    logger.error(`Error during application bootstrap: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error(`Unhandled error during bootstrap: ${err.message}`, err.stack);
  process.exit(1);
});
