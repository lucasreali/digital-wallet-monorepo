/** Turns a failed BFF call into text for the UI: "409 · Este e-mail já está em uso" (the service message is forwarded). */
export function apiErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined
  const { status, data } = error as { status?: number; data?: { message?: string | string[] } }
  if (!status) return 'Não foi possível falar com o servidor. Verifique a conexão e tente de novo.'
  const message = data?.message
  return `${status} · ${Array.isArray(message) ? message.join(', ') : (message ?? 'Erro inesperado')}`
}
