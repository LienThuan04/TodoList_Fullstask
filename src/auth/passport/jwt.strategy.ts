import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/users/interfaces/IUser';

//this file is used to validate the access token every time the user makes a request to a protected route, it will be called by the JwtAuthGuard and validate the token, if valid it will return the user information to be used in the request handler, if not it will throw an error and return 401 Unauthorized

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as string, //mã hóa token với signature giống như trong AuthModule để giải mã payload
    });
  }

  async validate(payload: IUser) { //hàm này được gọi tự động bởi Passport sau khi token được xác thực thành công
    const { _id, userName, email, avatar, roleName } = payload;
    //return for request.user
    return { _id, userName, email, avatar, roleName };
  }
}