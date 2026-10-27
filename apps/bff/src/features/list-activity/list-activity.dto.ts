import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ListActivityQuery {
  /** Maximum number of events to return */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
