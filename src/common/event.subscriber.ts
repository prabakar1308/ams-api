import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BaseEntity } from './entities/base.entity';
import { ClsService } from 'nestjs-cls';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<BaseEntity> {
  constructor(
    dataSource: DataSource,
    private readonly cls: ClsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const user = this.cls.get<{
      sub: number;
    }>('user');
    event.entity.createdBy = user ? user.sub : 0;
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>) {
    if (event.entity) {
      const user = this.cls.get<{
        sub: number;
      }>('user');
      event.entity.updatedBy = user ? user.sub : 0;
    }
  }
}
