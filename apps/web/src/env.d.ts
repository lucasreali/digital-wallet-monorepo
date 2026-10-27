interface ImportMetaEnv {
  /** Public base URL of the BFF (the API Gateway URL in production) */
  readonly VITE_BFF_URL: string
  readonly VITE_SWAGGER_IDENTIDADE_URL?: string
  readonly VITE_SWAGGER_CARTEIRA_URL?: string
  readonly VITE_SWAGGER_INSIGHTS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
