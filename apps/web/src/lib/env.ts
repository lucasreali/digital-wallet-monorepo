// Build-time config (Vite inlines VITE_* vars). The production build must set VITE_BFF_URL to the API Gateway URL.
export const bffUrl = import.meta.env.VITE_BFF_URL

const optional = (value: string | undefined) => value || undefined

/** Swagger UI links shown on "Sobre o sistema"; a link is hidden when its URL is not set. */
export const swaggerUrls = {
  bff: bffUrl ? `${bffUrl}/docs` : undefined,
  identidade: optional(import.meta.env.VITE_SWAGGER_IDENTIDADE_URL),
  carteira: optional(import.meta.env.VITE_SWAGGER_CARTEIRA_URL),
  insights: optional(import.meta.env.VITE_SWAGGER_INSIGHTS_URL),
}
