import { Module } from '@nestjs/common';
import { SessionService } from '@/sessions/sessions.service';
import { SessionController } from '@/sessions/sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '@/sessions/schema/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Session.name, schema: SessionSchema}
    ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
