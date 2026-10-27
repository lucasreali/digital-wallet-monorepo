import { Controller, Get, Query } from '@nestjs/common';
import type { ActivityEvent } from '../../domain/notifications.entity';
import { ListActivityQuery } from './list-activity.dto';
import { ListActivity } from './list-activity.use-case';

@Controller('activity')
export class ListActivityController {
  constructor(private readonly listActivity: ListActivity) {}

  /** Activity feed: the latest wallet events stored by fn-notificacoes, newest first */
  @Get()
  handle(@Query() query: ListActivityQuery): Promise<ActivityEvent[]> {
    return this.listActivity.execute(query);
  }
}
