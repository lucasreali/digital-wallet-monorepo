import { IsNumber } from 'class-validator';

export class DepositDto {
  /** Amount to add, greater than zero with at most 2 decimal places (422 otherwise) */
  @IsNumber()
  amount: number;
}
