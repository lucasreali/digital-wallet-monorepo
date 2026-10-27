import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { Wallet } from '../../domain/wallet.entity';
// biome-ignore lint/style/useImportType: ValidationPipe and Swagger read the DTO class at runtime
import { CreateWalletDto } from './create-wallet.dto';
import { CreateWallet } from './create-wallet.use-case';

@Controller('wallets')
export class CreateWalletController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(CreateWallet) private readonly createWallet: CreateWallet) {}

  /** Opens a user's wallet; 409 if the user already has one */
  @Post()
  create(@Body() dto: CreateWalletDto): Promise<Wallet> {
    return this.createWallet.execute(dto);
  }
}
