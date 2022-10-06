import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Ft_transcendence:)';
  }
  geTruc(): string {
    return 'Truc';
  }
}
