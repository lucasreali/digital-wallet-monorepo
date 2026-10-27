import { Controller, Delete, HttpCode, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { CloseWallet } from './close-wallet.use-case';

@Controller('wallets')
export class CloseWalletController {
  // Explicit token: the use case has no @Injectable() and type-only imports erase its metadata
  constructor(@Inject(CloseWallet) private readonly closeWallet: CloseWallet) {}

  /** Closes (deletes) a wallet and its transactions; 404 unknown wallet, 409 if the balance is not zero */
  @Delete(':id')
  @HttpCode(204)
  close(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.closeWallet.execute({ id });
  }
}
