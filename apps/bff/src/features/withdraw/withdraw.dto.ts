import { IsNumber, Min } from 'class-validator';

export class WithdrawDto {
  /** Amount in BRL, at least 0.01 */
  @IsNumber()
  // Not @IsPositive: the Swagger plugin turns it into minimum 1 and the generated Zod schema would reject cents
  @Min(0.01)
  amount: number;
}
