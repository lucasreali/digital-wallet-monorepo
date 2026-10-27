import { Icon } from '#/components/Icon'

/** Copies an id to the clipboard. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <button
      className="icon-btn"
      type="button"
      aria-label={label}
      style={{ width: 32, height: 32 }}
      onClick={() => navigator.clipboard?.writeText(value)}
    >
      <Icon name="copy" size="sm" />
    </button>
  )
}
