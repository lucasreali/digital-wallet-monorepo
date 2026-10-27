import { Controller, Get } from '@nestjs/common';
import type { AggregatedDataDto } from './get-aggregated-data.dto';
import { GetAggregatedData } from './get-aggregated-data.use-case';

@Controller('aggregated-data')
export class GetAggregatedDataController {
  constructor(private readonly getAggregatedData: GetAggregatedData) {}

  /** Joins both microservices and the Function in one response; 502 if any of them is unavailable */
  @Get()
  handle(): Promise<AggregatedDataDto> {
    return this.getAggregatedData.execute();
  }
}
