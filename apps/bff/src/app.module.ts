import { Module } from '@nestjs/common';
import { AggregatedDataController } from './features/aggregated-data/aggregated-data.controller';

@Module({ controllers: [AggregatedDataController] })
export class AppModule {}
