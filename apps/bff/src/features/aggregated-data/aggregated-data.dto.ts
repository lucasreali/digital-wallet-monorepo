export class AggregatedDataDto {
  /** Vem do svc-identidade (MongoDB) */
  users: object[];
  /** Vem do svc-carteira (Azure SQL) */
  wallets: object[];
  /** Vem da fn-notificacoes (Azure Function) */
  insights: object;
}
