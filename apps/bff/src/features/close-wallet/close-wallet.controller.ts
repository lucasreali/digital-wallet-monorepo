import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CloseWallet } from './close-wallet.use-case';

@Controller('wallets')
export class CloseWalletController {
  constructor(private readonly closeWallet: CloseWallet) {}

  /** Closes a wallet; 404 if it does not exist, 409 if the balance is not zero */
  @Delete(':id')
  @HttpCode(204)
  handle(@Param('id') id: string): Promise<void> {
    return this.closeWallet.execute(id);
  }
}
