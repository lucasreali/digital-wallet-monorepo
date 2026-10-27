import { IsNumber, IsPositive } from 'class-validator';

export class WithdrawDto {
  /** Amount in BRL, greater than zero */
  @IsNumber()
  @IsPositive()
  amount: number;
}
