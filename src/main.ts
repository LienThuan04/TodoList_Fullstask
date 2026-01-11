import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from '@nestjs/platform-express';
import ConfigSwagger from './swagger/swaggerExtension';

async function bootstrap() {
  const app:NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  ConfigSwagger.setup(app);

  await app.listen(process.env.PORT ?? 3000).then(app =>{
    // console.log(`Application is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/${globalPrefix}/v${version}`);
    console.log(`Swagger is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/swagger`);
  });
}
bootstrap();
