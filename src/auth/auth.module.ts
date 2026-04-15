import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@/users/users.module';
import { SessionModule } from '@/sessions/sessions.module';
import { LocalStrategy } from '@/auth/passport/local.strategy';
import { AppController } from '@/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@/auth/passport/jwt.strategy';
import ms from 'ms';
import { RoleModule } from '@/roles/roles.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    SessionModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_ACCESS_TOKEN_SECRET");
        const expiresIn = configService.get<string>("JWT_ACCESS_EXPIRE")! as string;
        return{
          secret: secret,
          signOptions: {
            expiresIn: ms(expiresIn as string)/1000, //chuyển ms sang giây
          }
        }
      },
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AuthService, LocalStrategy, JwtStrategy ],
  exports: [AuthService],
})
export class AuthModule {}
