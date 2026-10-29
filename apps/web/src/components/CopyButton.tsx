import { Icon } from '#/components/Icon'
import { Tip } from '#/components/Tip'
import { useToast } from '#/components/Toast'

/** Copies an id to the clipboard and confirms with a toast. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const toast = useToast()
  return (
    <Tip label="Copiar">
      <button
        className="icon-btn"
        type="button"
        aria-label={label}
        style={{ width: 32, height: 32 }}
        onClick={() => navigator.clipboard?.writeText(value).then(() => toast({ title: 'Id copiado', icon: 'copy' }))}
      >
        <Icon name="copy" size="sm" />
      </button>
    </Tip>
  )
}
