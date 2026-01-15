import { Module } from '@nestjs/common';
import { DatabasesController } from '@/databases/databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '@/role/schema/role.schema';
import { DatabasesService } from '@/databases/databases.service';
import { RoleService } from '@/role/role.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema},
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService, RoleService],
})
export class DatabasesModule { }