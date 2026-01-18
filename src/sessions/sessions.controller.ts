import { Controller } from '@nestjs/common';
import { SessionService } from '@/sessions/sessions.service';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
}
