import { Link } from '@tanstack/react-router'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { Icon, type IconName } from '#/components/Icon'
import { ToastProvider } from '#/components/Toast'

const THEME_KEY = 'lastro-theme'

const ThemeContext = createContext<{ dark: boolean; setDark: (dark: boolean) => void }>({
  dark: false,
  setDark: () => {},
})

export const useTheme = () => useContext(ThemeContext)

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Painel', icon: 'layout' },
  { to: '/usuarios', label: 'Usuários', icon: 'users' },
  { to: '/carteiras', label: 'Carteiras', icon: 'wallet' },
  { to: '/atividade', label: 'Atividade', icon: 'activity' },
]

/** App frame: sidebar on desktop, bottom nav on mobile, light/dark theme on <html>. */
export function Shell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(THEME_KEY)
    } catch {}
    setDark(saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {}
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <ToastProvider>
        <div className="shell">
          <div className="side-slot">
            <Sidebar />
          </div>
          <main className="main">{children}</main>
          <BottomNav />
        </div>
      </ToastProvider>
    </ThemeContext.Provider>
  )
}

export function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" style={{ fill: 'var(--primary)' }} />
      <rect x="9" y="7" width="4.5" height="18" rx="2.25" style={{ fill: 'var(--on-primary)' }} />
      <rect x="9" y="20.5" width="15" height="4.5" rx="2.25" style={{ fill: 'var(--on-primary)' }} />
      <circle cx="20" cy="13.5" r="4" style={{ fill: 'var(--on-primary)' }} />
    </svg>
  )
}

function Sidebar() {
  const { dark, setDark } = useTheme()
  return (
    <nav className="side" aria-label="Navegação principal" style={{ justifyContent: 'space-between' }}>
      <div className="flex flex-col gap-7">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-2 py-1"
          style={{ textDecoration: 'none', color: 'var(--text)' }}
          aria-label="Lastro — ir para o Painel"
        >
          <Logo />
          <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.04em' }}>lastro</span>
        </Link>
        <div className="nav">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-a"
              activeProps={{ className: 'on', 'aria-current': 'page' }}
              activeOptions={{ exact: item.to === '/' }}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <legend className="eyebrow px-1" style={{ marginBottom: 10 }}>
          Tema
        </legend>
        <div className="seg">
          <button
            className={`seg-b ${dark ? '' : 'on'}`}
            type="button"
            aria-pressed={!dark}
            onClick={() => setDark(false)}
          >
            <Icon name="sun" size="sm" />
            Claro
          </button>
          <button
            className={`seg-b ${dark ? 'on' : ''}`}
            type="button"
            aria-pressed={dark}
            onClick={() => setDark(true)}
          >
            <Icon name="moon" size="sm" />
            Escuro
          </button>
        </div>
      </fieldset>
    </nav>
  )
}

function BottomNav() {
  return (
    <nav className="bnav" aria-label="Navegação principal">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="bnav-a"
          activeProps={{ className: 'on', 'aria-current': 'page' }}
          activeOptions={{ exact: item.to === '/' }}
        >
          <span className="pill">
            <Icon name={item.icon} />
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

/** Mobile-only theme switch shown in the page header (the sidebar holds it on desktop). */
export function ThemeToggle() {
  const { dark, setDark } = useTheme()
  return (
    <button
      className="icon-btn icon-btn-lg theme-m"
      type="button"
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={() => setDark(!dark)}
    >
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  )
}
