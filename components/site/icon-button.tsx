import type { ComponentProps } from 'react'

/** A 40px square control; the smallest hit area design.md allows. Children stack, so two icons can cross-fade. */
export function IconButton({ label, className = '', ...rest }: ComponentProps<'button'> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`nav-control relative grid size-10 shrink-0 place-items-center rounded-[8px] text-foreground/80 [&>svg]:col-start-1 [&>svg]:row-start-1 [&>svg]:size-[18px] ${className}`}
      {...rest}
    />
  )
}
