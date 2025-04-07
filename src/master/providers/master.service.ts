import { Injectable } from '@nestjs/common';

@Injectable()
export class MasterService {
  public findTanksCount(type: string) {
    console.log(type);
    return 25;
  }
}
