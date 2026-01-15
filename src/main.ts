import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from '@nestjs/platform-express';
import ConfigSwagger from '@/swagger/swaggerExtension';
import { VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app:NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  ConfigSwagger.setup(app);

  const reflector: Reflector = app.get(Reflector);
  const globalPrefix = 'api';
  const version = '1';
  app.setGlobalPrefix(globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: `${version}`,
  });
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // You can add global guards here if needed

  app.use(cookieParser());


  await app.listen(process.env.PORT ?? 3000).then(app =>{
    // console.log(`Application is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/${globalPrefix}/v${version}`);
    console.log(`Swagger is running on: http://${configService.get<string>('HOST')}:${configService.get<number>('PORT')}/swagger`);
  });
}
bootstrap();
