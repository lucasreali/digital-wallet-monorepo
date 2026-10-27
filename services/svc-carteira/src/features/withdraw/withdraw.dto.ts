import { IsNumber } from 'class-validator';

export class WithdrawDto {
  /** Amount to take out, greater than zero with at most 2 decimal places (422 otherwise) */
  @IsNumber()
  amount: number;
}
