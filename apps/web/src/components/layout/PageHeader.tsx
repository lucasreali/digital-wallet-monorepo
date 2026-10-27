import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Icon } from '#/components/Icon'
import { ThemeToggle } from '#/components/layout/Shell'

type Props = {
  title: string
  subtitle?: ReactNode
  /** Breadcrumb back to a list page, e.g. { to: '/usuarios', label: 'Usuários', current: 'Ana Souza' } */
  crumb?: { to: string; label: string; current: string }
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, crumb, actions }: Props) {
  return (
    <header className="topbar">
      <div>
        {crumb && (
          <nav className="crumbs" aria-label="Trilha">
            <Link to={crumb.to}>{crumb.label}</Link>
            <Icon name="chevronRight" size="xs" />
            <span aria-current="page">{crumb.current}</span>
          </nav>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      <div className="topbar-actions">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  )
}
