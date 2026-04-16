import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@/users/users.module';
import { RoleModule } from '@/roles/roles.module';
import { DatabasesModule } from '@/databases/databases.module';
import { SessionModule } from '@/sessions/sessions.module';
import { AuthModule } from '@/auth/auth.module';
import { TaskModule } from '@/tasks/tasks.module';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>("MONGODB_URI")!,
        dbName: ConfigService.get<string>("DB_NAME") ?? "ToDoList",
        connectionFactory: (connection) =>{
          return connection
        }
      }),
      inject: [ConfigService]
    }),
    UserModule,
    RoleModule,
    DatabasesModule,
    SessionModule,
    AuthModule,
    TaskModule,
    FilesModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
