import { Module } from '@nestjs/common';
import { RoleService } from '@/roles/roles.service';
import { RoleController } from '@/roles/roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
