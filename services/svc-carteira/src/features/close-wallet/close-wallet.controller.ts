import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CloseWallet } from './close-wallet.use-case';

@Controller('wallets')
export class CloseWalletController {
  constructor(private readonly closeWallet: CloseWallet) {}

  /** Closes (deletes) a wallet and its transactions; 404 unknown wallet, 409 if the balance is not zero */
  @Delete(':id')
  @HttpCode(204)
  close(@Param('id') id: string): Promise<void> {
    return this.closeWallet.execute({ id });
  }
}
