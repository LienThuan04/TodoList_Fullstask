import { Module } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserController } from '@/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { RoleService } from '@/role/role.service';
import { RoleModule } from '@/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    RoleModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
