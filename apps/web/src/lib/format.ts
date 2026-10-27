export const brl = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export const time = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

/** Parses a pt-BR amount ("1.500,25" or "1500.25") into a number; NaN when it is not a valid amount. */
export const parseMoney = (text: string) => {
  const clean = text.trim().replace(/\s|R\$/g, '')
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean
  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Number(normalized) : Number.NaN
}
