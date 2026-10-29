interface ImportMetaEnv {
  /** Public base URL of the BFF (the API Gateway URL in production) */
  readonly VITE_BFF_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
