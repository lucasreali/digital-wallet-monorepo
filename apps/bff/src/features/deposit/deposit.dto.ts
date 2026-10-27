import { IsNumber, IsPositive } from 'class-validator';

export class DepositDto {
  /** Amount in BRL, greater than zero */
  @IsNumber()
  @IsPositive()
  amount: number;
}
