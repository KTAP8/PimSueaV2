import { cn } from '@/utils/cn'

type BadgeVariant = 'dtg' | 'dtf' | 'default'

const variantClasses: Record<BadgeVariant, string> = {
  dtg: 'bg-brand-green text-white',
  dtf: 'bg-surface-gray text-slate-gray',
  default: 'bg-surface-gray text-slate-gray',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-xs font-bold rounded-sm',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
