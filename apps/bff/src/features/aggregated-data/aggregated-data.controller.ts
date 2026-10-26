import { BadGatewayException, Controller, Get } from '@nestjs/common';
import type { AggregatedDataDto } from './aggregated-data.dto';

const IDENTIDADE = process.env.SVC_IDENTIDADE_URL ?? 'http://localhost:3001';
const CARTEIRA = process.env.SVC_CARTEIRA_URL ?? 'http://localhost:3002';
const FUNCTION = process.env.FN_NOTIFICACOES_URL ?? 'http://localhost:7071';

@Controller('aggregated-data')
export class AggregatedDataController {
  /** Junta os dois microsserviços e a Function em uma única resposta */
  @Get()
  async get(): Promise<AggregatedDataDto> {
    const [users, wallets, insights] = await Promise.all([
      getJson(`${IDENTIDADE}/users`),
      getJson(`${CARTEIRA}/wallets`),
      getJson(`${FUNCTION}/api/insights`),
    ]);
    return { users, wallets, insights };
  }
}

async function getJson(url: string) {
  const res = await fetch(url).catch((err) => {
    throw new BadGatewayException(`${url} indisponível: ${err.message}`);
  });
  if (!res.ok) throw new BadGatewayException(`${url} respondeu ${res.status}`);
  return res.json();
}
