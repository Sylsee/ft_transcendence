import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'ft_transcendance :)    ';
  }
  getTruc(): string {
    return 'Truc';
  }
}
